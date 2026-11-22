'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, Award, Shield, CheckCircle, ArrowRight, RefreshCw, Users, ShieldAlert } from 'lucide-react';
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
            Coaching Leadership • Est. 2016
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase font-display text-white mt-2">
            Meet Our Trainers &amp; Coaches
          </h1>
          <p className="text-sm text-slate-300 mt-4 leading-relaxed">
            At {BRAND.name}, our training floor is directed by owner Kapil Dev alongside coach Dev Vats. With 3 years of hands-on coaching, we guide every member through proper biomechanics, strength progression, and disciplined Karate self-defence.
          </p>
        </div>

        {/* Qualification Verification Note */}
        <div className="bg-[#101B37] border border-[#1E305C] rounded-2xl p-5 mb-12 max-w-3xl mx-auto flex items-center space-x-3.5 shadow-xl">
          <Shield className="w-6 h-6 text-[#D4AF37] shrink-0" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-white block uppercase">Coach Qualification Note</span>
            Karate specialization: <strong>8th Dan Black Belt</strong>. (The specific coach holding this qualification is noted pending formal profile assignment by owner Kapil Dev).
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400 uppercase tracking-wider">Loading Coaching Roster...</p>
          </div>
        ) : coaches.length === 0 ? (
          <div className="bg-[#101B37] rounded-2xl border border-[#1E305C] p-12 text-center max-w-xl mx-auto shadow-xl">
            <Users className="w-12 h-12 text-[#D4AF37] mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-white uppercase font-display">No Active Coaching Staff</h3>
            <p className="text-xs text-slate-400 mt-1">
              Active coaches will appear as configured by Kapil Dev in the Owner Console.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {coaches.map((trainer) => {
              const emp = trainer.employee;
              const isKapil = emp?.id === 'emp-kapil' || trainer.id === 'tr-1' || trainer.employee_id === 'emp-kapil';
              const isDevVats = emp?.id === 'emp-dev-vats' || trainer.id === 'tr-2' || trainer.employee_id === 'emp-dev-vats';

              const name = isKapil
                ? 'Kapil Dev'
                : isDevVats
                ? 'Dev Vats'
                : trainer.employee?.profile?.full_name || 'Staff Coach';

              const roleTitle = isKapil
                ? 'Owner and Coach'
                : isDevVats
                ? 'Coach'
                : emp?.designation || 'Coach';

              return (
                <div
                  key={trainer.id}
                  className={`bg-[#101B37] rounded-2xl border ${
                    isKapil ? 'border-[#D4AF37]/80 shadow-2xl shadow-black/60' : 'border-[#1E305C]'
                  } p-8 sm:p-10 transition-all hover:border-[#D4AF37]/50 shadow-xl`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-4 flex flex-col items-center text-center">
                      <div className="relative">
                        <div className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-xl bg-[#0A1128]">
                          <img
                            src={isKapil ? '/images/kapil-dev-owner.jpeg' : trainer.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                            alt={name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-3 bg-[#050B17] border border-[#D4AF37] px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg">
                          <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                          <span className="text-xs font-bold text-white">{trainer.rating || 5.0} / 5.0</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white uppercase font-display mt-5">{name}</h3>
                      <p className="text-xs text-[#D4AF37] font-semibold mt-0.5">{roleTitle}</p>
                      <span className="text-[11px] text-slate-400 mt-1">Experience: {trainer.experience_years || 3} Years</span>
                    </div>

                    <div className="lg:col-span-8 space-y-5 border-t lg:border-t-0 lg:border-l border-[#1E305C] pt-6 lg:pt-0 lg:pl-8">
                      <div>
                        <h4 className="text-xs font-bold uppercase text-[#D4AF37] tracking-wider mb-2">
                          Background &amp; Philosophy
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
                        <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider mb-2">Certifications &amp; Credentials</h4>
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

                      <div className="pt-4 flex flex-wrap items-center gap-4">
                        <Link
                          href={`/contact?plan=${encodeURIComponent(`Personal Coaching with ${name}`)}`}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#E5C158] hover:to-[#D4AF37] text-[#050B17] text-xs font-black uppercase tracking-wider transition-all inline-flex items-center shadow-md shadow-black/50"
                        >
                          <span>Inquire About Personal Training</span>
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

        {/* Contact Strip */}
        <div className="mt-16 bg-[#0A1128] rounded-2xl border border-[#1E305C] p-8 text-center max-w-2xl mx-auto shadow-2xl">
          <h3 className="text-lg font-bold uppercase font-display text-white mb-2">
            Speak Directly With Kapil Dev or Dev Vats
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Call us on <strong>9897191013</strong> or <strong>7983626564</strong> for personal training bookings, Karate batch schedules, or floor tours.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-xl bg-[#101B37] border border-[#1E305C] hover:border-[#D4AF37] text-white text-xs font-bold uppercase tracking-wider transition-all"
            >
              Contact Front Desk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
