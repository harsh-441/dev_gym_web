import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="bg-gradient-to-r from-[#050B17] via-[#101B37] to-[#050B17] text-slate-200 text-xs font-semibold py-2 px-4 border-b border-[#1E305C]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 truncate">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 animate-pulse" />
          <span className="truncate">
            <strong className="text-[#D4AF37]">Parshuram Fitness Gym:</strong> Zero Admission Fees • 100% Free Daily Attendance Tracking for all Athletes
          </span>
        </div>
        <Link
          href="/pricing"
          className="hidden sm:inline-flex items-center space-x-1 text-[#D4AF37] hover:underline text-[11px] font-bold uppercase tracking-wider shrink-0 ml-4"
        >
          <span>View Plans</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
