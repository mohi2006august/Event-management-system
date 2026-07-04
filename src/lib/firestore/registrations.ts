import { adminDb } from '../firebase-admin';
import type { Registration, Event } from '../../types';
import { generateTicketId } from '../ticket/qr';
import { FieldValue } from 'firebase-admin/firestore';

const REGISTRATIONS_COLLECTION = 'registrations';
const EVENTS_COLLECTION = 'events';

export class RegistrationError extends Error {
  constructor(public code: 'EVENT_NOT_FOUND' | 'ALREADY_REGISTERED' | 'DEADLINE_PASSED' | 'EVENT_FULL' | 'DUPLICATE_SCAN' | 'WRONG_EVENT', message?: string) {
    super(message || code);
    this.name = 'RegistrationError';
  }
}

/**
 * Deterministic ID generation for a registration.
 */
export function getRegistrationId(eventId: string, userId: string): string {
  return `${eventId}_${userId}`;
}

/**
 * Checks if a user is already registered for an event.
 */
export async function hasUserRegistered(eventId: string, userId: string): Promise<boolean> {
  const regId = getRegistrationId(eventId, userId);
  const doc = await adminDb.collection(REGISTRATIONS_COLLECTION).doc(regId).get();
  return doc.exists;
}

/**
 * Retrieves a single registration.
 */
export async function getRegistration(registrationId: string): Promise<Registration | null> {
  const doc = await adminDb.collection(REGISTRATIONS_COLLECTION).doc(registrationId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Registration;
}

/**
 * The core registration transaction.
 * Reads event and registration docs. If valid, writes the registration, reserved ticket ID, and increments capacity.
 */
export async function registerForEvent(eventId: string, userId: string): Promise<Registration> {
  const regId = getRegistrationId(eventId, userId);
  const eventRef = adminDb.collection(EVENTS_COLLECTION).doc(eventId);
  const regRef = adminDb.collection(REGISTRATIONS_COLLECTION).doc(regId);

  let finalRegistration: Registration | null = null;

  // Collision retry loop
  for (let attempt = 0; attempt < 3; attempt++) {
    const candidateTicketId = generateTicketId();
    const ticketRef = adminDb.collection('tickets').doc(candidateTicketId);

    try {
      finalRegistration = await adminDb.runTransaction(async (transaction) => {
        const eventDoc = await transaction.get(eventRef);
        const regDoc = await transaction.get(regRef);
        const ticketDoc = await transaction.get(ticketRef);

        if (!eventDoc.exists) {
          throw new RegistrationError('EVENT_NOT_FOUND');
        }

        if (regDoc.exists) {
          throw new RegistrationError('ALREADY_REGISTERED');
        }

        if (ticketDoc.exists) {
          throw new Error('COLLISION');
        }

        const eventData = eventDoc.data() as Event;

        if (Date.now() > eventData.registrationDeadline) {
          throw new RegistrationError('DEADLINE_PASSED');
        }

        if (eventData.registeredCount >= eventData.capacity) {
          throw new RegistrationError('EVENT_FULL');
        }

        const newRegistration: Omit<Registration, 'id'> = {
          eventId,
          userId,
          ticketId: candidateTicketId,
          status: 'registered',
          emailStatus: 'pending',
          registeredAt: Date.now(),
        };

        // Write registration
        transaction.set(regRef, newRegistration);
        
        // Reserve ticket ID
        transaction.set(ticketRef, { registrationId: regId, eventId, userId });

        // Increment event capacity
        transaction.update(eventRef, {
          registeredCount: FieldValue.increment(1)
        });

        return { id: regId, ...newRegistration } as Registration;
      });
      
      // If transaction succeeded without collision, break out of loop
      break;
    } catch (error: any) {
      if (error.message === 'COLLISION') {
        continue;
      }
      throw error;
    }
  }

  if (!finalRegistration) {
    throw new Error('Failed to generate a unique ticket ID after 3 attempts');
  }

  return finalRegistration;
}

/**
 * Marks a registration as attended, returning duplicate status if already attended.
 */
export async function markAttended(registrationId: string): Promise<{ success: boolean; duplicate?: boolean; attendedAt?: number }> {
  const regRef = adminDb.collection(REGISTRATIONS_COLLECTION).doc(registrationId);

  return adminDb.runTransaction(async (transaction) => {
    const regDoc = await transaction.get(regRef);
    
    if (!regDoc.exists) {
      throw new Error('Registration not found');
    }

    const data = regDoc.data() as Registration;

    if (data.status === 'attended') {
      // Already attended, return duplicate info without updating
      return { success: false, duplicate: true, attendedAt: data.attendedAt };
    }

    const now = Date.now();
    transaction.update(regRef, {
      status: 'attended',
      attendedAt: now,
    });

    return { success: true, attendedAt: now };
  });
}
