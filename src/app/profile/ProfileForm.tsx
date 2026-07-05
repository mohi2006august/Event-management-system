'use client';

import { useState } from 'react';
import { User, Mail, Phone, GraduationCap, Building, Hash, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Attendee } from '@/types';
import { useRouter } from 'next/navigation';

export default function ProfileForm({ session, attendee }: { session: any, attendee: Attendee | null }) {
  const [name, setName] = useState(attendee?.name || session.email?.split('@')[0] || '');
  const [email, setEmail] = useState(attendee?.email || session.email || '');
  const [phone, setPhone] = useState(attendee?.phone || '');
  const [classSection, setClassSection] = useState(attendee?.classSection || '');
  const [college, setCollege] = useState(attendee?.college || '');
  const [rollNo, setRollNo] = useState(attendee?.rollNo || '');

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, phone, classSection, college, rollNo
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to update profile');
      } else {
        setSuccess(true);
        router.refresh(); // Refresh the page to get the updated session state if needed
      }
    } catch (err) {
      setError('A network error occurred.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 relative z-10">
      
      {/* Name & Email Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-purple-200/80 mb-2 ml-1">Full Name</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-300/50 group-focus-within:text-purple-300 transition-colors">
              <User className="h-5 w-5" />
            </div>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-200/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all backdrop-blur-sm text-lg"
              placeholder="John Doe"
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-purple-200/80 mb-2 ml-1">Email Address</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-300/50 group-focus-within:text-purple-300 transition-colors">
              <Mail className="h-5 w-5" />
            </div>
            <input
              id="email"
              type="email"
              required
              disabled
              value={email}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white/50 cursor-not-allowed transition-all backdrop-blur-sm text-lg"
            />
          </div>
        </div>
      </div>

      {/* Phone & Class Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-purple-200/80 mb-2 ml-1">Phone Number</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-300/50 group-focus-within:text-purple-300 transition-colors">
              <Phone className="h-5 w-5" />
            </div>
            <input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-200/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all backdrop-blur-sm text-lg"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>
        <div>
          <label htmlFor="classSection" className="block text-sm font-semibold text-purple-200/80 mb-2 ml-1">Class & Section</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-300/50 group-focus-within:text-purple-300 transition-colors">
              <GraduationCap className="h-5 w-5" />
            </div>
            <input
              id="classSection"
              type="text"
              required
              value={classSection}
              onChange={(e) => setClassSection(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-200/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all backdrop-blur-sm text-lg"
              placeholder="B.Tech CS - A"
            />
          </div>
        </div>
      </div>

      {/* College & Roll No Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="college" className="block text-sm font-semibold text-purple-200/80 mb-2 ml-1">College Name</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-300/50 group-focus-within:text-purple-300 transition-colors">
              <Building className="h-5 w-5" />
            </div>
            <input
              id="college"
              type="text"
              required
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-200/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all backdrop-blur-sm text-lg"
              placeholder="University Name"
            />
          </div>
        </div>
        <div>
          <label htmlFor="rollNo" className="block text-sm font-semibold text-purple-200/80 mb-2 ml-1">Roll Number</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-300/50 group-focus-within:text-purple-300 transition-colors">
              <Hash className="h-5 w-5" />
            </div>
            <input
              id="rollNo"
              type="text"
              required
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-200/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all backdrop-blur-sm text-lg"
              placeholder="21XXXXXX"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <button
          type="submit"
          disabled={isPending}
          className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-black shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] text-lg"
        >
          {isPending ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin mr-3" />
              Saving Profile...
            </>
          ) : (
            'Save Profile'
          )}
        </button>
      </div>

      {success && (
        <div className="mt-2 p-5 bg-green-500/10 border border-green-500/30 text-green-200 text-sm rounded-xl flex items-center w-full backdrop-blur-md">
          <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0 text-green-400" />
          <span className="font-medium text-base">Profile successfully updated! You can now register for events.</span>
        </div>
      )}

      {error && (
        <div className="mt-2 p-5 bg-red-500/10 border border-red-500/30 text-red-200 text-sm rounded-xl flex items-center w-full backdrop-blur-md">
          <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0 text-red-400" />
          <span className="font-medium text-base">{error}</span>
        </div>
      )}
    </form>
  );
}
