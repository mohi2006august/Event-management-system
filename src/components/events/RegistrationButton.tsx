'use client';

import { useState } from 'react';
import { Registration, Attendee } from '@/types';
import { CheckCircle, MailWarning, User, LogIn, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface RegistrationButtonProps {
  eventId: string;
  isFull: boolean;
  isPastDeadline: boolean;
  initialRegistration: Registration | null;
  session: any | null;
  attendee: Attendee | null;
  slug: string;
}

export default function RegistrationButton({
  eventId,
  isFull,
  isPastDeadline,
  initialRegistration,
  session,
  attendee,
  slug,
}: RegistrationButtonProps) {
  const { signInWithGoogle } = useAuth();
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  if (initialRegistration) {
    return (
      <div className="flex flex-col items-center p-8 apple-glass-card rounded-[2rem] w-full text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-emerald-500/10 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-center">
          <CheckCircle className="w-16 h-16 text-green-400 mb-4 filter drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
          <h3 className="text-3xl font-black text-white mb-2 tracking-tight">You're Registered!</h3>
          <p className="text-green-200/80 font-medium">
            We've secured your spot. See you there!
          </p>

          {initialRegistration.emailStatus === 'failed' && (
            <div className="mt-4 w-full p-4 bg-orange-500/10 border border-orange-500/30 rounded-2xl flex flex-col items-center backdrop-blur-md">
              <MailWarning className="w-6 h-6 text-orange-400 mb-2" />
              <p className="text-xs text-orange-200 font-semibold text-center">
                We couldn't send your ticket email. Your registration is still valid.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isPastDeadline) {
    return (
      <button disabled className="w-full px-8 py-5 bg-white/5 border border-white/10 text-white/50 rounded-2xl font-bold flex items-center justify-center cursor-not-allowed apple-glass-card">
        Registration Closed
      </button>
    );
  }

  if (isFull) {
    return (
      <button disabled className="w-full px-8 py-5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl font-bold flex items-center justify-center cursor-not-allowed apple-glass-card shadow-inner">
        Event is Full
      </button>
    );
  }

  const handleLoginClick = async () => {
    setIsPending(true);
    try {
      await signInWithGoogle();
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  if (!session) {
    return (
      <button
        onClick={handleLoginClick}
        disabled={isPending}
        className="w-full px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 active:scale-95 text-xl tracking-wide flex items-center justify-center border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? <Loader2 className="w-6 h-6 mr-3 animate-spin" /> : <LogIn className="w-6 h-6 mr-3" />}
        {isPending ? 'Signing in...' : 'Sign in to Register'}
      </button>
    );
  }

  if (!attendee) {
    return (
      <Link
        href={`/profile?returnUrl=${encodeURIComponent('/events/' + slug)}`}
        className="w-full px-8 py-4 bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-500 hover:to-pink-500 text-white rounded-2xl font-black shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 active:scale-95 text-xl tracking-wide flex items-center justify-center"
      >
        <User className="w-6 h-6 mr-3" />
        Complete Profile to Register
      </Link>
    );
  }

  const handleRegister = async () => {
    setIsPending(true);
    try {
      const res = await fetch('/api/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, action: 'register' }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to register. Please try again.');
      }
    } catch (err) {
      alert('Network error.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleRegister}
      disabled={isPending}
      className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-black shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 active:scale-95 text-xl tracking-wide flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
    >
      {isPending ? (
        <>
          <Loader2 className="w-6 h-6 animate-spin mr-3" />
          Processing...
        </>
      ) : (
        'Register Now'
      )}
    </button>
  );
}

