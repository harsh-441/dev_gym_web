'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Shirt,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  Ban,
  Smartphone,
  HeartHandshake,
  Clock,
  HeartPulse,
  ArrowRight
} from 'lucide-react';
import { BRAND } from '@parshuram/shared';

export default function RulesPage() {
  const rules = [
    {
      number: '01',
      title: 'Wear Proper Gym Attire',
      description: 'Wear comfortable workout clothes and sports shoes at all times on the gym floor. Slippers, sandals, or working out barefoot are strictly prohibited for safety and hygiene.',
      icon: Shirt
    },
    {
      number: '02',
      title: 'Wipe Down Equipment',
      description: 'Wipe down machines, benches, and upholstery after use. Keep the gym clean, sanitised, and respectful for fellow lifters.',
      icon: Sparkles
    },
    {
      number: '03',
      title: 'Re-Rack Your Weights',
      description: 'Put back all dumbbells, weight plates, and barbell collars in their designated racks after completing your sets. Never leave loaded bars on the floor or racks.',
      icon: RotateCcw
    },
    {
      number: '04',
      title: 'Men / Boys Must Wear Supporter or Langot',
      description: 'All male members must wear a proper athletic supporter or traditional langot during workouts for anatomical safety, core stability, and hernia prevention.',
      icon: ShieldCheck
    },
    {
      number: '05',
      title: 'Equipment Damage',
      description: 'Treat gym machinery with care. If you break or intentionally damage any gym equipment, dumbbell, or facility item due to reckless behavior or dropping weights, you will be charged a penalty fine.',
      icon: ShieldAlert
    },
    {
      number: '06',
      title: 'No Mobile Phone Usage',
      description: 'Avoid using mobile phones on the gym floor. Excessive chatting, sitting on machines while browsing, or taking disruptive phone calls compromises workout focus and safety.',
      icon: Smartphone
    },
    {
      number: '07',
      title: 'Be Respectful',
      description: 'Be kind, encourage your peers, respect personal space, and avoid any kind of misconduct, loud vulgarity, or aggressive posturing. Parshuram Fitness Club is built on mutual honour.',
      icon: HeartHandshake
    },
    {
      number: '08',
      title: 'Be On Time',
      description: 'Respect your training time and others\' schedules. Do not hog stations, rest excessively while others wait, or occupy training zones during peak batch hours.',
      icon: Clock
    },
    {
      number: '09',
      title: 'Health Comes First',
      description: 'Consult a coach or trainer before attempting unfamiliar or maximal lifts. Never perform exercises beyond your safe capacity or ignore warning pain signals.',
      icon: HeartPulse
    }
  ];

  return (
    <div className="bg-[#050B17] text-white min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            Code of Discipline &amp; Safety
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase font-display text-white mt-2">
            Gym Rules &amp; Regulations
          </h1>
          <p className="text-sm text-slate-300 mt-4 leading-relaxed">
            At {BRAND.name}, discipline is the foundation of physical excellence. All members and visitors must adhere strictly to these rules to maintain a safe, clean, and focused training environment.
          </p>
        </div>

        {/* Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {rules.map((rule) => {
            const Icon = rule.icon;
            return (
              <div
                key={rule.number}
                className="bg-[#101B37] rounded-2xl border border-[#1E305C] p-7 flex flex-col justify-between hover:border-[#D4AF37]/60 transition-all shadow-xl group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-2xl font-black font-display text-[#D4AF37]/50 group-hover:text-[#D4AF37] transition-colors">
                      {rule.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#0A1128] border border-[#1E305C] flex items-center justify-center text-[#D4AF37] shadow-inner">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold uppercase font-display text-white mb-2.5">
                    {rule.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {rule.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#1E305C]/60 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Mandatory Protocol
                </div>
              </div>
            );
          })}
        </div>

        {/* Operating Notice */}
        <div className="bg-[#0A1128] rounded-2xl border border-[#1E305C] p-8 text-center max-w-2xl mx-auto shadow-2xl">
          <h3 className="text-lg font-bold uppercase font-display text-white mb-2">
            Questions About Gym Protocols?
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-6">
            Our coaching team led by Kapil Dev and Dev Vats is always on the floor to assist with proper equipment usage, form cues, and safety guidance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black hover:bg-[#E5C158] text-xs uppercase tracking-wider transition-all inline-flex items-center justify-center"
            >
              <span>Contact Management</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-xl bg-[#101B37] border border-[#1E305C] text-white hover:text-[#D4AF37] text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center justify-center"
            >
              <span>View Membership Plans</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
