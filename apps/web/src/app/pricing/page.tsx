'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, ShieldCheck, Flame, ArrowRight, HelpCircle, Gift } from 'lucide-react';
import { BRAND } from '@parshuram/shared';

type PublicPlan = { id: string; name: string; description: string; duration_months: number; price: number; features: string[] };

export default function PricingPage() {
  const [plans, setPlans] = useState<PublicPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  useEffect(() => {
    fetch('/api/membership-plans', { cache: 'no-store' })
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Could not load plans.'); setPlans(data.plans || []); })
      .catch((error) => setLoadError(error.message || 'Could not load membership plans.'))
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="bg-[#050B17] text-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            Official Gym Membership
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase font-display text-white mt-2">
            Membership Plans &amp; Rates
          </h1>
          <p className="text-sm text-slate-300 mt-4 leading-relaxed">
            Transparent and affordable training packages at {BRAND.name}, Meerut. Every membership includes full floor access, strength &amp; cardio facilities, Karate self-defence guidance, and free daily attendance tracking.
          </p>
        </div>

        {/* Special Offers Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-[#101B37] border border-emerald-500/40 rounded-xl p-5 flex items-center space-x-3.5 shadow-lg">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            <div className="text-xs text-slate-300">
              <span className="font-bold text-white block uppercase">100% Free Daily Attendance</span>
              Member Portal check-ins at zero extra cost.
            </div>
          </div>

          <div className="bg-[#101B37] border border-[#D4AF37]/50 rounded-xl p-5 flex items-center space-x-3.5 shadow-lg">
            <Gift className="w-6 h-6 text-[#D4AF37] shrink-0" />
            <div className="text-xs text-slate-300">
              <span className="font-bold text-white block uppercase">Special Offer: Gym Bag</span>
              Discounts &amp; complimentary gym bags available on select term packages.
            </div>
          </div>

          <div className="bg-[#101B37] border border-[#1E305C] rounded-xl p-5 flex items-center space-x-3.5 shadow-lg">
            <HelpCircle className="w-6 h-6 text-slate-300 shrink-0" />
            <div className="text-xs text-slate-300">
              <span className="font-bold text-white block uppercase">Admission &amp; Personal Training</span>
              Registration fee: ₹100. Personal training billing cycle confirmed with owner.
            </div>
          </div>
        </div>

        {/* Membership Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {loading ? <p className="col-span-full text-center text-sm text-slate-400">Loading current plans…</p> : loadError ? <p role="alert" className="col-span-full text-center text-sm text-red-300">{loadError}</p> : plans.length === 0 ? <p className="col-span-full text-center text-sm text-slate-400">No active plans are available at this time.</p> : plans.map((plan) => {
            const isFeatured = plan.duration_months >= 3;

            return (
              <div
                key={plan.id}
                className={`bg-[#101B37] rounded-2xl border ${
                  isFeatured
                    ? 'border-[#D4AF37] shadow-2xl shadow-black/40 relative'
                    : 'border-[#1E305C]'
                } p-8 flex flex-col justify-between transition-all hover:border-[#D4AF37]/60 group`}
              >
                {isFeatured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                    {plan.duration_months >= 12 ? 'Maximum Value Savings' : 'Popular Term Choice'}
                  </div>
                )}

                <div>
                  <div className="mb-6">
                    <span className="text-[11px] uppercase font-bold text-slate-400">
                      {`${plan.duration_months} Month Commitment`}
                    </span>
                    <h3 className="text-2xl font-black uppercase font-display text-white mt-1 group-hover:text-[#D4AF37] transition-colors">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  <div className="py-4 border-y border-[#1E305C] mb-6">
                    <div className="flex items-baseline">
                      <span className="text-3xl sm:text-4xl font-black font-display text-white">
                        ₹{plan.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-400 ml-2">
                        {`/ ${plan.duration_months > 1 ? `${plan.duration_months} months` : 'month'}`}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
                      Package Features:
                    </span>
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start text-xs text-slate-300">
                        <Check className="w-4 h-4 text-[#D4AF37] mr-2 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Link
                    href={`/contact?plan=${encodeURIComponent(plan.name)}`}
                    className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 ${
                      isFeatured
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black hover:bg-[#E5C158] shadow-lg shadow-black/60'
                        : 'bg-[#0A1128] hover:bg-[#1E305C] text-white border border-[#1E305C]'
                    }`}
                  >
                    <span>Inquire for {plan.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-current" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Operating Hours & Holiday Notice */}
        <div className="bg-[#0A1128] rounded-2xl border border-[#1E305C] p-8 text-center max-w-3xl mx-auto shadow-2xl">
          <h3 className="text-xl font-bold uppercase font-display text-white mb-2">
            Floor Timings &amp; Holiday Notification
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xl mx-auto mb-2">
            Monday to Saturday: <strong>Morning 5:30 AM – 10:00 AM</strong> and <strong>Evening 5:00 PM – 10:00 PM</strong>. Sunday: <strong>CLOSED</strong>.
          </p>
          <p className="text-[11px] text-amber-400 font-semibold mb-6">
            {BRAND.openingHours.holidayNotice}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black hover:bg-[#E5C158] text-xs uppercase tracking-wider transition-all inline-flex items-center justify-center"
            >
              <span>Contact Kapil Dev &amp; Dev Vats</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
