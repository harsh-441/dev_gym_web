'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BRAND } from '@parshuram/shared';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gym-black flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-1 bg-gym-red mb-6"></div>
      <h1 className="text-6xl font-black text-white mb-2">404</h1>
      <h2 className="text-xl font-bold uppercase tracking-widest text-zinc-300 mb-4">
        Page Not Found
      </h2>
      <p className="text-zinc-500 text-sm max-w-md mb-8">
        The path you are trying to access does not exist in {BRAND.name}. Return to discipline.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-gym-red hover:bg-gym-redHover text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>
    </div>
  );
}
