import { listEvents } from '@/lib/firestore/events';
import { requireAdmin } from '@/lib/auth';
import Link from 'next/link';
import { Plus, Edit2, LayoutDashboard } from 'lucide-react';
import { deleteEventAction } from './actions';

export default async function AdminEventsListPage() {
  await requireAdmin(); // Secure this page
  
  const events = await listEvents();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <LayoutDashboard className="w-8 h-8 mr-3 text-blue-600" />
              Manage Events
            </h1>
            <p className="mt-2 text-sm text-gray-500">Create, edit, or delete events.</p>
          </div>
          <Link
            href="/admin/events/new"
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2 -ml-1" />
            New Event
          </Link>
        </div>

        <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {events.length === 0 ? (
              <li className="p-12 text-center text-gray-500">
                No events found. Click "New Event" to create one.
              </li>
            ) : (
              events.map((event) => (
                <li key={event.id} className="p-6 hover:bg-gray-50/50 transition-colors flex items-center justify-between">
                  <div className="flex-1 min-w-0 pr-6">
                    <h3 className="text-lg font-bold text-gray-900 truncate">{event.title}</h3>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>{new Date(event.startsAt).toLocaleDateString()}</span>
                      <span>&bull;</span>
                      <span>{event.registeredCount} / {event.capacity} registered</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Link
                      href={`/admin/events/${event.id}/edit`}
                      className="inline-flex items-center p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                      title="Edit Event"
                    >
                      <Edit2 className="w-5 h-5" />
                    </Link>
                    
                    <form action={deleteEventAction.bind(null, event.id)}>
                      <button
                        type="submit"
                        className="inline-flex items-center p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        title="Delete Event"
                        onClick={(e) => {
                          if (!confirm('Are you sure you want to delete this event?')) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </form>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
