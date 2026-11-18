'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Dumbbell,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  X,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { INITIAL_EXERCISES, Exercise, ExerciseCategory } from '@parshuram/shared';

export default function ExercisesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'chest', label: 'Chest' },
    { id: 'back', label: 'Back' },
    { id: 'shoulders', label: 'Shoulders' },
    { id: 'biceps', label: 'Biceps' },
    { id: 'triceps', label: 'Triceps' },
    { id: 'legs', label: 'Legs' },
    { id: 'abs', label: 'Abs' },
    { id: 'cardio', label: 'Cardio & Conditioning' },
    { id: 'full_body', label: 'Full Body' }
  ];

  const filteredExercises = INITIAL_EXERCISES.filter((ex) => {
    const matchesCat = selectedCategory === 'all' || ex.category === selectedCategory;
    const matchesQuery =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.target_muscles.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ex.equipment.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="bg-[#050B17] text-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Biomechanical Precision</span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase font-display text-white mt-2">
            Exercise Library
          </h1>
          <p className="text-sm text-zinc-300 mt-4 leading-relaxed">
            Master pristine barbell, dumbbell, and bodyweight execution. Filter by muscle category and learn safe cues developed by Coach Dave.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-[#101B37] p-6 rounded-2xl border border-[#1E305C] mb-12 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search exercise by name, muscle (e.g. Quadriceps), or equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0A1128] border border-[#1E305C] text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedCategory === c.id
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black'
                    : 'bg-[#0A1128] text-zinc-400 hover:text-white border border-[#1E305C]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Exercises Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              onClick={() => setSelectedExercise(exercise)}
              className="bg-[#101B37] rounded-xl border border-[#1E305C] overflow-hidden hover:border-[#D4AF37]/60 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="h-48 relative overflow-hidden bg-[#0A1128]">
                  {exercise.demonstration_image_url ? (
                    <img
                      src={exercise.demonstration_image_url}
                      alt={exercise.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#D4AF37]">
                      <Dumbbell className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-[#050B17]/80 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-gym-silver border border-[#1E305C]">
                    {exercise.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white">
                    {exercise.difficulty}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors mb-2 font-display uppercase tracking-wide">
                    {exercise.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mb-3">
                    <strong className="text-gym-silver">Muscles:</strong> {exercise.target_muscles.join(', ')}
                  </p>
                  <p className="text-xs text-zinc-400 mb-3">
                    <strong className="text-gym-silver">Equipment:</strong> {exercise.equipment}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-[#1E305C]/60 flex items-center justify-between text-xs text-zinc-400 mt-2">
                <span>{exercise.sets} Sets • {exercise.reps} Reps</span>
                <span className="text-[#D4AF37] font-bold flex items-center group-hover:translate-x-1 transition-transform">
                  View Cues <ChevronRight className="w-4 h-4 ml-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-16 bg-[#101B37] rounded-2xl border border-[#1E305C] p-8">
            <Dumbbell className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No exercises found</h3>
            <p className="text-xs text-zinc-400 mt-1">Try clearing filters or search terms.</p>
          </div>
        )}

        {/* Detailed Exercise Modal */}
        {selectedExercise && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-[#101B37] border border-[#1E305C] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
              <div className="sticky top-0 bg-[#101B37]/95 backdrop-blur-md px-6 py-4 border-b border-[#1E305C] flex items-center justify-between z-10">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider">
                    {selectedExercise.category} • {selectedExercise.difficulty}
                  </span>
                  <h3 className="text-xl font-black uppercase text-white font-display">
                    {selectedExercise.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="p-1.5 rounded-lg bg-[#0A1128] text-zinc-400 hover:text-white border border-[#1E305C]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Target muscles & equipment summary */}
                <div className="grid grid-cols-2 gap-4 bg-[#0A1128] p-4 rounded-xl border border-[#1E305C] text-xs">
                  <div>
                    <span className="text-zinc-400 block mb-1">Target Muscles</span>
                    <span className="text-white font-bold">{selectedExercise.target_muscles.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block mb-1">Equipment</span>
                    <span className="text-white font-bold">{selectedExercise.equipment}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block mb-1">Target Sets &amp; Reps</span>
                    <span className="text-white font-bold">{selectedExercise.sets} Sets × {selectedExercise.reps}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block mb-1">Difficulty</span>
                    <span className="text-[#D4AF37] font-bold uppercase">{selectedExercise.difficulty}</span>
                  </div>
                </div>

                {/* Step-by-step instructions */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gym-silver mb-3 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1.5 text-[#D4AF37]" />
                    Step-by-Step Biomechanical Execution
                  </h4>
                  <ol className="space-y-2 text-xs text-zinc-300 list-decimal list-inside leading-relaxed bg-[#050B17]/50 p-4 rounded-xl border border-[#1E305C]">
                    {selectedExercise.instructions.map((step, idx) => (
                      <li key={idx} className="pl-1 py-1">{step}</li>
                    ))}
                  </ol>
                </div>

                {/* Common Mistakes */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1.5 text-amber-400" />
                    Common Mistakes To Avoid
                  </h4>
                  <ul className="space-y-1.5 text-xs text-zinc-300 list-disc list-inside bg-amber-950/20 p-4 rounded-xl border border-amber-900/40">
                    {selectedExercise.common_mistakes.map((mistake, idx) => (
                      <li key={idx} className="pl-1 py-0.5">{mistake}</li>
                    ))}
                  </ul>
                </div>

                {/* Safety notes */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-3 flex items-center">
                    <ShieldAlert className="w-4 h-4 mr-1.5 text-[#D4AF37]" />
                    Safety Notes &amp; Joint Protection
                  </h4>
                  <ul className="space-y-1.5 text-xs text-zinc-300 list-disc list-inside bg-red-950/20 p-4 rounded-xl border border-red-900/40">
                    {selectedExercise.safety_notes.map((note, idx) => (
                      <li key={idx} className="pl-1 py-0.5">{note}</li>
                    ))}
                  </ul>
                </div>

                {/* YouTube Link */}
                {selectedExercise.video_url && (
                  <div className="pt-2">
                    <a
                      href={selectedExercise.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-xl bg-[#0A1128] hover:bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black text-xs font-bold uppercase tracking-wider border border-[#1E305C] transition-colors flex items-center justify-center space-x-2"
                    >
                      <PlayCircle className="w-4 h-4 text-[#D4AF37] group-hover:text-white" />
                      <span>Watch Video Demonstration on YouTube</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


