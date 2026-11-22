'use client';

import React from 'react';
import Link from 'next/link';
import { Target, ArrowRight, ShieldCheck, Flame, Users, Dumbbell, Activity, CheckCircle2 } from 'lucide-react';
import { BRAND } from '@parshuram/shared';

export default function TransformationsPage() {
  const pillars = [
    {
      title: 'Progressive Overload & Strength',
      focus: 'Strength & Hypertrophy',
      description: 'Structured progression across fundamental compound lifts with form coaching supervised by Kapil Dev.',
      icon: Dumbbell
    },
    {
      title: 'Nutrition & Daily Discipline',
      focus: 'Indian High-Protein Nutrition',
      description: 'Culturally aligned nutrition strategies focusing on real Indian food sources and consistent caloric balance.',
      icon: Activity
    },
    {
      title: 'Karate & Mental Fortitude',
      focus: 'Mindset & Self-Defence',
      description: 'Martial discipline that builds patience, self-respect, confidence, and bodily awareness under Dev Vats.',
      icon: ShieldCheck
    }
  ];

  return (
    <div className="bg-[#050B17] text-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            Milestones &amp; Athlete Journeys • Est. 2016
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase font-display text-white mt-2">
            Athletic Progress &amp; Growth
          </h1>
          <p className="text-sm text-slate-300 mt-4 leading-relaxed">
            At {BRAND.name}, genuine physical progress is earned through dedicated coaching, consistent attendance, and personal determination.
          </p>
        </div>

        {/* Milestone Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-[#101B37] rounded-2xl border border-[#1E305C] p-8 flex flex-col justify-between hover:border-[#D4AF37]/60 transition-all shadow-xl group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#0A1128] border border-[#1E305C] flex items-center justify-center text-[#D4AF37] mb-6 group-hover:scale-105 transition-all">
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] block mb-1">
                    {pillar.focus}
                  </span>
                  <h3 className="text-xl font-bold uppercase font-display text-white mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#1E305C]/60 flex items-center text-xs text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] mr-2 shrink-0" />
                  <span>Coached on our Meerut training floor</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Card */}
        <div className="bg-[#0A1128] p-10 rounded-2xl border border-[#1E305C] text-center max-w-2xl mx-auto shadow-2xl">
          <Flame className="w-10 h-10 text-[#D4AF37] mx-auto mb-3" />
          <h3 className="text-2xl font-bold uppercase font-display text-white mb-2">
            Begin Your Fitness Journey
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-6">
            Join {BRAND.name} today. Daily attendance is included, memberships start from ₹500, and our coaching team is ready to guide you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/pricing"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black hover:bg-[#E5C158] text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center justify-center space-x-1.5 shadow-lg shadow-black/60"
            >
              <span>Explore Membership Plans (from ₹500)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
