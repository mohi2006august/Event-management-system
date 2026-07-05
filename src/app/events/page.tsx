import Link from 'next/link';
import { listEvents } from '@/lib/firestore/events';
import { Calendar, Users, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function EventsListPage() {
  const events = await listEvents();
  
  const upcomingEvents = events.filter(e => e.startsAt > Date.now());

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
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 relative z-10">
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-white via-purple-100 to-indigo-200 bg-clip-text text-transparent sm:text-6xl drop-shadow-sm">
            Upcoming Events
          </h1>
          <p className="mt-6 max-w-2xl text-xl text-purple-200/70 font-medium mx-auto">
            Discover and register for our exclusive upcoming events. Space is limited, secure your spot today.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20 rounded-[2rem] apple-glass-card relative overflow-hidden">
            <div className="relative z-10">
              <Calendar className="mx-auto h-16 w-16 text-purple-400 mb-4 filter drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
              <h3 className="mt-2 text-2xl font-bold text-white">No events found</h3>
              <p className="mt-2 text-purple-200/60 font-medium">Check back later for new upcoming events.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const isFull = event.registeredCount >= event.capacity;
              const date = new Date(event.startsAt);
              
              return (
                <div key={event.id} className="flex flex-col rounded-[2rem] apple-glass-card group relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(168,85,247,0.4)]">
                  <div className="flex-1 p-8 relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20 shadow-inner">
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      {isFull && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                          Full
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-black text-white mb-4 group-hover:text-purple-300 transition-colors">
                      {event.title}
                    </h3>
                    
                    <p className="text-purple-100/70 mb-8 line-clamp-3 font-medium">
                      {event.description}
                    </p>
                    
                    <div className="flex items-center text-purple-300 text-sm mt-auto font-semibold">
                      <Users className="w-5 h-5 mr-2" />
                      {event.registeredCount} / {event.capacity} registered
                    </div>
                  </div>
                  
                  <div className="px-8 py-5 bg-white/5 border-t border-white/10 relative z-10 backdrop-blur-md">
                    <Link 
                      href={`/events/${event.slug}`}
                      className="text-white hover:text-purple-300 font-bold flex items-center justify-between w-full transition-colors"
                    >
                      View Details
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform text-purple-400" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
