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
    <div className="min-h-screen bg-gym-black flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-1 bg-gym-red mb-6"></div>
      <h1 className="text-4xl font-black text-white mb-2">Something Went Wrong</h1>
      <p className="text-zinc-500 text-sm max-w-md mb-8">
        An unexpected error occurred in the system. {error?.message || ''}
      </p>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 rounded-xl bg-gym-red hover:bg-gym-redHover text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2"
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
