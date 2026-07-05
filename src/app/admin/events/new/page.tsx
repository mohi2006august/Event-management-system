import { requireAdmin } from '@/lib/auth';
import EventForm from '@/components/forms/EventForm';
import { createEventAction } from '../actions';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function NewEventPage() {
  await requireAdmin();

  return (
    <div 
      className="min-h-[calc(100vh-4rem)] flex-1 flex flex-col items-center justify-start py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#040209]"
      style={{
        background: 'linear-gradient(-45deg, #040209, #0f0822, #05030e, #16072d)',
        backgroundSize: '400% 400%',
        animation: 'liquid-bg 20s ease infinite'
      }}
    >
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
      `}</style>

      {/* Full-Page Cyber Grid Overlay */}
      <div className="absolute inset-0 cyber-grid pointer-events-none z-0"></div>

      {/* Dynamic Floating Liquid Blobs in the Background */}
      <div 
        className="absolute w-[800px] h-[800px] bg-purple-600/30 blur-[100px] pointer-events-none mix-blend-screen z-0"
        style={{
          top: '-10%',
          left: '-5%',
          animation: 'float-blob-1 25s infinite alternate ease-in-out, morph-liquid-1 22s infinite ease-in-out'
        }}
      ></div>
      <div 
        className="absolute w-[700px] h-[700px] bg-emerald-600/15 blur-[100px] pointer-events-none mix-blend-screen z-0"
        style={{
          bottom: '-10%',
          right: '-5%',
          animation: 'float-blob-2 20s infinite alternate ease-in-out, morph-liquid-2 18s infinite ease-in-out'
        }}
      ></div>

      <div className="max-w-4xl w-full mx-auto relative z-10">
        <Link href="/admin/events" className="inline-flex items-center text-sm font-bold text-purple-300 hover:text-white transition-colors mb-8 drop-shadow-md">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Link>
        
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-white via-purple-100 to-indigo-200 bg-clip-text text-transparent drop-shadow-sm">
            Create New Event
          </h1>
          <p className="mt-3 text-purple-200/70 font-medium">
            Fill in the details below to publish a new event to the platform.
          </p>
        </div>

        <EventForm action={createEventAction} />
      </div>
    </div>
  );
}
