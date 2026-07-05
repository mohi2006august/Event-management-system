import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
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

    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map(e => e.trim().toLowerCase());
      
    const userEmail = decodedClaims.email?.toLowerCase();
    const isAdmin = Boolean(userEmail && adminEmails.includes(userEmail));

    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email,
      isAdmin,
    };
  } catch (error) {
    console.error('Session verification failed:', error);
    return null;
  }
}

export async function requireAuth(): Promise<SessionData> {
  const session = await getSession();
  if (!session) {
    redirect('/admin/login');
  }
  return session;
}

export async function requireAdmin(): Promise<SessionData> {
  const session = await requireAuth();
  if (!session.isAdmin) {
    redirect('/events');
  }
  return session;
}

import { getAttendee } from './firestore/attendees';
import type { Attendee } from '../types';

export async function getAttendeeSession(): Promise<Attendee | null> {
  const session = await getSession();
  
  if (!session) {
    return null;
  }
  
  try {
    return await getAttendee(session.uid);
  } catch (error) {
    console.error('Error fetching attendee session:', error);
    return null;
  }
}
