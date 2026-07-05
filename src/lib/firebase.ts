import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

let app: any = null;
let rawDb: any = null;
let rawAuth: any = null;

function getFirebaseApp() {
  if (typeof window === 'undefined') {
    // Return mock app on server-side during builds if variables are missing
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      return null;
    }
  }

  if (!app) {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    if (!firebaseConfig.apiKey) {
      console.warn("Firebase client API key missing. Deferring client SDK initialization.");
      return null;
    }

    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  }
  return app;
}

export const db = new Proxy({} as ReturnType<typeof getFirestore>, {
  get(target, prop, receiver) {
    const firebaseApp = getFirebaseApp();
    if (!firebaseApp) {
      // Return a dummy object if missing to prevent immediately throwing on imports
      return undefined;
    }
    if (!rawDb) {
      rawDb = getFirestore(firebaseApp);
    }
    return Reflect.get(rawDb, prop, receiver);
  }
});

export const auth = new Proxy({} as ReturnType<typeof getAuth>, {
  get(target, prop, receiver) {
    const firebaseApp = getFirebaseApp();
    if (!firebaseApp) {
      return undefined;
    }
    if (!rawAuth) {
      rawAuth = getAuth(firebaseApp);
    }
    return Reflect.get(rawAuth, prop, receiver);
  }
});
