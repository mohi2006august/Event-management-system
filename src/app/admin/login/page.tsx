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
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10 w-full">
      {/* CSS Keyframes and styling for Apple Liquid Glass animations */}
      <style>{`
        @keyframes liquid-bg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float-blob-1 {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(80px, -100px) scale(1.35); }
          66% { transform: translate(-70px, 70px) scale(0.8); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes float-blob-2 {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(-70px, 90px) scale(0.85); }
          66% { transform: translate(80px, -60px) scale(1.25); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes float-blob-3 {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(60px, 70px) scale(1.2); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes float-blob-4 {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-60px, -70px) scale(1.1); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes morph-liquid-1 {
          0% { border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; }
          33% { border-radius: 70% 30% 52% 48% / 60% 40% 60% 40%; }
          66% { border-radius: 50% 60% 30% 70% / 60% 30% 70% 40%; }
          100% { border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; }
        }
        @keyframes morph-liquid-2 {
          0% { border-radius: 60% 40% 30% 70% / 50% 60% 30% 60%; }
          50% { border-radius: 40% 60% 70% 30% / 60% 40% 60% 40%; }
          100% { border-radius: 60% 40% 30% 70% / 50% 60% 30% 60%; }
        }
        .cyber-grid {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
          background-size: 50px 50px;
          background-position: center;
        }
        .apple-glass-card {
          background: rgba(10, 8, 20, 0.35) !important;
          backdrop-filter: blur(40px) saturate(220%) !important;
          -webkit-backdrop-filter: blur(40px) saturate(220%) !important;
          border: 1px solid rgba(255, 255, 255, 0.16) !important;
          box-shadow: 
            inset 0 1px 1px rgba(255, 255, 255, 0.25),
            inset 0 -1px 2px rgba(0, 0, 0, 0.5),
            0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
          border-radius: 36px;
          position: relative;
          overflow: hidden;
        }
        .apple-glass-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%);
          pointer-events: none;
          z-index: 1;
        }
        .apple-glass-input {
          background: rgba(255, 255, 255, 0.04) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          backdrop-filter: blur(10px) !important;
          color: #ffffff !important;
          border-radius: 16px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .apple-glass-input:focus {
          background: rgba(255, 255, 255, 0.08) !important;
          border-color: rgba(168, 85, 247, 0.5) !important;
          box-shadow: 
            0 0 0 1px rgba(168, 85, 247, 0.5),
            0 0 25px rgba(168, 85, 247, 0.25) !important;
        }
        /* Keep input transparent and text white under autofill */
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
          -webkit-background-clip: text;
          -webkit-text-fill-color: #ffffff !important;
          transition: background-color 999999s ease-in-out 0s;
          background-color: transparent !important;
        }
      `}</style>

      {/* Apple Glassmorphic Card Container */}
      <div className="max-w-md w-full relative z-10 apple-glass-card p-10 border border-white/10 text-white shadow-2xl">
        <div className="text-center relative z-10">
          <div className="mx-auto h-20 w-20 bg-gradient-to-tr from-purple-500/30 to-indigo-500/30 text-purple-300 border border-white/20 rounded-3xl flex items-center justify-center shadow-lg transition-transform duration-500 hover:rotate-12 cursor-pointer">
            <Lock className="h-10 w-10 filter drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-black tracking-tight bg-gradient-to-r from-white via-purple-100 to-indigo-200 bg-clip-text text-transparent">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-purple-200/60 font-medium">
            Sign in with your secure administrator credentials.
          </p>
        </div>
        
        <form className="mt-8 space-y-6 relative z-10" onSubmit={handleSubmit} autoComplete="off">
          {localError && (
            <div className="rounded-2xl bg-red-950/30 border border-red-500/40 p-4 backdrop-blur-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ShieldAlert className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-bold text-red-200">Authentication Error</h3>
                  <div className="mt-1 text-sm text-red-300/80 font-medium">
                    <p>{localError}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-5">
            <div>
              <label htmlFor="email-address" className="block text-sm font-semibold text-purple-200/80 mb-1.5 ml-1">
                Email address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-300 group-focus-within:text-purple-100 transition-colors z-20">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="off"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-xl relative block w-full px-4 py-3.5 pl-11 text-white placeholder-purple-300/30 focus:outline-none sm:text-sm apple-glass-input z-10"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-purple-200/80 mb-1.5 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-300 group-focus-within:text-purple-100 transition-colors z-20">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-xl relative block w-full px-4 py-3.5 pl-11 text-white placeholder-purple-300/30 focus:outline-none sm:text-sm apple-glass-input z-10"
                  placeholder="Enter your password"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-700 hover:via-fuchsia-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 hover:shadow-[0_0_30px_rgba(217,70,239,0.45)] disabled:from-purple-400 disabled:to-indigo-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer"
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
