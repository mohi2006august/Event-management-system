'use client';

import { useState } from 'react';
import type { Event } from '@/types';
import { Calendar, Clock, Type, Link as LinkIcon, FileText, Users, Loader2, MapPin, Globe, Image as ImageIcon, Tag, Activity, Lock } from 'lucide-react';

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
    <form onSubmit={handleSubmit} className="space-y-6 relative z-10 apple-glass-card p-10 border border-white/10 text-white shadow-2xl">
      <style>{`
        .apple-glass-card {
          background: rgba(10, 8, 20, 0.45) !important;
          backdrop-filter: blur(40px) saturate(220%) !important;
          -webkit-backdrop-filter: blur(40px) saturate(220%) !important;
          border: 1px solid rgba(255, 255, 255, 0.16) !important;
          box-shadow: 
            inset 0 1px 1px rgba(255, 255, 255, 0.25),
            inset 0 -1px 2px rgba(0, 0, 0, 0.5),
            0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
          border-radius: 36px;
        }
        .apple-glass-input {
          background: rgba(255, 255, 255, 0.04) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          backdrop-filter: blur(10px) !important;
          color: #ffffff !important;
          border-radius: 16px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .apple-glass-input:focus {
          background: rgba(255, 255, 255, 0.08) !important;
          border-color: rgba(168, 85, 247, 0.5) !important;
          box-shadow: 
            0 0 0 1px rgba(168, 85, 247, 0.5),
            0 0 25px rgba(168, 85, 247, 0.25) !important;
        }
        .apple-glass-select option {
          background: #140827;
          color: white;
        }
      `}</style>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-purple-200/80 flex items-center mb-1.5 ml-1">
            <Type className="w-4 h-4 mr-2 text-purple-400" /> Event Title
          </label>
          <input
            required
            type="text"
            name="title"
            defaultValue={initialData?.title}
            className="w-full px-4 py-3.5 rounded-xl apple-glass-input focus:outline-none placeholder-purple-300/30"
            placeholder="e.g. Summer Tech Summit"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-purple-200/80 flex items-center mb-1.5 ml-1">
            <LinkIcon className="w-4 h-4 mr-2 text-purple-400" /> URL Slug
          </label>
          <input
            required
            type="text"
            name="slug"
            defaultValue={initialData?.slug}
            className="w-full px-4 py-3.5 rounded-xl apple-glass-input focus:outline-none placeholder-purple-300/30"
            placeholder="e.g. summer-tech-summit-2026"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-purple-200/80 flex items-center mb-1.5 ml-1">
          <FileText className="w-4 h-4 mr-2 text-purple-400" /> Description
        </label>
        <textarea
          required
          name="description"
          rows={4}
          defaultValue={initialData?.description}
          className="w-full px-4 py-3.5 rounded-xl apple-glass-input focus:outline-none placeholder-purple-300/30 resize-y"
          placeholder="Detailed description of the event..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-purple-200/80 flex items-center mb-1.5 ml-1">
            <MapPin className="w-4 h-4 mr-2 text-purple-400" /> Location/Venue
          </label>
          <input
            required
            type="text"
            name="location"
            defaultValue={initialData?.location}
            className="w-full px-4 py-3.5 rounded-xl apple-glass-input focus:outline-none placeholder-purple-300/30"
            placeholder="e.g. 123 Main St, NY or 'Online'"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-purple-200/80 flex items-center mb-1.5 ml-1">
            <Globe className="w-4 h-4 mr-2 text-purple-400" /> Timezone
          </label>
          <input
            required
            type="text"
            name="timezone"
            defaultValue={initialData?.timezone || 'UTC'}
            className="w-full px-4 py-3.5 rounded-xl apple-glass-input focus:outline-none placeholder-purple-300/30"
            placeholder="e.g. America/New_York or UTC"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-purple-200/80 flex items-center mb-1.5 ml-1">
            <ImageIcon className="w-4 h-4 mr-2 text-purple-400" /> Banner URL
          </label>
          <input
            type="url"
            name="bannerUrl"
            defaultValue={initialData?.bannerUrl}
            className="w-full px-4 py-3.5 rounded-xl apple-glass-input focus:outline-none placeholder-purple-300/30"
            placeholder="https://example.com/banner.jpg"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-purple-200/80 flex items-center mb-1.5 ml-1">
            <Tag className="w-4 h-4 mr-2 text-purple-400" /> Category
          </label>
          <input
            required
            type="text"
            name="category"
            defaultValue={initialData?.category}
            className="w-full px-4 py-3.5 rounded-xl apple-glass-input focus:outline-none placeholder-purple-300/30"
            placeholder="e.g. Technology, Workshop"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-purple-200/80 flex items-center mb-1.5 ml-1">
            <Users className="w-4 h-4 mr-2 text-purple-400" /> Capacity
          </label>
          <input
            required
            type="number"
            min="1"
            name="capacity"
            defaultValue={initialData?.capacity || 100}
            className="w-full px-4 py-3.5 rounded-xl apple-glass-input focus:outline-none placeholder-purple-300/30"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-purple-200/80 flex items-center mb-1.5 ml-1">
            <Activity className="w-4 h-4 mr-2 text-purple-400" /> Event Type
          </label>
          <select
            name="eventType"
            required
            defaultValue={initialData?.eventType || 'free'}
            className="w-full px-4 py-3.5 rounded-xl apple-glass-input apple-glass-select focus:outline-none"
          >
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-purple-200/80 flex items-center mb-1.5 ml-1">
            <Lock className="w-4 h-4 mr-2 text-purple-400" /> Visibility
          </label>
          <select
            name="visibility"
            required
            defaultValue={initialData?.visibility || 'public'}
            className="w-full px-4 py-3.5 rounded-xl apple-glass-input apple-glass-select focus:outline-none"
          >
            <option value="public">Public</option>
            <option value="private">Private (Invite-Only)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-purple-200/80 flex items-center mb-1.5 ml-1">
            <Calendar className="w-4 h-4 mr-2 text-purple-400" /> Start Time
          </label>
          <input
            required
            type="datetime-local"
            name="startsAt"
            defaultValue={toDatetimeLocal(initialData?.startsAt)}
            className="w-full px-4 py-3.5 rounded-xl apple-glass-input focus:outline-none [color-scheme:dark]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-purple-200/80 flex items-center mb-1.5 ml-1">
            <Clock className="w-4 h-4 mr-2 text-purple-400" /> Registration Deadline
          </label>
          <input
            required
            type="datetime-local"
            name="registrationDeadline"
            defaultValue={toDatetimeLocal(initialData?.registrationDeadline)}
            className="w-full px-4 py-3.5 rounded-xl apple-glass-input focus:outline-none [color-scheme:dark]"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-white/10 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="group relative flex justify-center py-4 px-8 border border-transparent text-sm font-bold rounded-2xl text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-700 hover:via-fuchsia-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 hover:shadow-[0_0_30px_rgba(217,70,239,0.45)] disabled:from-purple-400 disabled:to-indigo-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer"
        >
          {isPending ? (
            <span className="flex items-center">
              <Loader2 className="w-5 h-5 mr-3 animate-spin text-white" />
              Processing...
            </span>
          ) : (
            initialData ? 'Save Changes' : 'Create Event'
          )}
        </button>
      </div>
    </form>
  );
}
