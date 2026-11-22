import './globals.css';
import type { Metadata } from 'next';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BRAND } from '@parshuram/shared';

export const metadata: Metadata = {
  title: `${BRAND.name} — Established 2016 in Meerut, UP | Owner: Kapil Dev`,
  description: 'Welcome to Parshuram Fitness Club, established in 2016 in Meerut, Uttar Pradesh. Owned by Kapil Dev. Featuring cardio, strength, weight training, CrossFit, functional fitness, Karate self-defence, and 100% free daily attendance.',
  keywords: 'Parshuram Fitness Club, Kapil Dev, Dev Vats, gym in Meerut, gym near Meerut City Public School, Ram Katori Wali Gali, strength gym, Karate training Meerut, CrossFit Meerut, powerlifting, fitness club',
  openGraph: {
    title: `${BRAND.name} — Strength, Discipline & Self-Defence (Est. 2016)`,
    description: 'Transform your body and mind with dedicated coaching, modern gym facilities, and Karate training in Meerut.',
    type: 'website',
    locale: 'en_IN'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#050B17] text-white min-h-screen flex flex-col antialiased selection:bg-[#D4AF37] selection:text-[#050B17]">
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
