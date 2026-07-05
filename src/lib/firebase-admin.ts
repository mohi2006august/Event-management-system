import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    try {
      // 1. Remove surrounding quotes if they were accidentally copy-pasted
      let cleanedPrivateKey = privateKey.replace(/(^"|"$)/g, '');
      
      // 2. Replace escaped \n with actual newlines
      cleanedPrivateKey = cleanedPrivateKey.replace(/\\n/g, '\n');

      // 3. If Vercel squashed it into a single line with spaces, rebuild the PEM format:
      if (!cleanedPrivateKey.includes('\n')) {
        const match = cleanedPrivateKey.match(/-----BEGIN PRIVATE KEY-----\s*(.*?)\s*-----END PRIVATE KEY-----/);
        if (match) {
          const body = match[1].replace(/\s+/g, ''); // remove any spaces
          const wrappedBody = body.match(/.{1,64}/g)?.join('\n') || body; // wrap at 64 chars
          cleanedPrivateKey = `-----BEGIN PRIVATE KEY-----\n${wrappedBody}\n-----END PRIVATE KEY-----\n`;
        }
      }

      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: cleanedPrivateKey,
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
