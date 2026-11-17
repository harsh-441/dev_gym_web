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
    <div className="bg-gym-black text-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-gym-red">Biomechanical Precision</span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase font-display text-white mt-2">
            Exercise Library
          </h1>
          <p className="text-sm text-zinc-300 mt-4 leading-relaxed">
            Master pristine barbell, dumbbell, and bodyweight execution. Filter by muscle category and learn safe cues developed by Coach Dave.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-gym-card p-6 rounded-2xl border border-gym-border mb-12 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search exercise by name, muscle (e.g. Quadriceps), or equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-gym-charcoal border border-gym-border text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-gym-red transition-colors"
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
                    ? 'bg-gym-red text-white'
                    : 'bg-gym-charcoal text-zinc-400 hover:text-white border border-gym-border'
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
              className="bg-gym-card rounded-xl border border-gym-border overflow-hidden hover:border-gym-red/60 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="h-48 relative overflow-hidden bg-gym-charcoal">
                  {exercise.demonstration_image_url ? (
                    <img
                      src={exercise.demonstration_image_url}
                      alt={exercise.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gym-red">
                      <Dumbbell className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-gym-black/80 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-gym-silver border border-gym-border">
                    {exercise.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-gym-red px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white">
                    {exercise.difficulty}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-white group-hover:text-gym-red transition-colors mb-2 font-display uppercase tracking-wide">
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

              <div className="p-5 pt-0 border-t border-gym-border/60 flex items-center justify-between text-xs text-zinc-400 mt-2">
                <span>{exercise.sets} Sets • {exercise.reps} Reps</span>
                <span className="text-gym-red font-bold flex items-center group-hover:translate-x-1 transition-transform">
                  View Cues <ChevronRight className="w-4 h-4 ml-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-16 bg-gym-card rounded-2xl border border-gym-border p-8">
            <Dumbbell className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No exercises found</h3>
            <p className="text-xs text-zinc-400 mt-1">Try clearing filters or search terms.</p>
          </div>
        )}

        {/* Detailed Exercise Modal */}
        {selectedExercise && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-gym-card border border-gym-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
              <div className="sticky top-0 bg-gym-card/95 backdrop-blur-md px-6 py-4 border-b border-gym-border flex items-center justify-between z-10">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gym-red tracking-wider">
                    {selectedExercise.category} • {selectedExercise.difficulty}
                  </span>
                  <h3 className="text-xl font-black uppercase text-white font-display">
                    {selectedExercise.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="p-1.5 rounded-lg bg-gym-charcoal text-zinc-400 hover:text-white border border-gym-border"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Target muscles & equipment summary */}
                <div className="grid grid-cols-2 gap-4 bg-gym-charcoal p-4 rounded-xl border border-gym-border text-xs">
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
                    <span className="text-gym-red font-bold uppercase">{selectedExercise.difficulty}</span>
                  </div>
                </div>

                {/* Step-by-step instructions */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gym-silver mb-3 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1.5 text-gym-red" />
                    Step-by-Step Biomechanical Execution
                  </h4>
                  <ol className="space-y-2 text-xs text-zinc-300 list-decimal list-inside leading-relaxed bg-gym-black/50 p-4 rounded-xl border border-gym-border">
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
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gym-red mb-3 flex items-center">
                    <ShieldAlert className="w-4 h-4 mr-1.5 text-gym-red" />
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
                      className="w-full py-3 rounded-xl bg-gym-charcoal hover:bg-gym-red text-white text-xs font-bold uppercase tracking-wider border border-gym-border transition-colors flex items-center justify-center space-x-2"
                    >
                      <PlayCircle className="w-4 h-4 text-gym-red group-hover:text-white" />
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
