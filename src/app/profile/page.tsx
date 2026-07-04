'use client';

import { useAuth } from '@/hooks/useAuth';
import { LogOut, User as UserIcon, Mail } from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100 text-center">
          <div>
            <div className="mx-auto h-20 w-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shadow-inner">
              <UserIcon className="h-10 w-10" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Sign in to manage your event registrations and preferences.
            </p>
          </div>
          <button
            onClick={signInWithGoogle}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 hover:shadow-lg shadow-md"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white overflow-hidden shadow-xl rounded-3xl border border-gray-100">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-8 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative flex items-center space-x-5">
              <div className="flex-shrink-0">
                {user.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="h-24 w-24 rounded-full border-4 border-white shadow-lg"
                    src={user.photoURL}
                    alt={user.displayName || "Profile picture"}
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full border-4 border-white shadow-lg bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
                    <UserIcon className="h-12 w-12" />
                  </div>
                )}
              </div>
              <div className="pt-1.5">
                <h1 className="text-3xl font-bold text-white drop-shadow-sm">
                  {user.displayName || "Anonymous User"}
                </h1>
                <p className="text-sm font-medium text-blue-100 flex items-center mt-1">
                  <Mail className="w-4 h-4 mr-1.5" />
                  {user.email}
                </p>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-6 sm:px-8 bg-white">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Account ID</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded-lg border border-gray-100">{user.uid}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Email Verified</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.emailVerified ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Unverified
                    </span>
                  )}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">About</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  This profile page is connected securely to Firebase Auth. In the future, this is where you can view your registered events and manage your preferences.
                </dd>
              </div>
            </dl>
          </div>
          
          <div className="px-4 py-4 sm:px-8 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button
              onClick={signOut}
              className="inline-flex items-center px-5 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
