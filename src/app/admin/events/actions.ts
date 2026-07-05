'use server';

import { requireAdmin } from '@/lib/auth';
import { createEvent, updateEvent, deleteEvent } from '@/lib/firestore/events';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  startsAt: z.coerce.number().min(1, 'Start time is required'),
  registrationDeadline: z.coerce.number().min(1, 'Registration deadline is required'),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1'),
  location: z.string().min(1, 'Location is required'),
  timezone: z.string().min(1, 'Timezone is required'),
  bannerUrl: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  eventType: z.enum(['free', 'paid']),
  visibility: z.enum(['public', 'private']),
});

export async function createEventAction(formData: FormData) {
  const session = await requireAdmin(); // Ensure caller is admin
  
  const data = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
    startsAt: new Date(formData.get('startsAt') as string).getTime(),
    registrationDeadline: new Date(formData.get('registrationDeadline') as string).getTime(),
    capacity: parseInt(formData.get('capacity') as string, 10),
    location: formData.get('location') as string,
    timezone: formData.get('timezone') as string,
    bannerUrl: (formData.get('bannerUrl') as string) || undefined,
    category: formData.get('category') as string,
    eventType: formData.get('eventType') as string,
    visibility: formData.get('visibility') as string,
  };

  const parsed = eventSchema.parse(data);
  
  await createEvent({
    ...parsed,
    registeredCount: 0,
    createdBy: session.uid,
  } as any);

  revalidatePath('/admin/events');
  revalidatePath('/events');
  redirect('/admin/events');
}

export async function updateEventAction(id: string, formData: FormData) {
  await requireAdmin();
  
  const data = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
    startsAt: new Date(formData.get('startsAt') as string).getTime(),
    registrationDeadline: new Date(formData.get('registrationDeadline') as string).getTime(),
    capacity: parseInt(formData.get('capacity') as string, 10),
    location: formData.get('location') as string,
    timezone: formData.get('timezone') as string,
    bannerUrl: (formData.get('bannerUrl') as string) || undefined,
    category: formData.get('category') as string,
    eventType: formData.get('eventType') as string,
    visibility: formData.get('visibility') as string,
  };

  const parsed = eventSchema.parse(data);
  
  await updateEvent(id, parsed);

  revalidatePath('/admin/events');
  revalidatePath('/events');
  revalidatePath(`/events/${parsed.slug}`);
  redirect('/admin/events');
}

export async function deleteEventAction(id: string) {
  await requireAdmin();
  await deleteEvent(id);
  revalidatePath('/admin/events');
  revalidatePath('/events');
}
