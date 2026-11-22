'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  Dumbbell,
  Shield,
  UserCheck,
  Flame,
  Zap,
  Sword,
  Clock,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { BRAND } from '@parshuram/shared';

export default function FacilitiesPage() {
  const facilities = [
    {
      title: 'Cardio Equipment',
      description: 'High-end treadmills, stationary cycles, and cross trainers for endurance building, VO2 max elevation, and targeted fat burning.',
      icon: Activity,
      details: ['Electronic resistance controls', 'Heart rate monitor integration', 'Pre-workout warmup protocols', 'Calorie expenditure tracking']
    },
    {
      title: 'Weight Training',
      description: 'Extensive free weight zones featuring calibrated iron plates, Olympic standard barbells, curl bars, and dumbbell racks ranging for all strength levels.',
      icon: Dumbbell,
      details: ['Full dumbbell spectrum', 'Olympic 20kg & 15kg bars', 'Standard bench stations', 'Barbell spring & lock collars']
    },
    {
      title: 'Strength Training',
      description: 'Heavy compound lifting stations for squats, deadlifts, overhead presses, and bench presses designed to maximize neuromuscular strength.',
      icon: Shield,
      details: ['Heavy duty squat racks', 'Deadlift platforms with bumper plates', 'Pull-up & dip stations', 'Plate-loaded power equipment']
    },
    {
      title: 'Personal Training',
      description: 'Customized one-on-one coaching and instruction directly tailored to your biomechanics, injury history, and athletic targets.',
      icon: UserCheck,
      details: ['Direct coach supervision', 'Individual periodized programming', 'Posture and joint stabilization cues', 'Dedicated accountability']
    },
    {
      title: 'CrossFit Training',
      description: 'Dynamic high-intensity functional workouts combining metabolic conditioning, explosive bodyweight movements, and functional strength.',
      icon: Flame,
      details: ['High-intensity circuit intervals', 'Kettlebells and battle ropes', 'Box jumps and plyometrics', 'Athletic conditioning']
    },
    {
      title: 'Functional Training',
      description: 'Movement patterns that build real-world resilience, core rotational strength, balance, agility, and joint mobility.',
      icon: Zap,
      details: ['Core stabilization workouts', 'Rotational resistance training', 'Band and suspension movement', 'Injury prevention drills']
    },
    {
      title: 'Karate Training',
      description: 'Traditional martial arts discipline cultivating mental focus, explosive striking power, physical stamina, confidence, and self-defence skills.',
      icon: Sword,
      details: ['Traditional Kata and Kumite techniques', 'Confidence & mental discipline', 'Self-defence and spatial awareness', 'Open to all experience levels']
    }
  ];

  return (
    <div className="bg-[#050B17] text-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            Comprehensive Fitness Infrastructure
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase font-display text-white mt-2">
            Gym Facilities &amp; Amenities
          </h1>
          <p className="text-sm text-slate-300 mt-4 leading-relaxed">
            Welcome to {BRAND.name}, established in 2016 in Meerut. We provide modern equipment, strength floors, CrossFit, and Karate training in an inclusive and focused training atmosphere.
          </p>
        </div>

        {/* Operating Inclusivity Banner */}
        <div className="bg-[#101B37] border border-[#1E305C] rounded-2xl p-6 mb-12 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#0A1128] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase text-white">Universal Welcoming Training Floor</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  No separate male and female timings or batches. Our facility offers an equal, professional, and respectful environment for all athletes and beginners.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 border-t md:border-t-0 md:border-l border-[#1E305C] pt-4 md:pt-0 md:pl-6">
              <div className="w-10 h-10 rounded-xl bg-[#0A1128] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase text-white">Daily Operating Hours</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Monday – Saturday: <strong>Morning: 5:30 AM – 10:00 AM</strong> &amp; <strong>Evening: 5:00 PM – 10:00 PM</strong>. Sunday: <strong>CLOSED</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {facilities.map((fac, idx) => {
            const Icon = fac.icon;
            return (
              <div
                key={fac.title}
                className="bg-[#101B37] rounded-2xl border border-[#1E305C] p-8 flex flex-col justify-between hover:border-[#D4AF37]/60 transition-all shadow-xl group"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#0A1128] border border-[#1E305C] flex items-center justify-center text-[#D4AF37] mb-6 group-hover:scale-105 group-hover:border-[#D4AF37]/50 transition-all shadow-inner">
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-xl font-bold uppercase font-display text-white mb-3">
                    {fac.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-6">
                    {fac.description}
                  </p>

                  <div className="space-y-2 border-t border-[#1E305C]/70 pt-4 mb-6">
                    {fac.details.map((detail, dIdx) => (
                      <div key={dIdx} className="flex items-center text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] mr-2 shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Link
                    href={`/contact?plan=${encodeURIComponent(fac.title)}`}
                    className="w-full py-3 rounded-xl bg-[#0A1128] hover:bg-[#1E305C] text-white text-xs font-bold uppercase tracking-wider transition-all border border-[#1E305C] flex items-center justify-center space-x-2"
                  >
                    <span>Enquire About {fac.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#0A1128] via-[#101B37] to-[#0A1128] rounded-2xl border border-[#1E305C] p-10 text-center max-w-3xl mx-auto shadow-2xl">
          <h3 className="text-2xl font-black uppercase font-display text-white mb-3">
            Ready to Train at Parshuram Fitness Club?
          </h3>
          <p className="text-xs text-slate-300 max-w-xl mx-auto mb-6">
            Visit our floor in Meerut during training hours or talk with coaches Kapil Dev &amp; Dev Vats for personalized plan recommendations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/pricing"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black hover:bg-[#E5C158] text-xs uppercase tracking-wider transition-all shadow-md inline-flex items-center justify-center"
            >
              <span>Explore Membership Plans</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3.5 rounded-xl bg-[#050B17] border border-[#1E305C] text-white hover:text-[#D4AF37] text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center justify-center"
            >
              <span>Find Gym Location</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
