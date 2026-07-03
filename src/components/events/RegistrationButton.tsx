'use client';

import { useState } from 'react';
import { Registration } from '@/types';
import { CheckCircle, AlertCircle, Loader2, MailWarning, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RegistrationButtonProps {
  eventId: string;
  isFull: boolean;
  isPastDeadline: boolean;
  initialRegistration: Registration | null;
  isSignedIn: boolean;
}

export default function RegistrationButton({
  eventId,
  isFull,
  isPastDeadline,
  initialRegistration,
  isSignedIn,
}: RegistrationButtonProps) {
  const [registration, setRegistration] = useState<Registration | null>(initialRegistration);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async () => {
    if (!isSignedIn) {
      // In a real app, you might redirect to /login?redirect=/events/...
      setError('Please sign in to register.');
      return;
    }

    setIsPending(true);
    setError(null);

    try {
      const res = await fetch('/api/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, action: 'register' }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to register');
      } else {
        setRegistration(data.registration);
        router.refresh(); // Refresh the server components to update counts
      }
    } catch (err) {
      setError('A network error occurred.');
    } finally {
      setIsPending(false);
    }
  };

  const handleResendEmail = async () => {
    setIsPending(true);
    setError(null);

    try {
      const res = await fetch('/api/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, action: 'resend' }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to resend email');
      } else {
        setRegistration({ ...registration!, emailStatus: 'sent' });
      }
    } catch (err) {
      setError('A network error occurred.');
    } finally {
      setIsPending(false);
    }
  };

  if (registration) {
    return (
      <div className="flex flex-col items-center p-6 bg-green-50 rounded-xl border border-green-200 w-full text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
        <h3 className="text-xl font-bold text-green-900 mb-1">You're Registered!</h3>
        <p className="text-green-700 mb-4 text-sm">
          We've secured your spot. See you there!
        </p>

        {registration.emailStatus === 'failed' && (
          <div className="mt-2 w-full p-4 bg-orange-50 border border-orange-200 rounded-lg flex flex-col items-center">
            <MailWarning className="w-6 h-6 text-orange-500 mb-2" />
            <p className="text-sm text-orange-800 mb-3">
              We couldn't send your ticket email. Your registration is still valid!
            </p>
            <button
              onClick={handleResendEmail}
              disabled={isPending}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center disabled:opacity-70"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              Resend Ticket
            </button>
          </div>
        )}
      </div>
    );
  }

  if (isPastDeadline) {
    return (
      <button disabled className="w-full px-8 py-4 bg-gray-200 text-gray-500 rounded-xl font-medium flex items-center justify-center cursor-not-allowed">
        Registration Closed
      </button>
    );
  }

  if (isFull) {
    return (
      <button disabled className="w-full px-8 py-4 bg-red-100 text-red-600 rounded-xl font-medium flex items-center justify-center cursor-not-allowed">
        Event is Full
      </button>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <button
        onClick={handleRegister}
        disabled={isPending}
        className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-200 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed text-lg"
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
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center w-full border border-red-100">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
