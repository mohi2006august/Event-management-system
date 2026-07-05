import { getSession } from '@/lib/auth';
import { getAttendee } from '@/lib/firestore/attendees';
import { redirect } from 'next/navigation';
import ProfileForm from './ProfileForm';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await getSession();
  
  if (!session) {
    // If not logged in via Firebase session, redirect to home
    redirect('/');
  }

  const attendee = await getAttendee(session.uid);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative z-10 w-full animate-in fade-in duration-700">
      <div className="max-w-3xl mx-auto mt-8">
        <div className="apple-glass-card rounded-[2.5rem] p-8 md:p-12 border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/10 pointer-events-none"></div>
          
          <div className="relative z-10 mb-8 text-center">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 tracking-tight drop-shadow-md">
              My Profile
            </h1>
            <p className="text-purple-200/70 text-lg mt-3 font-medium">
              Complete your profile to unlock one-click event registrations.
            </p>
          </div>

          <ProfileForm session={session} attendee={attendee} />
        </div>
      </div>
    </div>
  );
}
