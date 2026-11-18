'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, Award, Shield, CheckCircle, ArrowRight, RefreshCw, Users } from 'lucide-react';
import { BRAND } from '@parshuram/shared';

export default function TrainersPage() {
  const [coaches, setCoaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  return (
    <div className="bg-[#050B17] text-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            Certified Coaching Staff
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase font-display text-white mt-2">
            Our Elite Coaching Team
          </h1>
          <p className="text-sm text-slate-300 mt-4 leading-relaxed">
            Led directly by gym owner Dave, our active coaches combine decades of competitive lifting experience, biomechanical mastery, and personalized programming.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400 uppercase tracking-wider">Syncing Active Coaching Roster...</p>
          </div>
        ) : coaches.length === 0 ? (
          <div className="bg-[#101B37] rounded-2xl border border-[#1E305C] p-12 text-center max-w-xl mx-auto shadow-xl">
            <Users className="w-12 h-12 text-[#D4AF37] mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-white uppercase font-display">No Active Coaching Staff</h3>
            <p className="text-xs text-slate-400 mt-1">
              All non-owner coaching profiles are currently archived or inactive in Dave&apos;s Owner Console.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {coaches.map((trainer) => {
              const emp = trainer.employee;
              const isDave = emp?.id === 'emp-dave' || trainer.id === 'tr-1';
              const name = trainer.employee?.profile?.full_name || (isDave ? 'Dave (Owner & Founder)' : 'Staff Coach');
              const roleTitle = emp?.designation || (isDave ? 'Head Strength Coach & Master Trainer' : 'Strength Coach');

              return (
                <div
                  key={trainer.id}
                  className={`bg-[#101B37] rounded-2xl border ${
                    isDave ? 'border-[#D4AF37]/70 shadow-2xl shadow-black/60' : 'border-[#1E305C]'
                  } p-8 sm:p-10 transition-all hover:border-[#D4AF37]/50`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-4 flex flex-col items-center text-center">
                      <div className="relative">
                        <div className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-xl">
                          <img
                            src={trainer.photo_url}
                            alt={name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-3 bg-[#050B17] border border-[#D4AF37] px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg">
                          <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                          <span className="text-xs font-bold text-white">{trainer.rating} / 5.0</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white uppercase font-display mt-5">{name}</h3>
                      <p className="text-xs text-[#D4AF37] font-semibold mt-0.5">{roleTitle}</p>
                      <span className="text-[11px] text-slate-400 mt-1">{trainer.experience_years} Years Coaching Experience</span>
                    </div>

                    <div className="lg:col-span-8 space-y-5 border-t lg:border-t-0 lg:border-l border-[#1E305C] pt-6 lg:pt-0 lg:pl-8">
                      <div>
                        <h4 className="text-xs font-bold uppercase text-[#D4AF37] tracking-wider mb-2">
                          Biography &amp; Philosophy
                        </h4>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {trainer.bio}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider mb-2">Core Specializations</h4>
                        <div className="flex flex-wrap gap-2">
                          {trainer.specializations?.map((spec: string, sIdx: number) => (
                            <span
                              key={sIdx}
                              className="text-xs font-semibold px-3 py-1 rounded-md bg-[#0A1128] text-white border border-[#1E305C] flex items-center"
                            >
                              <CheckCircle className="w-3 h-3 text-[#D4AF37] mr-1.5" />
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider mb-2">Accreditations &amp; Certifications</h4>
                        <div className="flex flex-wrap gap-2">
                          {trainer.certifications?.map((cert: string, cIdx: number) => (
                            <span
                              key={cIdx}
                              className="text-xs font-medium px-3 py-1 rounded-md bg-[#050B17] text-slate-300 border border-[#1E305C] flex items-center"
                            >
                              <Award className="w-3 h-3 text-[#D4AF37] mr-1.5" />
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 flex items-center space-x-4">
                        <Link
                          href="/contact"
                          className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#E5C158] hover:to-[#D4AF37] text-[#050B17] text-xs font-black uppercase tracking-wider transition-all inline-flex items-center shadow-md shadow-black/50"
                        >
                          <span>Enquire About Personal Training</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


