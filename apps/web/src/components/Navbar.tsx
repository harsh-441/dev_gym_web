'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Shield,
  Dumbbell,
  UserCheck,
  Lock,
  Sparkles,
  ChevronDown,
  Flame,
  BookOpen,
  PlayCircle,
  Users,
  Utensils,
  ArrowRight
} from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trainingDropdownOpen, setTrainingDropdownOpen] = useState(false);
  const [nutritionDropdownOpen, setNutritionDropdownOpen] = useState(false);
  const [portalsDropdownOpen, setPortalsDropdownOpen] = useState(false);
  const pathname = usePathname();

  const isTrainingActive = ['/programs', '/exercises', '/videos', '/trainers'].includes(pathname);
  const isNutritionActive = ['/nutrition', '/ai-planner'].includes(pathname);
  const isPortalActive = ['/admin', '/portal/member', '/portal/employee', '/auth/login', '/auth/register'].some((p) => pathname.startsWith(p));

  return (
    <nav className="sticky top-0 z-50 bg-[#050B17]/95 backdrop-blur-md border-b border-[#1E305C] shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo with Divine Parshu & Disc Emblem */}
          <div className="shrink-0 flex items-center">
            <BrandLogo variant="navbar" />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            <Link
              href="/"
              className={`px-3.5 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all ${
                pathname === '/' ? 'text-white bg-[#101B37] font-bold border border-[#1E305C]' : 'text-slate-300 hover:text-white hover:bg-[#101B37]/60'
              }`}
            >
              Home
            </Link>

            <Link
              href="/about"
              className={`px-3.5 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all ${
                pathname === '/about' ? 'text-white bg-[#101B37] font-bold border border-[#1E305C]' : 'text-slate-300 hover:text-white hover:bg-[#101B37]/60'
              }`}
            >
              About
            </Link>

            {/* Training Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setTrainingDropdownOpen(true)}
              onMouseLeave={() => setTrainingDropdownOpen(false)}
            >
              <button
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all ${
                  isTrainingActive ? 'text-white bg-[#101B37] font-bold border border-[#1E305C]' : 'text-slate-300 hover:text-white hover:bg-[#101B37]/60'
                }`}
              >
                <span>Training</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37]" />
              </button>

              {trainingDropdownOpen && (
                <div className="absolute left-0 mt-1 w-56 bg-[#0A1128] border border-[#1E305C] rounded-xl shadow-2xl py-2 z-50">
                  <Link
                    href="/programs"
                    onClick={() => setTrainingDropdownOpen(false)}
                    className="flex items-center px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-[#101B37] hover:text-white"
                  >
                    <Flame className="w-4 h-4 mr-2.5 text-[#D4AF37]" />
                    <span>Workout Programs</span>
                  </Link>
                  <Link
                    href="/exercises"
                    onClick={() => setTrainingDropdownOpen(false)}
                    className="flex items-center px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-[#101B37] hover:text-white"
                  >
                    <BookOpen className="w-4 h-4 mr-2.5 text-[#D4AF37]" />
                    <span>Exercise Library</span>
                  </Link>
                  <Link
                    href="/videos"
                    onClick={() => setTrainingDropdownOpen(false)}
                    className="flex items-center px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-[#101B37] hover:text-white"
                  >
                    <PlayCircle className="w-4 h-4 mr-2.5 text-[#D4AF37]" />
                    <span>Video Workouts</span>
                  </Link>
                  <Link
                    href="/trainers"
                    onClick={() => setTrainingDropdownOpen(false)}
                    className="flex items-center px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-[#101B37] hover:text-white border-t border-[#1E305C]"
                  >
                    <Users className="w-4 h-4 mr-2.5 text-[#D4AF37]" />
                    <span>Meet Our Coaches</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Nutrition Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setNutritionDropdownOpen(true)}
              onMouseLeave={() => setNutritionDropdownOpen(false)}
            >
              <button
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all ${
                  isNutritionActive ? 'text-white bg-[#101B37] font-bold border border-[#1E305C]' : 'text-slate-300 hover:text-white hover:bg-[#101B37]/60'
                }`}
              >
                <span>Nutrition &amp; AI</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37]" />
              </button>

              {nutritionDropdownOpen && (
                <div className="absolute left-0 mt-1 w-60 bg-[#0A1128] border border-[#1E305C] rounded-xl shadow-2xl py-2 z-50">
                  <Link
                    href="/nutrition"
                    onClick={() => setNutritionDropdownOpen(false)}
                    className="flex items-center px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-[#101B37] hover:text-white"
                  >
                    <Utensils className="w-4 h-4 mr-2.5 text-[#D4AF37]" />
                    <span>Indian Diet Protocols</span>
                  </Link>
                  <Link
                    href="/ai-planner"
                    onClick={() => setNutritionDropdownOpen(false)}
                    className="flex items-center px-4 py-2.5 text-xs font-semibold bg-[#101B37]/80 text-[#D4AF37] border-l-2 border-[#D4AF37] hover:bg-[#17254A]"
                  >
                    <Sparkles className="w-4 h-4 mr-2.5 text-[#D4AF37]" />
                    <span>AI Personalized Planner</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/pricing"
              className={`px-3.5 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all ${
                pathname === '/pricing' ? 'text-white bg-[#101B37] font-bold border border-[#1E305C]' : 'text-slate-300 hover:text-white hover:bg-[#101B37]/60'
              }`}
            >
              Pricing
            </Link>

            <Link
              href="/transformations"
              className={`px-3.5 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all ${
                pathname === '/transformations' ? 'text-white bg-[#101B37] font-bold border border-[#1E305C]' : 'text-slate-300 hover:text-white hover:bg-[#101B37]/60'
              }`}
            >
              Hall of Fame
            </Link>

            <Link
              href="/contact"
              className={`px-3.5 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all ${
                pathname === '/contact' ? 'text-white bg-[#101B37] font-bold border border-[#1E305C]' : 'text-slate-300 hover:text-white hover:bg-[#101B37]/60'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Action Hub & Portals */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Portals Access Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setPortalsDropdownOpen(true)}
              onMouseLeave={() => setPortalsDropdownOpen(false)}
            >
              <button className="flex items-center space-x-2 text-xs uppercase tracking-wider font-bold bg-[#101B37] text-slate-200 border border-[#1E305C] px-4 py-2.5 rounded-xl hover:border-[#D4AF37]/50 hover:text-white transition-all shadow-md">
                <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Portals</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {portalsDropdownOpen && (
                <div className="absolute right-0 mt-1 w-64 bg-[#0A1128] border border-[#1E305C] rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Direct Portals
                  </div>
                  <Link
                    href="/admin"
                    onClick={() => setPortalsDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-xs font-semibold text-white hover:bg-[#101B37] hover:text-[#D4AF37] transition-colors"
                  >
                    <Shield className="w-4 h-4 mr-2.5 text-[#D4AF37]" />
                    <div>
                      <span className="block font-bold">Dave Owner Dashboard</span>
                      <span className="text-[10px] text-slate-400 font-normal">Attendance QR, Roster, Leaves</span>
                    </div>
                  </Link>
                  <Link
                    href="/portal/employee"
                    onClick={() => setPortalsDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-xs font-semibold text-white hover:bg-[#101B37] hover:text-[#D4AF37] transition-colors"
                  >
                    <UserCheck className="w-4 h-4 mr-2.5 text-slate-300" />
                    <div>
                      <span className="block font-bold">Staff &amp; Coach Terminal</span>
                      <span className="text-[10px] text-slate-400 font-normal">Shift Clock-In &amp; Leaves</span>
                    </div>
                  </Link>
                  <Link
                    href="/portal/member"
                    onClick={() => setPortalsDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-xs font-semibold text-white hover:bg-[#101B37] hover:text-[#D4AF37] transition-colors"
                  >
                    <Dumbbell className="w-4 h-4 mr-2.5 text-slate-300" />
                    <div>
                      <span className="block font-bold">Member Athlete Hub</span>
                      <span className="text-[10px] text-slate-400 font-normal">Free QR Check-in &amp; Workouts</span>
                    </div>
                  </Link>
                  <div className="my-1 border-t border-[#1E305C]" />
                  <Link
                    href="/auth/login"
                    onClick={() => setPortalsDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-xs font-bold text-[#D4AF37] hover:bg-[#101B37]"
                  >
                    <Lock className="w-4 h-4 mr-2.5" />
                    <span>Sign In to Account</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Join Button */}
            <Link
              href="/auth/register"
              className="bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#E5C158] hover:to-[#D4AF37] text-[#050B17] text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-md shadow-black/60 hover:scale-105"
            >
              Join Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <Link
              href="/auth/login"
              className="px-3 py-1.5 rounded-lg bg-[#101B37] border border-[#1E305C] text-xs font-bold text-[#D4AF37]"
            >
              Sign In
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#101B37] border border-[#1E305C] text-slate-300 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A1128] border-b border-[#1E305C] px-4 pt-4 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-lg bg-[#101B37] text-white hover:bg-[#17254A]"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-lg bg-[#101B37] text-white hover:bg-[#17254A]"
            >
              About Dave &amp; Gym
            </Link>
            <Link
              href="/programs"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-lg bg-[#101B37] text-white hover:bg-[#17254A]"
            >
              Workout Programs
            </Link>
            <Link
              href="/exercises"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-lg bg-[#101B37] text-white hover:bg-[#17254A]"
            >
              Exercise Library
            </Link>
            <Link
              href="/videos"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-lg bg-[#101B37] text-white hover:bg-[#17254A]"
            >
              Video Workouts
            </Link>
            <Link
              href="/trainers"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-lg bg-[#101B37] text-white hover:bg-[#17254A]"
            >
              Meet Our Coaches
            </Link>
            <Link
              href="/nutrition"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-lg bg-[#101B37] text-white hover:bg-[#17254A]"
            >
              Diet Plans
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-lg bg-[#101B37] text-white hover:bg-[#17254A]"
            >
              Memberships
            </Link>
          </div>

          <Link
            href="/ai-planner"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-3 rounded-xl text-xs font-bold text-[#D4AF37] bg-[#101B37] border border-[#1E305C]"
          >
            <Sparkles className="w-4 h-4 inline mr-2 text-[#D4AF37]" />
            AI Personalized Fitness &amp; Nutrition Planner
          </Link>

          <div className="pt-3 border-t border-[#1E305C] space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block px-1">
              Protected Portals
            </span>
            <div className="grid grid-cols-3 gap-2 text-[11px] font-bold text-center">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-[#101B37] text-white border border-[#1E305C]"
              >
                Owner Panel
              </Link>
              <Link
                href="/portal/employee"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-[#101B37] text-white border border-[#1E305C]"
              >
                Staff Clock
              </Link>
              <Link
                href="/portal/member"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-[#101B37] text-white border border-[#1E305C]"
              >
                Member Hub
              </Link>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/auth/register"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-3 rounded-xl text-center text-xs font-black uppercase tracking-wider text-[#050B17] bg-gradient-to-r from-[#D4AF37] to-[#B38F24]"
            >
              Join Parshuram Gym Today
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
