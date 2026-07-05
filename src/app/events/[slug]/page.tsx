import { notFound } from 'next/navigation';
import { getEventBySlug } from '@/lib/firestore/events';
import { Calendar, Users, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

import RegistrationButton from '@/components/events/RegistrationButton';
import { getAttendeeSession, getSession } from '@/lib/auth';
import { getRegistration, getRegistrationId } from '@/lib/firestore/registrations';

interface EventPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';

export default async function EventDetailPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const session = await getSession();
  const attendee = await getAttendeeSession();
  
  let userRegistration = null;
  if (attendee) {
    const regId = getRegistrationId(event.id, attendee.id);
    userRegistration = await getRegistration(regId);
  }

  const isFull = event.registeredCount >= event.capacity;
  const isPastDeadline = Date.now() > event.registrationDeadline;
  const startDate = new Date(event.startsAt);
  const deadlineDate = new Date(event.registrationDeadline);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative z-10 w-full animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto">
        <Link href="/events" className="text-purple-300 hover:text-white font-bold mb-8 inline-flex items-center transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10">
          &larr; <span className="ml-2">Back to all events</span>
        </Link>
        
        <div className="apple-glass-card rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10">
          <div className="bg-gradient-to-br from-purple-600/40 to-indigo-600/40 px-8 py-16 text-white text-center relative overflow-hidden backdrop-blur-md border-b border-white/10">
            <div className="absolute top-0 left-0 w-full h-full opacity-30 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="relative z-10">
              <span className="inline-flex items-center px-5 py-2 rounded-full text-sm font-bold bg-white/10 backdrop-blur-md text-purple-100 mb-6 shadow-sm border border-white/20 uppercase tracking-widest">
                {startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 drop-shadow-lg text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
                {event.title}
              </h1>
            </div>
          </div>

          <div className="p-8 md:p-12 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="md:col-span-2">
                <h3 className="text-2xl font-black text-white mb-6">About this Event</h3>
                <div className="prose prose-invert max-w-none text-purple-100/80 whitespace-pre-wrap leading-relaxed text-lg">
                  {event.description}
                </div>
              </div>
              
              <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 h-fit space-y-8 backdrop-blur-md">
                <div className="flex items-start">
                  <div className="bg-purple-500/20 p-3 rounded-2xl border border-purple-500/30">
                    <Clock className="w-6 h-6 text-purple-300 flex-shrink-0" />
                  </div>
                  <div className="ml-5">
                    <h4 className="text-xs font-bold text-purple-300/80 uppercase tracking-widest">Start Time</h4>
                    <p className="mt-1 text-white font-medium text-lg">{startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-indigo-500/20 p-3 rounded-2xl border border-indigo-500/30">
                    <Users className="w-6 h-6 text-indigo-300 flex-shrink-0" />
                  </div>
                  <div className="ml-5">
                    <h4 className="text-xs font-bold text-indigo-300/80 uppercase tracking-widest">Availability</h4>
                    <p className="mt-1 text-white font-medium text-lg">
                      {event.registeredCount} / {event.capacity} <span className="text-white/50 text-sm">seats taken</span>
                    </p>
                    {isFull && (
                      <p className="text-red-400 text-sm font-bold mt-2 bg-red-500/10 inline-block px-3 py-1 rounded-full border border-red-500/20">This event is currently full.</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-pink-500/20 p-3 rounded-2xl border border-pink-500/30">
                    <AlertCircle className="w-6 h-6 text-pink-300 flex-shrink-0" />
                  </div>
                  <div className="ml-5">
                    <h4 className="text-xs font-bold text-pink-300/80 uppercase tracking-widest">Registration Deadline</h4>
                    <p className="mt-1 text-white font-medium">
                      {deadlineDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} <br/>
                      <span className="text-white/60 text-sm">{deadlineDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                    </p>
                    {isPastDeadline && (
                      <p className="text-red-400 text-sm font-bold mt-2 bg-red-500/10 inline-block px-3 py-1 rounded-full border border-red-500/20">Registration has closed.</p>
                    )}
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10">
                  <RegistrationButton 
                    eventId={event.id}
                    isFull={isFull}
                    isPastDeadline={isPastDeadline}
                    initialRegistration={userRegistration}
                    session={session}
                    attendee={attendee}
                    slug={slug}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
