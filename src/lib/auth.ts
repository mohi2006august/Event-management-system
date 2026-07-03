import { cookies } from 'next/headers';
import { adminAuth } from './firebase-admin';

export type SessionData = {
  uid: string;
  email?: string;
  isAdmin: boolean;
};

// This is a stub pattern matching what would be expected for server-side auth.
// In a real implementation, you'd likely verify a session cookie with Firebase Admin.
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) return null;

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email,
      isAdmin: !!decodedClaims.admin, // assuming custom claim 'admin'
    };
  } catch (error) {
    console.error('Session verification failed', error);
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
