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
    <div className="sticky top-6 z-50 px-4 sm:px-6 w-full max-w-6xl mx-auto pointer-events-none">
      <style>{`
        .apple-glass-nav {
          background: rgba(15, 10, 30, 0.45) !important;
          backdrop-filter: blur(40px) saturate(220%) !important;
          -webkit-backdrop-filter: blur(40px) saturate(220%) !important;
          border: 1px solid rgba(255, 255, 255, 0.18) !important;
          box-shadow: 
            inset 0 1px 1px rgba(255, 255, 255, 0.25),
            0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
        }
        .apple-glass-dropdown {
          background: rgba(20, 15, 40, 0.85) !important;
          backdrop-filter: blur(40px) saturate(220%) !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
        }
      `}</style>
      <nav className="apple-glass-nav rounded-[3rem] w-full pointer-events-auto">
        <div className="px-6 py-3 md:px-8 md:py-3.5">
          <div className="flex justify-between items-center h-10">
            {/* Logo Section */}
            <div className="flex items-center animate-in fade-in duration-300">
              <Link href="/" className="flex-shrink-0 flex items-center group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center mr-3 shadow-lg group-hover:scale-105 transition-transform">
                  <span className="text-white font-black text-sm">aw</span>
                </div>
                <span className="text-xl font-black text-white tracking-tight group-hover:text-purple-200 transition-colors">
                  awss<span className="text-purple-400">bg</span>
                </span>
              </Link>
              
              {/* Center Links (Pill Style) */}
              <div className="hidden md:ml-10 md:flex space-x-2">
                <Link
                  href="/events"
                  className="text-white bg-white/10 px-4 py-2 rounded-full text-sm font-bold shadow-inner border border-white/10 transition-all hover:bg-white/20"
                >
                  Events
                </Link>
              </div>
            </div>
            
            {/* Right Section (Auth / Profile) */}
            <div className="flex items-center space-x-4">
              {!loading && (
                <>
                  {user ? (
                    <div className="relative">
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center space-x-2 text-purple-100 hover:text-white transition-all focus:outline-none cursor-pointer py-1.5 px-3 rounded-full hover:bg-white/10 border border-transparent hover:border-white/20"
                      >
                        {user.photoURL ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img 
                            src={user.photoURL} 
                            alt="User" 
                            className="w-8 h-8 rounded-full border-2 border-purple-400/50 shadow-sm"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center border border-purple-400/50 shadow-sm">
                            <UserIcon className="w-4 h-4" />
                          </div>
                        )}
                        <span className="hidden sm:inline-block text-sm font-bold tracking-wide">
                          {user.displayName || 'Account'}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-purple-300 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {dropdownOpen && (
                        <div className="absolute right-0 mt-4 w-64 rounded-3xl apple-glass-dropdown shadow-2xl divide-y divide-white/10 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                          <div className="px-5 py-5">
                            <p className="text-xs text-purple-300 font-bold uppercase tracking-wider">Signed in as</p>
                            <p className="text-sm font-black text-white truncate mt-1">{user.email}</p>
                          </div>
                          <div className="py-2 px-2 border-b border-white/10">
                            <Link
                              href="/profile"
                              onClick={() => setDropdownOpen(false)}
                              className="w-full text-left flex items-center px-4 py-3 text-sm text-purple-100 hover:bg-white/10 hover:text-white rounded-2xl transition-all font-bold cursor-pointer"
                            >
                              <UserIcon className="w-4 h-4 mr-3" />
                              My Profile
                            </Link>
                          </div>
                          <div className="py-2 px-2">
                            <button
                              onClick={() => {
                                setDropdownOpen(false);
                                signOut();
                              }}
                              className="w-full text-left flex items-center px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-2xl transition-all font-bold cursor-pointer"
                            >
                              <LogOut className="w-4 h-4 mr-3" />
                              Sign Out
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={signInWithGoogle}
                      className="flex items-center space-x-2 text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm font-bold shadow-inner border border-white/10 transition-all"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
