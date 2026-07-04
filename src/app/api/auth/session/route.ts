import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

// 5 days in milliseconds
const EXPIRES_IN = 1000 * 60 * 60 * 24 * 5;

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'Missing ID token' }, { status: 400 });
    }

    // Create the session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: EXPIRES_IN,
    });

    const cookieStore = await cookies();
    cookieStore.set('session', sessionCookie, {
      maxAge: EXPIRES_IN,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Error creating session cookie:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('session');

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting session cookie:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
