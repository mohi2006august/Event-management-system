'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { LogIn, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav 
      className="border-b border-white/10 sticky top-0 z-50 backdrop-blur-md"
      style={{
        background: 'linear-gradient(-45deg, #1e1b4b, #3b0764, #120024, #1e1b4b)',
        backgroundSize: '400% 400%',
        animation: 'liquid-nav 15s ease infinite'
      }}
    >
      <style>{`
        @keyframes liquid-nav {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex animate-in fade-in duration-300">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-black text-white tracking-tight hover:text-purple-200 transition-colors">
                awss<span className="text-purple-400">bg</span>
              </span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/events"
                className="border-transparent text-purple-200 hover:border-purple-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
              >
                Events
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {!loading && (
              <>
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center space-x-2 text-purple-100 hover:text-white transition-colors focus:outline-none cursor-pointer py-1.5 px-3 rounded-xl hover:bg-purple-900/50 border border-transparent hover:border-purple-800/40"
                    >
                      {user.photoURL ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={user.photoURL} 
                          alt="User" 
                          className="w-8 h-8 rounded-full border border-purple-400"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-purple-800 text-purple-200 flex items-center justify-center border border-purple-700">
                          <UserIcon className="w-4 h-4" />
                        </div>
                      )}
                      <span className="hidden sm:inline-block text-sm font-semibold">
                        {user.displayName || 'Account'}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-purple-300 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-2xl ring-1 ring-purple-100 divide-y divide-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="px-5 py-4">
                          <p className="text-xs text-purple-500 font-bold uppercase tracking-wider">Signed in as</p>
                          <p className="text-sm font-black text-gray-900 truncate mt-0.5">{user.email}</p>
                        </div>
                        <div className="py-2">
                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              signOut();
                            }}
                            className="w-full text-left flex items-center px-5 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-bold cursor-pointer"
                          >
                            <LogOut className="w-4 h-4 mr-2.5 text-red-500" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  !pathname.startsWith('/admin') && (
                    <button
                      onClick={signInWithGoogle}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-xl shadow-md text-white bg-purple-600 hover:bg-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 hover:shadow-purple-500/20 active:scale-[0.98] cursor-pointer"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign in with Google
                    </button>
                  )
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
