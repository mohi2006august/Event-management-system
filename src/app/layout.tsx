import type { Metadata } from "next";
import { Navigation } from "@/components/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "EventHub",
  description: "Event Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased font-sans"
    >
      <body className="min-h-full flex flex-col bg-[#040209] text-white">
        {/* GLOBAL ANIMATED BACKGROUND */}
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: -2,
            background: 'linear-gradient(-45deg, #040209, #0f0822, #05030e, #16072d)',
            backgroundSize: '400% 400%',
            animation: 'liquid-bg 20s ease infinite'
          }}
        ></div>
        
        {/* Full-Page Cyber Grid Overlay */}
        <div className="fixed inset-0 cyber-grid pointer-events-none" style={{ zIndex: -1 }}></div>
        
        {/* Dynamic Floating Liquid Blobs */}
        <div 
          className="fixed w-[800px] h-[800px] bg-purple-600/30 blur-[100px] pointer-events-none mix-blend-screen"
          style={{
            zIndex: -1,
            top: '-10%',
            left: '-5%',
            animation: 'float-blob-1 25s infinite alternate ease-in-out, morph-liquid-1 22s infinite ease-in-out'
          }}
        ></div>
        <div 
          className="fixed w-[700px] h-[700px] bg-emerald-600/15 blur-[100px] pointer-events-none mix-blend-screen"
          style={{
            zIndex: -1,
            bottom: '-10%',
            right: '-5%',
            animation: 'float-blob-2 20s infinite alternate ease-in-out, morph-liquid-2 18s infinite ease-in-out'
          }}
        ></div>

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

        <Navigation />
        <main className="flex-1 relative z-0">
          {children}
        </main>
      </body>
    </html>
  );
}
