import { requireAdmin } from '@/lib/auth';
import { listEvents } from '@/lib/firestore/events';
import ScannerClient from './ScannerClient';
import { ScanLine } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminCheckinPage() {
  await requireAdmin();
  
  // Fetch only what's needed for the dropdown
  const allEvents = await listEvents();
  const activeEvents = allEvents
    .filter(e => Date.now() < e.startsAt + 24 * 60 * 60 * 1000) // Filter out old events (e.g. >24h past start)
    .map(e => ({ id: e.id, title: e.title }));

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
            <ScanLine className="w-8 h-8 mr-3 text-blue-600" />
            Event Check-in Scanner
          </h1>
          <p className="mt-2 text-gray-500">Scan attendee QR tickets using your device camera.</p>
        </div>

        <ScannerClient events={activeEvents} />
      </div>
    </div>
  );
}
