import { adminDb } from '../firebase-admin';
import type { Attendee } from '../../types';

const ATTENDEES_COLLECTION = 'attendees';

export async function getAttendee(id: string): Promise<Attendee | null> {
  const doc = await adminDb.collection(ATTENDEES_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Attendee;
}

export async function createAttendee(id: string, data: Omit<Attendee, 'id' | 'createdAt'>): Promise<Attendee> {
  const docRef = adminDb.collection(ATTENDEES_COLLECTION).doc(id);
  const attendee: Attendee = {
    id,
    ...data,
    createdAt: Date.now(),
  };
  await docRef.set(attendee);
  return attendee;
}

export async function updateAttendee(id: string, data: Partial<Omit<Attendee, 'id' | 'createdAt'>>): Promise<void> {
  const docRef = adminDb.collection(ATTENDEES_COLLECTION).doc(id);
  await docRef.update(data);
}
