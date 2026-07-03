import { requireAdmin } from '@/lib/auth';
import EventForm from '@/components/forms/EventForm';
import { createEventAction } from '../actions';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function NewEventPage() {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/events" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Link>
        
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
          <p className="mt-2 text-gray-500">Fill in the details below to publish a new event to the platform.</p>
        </div>

        <EventForm action={createEventAction} />
      </div>
    </div>
  );
}
