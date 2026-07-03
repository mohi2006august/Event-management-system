import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

async function seed() {
  console.log('Seeding test event...');
  
  const eventRef = db.collection('events').doc();
  const now = Date.now();
  
  const eventData = {
    id: eventRef.id,
    title: 'Next.js Advanced Patterns Workshop',
    slug: 'nextjs-advanced-patterns-2026',
    description: 'Join us for a deep dive into Next.js App Router, Server Actions, and integrating with Firebase Firestore. We will build a complete event registration loop from scratch.',
    startsAt: now + 7 * 24 * 60 * 60 * 1000, // 7 days from now
    registrationDeadline: now + 5 * 24 * 60 * 60 * 1000, // 5 days from now
    capacity: 50,
    registeredCount: 0,
    createdBy: 'admin_seed_script',
    createdAt: now,
    updatedAt: now,
  };

  await eventRef.set(eventData);
  
  console.log('Successfully seeded event:');
  console.log(eventData);
  console.log(`\nYou can view it at: http://localhost:3000/events/${eventData.slug}`);
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
