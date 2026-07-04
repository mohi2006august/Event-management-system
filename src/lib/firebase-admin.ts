import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    try {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
    } catch (error) {
      console.error('Firebase admin initialization error', error);
    }
  } else {
    console.warn('Firebase Admin credentials missing. Deferring initialization.');
  }
}

// Use Proxies to defer getFirestore() and getAuth() calls to runtime.
// This prevents build-time import crashes when environment variables are not available.
export const adminDb = new Proxy({} as ReturnType<typeof getFirestore>, {
  get(target, prop, receiver) {
    return Reflect.get(getFirestore(), prop, receiver);
  }
});

export const adminAuth = new Proxy({} as ReturnType<typeof getAuth>, {
  get(target, prop, receiver) {
    return Reflect.get(getAuth(), prop, receiver);
  }
});

