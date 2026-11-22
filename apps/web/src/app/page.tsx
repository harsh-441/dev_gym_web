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
  RefreshCw,
  Gift,
  Sword,
  Shield,
  Activity
} from 'lucide-react';
import {
  BRAND,
  DEFAULT_APP_SETTINGS,
  INITIAL_WORKOUT_PROGRAMS,
  INITIAL_EXERCISES,
  INITIAL_DIET_PLANS,
  INITIAL_MEMBERSHIP_PLANS
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#050B17] via-[#0A1128] to-[#050B17] opacity-95 z-0" />
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-luminosity z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1920&q=80')`
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#0A1128] border border-[#D4AF37]/50 mb-6 shadow-lg shadow-black/40">
            <Flame className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            <span className="text-xs uppercase font-bold tracking-widest text-slate-200">
              Est. 2016 • Meerut, Uttar Pradesh • Owner: Kapil Dev
            </span>
          </div>

          <p className="text-sm sm:text-base md:text-lg uppercase tracking-[0.22em] sm:tracking-[0.3em] font-black text-[#D4AF37] mb-5">
            PARSHURAM FITNESS CLUB
          </p>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight font-display mb-6 leading-none">
            Forge An <span className="text-[#D4AF37]">Unbreakable</span> Body &amp; Mind
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mb-10 leading-relaxed font-normal">
            Welcome to <span className="text-white font-bold">{BRAND.name}</span>, established in 2016 in Meerut. We are committed to helping individuals achieve their fitness goals through dedicated coaching, modern training facilities, strength and cardio workouts, and personalized guidance. We also provide Karate training to encourage discipline, confidence, strength, and self-defence skills.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
            <Link
              href="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black hover:bg-[#E5C158] text-sm uppercase tracking-wider transition-all shadow-xl shadow-black/50 hover:scale-105"
            >
              <span>Join Club (From ₹500)</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link
              href="/facilities"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl bg-[#0A1128] hover:bg-[#1E305C] text-slate-200 hover:text-white text-sm font-bold uppercase tracking-wider border border-[#1E305C] transition-all"
            >
              <span>Explore Facilities</span>
            </Link>
          </div>

          {/* Quick Pillars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 w-full pt-10 border-t border-[#1E305C]/60">
            <div className="p-3.5 rounded-xl bg-[#101B37]/60 border border-[#1E305C]">
              <CalendarCheck className="w-5 h-5 text-[#D4AF37] mx-auto mb-1.5" />
              <p className="text-xs font-bold text-white uppercase">Free Attendance</p>
              <p className="text-[11px] text-slate-400">Member Portal check-in included</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#101B37]/60 border border-[#1E305C]">
              <Sword className="w-5 h-5 text-[#D4AF37] mx-auto mb-1.5" />
              <p className="text-xs font-bold text-white uppercase">Karate Training</p>
              <p className="text-[11px] text-slate-400">Discipline &amp; Self-Defence</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#101B37]/60 border border-[#1E305C]">
              <Gift className="w-5 h-5 text-[#D4AF37] mx-auto mb-1.5" />
              <p className="text-xs font-bold text-white uppercase">Special Offer</p>
              <p className="text-[11px] text-slate-400">Gym Bag promotion</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#101B37]/60 border border-[#1E305C]">
              <Clock className="w-5 h-5 text-[#D4AF37] mx-auto mb-1.5" />
              <p className="text-xs font-bold text-white uppercase">Universal Timings</p>
              <p className="text-[11px] text-slate-400">Morning &amp; Evening Batches</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT US & MISSION SUMMARY */}
      <section className="py-20 bg-[#050B17] border-b border-[#1E305C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-2xl bg-[#0A1128]">
                <img
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80"
                  alt="Parshuram Fitness Club Floor"
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-4 sm:right-6 bg-[#101B37] border border-[#1E305C] p-4 rounded-xl shadow-xl">
                <p className="text-xl font-black text-[#D4AF37] font-display">EST. 2016</p>
                <p className="text-[10px] uppercase font-bold text-slate-300">Meerut, Uttar Pradesh</p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-[#0A1128] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>Our Heritage &amp; Mission</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black uppercase font-display text-white">
                Dedicated Coaching &amp; Modern Facilities in Meerut
              </h2>

              <p className="text-slate-300 text-sm leading-relaxed">
                Welcome to <strong>Parshuram Fitness Club</strong>, established in 2016 in Meerut, Uttar Pradesh. We are committed to helping individuals achieve their fitness goals through dedicated coaching, modern training facilities, strength and cardio workouts, and personalized guidance.
              </p>

              <p className="text-slate-300 text-sm leading-relaxed">
                Whether you are a beginner or an experienced fitness enthusiast, our team is here to support your fitness journey. We also provide Karate training to encourage discipline, confidence, strength, and self-defence skills.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#101B37] border border-[#1E305C] flex items-center gap-3">
                  <img src="/images/kapil-dev-owner.jpeg" alt="Kapil Dev, Owner and Coach" className="h-14 w-14 rounded-lg border border-[#D4AF37] object-cover" />
                  <div>
                  <h4 className="text-sm font-bold uppercase text-white mb-1">Owner &amp; Coach</h4>
                  <p className="text-xs text-slate-400">Kapil Dev (3 Years Experience)</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#101B37] border border-[#1E305C]">
                  <h4 className="text-sm font-bold uppercase text-white mb-1">Coach</h4>
                  <p className="text-xs text-slate-400">Dev Vats (3 Years Experience)</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center space-x-2 text-xs font-bold text-[#D4AF37] hover:underline uppercase tracking-wider"
                >
                  <span>Read Full About Us &amp; Our Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 7 CORE FACILITIES SECTION */}
      <section className="py-20 bg-[#0A1128] border-b border-[#1E305C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              Complete Training Floor
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase font-display text-white mt-2">
              Our 7 Specialized Facilities
            </h2>
            <p className="text-sm text-slate-300 mt-4 leading-relaxed">
              Equipped with modern machinery and free weights. No separate male and female timings or batches — welcoming and professional for all athletes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[
              { title: '1. Cardio Equipment', desc: 'Electronic treadmills, cycles & cross trainers for high endurance and stamina.', icon: Activity },
              { title: '2. Weight Training', desc: 'Full spectrum dumbbell racks, Olympic bars, and calibrated iron plates.', icon: Dumbbell },
              { title: '3. Strength Training', desc: 'Heavy squat racks, bench stations, and powerlifting compound platforms.', icon: Shield },
              { title: '4. Personal Training', desc: 'One-on-one tailored coaching for posture, biomechanics, and progression.', icon: Users },
              { title: '5. CrossFit Training', desc: 'Metabolic conditioning, battle ropes, plyometrics, and circuit training.', icon: Flame },
              { title: '6. Functional Training', desc: 'Core stabilization, joint resilience, and functional movement drills.', icon: Zap },
              { title: '7. Karate Training', desc: 'Traditional martial arts for discipline, physical stamina, and self-defence.', icon: Sword }
            ].map((fac, idx) => {
              const Icon = fac.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#101B37] rounded-2xl border border-[#1E305C] p-6 hover:border-[#D4AF37]/60 transition-all shadow-xl group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#0A1128] border border-[#1E305C] flex items-center justify-center text-[#D4AF37] mb-4 group-hover:border-[#D4AF37]/50 group-hover:scale-105 transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold uppercase font-display text-white mb-2">
                      {fac.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {fac.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/facilities"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#101B37] border border-[#1E305C] text-slate-200 hover:text-white hover:border-[#D4AF37] text-xs font-bold uppercase tracking-wider transition-all"
            >
              <span>View All Facilities &amp; Equipment In Depth</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. PRICING & MEMBERSHIP PREVIEW */}
      <section className="py-20 bg-[#050B17] border-b border-[#1E305C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              Simple &amp; Honest Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase font-display text-white mt-2">
              Membership Plans
            </h2>
            <p className="text-sm text-slate-300 mt-4 leading-relaxed">
              Affordable packages with zero hidden fees. Guaranteed 100% free daily attendance tracking for every member.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { name: 'Monthly Membership', price: '₹500', term: 'per month', popular: false },
              { name: '3 Months Membership', price: '₹1,300', term: 'for 3 months', popular: true, tag: 'Most Popular' },
              { name: '6 Months Membership', price: '₹2,500', term: 'for 6 months', popular: false },
              { name: 'Yearly Membership', price: '₹5,000', term: 'for 12 months', popular: true, tag: 'Best Value' }
            ].map((p, idx) => (
              <div
                key={idx}
                className={`bg-[#101B37] rounded-2xl border ${
                  p.popular ? 'border-[#D4AF37] relative shadow-2xl' : 'border-[#1E305C]'
                } p-6 flex flex-col justify-between shadow-xl`}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] text-[10px] font-black uppercase px-3 py-0.5 rounded-full">
                    {p.tag}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-black uppercase font-display text-white mb-2">{p.name}</h3>
                  <div className="py-3 border-y border-[#1E305C] mb-4">
                    <span className="text-3xl font-black font-display text-white">{p.price}</span>
                    <span className="text-xs text-slate-400 ml-1.5">/ {p.term}</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-2 mb-6">
                    <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] mr-2 shrink-0" />Free Member Portal check-in</li>
                    <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] mr-2 shrink-0" />Cardio, strength &amp; CrossFit</li>
                    <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] mr-2 shrink-0" />Karate discipline sessions</li>
                  </ul>
                </div>

                <Link
                  href={`/contact?plan=${encodeURIComponent(p.name)}`}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-center transition-all ${
                    p.popular
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black hover:bg-[#E5C158]'
                      : 'bg-[#0A1128] border border-[#1E305C] text-white hover:border-[#D4AF37]'
                  }`}
                >
                  Inquire Now
                </Link>
              </div>
            ))}
          </div>

          <div className="bg-[#101B37] rounded-2xl border border-[#1E305C] p-6 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
            <div>
              <p className="font-bold text-white uppercase">One-Time Registration: ₹100 • Personal Training: ₹3,000</p>
              <p className="text-slate-400 text-[11px] mt-0.5">Special Offer: Gym Bag promotion available on select packages.</p>
            </div>
            <Link
              href="/pricing"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black hover:bg-[#E5C158] text-xs uppercase tracking-wider shrink-0"
            >
              View Full Pricing Details
            </Link>
          </div>
        </div>
      </section>

      {/* 5. OPERATING HOURS & LIVE LOCATION */}
      <section className="py-20 bg-[#0A1128] border-b border-[#1E305C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Hours */}
            <div className="lg:col-span-6 bg-[#101B37] rounded-2xl border border-[#1E305C] p-8 shadow-2xl space-y-6">
              <div className="flex items-center space-x-3 border-b border-[#1E305C] pb-4">
                <Clock className="w-6 h-6 text-[#D4AF37]" />
                <h3 className="text-xl font-black uppercase font-display text-white">
                  Gym Opening Hours
                </h3>
              </div>

              <div className="space-y-4 text-sm text-slate-300">
                <div className="p-4 rounded-xl bg-[#0A1128] border border-[#1E305C] flex items-center justify-between">
                  <span className="font-bold text-white uppercase">Monday to Saturday</span>
                  <div className="text-right text-xs">
                    <p className="text-white font-semibold">Morning: 5:30 AM – 10:00 AM</p>
                    <p className="text-white font-semibold mt-0.5">Evening: 5:00 PM – 10:00 PM</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0A1128] border border-[#1E305C] flex items-center justify-between">
                  <span className="font-bold text-rose-400 uppercase">Sunday</span>
                  <span className="text-xs font-bold uppercase text-rose-400 bg-rose-950/40 px-3 py-1 rounded border border-rose-800">
                    CLOSED
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-[#050B17] border border-amber-500/30 text-xs text-amber-300">
                  <p className="font-semibold">Holiday Information:</p>
                  <p className="text-[11px] text-slate-300 mt-0.5">{BRAND.openingHours.holidayNotice}</p>
                </div>
              </div>
            </div>

            {/* Location & Navigation */}
            <div className="lg:col-span-6 bg-[#101B37] rounded-2xl border border-[#1E305C] p-8 shadow-2xl space-y-6">
              <div className="flex items-center space-x-3 border-b border-[#1E305C] pb-4">
                <MapPin className="w-6 h-6 text-[#D4AF37]" />
                <h3 className="text-xl font-black uppercase font-display text-white">
                  Gym Location &amp; Directions
                </h3>
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                <div>
                  <span className="font-bold text-white uppercase block mb-1">Physical Address</span>
                  <a
                    href={BRAND.googleMapsSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-[#D4AF37] leading-relaxed transition-colors block text-sm"
                  >
                    {BRAND.address}
                  </a>
                  <span className="text-xs text-[#D4AF37] font-semibold mt-1 block">
                    Landmark: Near Meerut City Public School
                  </span>
                </div>

                <div className="pt-2">
                  <span className="font-bold text-white uppercase block mb-1">Contact Numbers</span>
                  <p className="text-sm text-white">
                    Primary: <a href="tel:9897191013" className="hover:text-[#D4AF37] underline font-bold">9897191013</a> • Secondary: <a href="tel:7983626564" className="hover:text-[#D4AF37] underline font-bold">7983626564</a>
                  </p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Contact Persons: Kapil Dev &amp; Dev Vats</p>
                </div>

                <div className="pt-3">
                  <a
                    href={BRAND.googleMapsSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black hover:bg-[#E5C158] text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center space-x-2"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Get Directions on Google Maps</span>
                  </a>

                  {/* Interactive Embedded Google Map */}
                  <div className="rounded-xl overflow-hidden border border-[#1E305C] bg-[#0A1128] mt-4 aspect-video w-full shadow-inner">
                    <iframe
                      title="Parshuram Fitness Club Interactive Map"
                      src="https://maps.google.com/maps?q=Parshuram+Fitness+Club%2C+Ram+Katori+Wali+Gali%2C+Near+Meerut+City+Public+School%2C+Meerut&t=&z=15&ie=UTF8&iwloc=&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. RULES BANNER STRIP */}
      <section className="py-12 bg-[#050B17] border-b border-[#1E305C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#101B37] border border-[#1E305C] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h3 className="text-xl font-bold uppercase font-display text-white mb-1">
                Committed to Cleanliness, Safety &amp; Discipline
              </h3>
              <p className="text-xs text-slate-300">
                Explore our 9 official gym rules: attire, hygiene, re-racking, safety gear, and mutual respect.
              </p>
            </div>
            <Link
              href="/rules"
              className="px-6 py-3 rounded-xl bg-[#0A1128] border border-[#1E305C] hover:border-[#D4AF37] text-white text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center space-x-2 shrink-0"
            >
              <span>View 9 Gym Rules</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
