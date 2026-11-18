'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, Dumbbell, Award, ArrowRight, Filter } from 'lucide-react';
import { INITIAL_WORKOUT_PROGRAMS, FitnessGoalType } from '@parshuram/shared';

export default function ProgramsPage() {
  const [selectedGoal, setSelectedGoal] = useState<string>('all');

  const goals = [
    { id: 'all', label: 'All Programs' },
    { id: 'strength', label: 'Strength' },
    { id: 'muscle_gain', label: 'Hypertrophy / Muscle' },
    { id: 'fat_loss', label: 'Fat Loss & Conditioning' }
  ];

  const filtered = selectedGoal === 'all'
    ? INITIAL_WORKOUT_PROGRAMS
    : INITIAL_WORKOUT_PROGRAMS.filter((p) => p.goal === selectedGoal);

  return (
    <div className="bg-[#050B17] text-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Periodized Protocols</span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase font-display text-white mt-2">
            Workout Programs
          </h1>
          <p className="text-sm text-zinc-300 mt-4 leading-relaxed">
            Every routine at Parshuram Gym is structured with progressive overload, calculated volume, and recovery phases.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {goals.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGoal(g.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                selectedGoal === g.id
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black shadow-lg shadow-black/50'
                  : 'bg-[#101B37] text-zinc-300 hover:text-white border border-[#1E305C]'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filtered.map((program) => (
            <div
              key={program.id}
              className="bg-[#101B37] rounded-2xl border border-[#1E305C] overflow-hidden hover:border-[#D4AF37]/60 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-52 relative overflow-hidden">
                  <img
                    src={program.cover_image}
                    alt={program.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-[#050B17]/80 px-2.5 py-1 rounded text-xs font-bold text-gym-silver border border-[#1E305C]">
                    {program.duration_weeks} Weeks
                  </div>
                  <div className="absolute bottom-3 left-3 bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider text-white">
                    {program.level}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 font-display uppercase tracking-wide">
                    {program.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                    {program.description}
                  </p>

                  <div className="space-y-2.5 py-3 border-y border-[#1E305C] text-xs text-zinc-300">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400 flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37]" /> Frequency
                      </span>
                      <span className="font-semibold text-white">{program.days_per_week} Days / Week</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400 flex items-center">
                        <Award className="w-3.5 h-3.5 mr-1.5 text-gym-silver" /> Primary Goal
                      </span>
                      <span className="font-semibold text-white uppercase">{program.goal.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400 flex items-center">
                        <Dumbbell className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37]" /> Experience
                      </span>
                      <span className="font-semibold text-white uppercase">{program.level}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href="/ai-planner"
                  className="w-full py-3 rounded-lg bg-[#0A1128] hover:bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black text-xs font-bold uppercase tracking-wider border border-[#1E305C] hover:border-[#D4AF37] transition-all flex items-center justify-center space-x-1.5"
                >
                  <span>Customize in AI Planner</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


