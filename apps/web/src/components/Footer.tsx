'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, MapPin, Phone, Mail, Instagram, Youtube, Facebook, ShieldCheck } from 'lucide-react';
import { BRAND, DEFAULT_APP_SETTINGS } from '@parshuram/shared';
import BrandLogo from './BrandLogo';

export default function Footer() {
  return (
    <footer className="bg-[#050B17] border-t border-[#1E305C] text-slate-300 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <BrandLogo variant="footer" />
            <p className="text-xs text-slate-400 leading-relaxed">
              {BRAND.tagline} Guided by owner Dave, we combine raw barbell discipline, athletic biomechanics, and Indian nutritional science to help you build lifetime strength.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <span className="p-2 rounded-lg bg-[#101B37] text-[#D4AF37] hover:bg-[#17254A] cursor-pointer transition-colors border border-[#1E305C]">
                <Instagram className="w-4 h-4" />
              </span>
              <span className="p-2 rounded-lg bg-[#101B37] text-[#D4AF37] hover:bg-[#17254A] cursor-pointer transition-colors border border-[#1E305C]">
                <Youtube className="w-4 h-4" />
              </span>
              <span className="p-2 rounded-lg bg-[#101B37] text-[#D4AF37] hover:bg-[#17254A] cursor-pointer transition-colors border border-[#1E305C]">
                <Facebook className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Training & Science */}
          <div>
            <h4 className="text-white font-bold uppercase text-xs tracking-wider mb-4 border-l-2 border-[#D4AF37] pl-2.5">
              Training &amp; Nutrition
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/programs" className="hover:text-[#D4AF37] transition-colors">Workout Programs</Link></li>
              <li><Link href="/exercises" className="hover:text-[#D4AF37] transition-colors">Exercise Guide (30+ Cues)</Link></li>
              <li><Link href="/nutrition" className="hover:text-[#D4AF37] transition-colors">Indian Diet &amp; Nutrition</Link></li>
              <li><Link href="/ai-planner" className="hover:text-[#D4AF37] transition-colors">AI Personalized Fitness Planner</Link></li>
              <li><Link href="/videos" className="hover:text-[#D4AF37] transition-colors">YouTube Video Workouts</Link></li>
              <li><Link href="/trainers" className="hover:text-[#D4AF37] transition-colors">Meet Our Coaches</Link></li>
              <li><Link href="/transformations" className="hover:text-[#D4AF37] transition-colors">Member Transformations</Link></li>
            </ul>
          </div>

          {/* Operational Hours */}
          <div>
            <h4 className="text-white font-bold uppercase text-xs tracking-wider mb-4 border-l-2 border-[#D4AF37] pl-2.5">
              Gym Facility Hours
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-white">Monday – Saturday</span>
                  <span className="text-slate-400">{DEFAULT_APP_SETTINGS.opening_hours_weekdays}</span>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-white">Sunday</span>
                  <span className="text-slate-400">{DEFAULT_APP_SETTINGS.opening_hours_weekends}</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#101B37] border border-[#1E305C] text-[11px] text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 inline mr-1.5" />
                <span>100% Free daily attendance for all registered members.</span>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold uppercase text-xs tracking-wider mb-4 border-l-2 border-[#D4AF37] pl-2.5">
              Contact &amp; Location
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-slate-400">{DEFAULT_APP_SETTINGS.address_line1}, {DEFAULT_APP_SETTINGS.city}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span className="text-slate-400">{DEFAULT_APP_SETTINGS.contact_phone}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span className="text-slate-400">{DEFAULT_APP_SETTINGS.contact_email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-[#1E305C] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} {BRAND.name}. Directed by Dave. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login" className="hover:text-white transition-colors">Staff &amp; Member Login</Link>
            <span>•</span>
            <Link href="/admin" className="hover:text-white transition-colors">Owner Console</Link>
            <span>•</span>
            <Link href="/pricing" className="text-[#D4AF37] hover:underline">Membership Pricing</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
