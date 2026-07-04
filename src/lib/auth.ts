import { cookies } from 'next/headers';
import { adminAuth } from './firebase-admin';

export type SessionData = {
  uid: string;
  email?: string;
  isAdmin: boolean;
};

export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) return null;

    // Verify the session cookie with Firebase Admin
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);

    // For now, anyone who is logged in is granted admin access
    // You can refine this by checking an 'admins' collection in Firestore later
    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email,
      isAdmin: true,
    };
  } catch (error) {
    console.error('Session verification failed:', error);
    return null;
  }
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
