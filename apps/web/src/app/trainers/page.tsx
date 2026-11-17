'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Award, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { INITIAL_TRAINERS, BRAND } from '@parshuram/shared';

export default function TrainersPage() {
  return (
    <div className="bg-gym-black text-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-gym-red">Certified Coaching Staff</span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase font-display text-white mt-2">
            Our Elite Trainers
          </h1>
          <p className="text-sm text-zinc-300 mt-4 leading-relaxed">
            Led directly by gym owner Dave, our coaches combine decades of competitive lifting experience, biomechanical mastery, and personalized programming.
          </p>
        </div>

        <div className="space-y-12">
          {INITIAL_TRAINERS.map((trainer, index) => {
            const isDave = trainer.id === 'tr-1';
            const name = isDave ? 'Dave (Owner & Founder)' : trainer.id === 'tr-2' ? 'Vikram Rathore' : 'Priya Sharma';
            const roleTitle = isDave ? 'Head Strength Coach & Master Trainer' : trainer.id === 'tr-2' ? 'Senior Powerlifting & Biomechanics Coach' : 'Functional Athletics & Mobility Coach';

            return (
              <div
                key={trainer.id}
                className={`bg-gym-card rounded-2xl border ${
                  isDave ? 'border-gym-red/70 shadow-2xl shadow-red-950/30' : 'border-gym-border'
                } p-8 sm:p-10 transition-all hover:border-gym-red/50`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-4 flex flex-col items-center text-center">
                    <div className="relative">
                      <div className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-gym-red shadow-xl">
                        <img
                          src={trainer.photo_url}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-3 bg-gym-black border border-gym-red px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg">
                        <Star className="w-3.5 h-3.5 fill-gym-gold text-gym-gold" />
                        <span className="text-xs font-bold text-white">{trainer.rating} / 5.0</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white uppercase font-display mt-5">{name}</h3>
                    <p className="text-xs text-gym-silver font-semibold mt-0.5">{roleTitle}</p>
                    <span className="text-[11px] text-zinc-400 mt-1">{trainer.experience_years} Years Coaching Experience</span>
                  </div>

                  <div className="lg:col-span-8 space-y-5 border-t lg:border-t-0 lg:border-l border-gym-border pt-6 lg:pt-0 lg:pl-8">
                    <div>
                      <h4 className="text-xs font-bold uppercase text-gym-red tracking-wider mb-2">Biography &amp; Philosophy</h4>
                      <p className="text-sm text-zinc-300 leading-relaxed">
                        {trainer.bio}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase text-gym-silver tracking-wider mb-2">Core Specializations</h4>
                      <div className="flex flex-wrap gap-2">
                        {trainer.specializations.map((spec, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-xs font-semibold px-3 py-1 rounded-md bg-gym-charcoal text-white border border-gym-border flex items-center"
                          >
                            <CheckCircle className="w-3 h-3 text-gym-red mr-1.5" />
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase text-gym-silver tracking-wider mb-2">Accreditations &amp; Certifications</h4>
                      <div className="flex flex-wrap gap-2">
                        {trainer.certifications.map((cert, cIdx) => (
                          <span
                            key={cIdx}
                            className="text-xs font-medium px-3 py-1 rounded-md bg-zinc-900 text-zinc-300 border border-zinc-800 flex items-center"
                          >
                            <Award className="w-3 h-3 text-gym-silver mr-1.5" />
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 flex items-center space-x-4">
                      <Link
                        href="/contact"
                        className="px-5 py-2.5 rounded-lg bg-gym-red hover:bg-gym-redHover text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center"
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
      </div>
    </div>
  );
}
