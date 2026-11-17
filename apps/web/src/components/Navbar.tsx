'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Shield, Dumbbell, UserCheck, Lock, Sparkles, ChevronDown } from 'lucide-react';
import { BRAND } from '@parshuram/shared';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalsDropdownOpen, setPortalsDropdownOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Trainers', href: '/trainers' },
    { label: 'Programs', href: '/programs' },
    { label: 'Exercises', href: '/exercises' },
    { label: 'Nutrition', href: '/nutrition' },
    { label: 'AI Planner', href: '/ai-planner', highlight: true },
    { label: 'Videos', href: '/videos' },
    { label: 'Plans', href: '/pricing' },
    { label: 'Contact', href: '/contact' }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gym-black/95 backdrop-blur-md border-b border-gym-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with Indian Parshu (Divine Axe) Aesthetic Treatment */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-gym-red via-[#B51015] to-zinc-950 flex items-center justify-center border border-gym-red/60 shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-xl font-black text-white tracking-widest">PFG</span>
            </div>
            <div>
              <span className="block text-lg font-black tracking-wider text-white font-display uppercase group-hover:text-gym-red transition-colors">
                {BRAND.name}
              </span>
              <span className="block text-[10px] tracking-widest text-gym-silver font-semibold uppercase">
                Owner: {BRAND.owner}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs uppercase tracking-wider font-semibold transition-all px-2.5 py-1.5 rounded-md ${
                    link.highlight
                      ? 'bg-gradient-to-r from-gym-red/30 to-red-900/40 text-red-200 border border-gym-red/50 hover:bg-gym-red hover:text-white'
                      : isActive
                      ? 'text-gym-red border-b-2 border-gym-red font-bold'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.highlight && <Sparkles className="w-3.5 h-3.5 inline mr-1 text-gym-silver" />}
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Portals & Actions (Dave Admin, Member, Employee) */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="relative">
              <button
                onClick={() => setPortalsDropdownOpen(!portalsDropdownOpen)}
                className="flex items-center space-x-1.5 text-xs uppercase tracking-wider font-semibold bg-gym-charcoal text-gym-silver border border-gym-border px-3.5 py-2 rounded-md hover:border-gym-red/60 hover:text-white transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-gym-red" />
                <span>Portals</span>
                <ChevronDown className="w-3 h-3 ml-1" />
              </button>

              {portalsDropdownOpen && (
                <div
                  onMouseLeave={() => setPortalsDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-56 bg-gym-charcoal border border-gym-border rounded-lg shadow-2xl py-2 z-50"
                >
                  <Link
                    href="/admin"
                    onClick={() => setPortalsDropdownOpen(false)}
                    className="flex items-center px-4 py-2.5 text-xs font-semibold text-white hover:bg-gym-red/20 hover:text-gym-red"
                  >
                    <Shield className="w-4 h-4 mr-2.5 text-gym-red" />
                    Dave Admin Dashboard
                  </Link>
                  <Link
                    href="/portal/member"
                    onClick={() => setPortalsDropdownOpen(false)}
                    className="flex items-center px-4 py-2.5 text-xs font-semibold text-white hover:bg-gym-red/20 hover:text-gym-red"
                  >
                    <Dumbbell className="w-4 h-4 mr-2.5 text-gym-silver" />
                    Member Portal
                  </Link>
                  <Link
                    href="/portal/employee"
                    onClick={() => setPortalsDropdownOpen(false)}
                    className="flex items-center px-4 py-2.5 text-xs font-semibold text-white hover:bg-gym-red/20 hover:text-gym-red"
                  >
                    <UserCheck className="w-4 h-4 mr-2.5 text-gym-silver" />
                    Employee / Trainer Portal
                  </Link>
                  <div className="border-t border-gym-border my-1" />
                  <Link
                    href="/auth/login"
                    onClick={() => setPortalsDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-xs text-zinc-400 hover:text-white"
                  >
                    Sign In / Switch Role
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/pricing"
              className="bg-gym-red hover:bg-gym-redHover text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-md transition-all shadow-md shadow-red-900/40"
            >
              Join Now
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-zinc-300 hover:text-white p-2 rounded-md bg-gym-charcoal border border-gym-border"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gym-charcoal border-b border-gym-border px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-semibold text-zinc-300 hover:text-white hover:bg-gym-card"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-gym-border pt-4 mt-2 space-y-2">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-bold text-gym-red hover:bg-gym-card flex items-center"
            >
              <Shield className="w-4 h-4 mr-2" /> Dave Admin Dashboard
            </Link>
            <Link
              href="/portal/member"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-semibold text-zinc-300 hover:bg-gym-card flex items-center"
            >
              <Dumbbell className="w-4 h-4 mr-2" /> Member Portal
            </Link>
            <Link
              href="/portal/employee"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-semibold text-zinc-300 hover:bg-gym-card flex items-center"
            >
              <UserCheck className="w-4 h-4 mr-2" /> Employee & Trainer Portal
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
