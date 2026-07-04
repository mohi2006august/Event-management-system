import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { markAttended } from '@/lib/firestore/registrations';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(
  request: Request,
  { params }: { params: { ticketId: string } }
) {
  try {
    const session = await requireAdmin();
    if (!session.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { ticketId } = params;

    // Look up the ticket reservation
    const ticketDoc = await adminDb.collection('tickets').doc(ticketId).get();
    if (!ticketDoc.exists) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const { registrationId } = ticketDoc.data()!;

    const result = await markAttended(registrationId);

    if (result.duplicate) {
      return NextResponse.json({
        success: false,
        duplicate: true,
        message: 'This ticket has already been used.',
        attendedAt: result.attendedAt
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Ticket successfully verified and checked in!',
      attendedAt: result.attendedAt
    });

  } catch (error) {
    console.error('Verify API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
