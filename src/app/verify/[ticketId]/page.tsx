import { notFound } from 'next/navigation';
import { adminDb } from '@/lib/firebase-admin';
import { getEvent } from '@/lib/firestore/events';
import { getSession } from '@/lib/auth';
import VerifyClient from './VerifyClient';

interface PageProps {
  params: Promise<{
    ticketId: string;
  }>;
}

export default async function VerifyPage({ params }: PageProps) {
  const { ticketId } = await params;

  // 1. Fetch Ticket Record
  const ticketDoc = await adminDb.collection('tickets').doc(ticketId).get();
  
  if (!ticketDoc.exists) {
    notFound();
  }

  const { eventId, registrationId } = ticketDoc.data()!;

  // 2. Fetch Registration Record
  const regDoc = await adminDb.collection('registrations').doc(registrationId).get();
  if (!regDoc.exists) {
    notFound();
  }
  const registration = { id: regDoc.id, ...regDoc.data() } as any;

  // 3. Fetch Event
  const event = await getEvent(eventId);
  if (!event) {
    notFound();
  }

  // 4. Check Admin Status
  const session = await getSession();
  const isAdmin = session?.isAdmin || false;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ticket Verification</h1>
          <p className="text-gray-500">ID: {ticketId}</p>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{event.title}</h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className={`font-medium ${registration.status === 'attended' ? 'text-green-600' : 'text-blue-600'}`}>
                {registration.status === 'attended' ? 'Already Checked In' : 'Valid'}
              </span>
            </div>
            {registration.attendedAt && (
              <div className="flex justify-between">
                <span className="text-gray-500">Checked In At</span>
                <span className="font-medium text-gray-900">
                  {new Date(registration.attendedAt).toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Purchased At</span>
              <span className="font-medium text-gray-900">
                {new Date(registration.registeredAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {isAdmin ? (
          <VerifyClient 
            ticketId={ticketId} 
            isAttended={registration.status === 'attended'} 
          />
        ) : (
          <div className="text-center text-sm text-gray-500 bg-gray-100 p-4 rounded-lg">
            You must be logged in as an Event Administrator to check in this ticket.
          </div>
        )}
      </div>
    </div>
  );
}
