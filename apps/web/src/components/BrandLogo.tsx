'use client';

import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  variant?: 'navbar' | 'footer' | 'auth' | 'compact';
  className?: string;
}

export default function BrandLogo({ variant = 'navbar', className = '' }: BrandLogoProps) {
  // SVG Icon: The Divine Parshu (Battle Axe of Parshuram) combined with an Iron Barbell Plate Disc
  // Styled with Champagne Gold & Deep Navy for an international luxury fitness aesthetic
  const Emblem = ({ size = 40 }: { size?: number }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 group-hover:scale-105"
    >
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5E6B3" />
          <stop offset="45%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#997D29" />
        </linearGradient>
        <linearGradient id="navyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E305C" />
          <stop offset="100%" stopColor="#050B17" />
        </linearGradient>
      </defs>

      {/* Hexagonal Iron Shield Background */}
      <polygon
        points="50,4 90,26 90,74 50,96 10,74 10,26"
        fill="url(#navyGrad)"
        stroke="url(#goldGrad)"
        strokeWidth="3.5"
      />

      {/* Inner Concentric Disc Rim */}
      <circle cx="50" cy="50" r="32" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />

      {/* Symmetric Divine Axe Blades (Parshu) & Weight Bar Motif */}
      {/* Central Handle / Olympic Bar */}
      <rect x="47" y="18" width="6" height="64" rx="3" fill="url(#goldGrad)" />
      
      {/* Left Blade Curve */}
      <path
        d="M47 30 C30 30 22 42 22 52 C22 62 30 70 47 70 Z"
        fill="url(#goldGrad)"
        opacity="0.9"
      />
      {/* Left Inner Cutout */}
      <path
        d="M45 37 C34 37 29 44 29 51 C29 58 34 63 45 63 Z"
        fill="#0A1128"
      />

      {/* Right Counterbalance Blade Curve */}
      <path
        d="M53 30 C70 30 78 42 78 52 C78 62 70 70 53 70 Z"
        fill="url(#goldGrad)"
        opacity="0.9"
      />
      {/* Right Inner Cutout */}
      <path
        d="M55 37 C66 37 71 44 71 51 C71 58 66 63 55 63 Z"
        fill="#0A1128"
      />

      {/* Center Iron Hub */}
      <circle cx="50" cy="50" r="8" fill="#F1F5F9" stroke="url(#goldGrad)" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="3.5" fill="#0A1128" />

      {/* Divine Crown Points */}
      <polygon points="50,14 46,21 54,21" fill="url(#goldGrad)" />
      <polygon points="50,86 46,79 54,79" fill="url(#goldGrad)" />
    </svg>
  );

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-2.5 ${className}`}>
        <Emblem size={34} />
        <span className="font-display font-black text-white text-base tracking-wider uppercase">
          PARSHURAM
        </span>
      </div>
    );
  }

  if (variant === 'auth') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <div className="p-3 rounded-2xl bg-gradient-to-b from-[#101B37] to-[#0A1128] border border-[#1E305C] shadow-xl shadow-black/40 mb-3.5 inline-block">
          <Emblem size={56} />
        </div>
        <h2 className="font-display font-black text-2xl text-white tracking-wider uppercase">
          PARSHURAM <span className="text-[#D4AF37]">FITNESS</span>
        </h2>
        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#CBD5E1] mt-1 block">
          Divine Discipline • Elite Strength
        </span>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex items-center space-x-3.5 ${className}`}>
        <Emblem size={44} />
        <div>
          <span className="block font-display font-black text-xl text-white tracking-wider uppercase">
            PARSHURAM <span className="text-[#D4AF37]">FITNESS</span> GYM
          </span>
          <span className="block text-[11px] font-semibold text-[#CBD5E1] tracking-widest uppercase">
            Founded &amp; Directed by Dave • Elite Facility
          </span>
        </div>
      </div>
    );
  }

  // Navbar default
  return (
    <Link href="/" className={`flex items-center space-x-3.5 group shrink-0 ${className}`}>
      <Emblem size={42} />
      <div className="flex flex-col justify-center">
        <span className="font-display font-black text-base sm:text-lg tracking-wider text-white uppercase group-hover:text-[#D4AF37] transition-colors leading-tight">
          PARSHURAM <span className="text-[#D4AF37]">FITNESS</span> GYM
        </span>
        <span className="text-[9.5px] sm:text-[10px] tracking-[0.16em] text-[#CBD5E1] font-semibold uppercase leading-tight mt-0.5">
          Owner: Dave • Divine Discipline
        </span>
      </div>
    </Link>
  );
}
