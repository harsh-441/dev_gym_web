import React from 'react';
import Link from 'next/link';
import { BRAND, DEFAULT_APP_SETTINGS } from '@parshuram/shared';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gym-charcoal border-t border-gym-border text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-9 h-9 rounded bg-gym-red flex items-center justify-center font-black text-white">
                PFG
              </div>
              <span className="font-display font-black text-lg text-white uppercase tracking-wider">
                {BRAND.name}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mb-4 italic">
              &quot;{BRAND.tagline}&quot;
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Founded and managed by Dave. A state-of-the-art strength and conditioning facility where ancient discipline meets cutting-edge sports science.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold uppercase text-xs tracking-wider mb-4 border-l-2 border-gym-red pl-2">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/programs" className="hover:text-gym-red transition-colors">Workout Programs</Link></li>
              <li><Link href="/exercises" className="hover:text-gym-red transition-colors">Exercise Library (30+ Movements)</Link></li>
              <li><Link href="/nutrition" className="hover:text-gym-red transition-colors">Indian Diet & Nutrition</Link></li>
              <li><Link href="/ai-planner" className="hover:text-gym-red transition-colors">AI Personalized Fitness Planner</Link></li>
              <li><Link href="/videos" className="hover:text-gym-red transition-colors">YouTube Video Workouts</Link></li>
              <li><Link href="/transformations" className="hover:text-gym-red transition-colors">Member Transformations</Link></li>
            </ul>
          </div>

          {/* Operating Hours & Policy */}
          <div>
            <h4 className="text-white font-bold uppercase text-xs tracking-wider mb-4 border-l-2 border-gym-red pl-2">
              Facility Hours
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-gym-red shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-semibold">Monday – Saturday</p>
                  <p className="text-zinc-400">{DEFAULT_APP_SETTINGS.opening_hours_weekdays}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-gym-silver shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-semibold">Sunday</p>
                  <p className="text-zinc-400">{DEFAULT_APP_SETTINGS.opening_hours_weekends}</p>
                </div>
              </div>
              <div className="pt-2 text-[11px] text-zinc-400 border-t border-gym-border">
                <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-emerald-500" />
                Attendance marking is 100% free for all authorized members and staff.
              </div>
            </div>
          </div>

          {/* Contact (Placeholders clearly identified) */}
          <div>
            <h4 className="text-white font-bold uppercase text-xs tracking-wider mb-4 border-l-2 border-gym-red pl-2">
              Gym Location & Contact
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gym-red shrink-0 mt-0.5" />
                <p className="text-zinc-300">{DEFAULT_APP_SETTINGS.address_line1}, {DEFAULT_APP_SETTINGS.city}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gym-red shrink-0" />
                <p className="text-zinc-300">{DEFAULT_APP_SETTINGS.contact_phone}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gym-red shrink-0" />
                <p className="text-zinc-300">{DEFAULT_APP_SETTINGS.contact_email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gym-border mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved. Owner: {BRAND.owner}.</p>
          <p className="mt-2 md:mt-0 flex items-center">
            Built for Strength &amp; Discipline with modern multi-platform technology.
          </p>
        </div>
      </div>
    </footer>
  );
}
