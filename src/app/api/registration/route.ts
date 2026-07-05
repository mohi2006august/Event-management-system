import { NextResponse } from 'next/server';
import { getAttendeeSession } from '@/lib/auth';
import { createAttendee } from '@/lib/firestore/attendees';
import { registerForEvent, RegistrationError, getRegistration, getRegistrationId } from '@/lib/firestore/registrations';
import { getEvent } from '@/lib/firestore/events';
import { sendTicketEmail } from '@/lib/ticket/email';
import { generateQR } from '@/lib/ticket/qr';
import { generateTicketPDF } from '@/lib/ticket/pdf';
import { adminDb } from '@/lib/firebase-admin';
import { z } from 'zod';


const requestSchema = z.object({
  eventId: z.string().min(1, 'eventId is required'),
  action: z.enum(['register', 'resend']).default('register'),
});

export async function POST(request: Request) {
  try {
    let attendee = await getAttendeeSession();
    const body = await request.json();
    const result = requestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid request data', details: result.error.format() }, { status: 400 });
    }

    const { eventId, action } = result.data;

    // 1. Fetch Event Details
    const event = await getEvent(eventId);
    if (!event) {
      return NextResponse.json({ error: 'EVENT_NOT_FOUND' }, { status: 404 });
    }

    // 2. Resolve Attendee
    if (!attendee) {
      return NextResponse.json({ error: 'Unauthorized. Please complete your profile.' }, { status: 401 });
    }

    const userId = attendee.id;
    const regId = getRegistrationId(eventId, userId);
    let registration;

    // 3. Database Registration & Collision Handling
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
        registration = await registerForEvent(eventId, userId);
      } catch (error: any) {
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

    // 4. Orchestrate Ticket Generation and Email
    try {
      // Determine host for QR URL (in production this should be your actual domain from env)
      const host = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      
      // Generate QR Code Data URL
      const qrDataUrl = await generateQR(registration.ticketId, host);
      
      // Generate PDF Buffer
      const pdfBuffer = await generateTicketPDF(registration, event, attendee, qrDataUrl);
      
      // Compose & Send Email
      await sendTicketEmail(attendee, event, registration, pdfBuffer);

      // Mark success
      await adminDb.collection('registrations').doc(regId).update({ emailStatus: 'sent' });
      registration.emailStatus = 'sent';
    } catch (ticketPipelineError) {
      console.error('Failed in ticket generation/email pipeline:', ticketPipelineError);
      await adminDb.collection('registrations').doc(regId).update({ emailStatus: 'failed' });
      registration.emailStatus = 'failed';
    }

    return NextResponse.json({ success: true, registration });
  } catch (error) {
    console.error('Registration API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

