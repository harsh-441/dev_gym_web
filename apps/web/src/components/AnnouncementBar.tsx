'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Phone } from 'lucide-react';
import { BRAND } from '@parshuram/shared';

export default function AnnouncementBar() {
  return (
    <div className="bg-gradient-to-r from-[#050B17] via-[#101B37] to-[#050B17] text-slate-200 text-xs font-semibold py-2 px-4 border-b border-[#1E305C]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 truncate">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 animate-pulse" />
          <span className="truncate">
            <strong className="text-[#D4AF37]">{BRAND.name}:</strong> Est. 2016 in Meerut • Morning 5:30–10:00 AM &amp; Evening 5:00–10:00 PM • 100% Free Daily Attendance Tracking
          </span>
        </div>
        <div className="flex items-center space-x-4 shrink-0 ml-4">
          <a
            href="tel:9897191013"
            className="hidden md:inline-flex items-center space-x-1 text-slate-300 hover:text-white text-[11px]"
          >
            <Phone className="w-3 h-3 text-[#D4AF37]" />
            <span>9897191013</span>
          </a>
          <Link
            href="/pricing"
            className="hidden sm:inline-flex items-center space-x-1 text-[#D4AF37] hover:underline text-[11px] font-bold uppercase tracking-wider"
          >
            <span>Plans from ₹500</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
