'use client';

import React, { useState } from 'react';
import { PlayCircle, Search, Filter, Video, ExternalLink } from 'lucide-react';
import { INITIAL_YOUTUBE_VIDEOS, YouTubeVideo } from '@parshuram/shared';

export default function VideosPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeVideo, setActiveVideo] = useState<YouTubeVideo>(INITIAL_YOUTUBE_VIDEOS[0]);

  const categories = ['all', 'Form & Technique', 'Lower Body Strength', 'Compound Power', 'Cardio & Conditioning'];

  const filtered = INITIAL_YOUTUBE_VIDEOS.filter((v) => {
    const matchesCat = activeCategory === 'all' || v.category === activeCategory;
    const matchesQuery = v.title.toLowerCase().includes(search.toLowerCase()) || v.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="bg-gym-black text-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-gym-red">Video Demonstration Hub</span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase font-display text-white mt-2">
            YouTube Fitness Videos
          </h1>
          <p className="text-sm text-zinc-300 mt-4 leading-relaxed">
            Curated movement demonstrations and technique breakdowns. Watch verified lifting cues directly through official YouTube embeds.
          </p>
        </div>

        {/* Featured Video Player Box */}
        {activeVideo && (
          <div className="bg-gym-card rounded-2xl border border-gym-border overflow-hidden mb-12 shadow-2xl">
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtube_id}?rel=0&modestbranding=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
            <div className="p-6 bg-gym-charcoal flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-bold text-gym-red tracking-wider">{activeVideo.category}</span>
                <h3 className="text-xl font-bold uppercase font-display text-white mt-1">{activeVideo.title}</h3>
                <p className="text-xs text-zinc-400 mt-2 max-w-3xl leading-relaxed">{activeVideo.description}</p>
              </div>
              <a
                href={activeVideo.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-lg bg-gym-red hover:bg-gym-redHover text-white text-xs font-bold uppercase tracking-wider shrink-0 inline-flex items-center space-x-1.5 transition-colors"
              >
                <span>Open in YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Search & Categories */}
        <div className="bg-gym-card p-6 rounded-2xl border border-gym-border mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search fitness tutorials..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-gym-charcoal border border-gym-border text-white text-xs placeholder-zinc-500 focus:border-gym-red focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  activeCategory === c
                    ? 'bg-gym-red text-white'
                    : 'bg-gym-charcoal text-zinc-400 hover:text-white border border-gym-border'
                }`}
              >
                {c === 'all' ? 'All Videos' : c}
              </button>
            ))}
          </div>
        </div>

        {/* Video Thumbnails Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((video) => (
            <div
              key={video.id}
              onClick={() => {
                setActiveVideo(video);
                window.scrollTo({ top: 250, behavior: 'smooth' });
              }}
              className={`bg-gym-card rounded-xl border ${
                activeVideo?.id === video.id ? 'border-gym-red shadow-lg shadow-red-950/40' : 'border-gym-border'
              } overflow-hidden hover:border-gym-red/60 transition-all cursor-pointer group flex flex-col justify-between`}
            >
              <div>
                <div className="aspect-video relative overflow-hidden bg-gym-charcoal">
                  <img
                    src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <PlayCircle className="w-10 h-10 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                <div className="p-4">
                  <span className="text-[10px] uppercase font-bold text-gym-silver">{video.category}</span>
                  <h4 className="text-xs font-bold text-white uppercase font-display mt-1 line-clamp-2 group-hover:text-gym-red transition-colors">
                    {video.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                    {video.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 text-[10px] text-gym-red font-bold uppercase tracking-wider">
                Tap to Watch
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
