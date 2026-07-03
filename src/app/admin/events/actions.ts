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
  };

  const parsed = eventSchema.parse(data);
  
  await createEvent({
    ...parsed,
    createdBy: session.uid,
  });

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
