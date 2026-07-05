'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Lock, Mail, ShieldAlert } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  const { signInWithEmail } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setIsSubmitting(true);
    
    try {
      await signInWithEmail(email, password);
      router.push('/admin/events');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') {
        setLocalError('Invalid email or password.');
      } else {
        setLocalError(err.message || 'Failed to sign in.');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-purple-50/50 via-gray-50 to-indigo-50/30 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-300 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-indigo-300 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-purple-100/80 relative z-10">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-tr from-purple-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 ring-4 ring-purple-100 transition-transform duration-300 hover:rotate-6">
            <Lock className="h-10 w-10" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-black tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500 font-medium">
            Sign in with your secure administrator credentials.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {localError && (
            <div className="rounded-2xl bg-red-50 p-4 border border-red-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ShieldAlert className="h-5 w-5 text-red-500" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-bold text-red-800">Authentication Error</h3>
                  <div className="mt-1 text-sm text-red-700 font-medium">
                    <p>{localError}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-5">
            <div>
              <label htmlFor="email-address" className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                Email address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-purple-500 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-xl relative block w-full px-4 py-3 pl-10 border border-purple-100/80 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 bg-purple-50/15 focus:bg-white transition-all sm:text-sm autofill:shadow-[inset_0_0_0_1000px_white]"
                  placeholder="admin@example.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-purple-500 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-xl relative block w-full px-4 py-3 pl-10 border border-purple-100/80 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 bg-purple-50/15 focus:bg-white transition-all sm:text-sm autofill:shadow-[inset_0_0_0_1000px_white]"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:from-purple-400 disabled:to-indigo-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/25 active:translate-y-0 active:scale-[0.98]"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
