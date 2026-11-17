'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Video,
  Dumbbell,
  Utensils,
  Megaphone,
  Sparkles,
  ExternalLink,
  X
} from 'lucide-react';
import {
  api,
  Exercise,
  DietPlan,
  YouTubeVideo,
  WorkoutProgram,
  INITIAL_EXERCISES,
  INITIAL_DIET_PLANS,
  INITIAL_YOUTUBE_VIDEOS,
  INITIAL_WORKOUT_PROGRAMS
} from '@parshuram/shared';

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<'exercises' | 'diets' | 'videos' | 'programs'>('exercises');
  const [exercises, setExercises] = useState<Exercise[]>([...INITIAL_EXERCISES]);
  const [diets, setDiets] = useState<DietPlan[]>([...INITIAL_DIET_PLANS]);
  const [videos, setVideos] = useState<YouTubeVideo[]>([...INITIAL_YOUTUBE_VIDEOS]);
  const [programs, setPrograms] = useState<WorkoutProgram[]>([...INITIAL_WORKOUT_PROGRAMS]);

  // Video Form Modal
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoCategory, setNewVideoCategory] = useState('Form & Technique');
  const [newVideoDesc, setNewVideoDesc] = useState('');

  // Exercise Form Modal
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [exName, setExName] = useState('');
  const [exCategory, setExCategory] = useState('chest');
  const [exEquipment, setExEquipment] = useState('');
  const [exInstructions, setExInstructions] = useState('');

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle || !newVideoUrl) return;

    // Extract youtube ID
    let vidId = 'rT7DgCr-3pg';
    const match = newVideoUrl.match(/(?:v=|\/embed\/|youtu\.be\/)([^&?]+)/);
    if (match && match[1]) {
      vidId = match[1];
    }

    const video: YouTubeVideo = {
      id: `yt-${Date.now()}`,
      title: newVideoTitle,
      youtube_id: vidId,
      youtube_url: newVideoUrl,
      category: newVideoCategory,
      description: newVideoDesc || 'Technique cueing by Parshuram coaches.',
      is_featured: false,
      order_index: videos.length + 1,
      created_at: new Date().toISOString()
    };

    setVideos([video, ...videos]);
    (api as any).store.youtubeVideos.unshift(video);
    setShowVideoModal(false);
    setNewVideoTitle('');
    setNewVideoUrl('');
    setNewVideoDesc('');
  };

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exName) return;

    const exercise: Exercise = {
      id: `ex-${Date.now()}`,
      name: exName,
      category: exCategory as any,
      target_muscles: ['Primary Target Muscle'],
      equipment: exEquipment || 'Barbell / Dumbbell',
      difficulty: 'intermediate',
      sets: '3',
      reps: '10-12',
      instructions: exInstructions ? [exInstructions] : ['Execute movement through full active range of motion.'],
      common_mistakes: ['Using momentum instead of controlled tension'],
      safety_notes: ['Maintain neutral spine alignment'],
      is_active: true,
      created_at: new Date().toISOString()
    };

    setExercises([exercise, ...exercises]);
    (api as any).store.exercises.unshift(exercise);
    setShowExerciseModal(false);
    setExName('');
    setExEquipment('');
    setExInstructions('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gym-card p-6 rounded-2xl border border-gym-border shadow-xl">
        <div>
          <span className="text-xs uppercase font-bold text-gym-red tracking-wider">Module E</span>
          <h1 className="text-2xl font-black uppercase font-display text-white mt-0.5">
            Content &amp; Media Management
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Dave&apos;s direct control of exercise guides, Indian diet plans, YouTube video links, and programs.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {activeTab === 'videos' && (
            <button
              onClick={() => setShowVideoModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gym-red hover:bg-gym-redHover text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 shadow-md shadow-red-950/60"
            >
              <Plus className="w-4 h-4" />
              <span>Add YouTube URL</span>
            </button>
          )}
          {activeTab === 'exercises' && (
            <button
              onClick={() => setShowExerciseModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gym-red hover:bg-gym-redHover text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 shadow-md shadow-red-950/60"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Exercise</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gym-border overflow-x-auto">
        <button
          onClick={() => setActiveTab('exercises')}
          className={`py-3 px-5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'exercises' ? 'border-gym-red text-gym-red' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          <span>Exercise Library ({exercises.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('diets')}
          className={`py-3 px-5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'diets' ? 'border-gym-red text-gym-red' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Diet &amp; Nutrition ({diets.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`py-3 px-5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'videos' ? 'border-gym-red text-gym-red' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>YouTube Video Hub ({videos.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('programs')}
          className={`py-3 px-5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'programs' ? 'border-gym-red text-gym-red' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Workout Programs ({programs.length})</span>
        </button>
      </div>

      {/* Exercises Tab View */}
      {activeTab === 'exercises' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((ex) => (
            <div key={ex.id} className="bg-gym-card p-5 rounded-2xl border border-gym-border flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-gym-red px-2 py-0.5 rounded bg-gym-red/20 border border-gym-red/40">
                    {ex.category}
                  </span>
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">{ex.difficulty}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{ex.name}</h3>
                <p className="text-xs text-zinc-400 line-clamp-2 mb-3">{ex.instructions[0]}</p>
                <div className="text-[11px] text-gym-silver">
                  <strong>Equipment:</strong> {ex.equipment}
                </div>
              </div>

              <div className="pt-4 border-t border-gym-border flex items-center justify-between mt-4">
                <span className="text-xs text-zinc-400">{ex.sets} Sets × {ex.reps}</span>
                <button
                  onClick={() => setExercises(exercises.filter((e) => e.id !== ex.id))}
                  className="text-red-400 hover:text-red-300 text-xs font-bold"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Diets Tab View */}
      {activeTab === 'diets' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {diets.map((diet) => (
            <div key={diet.id} className="bg-gym-card p-5 rounded-2xl border border-gym-border flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                  {diet.is_veg ? 'Vegetarian' : 'Non-Vegetarian'}
                </span>
                <h3 className="text-base font-bold text-white mt-2 mb-2">{diet.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">{diet.description}</p>
                <div className="bg-gym-charcoal p-3 rounded-lg border border-gym-border text-xs flex justify-between">
                  <span>{diet.calories} kcal</span>
                  <span className="text-gym-red">{diet.protein_g}g Protein</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Videos Tab View */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((vid) => (
            <div key={vid.id} className="bg-gym-card rounded-xl border border-gym-border overflow-hidden flex flex-col justify-between">
              <div>
                <div className="aspect-video bg-gym-charcoal relative">
                  <img
                    src={`https://img.youtube.com/vi/${vid.youtube_id}/mqdefault.jpg`}
                    alt={vid.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-bold uppercase text-gym-silver">{vid.category}</span>
                  <h4 className="text-xs font-bold text-white mt-1 line-clamp-2">{vid.title}</h4>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-between text-xs">
                <a href={vid.youtube_url} target="_blank" rel="noopener noreferrer" className="text-gym-red font-bold flex items-center">
                  <span>Test Link</span> <ExternalLink className="w-3 h-3 ml-1" />
                </a>
                <button
                  onClick={() => setVideos(videos.filter((v) => v.id !== vid.id))}
                  className="text-zinc-500 hover:text-red-400 text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Programs Tab View */}
      {activeTab === 'programs' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {programs.map((prog) => (
            <div key={prog.id} className="bg-gym-card rounded-2xl border border-gym-border overflow-hidden">
              <div className="h-44 relative">
                <img src={prog.cover_image} alt={prog.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold text-white mb-2">{prog.title}</h3>
                <p className="text-xs text-zinc-400 mb-3 leading-relaxed">{prog.description}</p>
                <div className="flex justify-between text-xs text-zinc-300 pt-3 border-t border-gym-border">
                  <span>{prog.duration_weeks} Weeks</span>
                  <span className="text-gym-red uppercase font-semibold">{prog.level}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gym-card border border-gym-border rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-gym-border pb-3 mb-4">
              <h3 className="text-base font-bold uppercase font-display text-white">
                Add YouTube Fitness Video URL
              </h3>
              <button onClick={() => setShowVideoModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVideo} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Video Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Perfect Deadlift Setup"
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">YouTube URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=op9kVnSso6Q"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Category</label>
                <select
                  value={newVideoCategory}
                  onChange={(e) => setNewVideoCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
                >
                  <option value="Form & Technique">Form &amp; Technique</option>
                  <option value="Lower Body Strength">Lower Body Strength</option>
                  <option value="Compound Power">Compound Power</option>
                  <option value="Cardio & Conditioning">Cardio &amp; Conditioning</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Key cues..."
                  value={newVideoDesc}
                  onChange={(e) => setNewVideoDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gym-red hover:bg-gym-redHover text-white font-bold uppercase tracking-wider transition-colors"
              >
                Save Video to Hub
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Exercise Modal */}
      {showExerciseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gym-card border border-gym-border rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-gym-border pb-3 mb-4">
              <h3 className="text-base font-bold uppercase font-display text-white">
                Add Movement to Exercise Library
              </h3>
              <button onClick={() => setShowExerciseModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExercise} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Exercise Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Romanian Deadlift"
                  value={exName}
                  onChange={(e) => setExName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Category</label>
                  <select
                    value={exCategory}
                    onChange={(e) => setExCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
                  >
                    <option value="chest">Chest</option>
                    <option value="back">Back</option>
                    <option value="legs">Legs</option>
                    <option value="shoulders">Shoulders</option>
                    <option value="biceps">Biceps</option>
                    <option value="triceps">Triceps</option>
                    <option value="abs">Abs</option>
                    <option value="cardio">Cardio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Equipment</label>
                  <input
                    type="text"
                    placeholder="Barbell / Dumbbell"
                    value={exEquipment}
                    onChange={(e) => setExEquipment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Execution Cues</label>
                <textarea
                  rows={3}
                  placeholder="Step by step execution cues..."
                  value={exInstructions}
                  onChange={(e) => setExInstructions(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gym-red hover:bg-gym-redHover text-white font-bold uppercase tracking-wider transition-colors"
              >
                Save Exercise
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
