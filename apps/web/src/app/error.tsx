'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { BRAND } from '@parshuram/shared';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#050B17] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-1 bg-[#D4AF37] mb-6"></div>
      <h1 className="text-4xl font-black text-white mb-2">Something Went Wrong</h1>
      <p className="text-zinc-500 text-sm max-w-md mb-8">
        An unexpected error occurred in the system. {error?.message || ''}
      </p>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#E5C158] hover:to-[#D4AF37] text-[#050B17] text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
