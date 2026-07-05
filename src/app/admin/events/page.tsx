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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative z-10 w-full">
      <style>{`
        .apple-glass-card {
          background: rgba(10, 8, 20, 0.35) !important;
          backdrop-filter: blur(40px) saturate(220%) !important;
          -webkit-backdrop-filter: blur(40px) saturate(220%) !important;
          border: 1px solid rgba(255, 255, 255, 0.16) !important;
          box-shadow: 
            inset 0 1px 1px rgba(255, 255, 255, 0.25),
            inset 0 -1px 2px rgba(0, 0, 0, 0.5),
            0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
        }
        .apple-glass-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%);
          pointer-events: none;
          z-index: 1;
          border-radius: inherit;
        }
      `}</style>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="h-14 w-14 bg-gradient-to-tr from-purple-500/30 to-indigo-500/30 text-purple-300 border border-white/20 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <LayoutDashboard className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-purple-100 to-indigo-200 bg-clip-text text-transparent">
                Manage Events
              </h1>
              <p className="mt-1 text-sm font-medium text-purple-200/70">Create, edit, or delete events.</p>
            </div>
          </div>
          <Link
            href="/admin/events/new"
            className="inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-sm font-bold rounded-2xl shadow-[0_0_15px_rgba(168,85,247,0.3)] text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
          >
            <Plus className="w-5 h-5 mr-2 -ml-1 stroke-[3]" />
            New Event
          </Link>
        </div>

        <div className="apple-glass-card rounded-[2rem] overflow-hidden relative">
          <ul className="relative z-10 divide-y divide-white/10">
            {events.length === 0 ? (
              <li className="p-16 text-center text-gray-500">
                <div className="mx-auto w-16 h-16 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                  <Calendar className="w-8 h-8" />
                </div>
                <p className="text-lg font-bold text-white">No events found</p>
                <p className="text-sm text-purple-200/60 mt-1 font-medium">Click "New Event" to create your first event.</p>
              </li>
            ) : (
              events.map((event) => (
                <li key={event.id} className="p-6 hover:bg-white/5 transition-all duration-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-black text-white hover:text-purple-300 transition-colors duration-200 truncate">
                      {event.title}
                    </h3>
                    <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-4 text-sm font-semibold text-purple-200/80">
                      <span className="flex items-center text-white bg-white/10 border border-white/10 px-3 py-1 rounded-full shadow-inner">
                        <Calendar className="w-4 h-4 mr-1.5 text-purple-300" />
                        {new Date(event.startsAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </span>
                      <span className="flex items-center text-white bg-white/10 border border-white/10 px-3 py-1 rounded-full shadow-inner">
                        <Users className="w-4 h-4 mr-1.5 text-indigo-300" />
                        <span className="font-bold mr-1">{event.registeredCount}</span> / {event.capacity} registered
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 self-end sm:self-center">
                    <Link
                      href={`/admin/events/${event.id}/edit`}
                      className="inline-flex items-center justify-center p-2.5 text-purple-300 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 rounded-xl cursor-pointer shadow-inner"
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
