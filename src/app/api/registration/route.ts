import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { registerForEvent, RegistrationError, getRegistration, getRegistrationId } from '@/lib/firestore/registrations';
import { sendTicketEmail } from '@/lib/email';
import { adminDb } from '@/lib/firebase-admin';
import { z } from 'zod';

const requestSchema = z.object({
  eventId: z.string().min(1, 'eventId is required'),
  action: z.enum(['register', 'resend']).default('register'),
});

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const result = requestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid request data', details: result.error.format() }, { status: 400 });
    }

    const { eventId, action } = result.data;
    const userEmail = session.email || 'user@example.com'; // Fallback if claim is missing
    const regId = getRegistrationId(eventId, session.uid);
    let registration;

    if (action === 'resend') {
      registration = await getRegistration(regId);
      if (!registration) {
        return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
      }
      if (registration.emailStatus === 'sent') {
        return NextResponse.json({ error: 'Email already sent' }, { status: 400 });
      }
    } else {
      try {
        registration = await registerForEvent(eventId, session.uid);
      } catch (error) {
        if (error instanceof RegistrationError) {
          const statusMap: Record<string, number> = {
            'EVENT_NOT_FOUND': 404,
            'ALREADY_REGISTERED': 409,
            'DEADLINE_PASSED': 403,
            'EVENT_FULL': 403,
          };
          return NextResponse.json({ error: error.message }, { status: statusMap[error.code] || 400 });
        }
        throw error;
      }
    }

    // Attempt to send the ticket email
    try {
      await sendTicketEmail(registration, userEmail);
      // If success, update email status
      await adminDb.collection('registrations').doc(regId).update({ emailStatus: 'sent' });
      registration.emailStatus = 'sent';
    } catch (emailError) {
      console.error('Failed to send ticket email:', emailError);
      // NEVER fail the registration itself due to an email failure
      await adminDb.collection('registrations').doc(regId).update({ emailStatus: 'failed' });
      registration.emailStatus = 'failed';
    }

    return NextResponse.json({ success: true, registration });
  } catch (error) {
    console.error('Registration API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
