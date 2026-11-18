'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Flame,
  Dumbbell,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Zap,
  Users,
  CalendarCheck,
  Utensils,
  PlayCircle,
  Clock,
  MapPin,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import {
  BRAND,
  DEFAULT_APP_SETTINGS,
  INITIAL_WORKOUT_PROGRAMS,
  INITIAL_EXERCISES,
  INITIAL_DIET_PLANS
} from '@parshuram/shared';

export default function HomePage() {
  const [coaches, setCoaches] = useState<any[]>([]);
  const [coachesLoading, setCoachesLoading] = useState(true);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await fetch('/api/coaches', { cache: 'no-store' });
        const data = await res.json();
        if (data.success && Array.isArray(data.coaches)) {
          setCoaches(data.coaches);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setCoachesLoading(false);
      }
    };
    fetchCoaches();
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-[#050B17] text-white">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden border-b border-[#1E305C]">
        {/* Cinematic dark background with subtle crimson vignette & grid */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050B17] via-[#0A1128] to-[#050B17] opacity-95 z-0" />
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-luminosity z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1920&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#050B17]/80 to-[#050B17] z-0 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#0A1128] border border-[#D4AF37]/50 mb-6 shadow-lg shadow-black/40">
            <Flame className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            <span className="text-xs uppercase font-bold tracking-widest text-zinc-200">
              {BRAND.tagline}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight font-display mb-6 leading-none">
            Forge An <span className="text-[#D4AF37]">Unbreakable</span> Body &amp; Mind
          </h1>

          <p className="text-base sm:text-xl text-zinc-300 max-w-3xl mb-10 leading-relaxed font-normal">
            Welcome to <span className="text-white font-bold">{BRAND.name}</span>, directed by Dave. Rooted in divine discipline and guided by state-of-the-art sports science, we sculpt warriors with powerlifting, hypertrophy, Indian nutrition, and free digital attendance.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
            <Link
              href="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black hover:bg-[#E5C158] text-white text-sm font-bold uppercase tracking-wider transition-all shadow-xl shadow-black/50 hover:scale-105"
            >
              <span>Join Now</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link
              href="/programs"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[#0A1128] hover:bg-zinc-800 text-gym-silver hover:text-white text-sm font-bold uppercase tracking-wider border border-[#1E305C] transition-all"
            >
              <span>Explore Programs</span>
            </Link>
          </div>

          {/* Quick Pillars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 w-full pt-10 border-t border-[#1E305C]/60">
            <div className="p-3 rounded bg-[#0A1128]/50 border border-[#1E305C]">
              <CalendarCheck className="w-5 h-5 text-[#D4AF37] mx-auto mb-1.5" />
              <p className="text-xs font-bold text-white uppercase">Free Attendance</p>
              <p className="text-[11px] text-zinc-400">QR Check-in included</p>
            </div>
            <div className="p-3 rounded bg-[#0A1128]/50 border border-[#1E305C]">
              <Sparkles className="w-5 h-5 text-gym-silver mx-auto mb-1.5" />
              <p className="text-xs font-bold text-white uppercase">AI Fitness Planner</p>
              <p className="text-[11px] text-zinc-400">Personalized diet &amp; workout</p>
            </div>
            <div className="p-3 rounded bg-[#0A1128]/50 border border-[#1E305C]">
              <Award className="w-5 h-5 text-[#D4AF37] mx-auto mb-1.5" />
              <p className="text-xs font-bold text-white uppercase">Certified Coaches</p>
              <p className="text-[11px] text-zinc-400">Led by Founder Dave</p>
            </div>
            <div className="p-3 rounded bg-[#0A1128]/50 border border-[#1E305C]">
              <Utensils className="w-5 h-5 text-gym-silver mx-auto mb-1.5" />
              <p className="text-xs font-bold text-white uppercase">Desi Nutrition</p>
              <p className="text-[11px] text-zinc-400">Affordable Indian diet</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. GYM INTRODUCTION & LORD PARSHURAM ETHOS */}
      <section className="py-20 bg-[#0A1128]/40 border-b border-[#1E305C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black/20 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-4 border border-[#D4AF37]/30">
                <ShieldCheck className="w-4 h-4 mr-1" />
                The Core Philosophy
              </div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase font-display tracking-tight text-white mb-6">
                Inspired by Divinity. <br />
                <span className="text-[#D4AF37]">Built Through Discipline.</span>
              </h2>
              <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
                <p>
                  Named in honor of Lord Parshuram — the supreme embodiment of strength, courage, determination, wisdom, and tireless dedication — our gym rejects fitness shortcuts and empty gimmicks.
                </p>
                <p>
                  Owner Dave built <strong className="text-white">Parshuram Fitness Gym</strong> on the conviction that physical strength is inseparable from mental discipline. Whether you are lifting an Olympic barbell for the first time or preparing for competitive powerlifting, you step onto our floor with clear purpose.
                </p>
                <p>
                  Every member enjoys unlimited facility access, free digital attendance tracking, verified Indian nutrition blueprints, and guidance from master trainers who live the discipline every single day.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-[#1E305C]">
                <div>
                  <p className="text-2xl font-black text-[#D4AF37] font-display">14+</p>
                  <p className="text-xs text-zinc-400 uppercase tracking-wider">Years Dave Coaching</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-gym-silver font-display">1,500+</p>
                  <p className="text-xs text-zinc-400 uppercase tracking-wider">Members Transformed</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white font-display">100%</p>
                  <p className="text-xs text-zinc-400 uppercase tracking-wider">Commitment to Form</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#1E305C] shadow-2xl relative">
                <img
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80"
                  alt="Parshuram Fitness Gym Facility"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050B17] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-[#050B17]/80 backdrop-blur-md rounded-lg border border-[#1E305C]">
                  <p className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Authentic Iron &amp; Modern Technology
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    Olympic barbells, custom power cages, dumbbell rows up to 60kg, and synced mobile apps.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED WORKOUT PROGRAMS */}
      <section className="py-20 bg-[#050B17] border-b border-[#1E305C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Structured Protocols</span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase font-display text-white mt-2">
                Featured Workout Programs
              </h2>
            </div>
            <Link
              href="/programs"
              className="mt-4 md:mt-0 inline-flex items-center text-xs font-bold uppercase tracking-wider text-gym-silver hover:text-white"
            >
              <span>View All Programs</span>
              <ArrowRight className="w-4 h-4 ml-1 text-[#D4AF37]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {INITIAL_WORKOUT_PROGRAMS.map((program) => (
              <div
                key={program.id}
                className="bg-[#101B37] rounded-xl border border-[#1E305C] overflow-hidden hover:border-[#D4AF37]/60 transition-all group flex flex-col"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={program.cover_image}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-[#050B17]/80 px-2.5 py-1 rounded text-[11px] font-bold text-gym-silver border border-[#1E305C]">
                    {program.duration_weeks} Weeks
                  </div>
                  <div className="absolute bottom-3 left-3 bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white">
                    {program.level}
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                      {program.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#1E305C] flex items-center justify-between text-xs text-zinc-300">
                    <span>{program.days_per_week} Days/Week</span>
                    <Link
                      href="/programs"
                      className="text-[#D4AF37] font-bold hover:underline inline-flex items-center"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TRAINER SECTION */}
      <section className="py-20 bg-[#0A1128] border-b border-[#1E305C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Expert Leadership</span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase font-display text-white mt-2">
              Meet Your Coaches
            </h2>
            <p className="text-sm text-zinc-400 mt-3">
              No novice instructors. Our coaching team is led directly by Dave and certified strength specialists.
            </p>
          </div>

          {coachesLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-400">Syncing live coaching team...</p>
            </div>
          ) : coaches.length === 0 ? (
            <div className="text-center py-12 bg-[#101B37] rounded-xl border border-[#1E305C]">
              <Users className="w-10 h-10 text-gym-silver mx-auto mb-2 opacity-50" />
              <p className="text-xs text-slate-400">Owner Dave supervises all floor lifting sessions.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {coaches.map((trainer) => {
                const emp = trainer.employee;
                const isDave = emp?.id === 'emp-dave' || trainer.id === 'tr-1';
                const name = trainer.employee?.profile?.full_name || (isDave ? 'Dave' : 'Coach');

                return (
                  <div
                    key={trainer.id}
                    className="bg-[#101B37] rounded-xl border border-[#1E305C] p-6 flex flex-col justify-between hover:border-[#D4AF37]/50 transition-all shadow-xl"
                  >
                    <div>
                      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#D4AF37] mb-4 mx-auto shadow-md">
                        <img
                          src={trainer.photo_url}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-lg font-bold text-white text-center">
                        {name}
                      </h3>
                      <p className="text-xs text-gym-silver font-semibold text-center mb-3">
                        {trainer.specializations?.[0] || 'Strength Training'} • {trainer.experience_years} Yrs Experience
                      </p>
                      <p className="text-xs text-zinc-400 leading-relaxed mb-4 text-center">
                        {trainer.bio}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#1E305C]">
                      <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                        {trainer.certifications?.map((c: string, i: number) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded bg-[#0A1128] text-zinc-300 border border-[#1E305C]"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                      <Link
                        href="/trainers"
                        className="block text-center text-xs font-bold uppercase tracking-wider text-white bg-[#0A1128] hover:bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black py-2 rounded transition-colors"
                      >
                        View Bio &amp; Specialty
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 5. AI FITNESS PLANNER TEASER */}
      <section className="py-20 bg-gradient-to-r from-[#050B17] via-[#0A1128] to-[#050B17] border-b border-[#1E305C] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-[#101B37]/90 border border-[#D4AF37]/40 rounded-2xl p-8 sm:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black/20 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-4 border border-[#D4AF37]/40">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Personalization</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase font-display text-white mb-4">
                Personalized AI Fitness &amp; Indian Nutrition Planner
              </h2>
              <p className="text-sm text-zinc-300 leading-relaxed mb-6">
                Tell us your age, height, weight, lifting experience, and dietary preferences (including vegetarian, desi high-protein, or budget staples). Our intelligent engine calculates your exact calories, macro split, weekly workout schedule, and safe alternative Indian food substitutions in seconds.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-zinc-300 mb-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Mifflin-St Jeor TDEE</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Indian Food Options</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Allergy Respect</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Rest &amp; Rep Guidelines</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Save Plan to App</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Safe Caloric Deficits</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-auto shrink-0 flex flex-col items-center">
              <Link
                href="/ai-planner"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black hover:bg-[#E5C158] text-white text-sm font-bold uppercase tracking-wider transition-all shadow-xl shadow-black/60 flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate My Free Plan</span>
              </Link>
              <span className="text-[11px] text-zinc-400 mt-2">Zero paywall • Free for all members</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. EXERCISE LIBRARY & NUTRITION PREVIEW */}
      <section className="py-20 bg-[#050B17] border-b border-[#1E305C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Exercise preview */}
            <div className="bg-[#0A1128]/60 rounded-xl border border-[#1E305C] p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-bold uppercase text-[#D4AF37]">Comprehensive Movement Guide</span>
                  <h3 className="text-2xl font-black uppercase font-display text-white mt-1">Exercise Library</h3>
                </div>
                <Link href="/exercises" className="text-xs font-bold text-gym-silver hover:text-white uppercase flex items-center">
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>

              <div className="space-y-4">
                {INITIAL_EXERCISES.slice(0, 3).map((ex) => (
                  <div key={ex.id} className="p-4 rounded-lg bg-[#101B37] border border-[#1E305C] flex items-start space-x-4">
                    <div className="w-12 h-12 rounded bg-[#050B17] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                      <Dumbbell className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-white">{ex.name}</h4>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-zinc-800 text-gym-silver">
                          {ex.category}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                        {ex.instructions[0]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nutrition preview */}
            <div className="bg-[#0A1128]/60 rounded-xl border border-[#1E305C] p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-bold uppercase text-gym-silver">Macro Science &amp; Indian Meals</span>
                  <h3 className="text-2xl font-black uppercase font-display text-white mt-1">Diet &amp; Nutrition</h3>
                </div>
                <Link href="/nutrition" className="text-xs font-bold text-gym-silver hover:text-white uppercase flex items-center">
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>

              <div className="space-y-4">
                {INITIAL_DIET_PLANS.slice(0, 3).map((plan) => (
                  <div key={plan.id} className="p-4 rounded-lg bg-[#101B37] border border-[#1E305C] flex items-start space-x-4">
                    <div className="w-12 h-12 rounded bg-[#050B17] border border-gym-silver/40 flex items-center justify-center text-gym-silver shrink-0">
                      <Utensils className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-white">{plan.title}</h4>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                          {plan.calories} kcal
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                        {plan.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CONTACT & LOCATION SUMMARY */}
      <section className="py-16 bg-[#0A1128]/80 border-b border-[#1E305C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#050B17]/70 border border-[#1E305C] rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-black uppercase font-display text-white mb-2">
                Ready to Join Parshuram Fitness Gym?
              </h3>
              <p className="text-xs text-zinc-400">
                Stop by during opening hours or submit an enquiry online. Dave and the team are ready to train you.
              </p>
            </div>
            <div className="flex items-center space-x-4 shrink-0">
              <Link
                href="/contact"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black hover:bg-[#E5C158] text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Send Enquiry
              </Link>
              <Link
                href="/pricing"
                className="px-6 py-3 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white text-xs font-bold uppercase tracking-wider hover:border-[#D4AF37] transition-colors"
              >
                View Plans
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


