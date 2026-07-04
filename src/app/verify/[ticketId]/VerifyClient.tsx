'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface VerifyClientProps {
  ticketId: string;
  isAttended: boolean;
}

export default function VerifyClient({ ticketId, isAttended }: VerifyClientProps) {
  const [isPending, setIsPending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const router = useRouter();

  const handleCheckIn = async () => {
    setIsPending(true);
    setResult(null);

    try {
      const res = await fetch(`/api/verify/${ticketId}`, {
        method: 'POST',
      });
      const data = await res.json();

      if (res.ok) {
        setResult({ success: data.success, message: data.message });
        if (data.success) {
          router.refresh();
        }
      } else {
        setResult({ success: false, message: data.error || 'Check-in failed' });
      }
    } catch (err) {
      setResult({ success: false, message: 'Network error occurred' });
    } finally {
      setIsPending(false);
    }
  };

  if (isAttended && !result) {
    return (
      <button disabled className="w-full px-6 py-4 bg-gray-200 text-gray-500 rounded-xl font-bold flex items-center justify-center cursor-not-allowed">
        Already Checked In
      </button>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <button
        onClick={handleCheckIn}
        disabled={isPending || isAttended}
        className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-200 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Check In Attendee'}
      </button>

      {result && (
        <div className={`p-4 rounded-lg flex items-center ${result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {result.success ? <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />}
          <p className="font-medium text-sm">{result.message}</p>
        </div>
      )}
    </div>
  );
}
