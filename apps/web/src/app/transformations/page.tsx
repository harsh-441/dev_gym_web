'use client';

import React from 'react';
import Link from 'next/link';
import { Award, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { BRAND } from '@parshuram/shared';

export default function TransformationsPage() {
  const transformations = [
    {
      name: 'Rohan Sharma',
      age: 28,
      duration: '6 Months',
      goal: 'Fat Loss & Muscle Recomposition',
      stats: '-14 kg Body Fat • +4 kg Lean Muscle',
      quote: 'Coach Dave’s approach broke down all confusion. High-protein Indian vegetarian eating with disciplined squats and deadlifts transformed my entire life.',
      image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Ananya Verma',
      age: 24,
      duration: '4 Months',
      goal: 'Strength Foundation & Posture Correction',
      stats: 'Squat 40kg -> 95kg • Core Stability',
      quote: 'I had severe lower back stiffness from desk work. Trainer Priya taught me biomechanics and bracing. I feel stronger and more energetic than ever.',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Manish Rawat',
      age: 32,
      duration: '8 Months',
      goal: 'Powerlifting Total Peak',
      stats: 'Total 320kg -> 510kg (S/B/D)',
      quote: 'Vikram and Dave run a serious gym. There is zero nonsense, only iron and relentless discipline. Best decision I made.',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="bg-[#050B17] text-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Proof of Discipline</span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase font-display text-white mt-2">
            Transformation Gallery
          </h1>
          <p className="text-sm text-zinc-300 mt-4 leading-relaxed">
            Real members. Authentic adherence to nutrition and strength training. Verified by gym owner Dave.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {transformations.map((t, idx) => (
            <div
              key={idx}
              className="bg-[#101B37] rounded-2xl border border-[#1E305C] overflow-hidden hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-60 relative overflow-hidden bg-[#0A1128]">
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-3 left-3 bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-white">
                    {t.duration}
                  </div>
                  <div className="absolute top-3 right-3 bg-[#050B17]/80 px-2.5 py-1 rounded text-[10px] font-bold text-gym-silver border border-[#1E305C]">
                    Age {t.age}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-white uppercase font-display mb-1">{t.name}</h3>
                  <p className="text-xs text-[#D4AF37] font-semibold mb-2">{t.goal}</p>
                  <p className="text-xs font-bold text-gym-silver bg-[#0A1128] px-3 py-1.5 rounded-lg border border-[#1E305C] mb-4">
                    {t.stats}
                  </p>
                  <p className="text-xs text-zinc-400 italic leading-relaxed">
                    &quot;{t.quote}&quot;
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-[#1E305C]/60 flex items-center text-[10px] text-zinc-400 mt-4">
                <ShieldCheck className="w-4 h-4 text-emerald-500 mr-1.5 shrink-0" />
                <span>Adherence &amp; attendance verified by Dave</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#0A1128] p-8 rounded-2xl border border-[#1E305C] text-center max-w-2xl mx-auto">
          <Flame className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
          <h3 className="text-xl font-bold uppercase font-display text-white mb-2">Write Your Own Transformation</h3>
          <p className="text-xs text-zinc-400 mb-6">
            Join Parshuram Fitness Gym today and start tracking your workouts, diet, and progress.
          </p>
          <Link
            href="/pricing"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black hover:bg-[#E5C158] text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center space-x-1.5"
          >
            <span>Explore Memberships</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}


