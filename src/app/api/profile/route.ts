import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createAttendee, getAttendee, updateAttendee } from '@/lib/firestore/attendees';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email(),
  phone: z.string().min(1, 'Phone is required'),
  classSection: z.string().min(1, 'Class/Section is required'),
  college: z.string().min(1, 'College is required'),
  rollNo: z.string().min(1, 'Roll No is required'),
});

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const result = profileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid request data', details: result.error.format() }, { status: 400 });
    }

    const existingAttendee = await getAttendee(session.uid);
    if (existingAttendee) {
      await updateAttendee(session.uid, result.data);
    } else {
      await createAttendee(session.uid, result.data);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Profile API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
