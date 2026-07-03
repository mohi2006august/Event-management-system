import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { verifyTicketCode } from '@/lib/qr/ticket';
import { markAttended, getRegistration } from '@/lib/firestore/registrations';
import { getMember } from '@/lib/firestore/members';
import { z } from 'zod';

const scanPayloadSchema = z.object({
  ticketCode: z.string().min(1, 'Ticket code is required'),
  targetEventId: z.string().min(1, 'Target event ID is required'),
});

export async function POST(request: Request) {
  try {
    // 1. Verify admin server-side
    const session = await requireAdmin();
    if (!session.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // 2. Validate payload
    const body = await request.json();
    const result = scanPayloadSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ 
        result: 'invalid', 
        message: 'Invalid scan payload format' 
      }, { status: 400 });
    }

    const { ticketCode, targetEventId } = result.data;

    // 3. Verify cryptographic signature
    let payload;
    try {
      payload = await verifyTicketCode(ticketCode);
    } catch (err) {
      return NextResponse.json({ 
        result: 'invalid', 
        message: 'Invalid or tampered ticket code' 
      });
    }

    // 4. Verify correct event
    if (payload.eventId !== targetEventId) {
      return NextResponse.json({ 
        result: 'wrong_event', 
        message: 'This ticket is for a different event' 
      });
    }

    // 5. Look up the registration to verify it actually exists in DB
    const registration = await getRegistration(payload.registrationId);
    if (!registration) {
      return NextResponse.json({ 
        result: 'invalid', 
        message: 'Registration record not found' 
      });
    }

    // 6. Fetch attendee info (optional, helps the admin greet the person)
    const member = await getMember(payload.userId);
    const attendee = member ? { name: member.name, email: member.email } : { name: 'Unknown', email: 'Unknown' };

    // 7. Transactionally mark as attended
    const updateResult = await markAttended(payload.registrationId);

    if (updateResult.duplicate) {
      return NextResponse.json({
        result: 'duplicate',
        message: 'This ticket has already been scanned.',
        attendee,
        attendedAt: updateResult.attendedAt
      });
    }

    return NextResponse.json({
      result: 'success',
      message: 'Check-in successful!',
      attendee,
      attendedAt: updateResult.attendedAt
    });

  } catch (error) {
    console.error('Check-in API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
