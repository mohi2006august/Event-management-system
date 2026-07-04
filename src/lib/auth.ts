import { cookies } from 'next/headers';


export type SessionData = {
  uid: string;
  email?: string;
  isAdmin: boolean;
};

// This is a stub pattern matching what would be expected for server-side auth.
// In a real implementation, you'd likely verify a session cookie with Firebase Admin.
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  // TEMPORARY MOCK FOR TESTING:
  // Since we haven't implemented the client-side login flow yet,
  // we will automatically return a mock admin session so you can test the UI.
  return {
    uid: 'mock-admin-456',
    email: 'admin@example.com',
    isAdmin: true,
  };
}

export async function requireAuth(): Promise<SessionData> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function requireAdmin(): Promise<SessionData> {
  const session = await requireAuth();
  if (!session.isAdmin) {
    throw new Error('Forbidden: Admin access required');
  }
  return session;
}

import { getAttendee } from './firestore/attendees';
import type { Attendee } from '../types';

export async function getAttendeeSession(): Promise<Attendee | null> {
  const cookieStore = await cookies();
  const attendeeId = cookieStore.get('attendeeId')?.value;
  
  if (!attendeeId) {
    return null;
  }
  
  try {
    return await getAttendee(attendeeId);
  } catch (error) {
    console.error('Error fetching attendee session:', error);
    return null;
  }
}
