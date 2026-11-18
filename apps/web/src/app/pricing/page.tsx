'use client';

import React from 'react';
import Link from 'next/link';
import { Check, ShieldCheck, Flame, ArrowRight, HelpCircle } from 'lucide-react';
import { INITIAL_MEMBERSHIP_PLANS, BRAND } from '@parshuram/shared';

export default function PricingPage() {
  return (
    <div className="bg-[#050B17] text-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Invest in Discipline</span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase font-display text-white mt-2">
            Membership Plans
          </h1>
          <p className="text-sm text-zinc-300 mt-4 leading-relaxed">
            Transparent packages with full gym floor access, zero hidden enrollment fees, and guaranteed 100% free daily attendance marking.
          </p>
        </div>

        {/* Free attendance & placeholder pricing banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="bg-[#101B37] border border-emerald-500/40 rounded-xl p-4 flex items-center space-x-3 text-xs text-zinc-300">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">Guaranteed Free Daily Attendance</span>
              Every member marks attendance via the QR scanner at zero extra cost. No per-visit fees, ever.
            </div>
          </div>
          <div className="bg-[#101B37] border border-[#1E305C] rounded-xl p-4 flex items-center space-x-3 text-xs text-zinc-300">
            <HelpCircle className="w-6 h-6 text-gym-silver shrink-0" />
            <div>
              <span className="font-bold text-white block">Official Pricing Notice</span>
              Prices below represent preliminary editable placeholders. Final rates are confirmed with Dave at the front desk.
            </div>
          </div>
        </div>

        {/* Plans Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {INITIAL_MEMBERSHIP_PLANS.map((plan, idx) => {
            const isFeatured = plan.id === 'plan-quarterly';

            return (
              <div
                key={plan.id}
                className={`bg-[#101B37] rounded-2xl border ${
                  isFeatured
                    ? 'border-[#D4AF37] shadow-2xl shadow-black/40 relative'
                    : 'border-[#1E305C]'
                } p-8 flex flex-col justify-between transition-all hover:border-[#D4AF37]/60`}
              >
                {isFeatured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                    Most Popular Choice
                  </div>
                )}

                <div>
                  <div className="mb-6">
                    <span className="text-xs uppercase font-bold text-gym-silver">{plan.duration_months} Month Commitment</span>
                    <h3 className="text-2xl font-black uppercase font-display text-white mt-1">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  <div className="py-4 border-y border-[#1E305C] mb-6">
                    <div className="flex items-baseline">
                      <span className="text-3xl sm:text-4xl font-black font-display text-white">₹{plan.price.toLocaleString('en-IN')}</span>
                      <span className="text-xs text-zinc-400 ml-2">/ {plan.duration_months > 1 ? `${plan.duration_months} months` : 'month'}</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 mt-1 block italic">Placeholder price — adjustable by Dave</span>
                  </div>

                  <div className="space-y-3 mb-8">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gym-silver block">What&apos;s Included:</span>
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start text-xs text-zinc-300">
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
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black hover:bg-[#E5C158] text-white shadow-lg shadow-black/60'
                        : 'bg-[#0A1128] hover:bg-zinc-800 text-white border border-[#1E305C]'
                    }`}
                  >
                    <span>Enquire for {plan.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Corporate & Student Discounts */}
        <div className="bg-[#0A1128] rounded-2xl border border-[#1E305C] p-8 text-center max-w-3xl mx-auto">
          <h3 className="text-xl font-bold uppercase font-display text-white mb-2">Student &amp; First-Responder Concessions</h3>
          <p className="text-xs text-zinc-300 leading-relaxed max-w-xl mx-auto mb-4">
            We honor college students, martial artists, and police/armed personnel with special subsidized rates. Ask Dave during your visit with a valid ID card.
          </p>
          <Link href="/contact" className="text-xs font-bold text-[#D4AF37] hover:underline uppercase tracking-wider">
            Contact Front Desk →
          </Link>
        </div>
      </div>
    </div>
  );
}


