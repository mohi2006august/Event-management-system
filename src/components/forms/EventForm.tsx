'use client';

import { useState } from 'react';
import type { Event } from '@/types';
import { Calendar, Clock, Type, Link as LinkIcon, FileText, Users, Loader2 } from 'lucide-react';

interface EventFormProps {
  initialData?: Event;
  action: (formData: FormData) => Promise<void>;
}

export default function EventForm({ initialData, action }: EventFormProps) {
  const [isPending, setIsPending] = useState(false);

  // Helper to format timestamp to datetime-local string
  const toDatetimeLocal = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    try {
      await action(new FormData(e.currentTarget));
    } catch (error) {
      console.error(error);
      setIsPending(false);
      // In a real app, toast an error here
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <Type className="w-4 h-4 mr-2 text-blue-500" /> Event Title
          </label>
          <input
            required
            type="text"
            name="title"
            defaultValue={initialData?.title}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            placeholder="e.g. Summer Tech Summit"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <LinkIcon className="w-4 h-4 mr-2 text-blue-500" /> URL Slug
          </label>
          <input
            required
            type="text"
            name="slug"
            defaultValue={initialData?.slug}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            placeholder="e.g. summer-tech-summit-2026"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 flex items-center">
          <FileText className="w-4 h-4 mr-2 text-blue-500" /> Description
        </label>
        <textarea
          required
          name="description"
          rows={5}
          defaultValue={initialData?.description}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-y"
          placeholder="Detailed description of the event..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-blue-500" /> Start Time
          </label>
          <input
            required
            type="datetime-local"
            name="startsAt"
            defaultValue={toDatetimeLocal(initialData?.startsAt)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <Clock className="w-4 h-4 mr-2 text-blue-500" /> Registration Deadline
          </label>
          <input
            required
            type="datetime-local"
            name="registrationDeadline"
            defaultValue={toDatetimeLocal(initialData?.registrationDeadline)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <Users className="w-4 h-4 mr-2 text-blue-500" /> Capacity
          </label>
          <input
            required
            type="number"
            min="1"
            name="capacity"
            defaultValue={initialData?.capacity || 100}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm shadow-blue-200 transition-all flex items-center justify-center min-w-[160px] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (initialData ? 'Save Changes' : 'Create Event')}
        </button>
      </div>
    </form>
  );
}
