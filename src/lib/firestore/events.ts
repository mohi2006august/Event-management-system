import { adminDb } from '../firebase-admin';
import type { Event } from '../../types';
import { FieldValue } from 'firebase-admin/firestore';

const EVENTS_COLLECTION = 'events';

/**
 * Retrieves a single event by ID.
 */
export async function getEvent(id: string): Promise<Event | null> {
  const doc = await adminDb.collection(EVENTS_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Event;
}

/**
 * Retrieves a single event by slug. Useful for public URLs.
 */
export async function getEventBySlug(slug: string): Promise<Event | null> {
  const snapshot = await adminDb
    .collection(EVENTS_COLLECTION)
    .where('slug', '==', slug)
    .limit(1)
    .get();

  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Event;
}

/**
 * Lists all events, optionally ordered by start time.
 */
export async function listEvents(): Promise<Event[]> {
  const snapshot = await adminDb
    .collection(EVENTS_COLLECTION)
    .orderBy('startsAt', 'asc')
    .get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
}

/**
 * Creates a new event.
 */
export async function createEvent(data: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'registeredCount'>): Promise<Event> {
  const docRef = adminDb.collection(EVENTS_COLLECTION).doc();
  const now = Date.now();
  
  const event: Event = {
    id: docRef.id,
    ...data,
    registeredCount: 0,
    createdAt: now,
    updatedAt: now,
  };
  
  await docRef.set(event);
  return event;
}

/**
 * Updates an existing event.
 */
export async function updateEvent(id: string, data: Partial<Omit<Event, 'id' | 'createdAt' | 'registeredCount'>>): Promise<void> {
  const docRef = adminDb.collection(EVENTS_COLLECTION).doc(id);
  
  await docRef.update({
    ...data,
    updatedAt: Date.now(),
  });
}

/**
 * Deletes an event.
 */
export async function deleteEvent(id: string): Promise<void> {
  await adminDb.collection(EVENTS_COLLECTION).doc(id).delete();
}
