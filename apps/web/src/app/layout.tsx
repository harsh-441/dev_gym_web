import './globals.css';
import type { Metadata } from 'next';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BRAND } from '@parshuram/shared';

export const metadata: Metadata = {
  title: `${BRAND.name} — Inspired by Divinity. Built Through Discipline.`,
  description: 'Premier gym and strength facility led by Dave. Featuring full athletic conditioning, powerlifting, functional training, Indian nutrition protocols, AI fitness planning, and free attendance marking.',
  keywords: 'Parshuram Fitness Gym, Dave, strength gym, powerlifting, bodybuilding, Indian diet plans, AI fitness planner, workout programs',
  openGraph: {
    title: `${BRAND.name} — Strength, Courage & Discipline`,
    description: 'Transform your body and mind with elite training, verified nutrition, and personalized AI coaching.',
    type: 'website'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gym-black text-white min-h-screen flex flex-col antialiased selection:bg-gym-red selection:text-white">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
