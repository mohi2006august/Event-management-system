import Link from 'next/link';
import { listEvents } from '@/lib/firestore/events';
import { Calendar, Users, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function EventsListPage() {
  const events = await listEvents();
  
  // Basic filtering for upcoming events, though we could just show all
  const upcomingEvents = events.filter(e => e.startsAt > Date.now());

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Upcoming Events
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Discover and register for our exclusive upcoming events. Space is limited, secure your spot today.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No events found</h3>
            <p className="mt-1 text-sm text-gray-500">Check back later for new upcoming events.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const isFull = event.registeredCount >= event.capacity;
              const date = new Date(event.startsAt);
              
              return (
                <div key={event.id} className="flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
                  <div className="flex-1 p-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      {isFull && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-700">
                          Full
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {event.description}
                    </p>
                    
                    <div className="flex items-center text-gray-500 text-sm mt-auto">
                      <Users className="w-4 h-4 mr-2" />
                      {event.registeredCount} / {event.capacity} registered
                    </div>
                  </div>
                  
                  <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
                    <Link 
                      href={`/events/${event.slug}`}
                      className="text-blue-600 hover:text-blue-700 font-semibold flex items-center justify-between w-full"
                    >
                      View Details
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
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
