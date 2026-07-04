import { useState, useEffect } from 'react';
import { User, onAuthStateChanged, GoogleAuthProvider, signInWithRedirect, signInWithEmailAndPassword, signOut as firebaseSignOut, getIdToken } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        try {
          if (currentUser) {
            // Get the ID token and send it to our API to create a session cookie
            const idToken = await getIdToken(currentUser, true);
            await fetch('/api/auth/session', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ idToken }),
            });
          } else {
            // If logged out on client, clear the server cookie
            await fetch('/api/auth/session', {
              method: 'DELETE',
            });
          }
          setUser(currentUser);
        } catch (err) {
          console.error("Session sync error", err);
          setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Using Redirect instead of Popup to bypass strict browser popup blockers
      await signInWithRedirect(auth, provider);
    } catch (err) {
      console.error('Error signing in with Google', err);
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err) {
      console.error('Error signing in with Email', err);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      // The onAuthStateChanged listener will automatically call the DELETE endpoint
    } catch (err) {
      console.error('Error signing out', err);
      throw err;
    }
  };

  return { user, loading, error, signInWithGoogle, signInWithEmail, signOut };
}
