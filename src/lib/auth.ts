import { cookies } from 'next/headers';


export type SessionData = {
  uid: string;
  email?: string;
  isAdmin: boolean;
};

// In a real implementation, you'd likely verify a session cookie with Firebase Admin.
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  
  // TODO: Implement actual session verification here
  // For now, it returns null since there is no session cookie set up yet.
  return null;
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
