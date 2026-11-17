'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Target, Flame, Heart, Award, ArrowRight } from 'lucide-react';
import { BRAND, DEFAULT_APP_SETTINGS } from '@parshuram/shared';

export default function AboutPage() {
  const values = [
    {
      title: 'Discipline as Divine Duty',
      desc: 'We treat physical discipline not as an agonizing chore, but as an elevated practice of self-mastery. Every rep, set, and meal reflects commitment.',
      icon: Flame
    },
    {
      title: 'Courage & Determination',
      desc: 'Inspired by Lord Parshuram, we cultivate the fortitude to confront weakness, push past mental boundaries, and endure physical challenges.',
      icon: Shield
    },
    {
      title: 'Scientific Biomechanics',
      desc: 'Raw motivation without technique leads to injury. Every barbell lift and movement path is rooted in orthopedic and kinesiological science.',
      icon: Target
    },
    {
      title: 'Respectful Community',
      desc: 'No egos or superficial posturing. Our floor brings together absolute beginners, everyday lifters, and national-level athletes in mutual respect.',
      icon: Heart
    }
  ];

  return (
    <div className="bg-gym-black text-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-gym-red">The Story &amp; Vision</span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase font-display text-white mt-2">
            About {BRAND.name}
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 mt-4 leading-relaxed italic">
            &quot;{BRAND.tagline}&quot;
          </p>
        </div>

        {/* Founder Dave's Message */}
        <div className="bg-gym-card rounded-2xl border border-gym-border p-8 sm:p-12 mb-16 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="w-40 h-40 rounded-2xl overflow-hidden border-2 border-gym-red shadow-xl mb-4">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                  alt="Dave - Founder & Head Coach"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-white uppercase font-display">Dave</h3>
              <p className="text-xs font-semibold text-gym-silver">Founder &amp; Head Coach</p>
              <span className="text-[11px] text-zinc-400 mt-1">CSCS Certified • 14+ Yrs In Iron</span>
            </div>

            <div className="lg:col-span-8 space-y-4 text-zinc-300 text-sm leading-relaxed border-t lg:border-t-0 lg:border-l border-gym-border pt-6 lg:pt-0 lg:pl-8">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded bg-gym-red/20 text-gym-red text-xs font-bold uppercase tracking-wider mb-2">
                <Award className="w-4 h-4" />
                <span>Founder Message</span>
              </div>
              <p>
                &quot;When I founded Parshuram Fitness Gym, my vision was simple yet uncompromising: create a sacred haven for discipline where people don&apos;t just burn calories, but systematically forge resilient bodies and unbreakable character.&quot;
              </p>
              <p>
                &quot;Lord Parshuram represents the warrior who combines supreme strength with profound wisdom and dharma. That is exactly how we approach physical conditioning. We teach proper joint loading, compound barbell efficiency, tailored Indian nutrition, and sustainable daily habits.&quot;
              </p>
              <p>
                &quot;Whether you are taking your first steps toward health or striving for a 500lb deadlift, my coaching team and I are in your corner. Welcome to our iron family.&quot;
              </p>
              <p className="text-white font-bold text-xs pt-2">
                — Dave, Gym Owner &amp; Head Coach
              </p>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Parshuram */}
        <div className="mb-16">
          <h2 className="text-2xl font-black uppercase font-display text-white text-center mb-10">
            Our Guiding Pillars
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="bg-gym-card rounded-xl border border-gym-border p-6 hover:border-gym-red/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-gym-black border border-gym-red/40 flex items-center justify-center text-gym-red mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{v.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-gym-charcoal via-gym-red/20 to-gym-charcoal p-10 rounded-xl border border-gym-border">
          <h3 className="text-2xl font-black uppercase font-display text-white mb-3">
            Train With Purpose At Parshuram Gym
          </h3>
          <p className="text-xs text-zinc-300 max-w-xl mx-auto mb-6">
            Explore our curated workout programs or generate a personalized AI fitness plan calibrated specifically to your body.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-lg bg-gym-red hover:bg-gym-redHover text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center"
            >
              <span>View Membership Plans</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
