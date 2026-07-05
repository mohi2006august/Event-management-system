import { listEvents } from '@/lib/firestore/events';
import { requireAdmin } from '@/lib/auth';
import Link from 'next/link';
import { Plus, Edit2, LayoutDashboard, Calendar, Users } from 'lucide-react';
import { deleteEventAction } from './actions';
import DeleteEventButton from '@/components/events/DeleteEventButton';
export const dynamic = 'force-dynamic';

export default async function AdminEventsListPage() {
  await requireAdmin(); // Secure this page
  
  const events = await listEvents();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-50/30 via-gray-50 to-indigo-50/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="h-14 w-14 bg-gradient-to-tr from-purple-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <LayoutDashboard className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-gray-900">
                Manage Events
              </h1>
              <p className="mt-1 text-sm font-medium text-gray-500">Create, edit, or delete events.</p>
            </div>
          </div>
          <Link
            href="/admin/events/new"
            className="inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-sm font-bold rounded-2xl shadow-lg shadow-purple-500/15 text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:shadow-purple-500/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
          >
            <Plus className="w-5 h-5 mr-2 -ml-1 stroke-[3]" />
            New Event
          </Link>
        </div>

        <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-3xl border border-purple-100/50 overflow-hidden">
          <ul className="divide-y divide-purple-100/50">
            {events.length === 0 ? (
              <li className="p-16 text-center text-gray-500">
                <div className="mx-auto w-16 h-16 bg-purple-50 text-purple-400 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8" />
                </div>
                <p className="text-lg font-bold text-gray-800">No events found</p>
                <p className="text-sm text-gray-500 mt-1">Click "New Event" to create your first event.</p>
              </li>
            ) : (
              events.map((event) => (
                <li key={event.id} className="p-6 hover:bg-purple-50/20 transition-all duration-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-950 hover:text-purple-700 transition-colors duration-150 truncate">
                      {event.title}
                    </h3>
                    <div className="mt-2.5 flex flex-wrap items-center gap-y-2 gap-x-4 text-sm font-medium text-gray-500">
                      <span className="flex items-center text-purple-600 bg-purple-50/80 px-2.5 py-1 rounded-lg">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        {new Date(event.startsAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </span>
                      <span className="flex items-center text-indigo-600 bg-indigo-50/80 px-2.5 py-1 rounded-lg">
                        <Users className="w-4 h-4 mr-1.5" />
                        <span className="font-bold mr-1">{event.registeredCount}</span> / {event.capacity} registered
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 self-end sm:self-center">
                    <Link
                      href={`/admin/events/${event.id}/edit`}
                      className="inline-flex items-center justify-center p-2.5 text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 transition-all rounded-xl cursor-pointer"
                      title="Edit Event"
                    >
                      <Edit2 className="w-5 h-5 stroke-[2.5]" />
                    </Link>
                    
                    <DeleteEventButton id={event.id} deleteAction={deleteEventAction} />
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
