import { notFound } from 'next/navigation';
import { getEventBySlug } from '@/lib/firestore/events';
import { Calendar, Users, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

// NOTE: RegistrationButton will be added in Step 7
// import RegistrationButton from '@/components/events/RegistrationButton';

interface EventPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const isFull = event.registeredCount >= event.capacity;
  const isPastDeadline = Date.now() > event.registrationDeadline;
  const startDate = new Date(event.startsAt);
  const deadlineDate = new Date(event.registrationDeadline);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/events" className="text-blue-600 hover:text-blue-800 font-medium mb-8 inline-block">
          &larr; Back to all events
        </Link>
        
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-blue-600 px-8 py-16 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="relative z-10">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm text-white mb-6 shadow-sm border border-white/20">
                {startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                {event.title}
              </h1>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">About this Event</h3>
                <div className="prose prose-blue max-w-none text-gray-600 whitespace-pre-wrap leading-relaxed text-lg">
                  {event.description}
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 h-fit space-y-6">
                <div className="flex items-start">
                  <Clock className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="ml-4">
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Start Time</h4>
                    <p className="mt-1 text-gray-600">{startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Users className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="ml-4">
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Availability</h4>
                    <p className="mt-1 text-gray-600">
                      {event.registeredCount} / {event.capacity} seats taken
                    </p>
                    {isFull && (
                      <p className="text-red-600 text-sm font-medium mt-1">This event is currently full.</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <AlertCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="ml-4">
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Registration Deadline</h4>
                    <p className="mt-1 text-gray-600">
                      {deadlineDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </p>
                    {isPastDeadline && (
                      <p className="text-red-600 text-sm font-medium mt-1">Registration has closed.</p>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  {/* RegistrationButton component will go here in Step 7 */}
                  <div className="w-full bg-blue-100 text-blue-800 text-center py-4 rounded-xl font-medium border border-blue-200 shadow-inner">
                    [Registration Component Placeholder]
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
