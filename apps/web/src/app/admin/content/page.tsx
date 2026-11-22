'use client';

import React, { useEffect, useState } from 'react';
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
  X,
  Camera,
  Gift,
  Clock,
  Save,
  CheckCircle2,
  ShieldCheck,
  Pencil
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
  INITIAL_WORKOUT_PROGRAMS,
  BRAND,
  DEFAULT_APP_SETTINGS
} from '@parshuram/shared';

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<'exercises' | 'diets' | 'videos' | 'programs' | 'gallery' | 'announcements' | 'offers'>('exercises');
  const [exercises, setExercises] = useState<Exercise[]>([...INITIAL_EXERCISES]);
  const [diets, setDiets] = useState<DietPlan[]>([...INITIAL_DIET_PLANS]);
  const [videos, setVideos] = useState<YouTubeVideo[]>([...INITIAL_YOUTUBE_VIDEOS]);
  const [programs, setPrograms] = useState<WorkoutProgram[]>([...INITIAL_WORKOUT_PROGRAMS]);

  // Gallery state
  const [galleryImages, setGalleryImages] = useState<any[]>([
    {
      id: 'g-1',
      title: 'Strength & Free Weights Area',
      category: 'Weight Training',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'g-2',
      title: 'Powerlifting Squat & Bench Stations',
      category: 'Strength Training',
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'g-3',
      title: 'Cardio & Conditioning Floor',
      category: 'Cardio',
      imageUrl: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'g-4',
      title: 'Functional Movement & CrossFit Arena',
      category: 'CrossFit & Functional',
      imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'g-5',
      title: 'Karate & Self-Defence Practice Area',
      category: 'Karate Training',
      imageUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80'
    }
  ]);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCategory, setPhotoCategory] = useState('Weight Training');
  const [photoUrl, setPhotoUrl] = useState('');

  // Announcements state
  const [announcementText, setAnnouncementText] = useState(
    DEFAULT_APP_SETTINGS.announcement_banner || 'Welcome to Parshuram Fitness Club, Meerut! Morning: 5:30 AM – 10:00 AM | Evening: 5:00 PM – 10:00 PM'
  );
  const [holidayNotice, setHolidayNotice] = useState(
    BRAND.openingHours.holidayNotice || 'Holiday information: The gym informs members one day before a holiday.'
  );
  const [announcementSaved, setAnnouncementSaved] = useState(false);

  // Special Offers state
  const [offers, setOffers] = useState<any[]>([
    {
      id: 'off-1',
      title: 'Special Offer: Gym Bag',
      description: 'Complimentary high-durability gym bag provided with annual membership enrollment.',
      active: true,
      badge: 'Equipment Bonus'
    },
    {
      id: 'off-2',
      title: 'Term Membership Discount',
      description: 'Discounts available on 3-month, 6-month, and yearly packages.',
      active: true,
      badge: 'Seasonal Pricing'
    }
  ]);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerTitle, setOfferTitle] = useState('');
  const [offerDesc, setOfferDesc] = useState('');
  const [offerBadge, setOfferBadge] = useState('Promotion');

  // Video Form Modal
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoCategory, setNewVideoCategory] = useState('Form & Technique');
  const [newVideoDesc, setNewVideoDesc] = useState('');
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [videoError, setVideoError] = useState('');
  const [videoSaving, setVideoSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('pfg_user_token');
    if (!token) return;
    fetch('/api/admin/videos', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Could not load saved videos.');
        setVideos(data.videos);
      })
      .catch((error) => setVideoError(error.message));
  }, []);

  const extractYouTubeId = (value: string) => {
    try {
      const url = new URL(value.trim());
      if (!['http:', 'https:'].includes(url.protocol)) return null;
      const host = url.hostname.toLowerCase().replace(/^www\./, '');
      const segments = url.pathname.split('/').filter(Boolean);
      const id = host === 'youtu.be'
        ? segments[0]
        : ['youtube.com', 'm.youtube.com', 'youtube-nocookie.com'].includes(host)
          ? url.pathname === '/watch' ? url.searchParams.get('v') : ['embed', 'shorts', 'live', 'v'].includes(segments[0]) ? segments[1] : null
          : null;
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    } catch {
      return null;
    }
  };

  const resetVideoForm = () => {
    setEditingVideoId(null);
    setNewVideoTitle('');
    setNewVideoUrl('');
    setNewVideoCategory('Form & Technique');
    setNewVideoDesc('');
    setVideoError('');
  };

  const openVideoForm = (video?: YouTubeVideo) => {
    resetVideoForm();
    if (video) {
      setEditingVideoId(video.id);
      setNewVideoTitle(video.title);
      setNewVideoUrl(video.youtube_url);
      setNewVideoCategory(video.category);
      setNewVideoDesc(video.description);
    }
    setShowVideoModal(true);
  };

  // Exercise Form Modal
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [exName, setExName] = useState('');
  const [exCategory, setExCategory] = useState('chest');
  const [exEquipment, setExEquipment] = useState('');
  const [exInstructions, setExInstructions] = useState('');

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim() || !photoUrl.trim()) return;
    const newPhoto = {
      id: `photo-${Date.now()}`,
      title: photoTitle,
      category: photoCategory,
      imageUrl: photoUrl
    };
    setGalleryImages([newPhoto, ...galleryImages]);
    setShowPhotoModal(false);
    setPhotoTitle('');
    setPhotoUrl('');
  };

  const handleAddOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerTitle.trim() || !offerDesc.trim()) return;
    const newOffer = {
      id: `off-${Date.now()}`,
      title: offerTitle,
      description: offerDesc,
      active: true,
      badge: offerBadge
    };
    setOffers([newOffer, ...offers]);
    setShowOfferModal(false);
    setOfferTitle('');
    setOfferDesc('');
  };

  const handleSaveAnnouncements = (e: React.FormEvent) => {
    e.preventDefault();
    (api as any).store.settings.announcement_banner = announcementText;
    setAnnouncementSaved(true);
    setTimeout(() => setAnnouncementSaved(false), 3000);
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle.trim() || !newVideoCategory.trim() || !extractYouTubeId(newVideoUrl)) {
      setVideoError('Enter a title, category, and valid YouTube video URL.');
      return;
    }
    setVideoSaving(true);
    setVideoError('');
    try {
      const token = localStorage.getItem('pfg_user_token');
      const response = await fetch('/api/admin/videos', {
        method: editingVideoId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token || ''}` },
        body: JSON.stringify({ id: editingVideoId, title: newVideoTitle, youtube_url: newVideoUrl, category: newVideoCategory, description: newVideoDesc })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not save the video.');
      setVideos((current) => editingVideoId
        ? current.map((video) => video.id === data.video.id ? data.video : video)
        : [data.video, ...current]);
      setShowVideoModal(false);
      resetVideoForm();
    } catch (error: any) {
      setVideoError(error.message || 'Could not save the video.');
    } finally {
      setVideoSaving(false);
    }
  };

  const handleDeleteVideo = async (video: YouTubeVideo) => {
    if (!window.confirm(`Remove “${video.title}” from the saved video list?`)) return;
    try {
      const token = localStorage.getItem('pfg_user_token');
      const response = await fetch('/api/admin/videos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token || ''}` },
        body: JSON.stringify({ id: video.id })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not remove the video.');
      setVideos((current) => current.filter((item) => item.id !== video.id));
      setVideoError('');
    } catch (error: any) {
      setVideoError(error.message || 'Could not remove the video.');
    }
  };

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exName.trim()) return;

    const exercise: Exercise = {
      id: `ex-${Date.now()}`,
      name: exName,
      category: exCategory as any,
      difficulty: 'intermediate',
      equipment: exEquipment || 'Standard Barbell / Dumbbells',
      target_muscles: [exCategory],
      instructions: [exInstructions || 'Execute with tight core bracing and controlled tempo.'],
      common_mistakes: [],
      safety_notes: [],
      is_active: true,
      sets: '3-4',
      reps: '8-12',
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101B37] p-6 rounded-2xl border border-[#1E305C] shadow-xl">
        <div>
          <span className="text-xs uppercase font-bold text-[#D4AF37] tracking-wider">Owner Console</span>
          <h1 className="text-2xl font-black uppercase font-display text-white mt-0.5">
            Content, Media &amp; Offers Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Owner&apos;s direct control of gym photographs, announcements, special offers, exercise guides, and programs.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {activeTab === 'gallery' && (
            <button
              onClick={() => setShowPhotoModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black hover:bg-[#E5C158] text-xs uppercase tracking-wider transition-colors flex items-center space-x-1.5 shadow-md shadow-black/60"
            >
              <Plus className="w-4 h-4" />
              <span>Add Gym Photo</span>
            </button>
          )}
          {activeTab === 'offers' && (
            <button
              onClick={() => setShowOfferModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black hover:bg-[#E5C158] text-xs uppercase tracking-wider transition-colors flex items-center space-x-1.5 shadow-md shadow-black/60"
            >
              <Plus className="w-4 h-4" />
              <span>Add Special Offer</span>
            </button>
          )}
          {activeTab === 'videos' && (
            <button
              onClick={() => openVideoForm()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black hover:bg-[#E5C158] text-xs uppercase tracking-wider transition-colors flex items-center space-x-1.5 shadow-md shadow-black/60"
            >
              <Plus className="w-4 h-4" />
              <span>Add YouTube URL</span>
            </button>
          )}
          {activeTab === 'exercises' && (
            <button
              onClick={() => setShowExerciseModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black hover:bg-[#E5C158] text-xs uppercase tracking-wider transition-colors flex items-center space-x-1.5 shadow-md shadow-black/60"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Exercise</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1E305C] overflow-x-auto space-x-1">
        <button
          onClick={() => setActiveTab('gallery')}
          className={`py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center space-x-2 shrink-0 ${
            activeTab === 'gallery' ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Gym Photographs ({galleryImages.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center space-x-2 shrink-0 ${
            activeTab === 'announcements' ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Announcements &amp; Holidays</span>
        </button>
        <button
          onClick={() => setActiveTab('offers')}
          className={`py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center space-x-2 shrink-0 ${
            activeTab === 'offers' ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>Special Offers ({offers.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('exercises')}
          className={`py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center space-x-2 shrink-0 ${
            activeTab === 'exercises' ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          <span>Exercise Library ({exercises.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('diets')}
          className={`py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center space-x-2 shrink-0 ${
            activeTab === 'diets' ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Diet &amp; Nutrition ({diets.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center space-x-2 shrink-0 ${
            activeTab === 'videos' ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>YouTube Video Hub ({videos.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('programs')}
          className={`py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center space-x-2 shrink-0 ${
            activeTab === 'programs' ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Workout Programs ({programs.length})</span>
        </button>
      </div>

      {/* Gallery Tab View */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <div className="bg-[#0A1128] border border-[#1E305C] rounded-xl p-4 flex items-center space-x-3 text-xs text-slate-300">
            <Camera className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <span>
              <strong>Owner Asset Control:</strong> Upload and update photographs of Parshuram Fitness Club interior, equipment, and coach sessions to appear on the public floor gallery page.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((img) => (
              <div key={img.id} className="bg-[#101B37] rounded-2xl border border-[#1E305C] overflow-hidden shadow-xl flex flex-col justify-between">
                <div className="h-48 relative overflow-hidden bg-[#0A1128]">
                  <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#050B17]/90 text-[10px] font-bold uppercase text-[#D4AF37] border border-[#D4AF37]/40">
                    {img.category}
                  </span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase">{img.title}</span>
                  <button
                    onClick={() => setGalleryImages(galleryImages.filter((g) => g.id !== img.id))}
                    className="text-rose-400 hover:text-rose-300 text-xs font-bold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Announcements Tab View */}
      {activeTab === 'announcements' && (
        <form onSubmit={handleSaveAnnouncements} className="bg-[#101B37] rounded-2xl border border-[#1E305C] p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#1E305C] pb-3">
            <div>
              <h3 className="text-base font-bold uppercase font-display text-white">Website Announcement Banners</h3>
              <p className="text-xs text-slate-400">Controls the marquee ticker at the top of the website and holiday notification.</p>
            </div>
            {announcementSaved && (
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded bg-emerald-950 border border-emerald-600 text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Updated Live!</span>
              </div>
            )}
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Top Banner Marquee Announcement</label>
              <textarea
                rows={2}
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Holiday Notice Policy</label>
              <input
                type="text"
                value={holidayNotice}
                onChange={(e) => setHolidayNotice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default: &quot;Holiday information: The gym informs members one day before a holiday.&quot;</span>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black hover:bg-[#E5C158] text-xs uppercase tracking-wider transition-all flex items-center space-x-2 shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>Save Announcements</span>
          </button>
        </form>
      )}

      {/* Special Offers Tab View */}
      {activeTab === 'offers' && (
        <div className="space-y-6">
          <div className="bg-[#0A1128] border border-[#1E305C] rounded-xl p-4 flex items-center space-x-3 text-xs text-slate-300">
            <Gift className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <span>
              <strong>Owner Special Offers:</strong> Manage campaigns such as complimentary gym bags, seasonal discounts, and admission perks displayed on membership cards.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offers.map((offer) => (
              <div key={offer.id} className="bg-[#101B37] rounded-2xl border border-[#1E305C] p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#0A1128] border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-bold uppercase">
                      {offer.badge}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-emerald-400">
                      {offer.active ? 'Active on Website' : 'Paused'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase font-display mb-1">{offer.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{offer.description}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#1E305C] flex items-center justify-between">
                  <button
                    onClick={() => {
                      offer.active = !offer.active;
                      setOffers([...offers]);
                    }}
                    className="text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    Toggle {offer.active ? 'Pause' : 'Activate'}
                  </button>
                  <button
                    onClick={() => setOffers(offers.filter((o) => o.id !== offer.id))}
                    className="text-rose-400 hover:text-rose-300 text-xs font-bold"
                  >
                    Remove Offer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exercises Tab View */}
      {activeTab === 'exercises' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((ex) => (
            <div key={ex.id} className="bg-[#101B37] p-5 rounded-2xl border border-[#1E305C] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-[#D4AF37] px-2 py-0.5 rounded bg-[#D4AF37] text-[#050B17]/20 border border-[#D4AF37]/40">
                    {ex.category}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">{ex.difficulty}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{ex.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">{ex.instructions[0]}</p>
                <div className="text-[11px] text-slate-300">
                  <strong>Equipment:</strong> {ex.equipment}
                </div>
              </div>

              <div className="pt-4 border-t border-[#1E305C] flex items-center justify-between mt-4">
                <span className="text-xs text-slate-400">{ex.sets} Sets × {ex.reps}</span>
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
            <div key={diet.id} className="bg-[#101B37] p-5 rounded-2xl border border-[#1E305C] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                    {diet.target_goal}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">{diet.is_veg ? 'Vegetarian' : 'Non-vegetarian'}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{diet.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{diet.description}</p>
                <div className="bg-[#0A1128] p-3 rounded-lg border border-[#1E305C] text-xs space-y-1">
                  <div className="text-white font-bold">{diet.calories} Calories</div>
                  <div className="text-slate-400 text-[11px]">
                    P: {diet.protein_g}g • C: {diet.carbs_g}g • F: {diet.fat_g}g
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#1E305C] flex items-center justify-between mt-4">
                <span className="text-[10px] text-slate-400">{diet.meals?.length || 0} Meals Structured</span>
                <button
                  onClick={() => setDiets(diets.filter((d) => d.id !== diet.id))}
                  className="text-red-400 hover:text-red-300 text-xs font-bold"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Videos Tab View */}
      {activeTab === 'videos' && (
        <div className="space-y-4">
          {videoError && <p role="alert" className="rounded-xl border border-rose-700 bg-rose-950/40 px-4 py-3 text-sm text-rose-200">{videoError}</p>}
          {videos.length === 0 && <p className="rounded-xl border border-[#1E305C] bg-[#101B37] p-6 text-sm text-slate-300">No saved YouTube videos yet. Add a video URL to manage it here.</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((vid) => (
              <div key={vid.id} className="bg-[#101B37] rounded-2xl border border-[#1E305C] overflow-hidden">
                <div className="aspect-video w-full bg-[#0A1128]">
                  <iframe title={vid.title} src={`https://www.youtube.com/embed/${vid.youtube_id}`} className="w-full h-full" allowFullScreen />
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-bold text-[#D4AF37] uppercase">{vid.category}</span>
                  <h4 className="text-sm font-bold text-white mt-1">{vid.title}</h4>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{vid.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button onClick={() => openVideoForm(vid)} className="inline-flex items-center gap-1.5 rounded-lg border border-[#D4AF37]/50 px-3 py-2 text-xs font-bold text-[#D4AF37] hover:bg-[#D4AF37]/10">
                      <Pencil className="h-3.5 w-3.5" /> Edit details / URL
                    </button>
                    <button onClick={() => handleDeleteVideo(vid)} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-800 px-3 py-2 text-xs font-bold text-rose-300 hover:bg-rose-950/50">
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Programs Tab View */}
      {activeTab === 'programs' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {programs.map((prog) => (
            <div key={prog.id} className="bg-[#101B37] rounded-2xl border border-[#1E305C] overflow-hidden flex flex-col justify-between">
              <div>
                <div className="h-40 relative bg-[#0A1128]">
                  <img src={prog.cover_image} alt={prog.title} className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 bg-[#050B17]/90 text-[10px] font-bold uppercase text-[#D4AF37] px-2 py-0.5 rounded border border-[#1E305C]">
                    {prog.duration_weeks} Weeks
                  </span>
                </div>
                <div className="p-5">
                  <span className="text-[10px] font-bold uppercase text-slate-400">{prog.level}</span>
                  <h3 className="text-base font-bold text-white uppercase font-display mt-1">{prog.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{prog.description}</p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-[#1E305C] mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-400">{prog.days_per_week} Days/Week</span>
                <button
                  onClick={() => setPrograms(programs.filter((p) => p.id !== prog.id))}
                  className="text-red-400 hover:text-red-300 text-xs font-bold"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#101B37] border border-[#1E305C] rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#1E305C] pb-3 mb-4">
              <h3 className="text-base font-bold uppercase font-display text-white">Add Gym Photograph</h3>
              <button onClick={() => setShowPhotoModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPhoto} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Photo Title / Zone</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Free Weights & Dumbbell Floor"
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Category</label>
                <select
                  value={photoCategory}
                  onChange={(e) => setPhotoCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="Weight Training">Weight Training</option>
                  <option value="Strength Training">Strength Training</option>
                  <option value="Cardio">Cardio</option>
                  <option value="CrossFit & Functional">CrossFit &amp; Functional</option>
                  <option value="Karate Training">Karate Training</option>
                  <option value="Gym Interior">Gym Interior</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black hover:bg-[#E5C158] uppercase tracking-wider transition-colors"
              >
                Save Photograph to Gallery
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#101B37] border border-[#1E305C] rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#1E305C] pb-3 mb-4">
              <h3 className="text-base font-bold uppercase font-display text-white">Create Special Offer</h3>
              <button onClick={() => setShowOfferModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddOffer} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Offer Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Free Gym Bag with Yearly Plan"
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Badge / Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Special Offer / Equipment Bonus"
                  value={offerBadge}
                  onChange={(e) => setOfferBadge(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Offer details and membership terms..."
                  value={offerDesc}
                  onChange={(e) => setOfferDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black hover:bg-[#E5C158] uppercase tracking-wider transition-colors"
              >
                Publish Special Offer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#101B37] border border-[#1E305C] rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#1E305C] pb-3 mb-4">
              <h3 className="text-base font-bold uppercase font-display text-white">{editingVideoId ? 'Edit YouTube Video' : 'Add YouTube Video'}</h3>
              <button onClick={() => { setShowVideoModal(false); resetVideoForm(); }} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Video Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scapular Retraction Bench Press"
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">YouTube URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
                />
                {newVideoUrl && (extractYouTubeId(newVideoUrl)
                  ? <div className="mt-3 aspect-video overflow-hidden rounded-lg border border-[#1E305C] bg-black"><iframe title="YouTube video preview" src={`https://www.youtube.com/embed/${extractYouTubeId(newVideoUrl)}`} className="h-full w-full" allowFullScreen /></div>
                  : <p className="mt-1 text-rose-300">Enter a supported YouTube video URL to preview it.</p>)}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Category</label>
                <input
                  type="text"
                  value={newVideoCategory}
                  onChange={(e) => setNewVideoCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Description</label>
                <textarea rows={3} value={newVideoDesc} onChange={(e) => setNewVideoDesc(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none" />
              </div>

              {videoError && <p role="alert" className="text-rose-300">{videoError}</p>}

              <button
                type="submit"
                disabled={videoSaving}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black hover:bg-[#E5C158] uppercase tracking-wider transition-colors"
              >
                {videoSaving ? 'Saving…' : editingVideoId ? 'Save Video Changes' : 'Save Video'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Exercise Modal */}
      {showExerciseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#101B37] border border-[#1E305C] rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#1E305C] pb-3 mb-4">
              <h3 className="text-base font-bold uppercase font-display text-white">Add Exercise Guide</h3>
              <button onClick={() => setShowExerciseModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExercise} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Exercise Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Romanian Deadlift"
                  value={exName}
                  onChange={(e) => setExName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Category</label>
                  <select
                    value={exCategory}
                    onChange={(e) => setExCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
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
                  <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Equipment</label>
                  <input
                    type="text"
                    placeholder="Barbell / Dumbbell"
                    value={exEquipment}
                    onChange={(e) => setExEquipment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Execution Cues</label>
                <textarea
                  rows={3}
                  placeholder="Step by step execution cues..."
                  value={exInstructions}
                  onChange={(e) => setExInstructions(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black hover:bg-[#E5C158] uppercase tracking-wider transition-colors"
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
