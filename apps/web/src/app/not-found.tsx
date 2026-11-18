'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BRAND } from '@parshuram/shared';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050B17] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-1 bg-[#D4AF37] mb-6"></div>
      <h1 className="text-6xl font-black text-white mb-2">404</h1>
      <h2 className="text-xl font-bold uppercase tracking-widest text-zinc-300 mb-4">
        Page Not Found
      </h2>
      <p className="text-zinc-400 text-sm max-w-md mb-8">
        The path you are trying to access does not exist in {BRAND.name}. Return to discipline.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#E5C158] hover:to-[#D4AF37] text-[#050B17] text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>
    </div>
  );
}
