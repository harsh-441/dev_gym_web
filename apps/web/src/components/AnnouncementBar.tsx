'use client';

import React from 'react';
import { Flame, ShieldAlert } from 'lucide-react';
import { BRAND, DEFAULT_APP_SETTINGS } from '@parshuram/shared';

export default function AnnouncementBar() {
  return (
    <div className="bg-gradient-to-r from-gym-charcoal via-gym-red to-gym-charcoal text-white text-xs font-semibold py-2 px-4 border-b border-gym-red/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Flame className="w-4 h-4 text-gym-silver animate-pulse" />
          <span>{BRAND.tagline}</span>
        </div>
        <div className="hidden md:flex items-center space-x-4 text-zinc-300">
          <span>Hours: {DEFAULT_APP_SETTINGS.opening_hours_weekdays}</span>
          <span className="text-gym-silver">|</span>
          <span className="text-white font-medium">Free Member Attendance Marking</span>
        </div>
      </div>
    </div>
  );
}
