import { requireAdmin } from '@/lib/auth';
import { getEvent } from '@/lib/firestore/events';
import EventForm from '@/components/forms/EventForm';
import { updateEventAction } from '../../actions';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

interface EditEventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  await requireAdmin();
  
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  // Bind the event ID to the update action
  const updateActionWithId = updateEventAction.bind(null, id);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/events" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Link>
        
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
          <p className="mt-2 text-gray-500">Update details for "{event.title}".</p>
        </div>

        <EventForm initialData={event} action={updateActionWithId} />
      </div>
    </div>
  );
}
