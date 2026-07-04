'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';

export function Navigation() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-900 tracking-tight hover:text-blue-600 transition-colors">
                Event<span className="text-blue-600">Hub</span>
              </span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/events"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
              >
                Events
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link 
                      href="/profile"
                      className="text-gray-500 hover:text-gray-700 transition-colors flex items-center space-x-2 text-sm font-medium"
                    >
                      {user.photoURL ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={user.photoURL} 
                          alt="Profile" 
                          className="w-8 h-8 rounded-full border border-gray-200"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          <UserIcon className="w-4 h-4" />
                        </div>
                      )}
                      <span className="hidden sm:inline-block">Profile</span>
                    </Link>
                    <button
                      onClick={signOut}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-500 bg-gray-50 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                    >
                      <LogOut className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline-block">Sign Out</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={signInWithGoogle}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign in with Google
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
