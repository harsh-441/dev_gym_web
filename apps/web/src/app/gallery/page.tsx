'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Camera, Image as ImageIcon, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { BRAND } from '@parshuram/shared';

export default function GalleryPage() {
  const [filter, setFilter] = useState<'all' | 'equipment' | 'strength' | 'karate'>('all');

  const galleryPlaceholders = [
    {
      id: 'g-1',
      title: 'Strength & Free Weights Area',
      category: 'equipment',
      desc: 'Olympic standard barbells, calibrated iron plates, and heavy dumbbell racks.',
      tag: 'Weight Training',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'g-2',
      title: 'Powerlifting Squat & Bench Stations',
      category: 'strength',
      desc: 'Dedicated heavy lifting stations for compound development with spotter arms.',
      tag: 'Strength Training',
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'g-3',
      title: 'Cardio & Conditioning Floor',
      category: 'equipment',
      desc: 'Modern electronic treadmills and cycles for cardiovascular stamina.',
      tag: 'Cardio',
      imageUrl: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'g-4',
      title: 'Functional Movement & CrossFit Arena',
      category: 'strength',
      desc: 'Open floor space for battle ropes, plyometrics, kettlebells, and agility drills.',
      tag: 'Functional Training',
      imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'g-5',
      title: 'Karate & Martial Arts Training Arena',
      category: 'karate',
      desc: 'Disciplined practice floor for traditional Karate Kata, Kumite, and self-defence.',
      tag: 'Karate Training',
      imageUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'g-6',
      title: 'Personal Coaching & Form Evaluation',
      category: 'strength',
      desc: 'One-on-one biomechanical form coaching and progressive overload instruction.',
      tag: 'Coaching',
      imageUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const filteredItems = filter === 'all'
    ? galleryPlaceholders
    : galleryPlaceholders.filter((item) => item.category === filter);

  return (
    <div className="bg-[#050B17] text-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            Visual Facility Showcase
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase font-display text-white mt-2">
            Gym Gallery &amp; Floor
          </h1>
          <p className="text-sm text-slate-300 mt-4 leading-relaxed">
            Take a visual tour of {BRAND.name}. Below are our facility layouts and training sections. High-resolution gallery photographs will be updated directly by management.
          </p>
        </div>

        {/* Real photo notice banner */}
        <div className="bg-[#101B37] border border-[#1E305C] rounded-2xl p-4 mb-10 max-w-2xl mx-auto flex items-center space-x-3 text-xs text-slate-300 shadow-lg">
          <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0" />
          <span>
            <strong>Asset Notice:</strong> High-resolution actual photos of Parshuram Fitness Club interior, equipment, and coach sessions are being prepared and will be uploaded via the Owner Console.
          </span>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {[
            { id: 'all', label: 'All Floor Views' },
            { id: 'equipment', label: 'Equipment & Cardio' },
            { id: 'strength', label: 'Strength & CrossFit' },
            { id: 'karate', label: 'Karate & Martial Arts' }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                filter === btn.id
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] shadow-lg shadow-black/50 font-black'
                  : 'bg-[#101B37] text-slate-300 hover:text-white border border-[#1E305C]'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#101B37] rounded-2xl border border-[#1E305C] overflow-hidden shadow-xl hover:border-[#D4AF37]/60 transition-all group"
            >
              <div className="relative h-64 overflow-hidden bg-[#0A1128]">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050B17] via-transparent to-transparent opacity-80" />
                <div className="absolute top-3 left-3 bg-[#050B17]/90 border border-[#D4AF37]/50 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                  {item.tag}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold uppercase font-display text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Visit CTA */}
        <div className="bg-[#0A1128] rounded-2xl border border-[#1E305C] p-8 text-center max-w-xl mx-auto shadow-2xl">
          <h3 className="text-xl font-bold uppercase font-display text-white mb-2">
            Experience the Floor in Person
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-6">
            Located in Ram Katori Wali Gali, Near Meerut City Public School. Open Monday to Saturday morning and evening.
          </p>
          <Link
            href="/contact"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black hover:bg-[#E5C158] text-xs uppercase tracking-wider transition-all inline-flex items-center justify-center space-x-1.5"
          >
            <span>Get Directions to Gym</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
