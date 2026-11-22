'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Target, Flame, Heart, Award, ArrowRight, Sword, Users, Clock } from 'lucide-react';
import { BRAND } from '@parshuram/shared';

export default function AboutPage() {
  const values = [
    {
      title: 'Dedicated Coaching',
      desc: 'Hands-on instruction from coaches Kapil Dev and Dev Vats. We focus on proper movement mechanics, form cueing, and continuous athletic progression.',
      icon: Target
    },
    {
      title: 'Modern Facilities',
      desc: 'Extensive cardio equipment, free weights, heavy strength stations, CrossFit floor, and functional training zones equipped for all levels.',
      icon: Flame
    },
    {
      title: 'Karate & Self-Defence',
      desc: 'Karate training integrated to foster supreme discipline, inner confidence, physical toughness, mental agility, and essential self-defence skills.',
      icon: Sword
    },
    {
      title: 'Equal & Welcoming Floor',
      desc: 'No separate male and female timings or batches. Our floor is respectful, encouraging, and welcoming for every beginner and experienced lifter.',
      icon: Users
    }
  ];

  return (
    <div className="bg-[#050B17] text-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            Established 2016 • Meerut, Uttar Pradesh
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase font-display text-white mt-2">
            About {BRAND.name}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed italic">
            &quot;{BRAND.tagline}&quot;
          </p>
        </div>

        {/* Official Story Section */}
        <div className="bg-[#101B37] rounded-2xl border border-[#1E305C] p-8 sm:p-12 mb-16 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="w-44 h-44 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-xl mb-4 bg-[#0A1128] relative">
                <img
                  src="/images/kapil-dev-owner.jpeg"
                  alt="Kapil Dev - Owner & Coach"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-white uppercase font-display">Kapil Dev</h3>
              <p className="text-xs font-semibold text-[#D4AF37]">Owner &amp; Coach</p>
              <span className="text-[11px] text-slate-400 mt-1">3 Years Experience • Est. 2016</span>
            </div>

            <div className="lg:col-span-8 space-y-4 text-slate-300 text-sm leading-relaxed border-t lg:border-t-0 lg:border-l border-[#1E305C] pt-6 lg:pt-0 lg:pl-8">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded bg-[#0A1128] text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-2 border border-[#D4AF37]/40">
                <Award className="w-4 h-4" />
                <span>Our Heritage &amp; Commitment</span>
              </div>
              <p className="text-base text-white font-medium">
                Welcome to Parshuram Fitness Club, established in 2016 in Meerut, Uttar Pradesh. We are committed to helping individuals achieve their fitness goals through dedicated coaching, modern training facilities, strength and cardio workouts, and personalized guidance.
              </p>
              <p>
                Whether you are a beginner or an experienced fitness enthusiast, our team is here to support your fitness journey. We also provide Karate training to encourage discipline, confidence, strength, and self-defence skills.
              </p>
              <p>
                Directed by Kapil Dev alongside coach Dev Vats, our mission is to build a supportive, ego-free fitness haven where hard work, community, and personal growth thrive together.
              </p>
              <div className="pt-2 text-white font-bold text-xs flex flex-wrap gap-4">
                <span>• Owner: Kapil Dev</span>
                <span>• Coach: Dev Vats</span>
                <span>• Location: Ram Katori Wali Gali, Meerut</span>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us & Mission */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Core Advantages</span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase font-display text-white mt-1">
              Why Choose Parshuram Fitness Club
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="bg-[#101B37] rounded-xl border border-[#1E305C] p-6 hover:border-[#D4AF37]/50 transition-colors shadow-lg">
                  <div className="w-12 h-12 rounded-lg bg-[#050B17] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{v.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Operating Hours Summary */}
        <div className="bg-[#101B37] rounded-2xl border border-[#1E305C] p-8 mb-16 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#0A1128] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase text-white">Daily Training Hours</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Monday to Saturday: <strong>Morning 5:30 AM – 10:00 AM</strong> &amp; <strong>Evening 5:00 PM – 10:00 PM</strong>. Sunday: <strong>CLOSED</strong>.
                </p>
                <p className="text-[11px] text-amber-400 mt-1 italic">
                  {BRAND.openingHours.holidayNotice}
                </p>
              </div>
            </div>

            <Link
              href="/rules"
              className="px-5 py-2.5 rounded-xl bg-[#0A1128] border border-[#1E305C] hover:border-[#D4AF37] text-white text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center space-x-1 shrink-0"
            >
              <span>View Gym Rules</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-[#0A1128] via-[#101B37] to-[#0A1128] p-10 rounded-2xl border border-[#1E305C] shadow-2xl">
          <h3 className="text-2xl font-black uppercase font-display text-white mb-3">
            Begin Your Fitness Journey With Us
          </h3>
          <p className="text-xs text-slate-300 max-w-xl mx-auto mb-6">
            Visit our floor in Meerut or explore membership packages starting from just ₹500/month.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black hover:bg-[#E5C158] text-xs uppercase tracking-wider transition-all inline-flex items-center justify-center shadow-md"
            >
              <span>View Membership Plans</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
            <Link
              href="/facilities"
              className="px-6 py-3 rounded-xl bg-[#050B17] border border-[#1E305C] text-white hover:text-[#D4AF37] text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center justify-center"
            >
              <span>Explore Facilities</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
