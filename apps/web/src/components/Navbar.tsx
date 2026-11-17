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
import { BRAND } from '@parshuram/shared';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trainingDropdownOpen, setTrainingDropdownOpen] = useState(false);
  const [nutritionDropdownOpen, setNutritionDropdownOpen] = useState(false);
  const [portalsDropdownOpen, setPortalsDropdownOpen] = useState(false);
  const pathname = usePathname();

  const isTrainingActive = ['/programs', '/exercises', '/videos', '/trainers'].includes(pathname);
  const isNutritionActive = ['/nutrition', '/ai-planner'].includes(pathname);

  return (
    <nav className="sticky top-0 z-50 bg-[#080808]/95 backdrop-blur-md border-b border-[#242424]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with Athletic Brand Identity */}
          <Link href="/" className="flex items-center space-x-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gym-red via-[#B31317] to-black flex items-center justify-center border border-gym-red/50 shadow-md shadow-red-950/40 group-hover:scale-105 transition-transform">
              <span className="text-base font-black text-white tracking-widest font-display">PFG</span>
            </div>
            <div>
              <span className="block text-base sm:text-lg font-black tracking-wider text-white font-display uppercase group-hover:text-gym-red transition-colors">
                {BRAND.name}
              </span>
              <span className="block text-[10px] tracking-widest text-zinc-400 font-semibold uppercase">
                Owner: {BRAND.owner} • Elite Facility
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all ${
                pathname === '/' ? 'text-white bg-white/10 font-bold' : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </Link>

            <Link
              href="/about"
              className={`px-3 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all ${
                pathname === '/about' ? 'text-white bg-white/10 font-bold' : 'text-zinc-300 hover:text-white hover:bg-white/5'
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
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all ${
                  isTrainingActive ? 'text-white bg-white/10 font-bold' : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Training</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {trainingDropdownOpen && (
                <div className="absolute left-0 mt-1 w-56 bg-[#161616] border border-[#282828] rounded-xl shadow-2xl py-2 z-50">
                  <Link
                    href="/programs"
                    onClick={() => setTrainingDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/5 hover:text-white"
                  >
                    <Flame className="w-4 h-4 mr-2.5 text-gym-red" />
                    <span>Workout Programs</span>
                  </Link>
                  <Link
                    href="/exercises"
                    onClick={() => setTrainingDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/5 hover:text-white"
                  >
                    <BookOpen className="w-4 h-4 mr-2.5 text-zinc-400" />
                    <span>Exercise Library</span>
                  </Link>
                  <Link
                    href="/videos"
                    onClick={() => setTrainingDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/5 hover:text-white"
                  >
                    <PlayCircle className="w-4 h-4 mr-2.5 text-zinc-400" />
                    <span>Video Demonstration Hub</span>
                  </Link>
                  <Link
                    href="/trainers"
                    onClick={() => setTrainingDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/5 hover:text-white"
                  >
                    <Users className="w-4 h-4 mr-2.5 text-zinc-400" />
                    <span>Our Master Coaches</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Nutrition & AI Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setNutritionDropdownOpen(true)}
              onMouseLeave={() => setNutritionDropdownOpen(false)}
            >
              <button
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all ${
                  isNutritionActive ? 'text-white bg-white/10 font-bold' : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Nutrition &amp; AI</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {nutritionDropdownOpen && (
                <div className="absolute left-0 mt-1 w-64 bg-[#161616] border border-[#282828] rounded-xl shadow-2xl py-2 z-50">
                  <Link
                    href="/nutrition"
                    onClick={() => setNutritionDropdownOpen(false)}
                    className="flex items-center px-4 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-white/5 hover:text-white"
                  >
                    <Utensils className="w-4 h-4 mr-2.5 text-zinc-400" />
                    <div>
                      <span className="block font-bold">Diet &amp; Nutrition Guide</span>
                      <span className="text-[10px] text-zinc-400">Indian meal plans &amp; macro guides</span>
                    </div>
                  </Link>
                  <Link
                    href="/ai-planner"
                    onClick={() => setNutritionDropdownOpen(false)}
                    className="flex items-center px-4 py-2.5 text-xs font-semibold bg-red-950/20 text-red-200 border-l-2 border-gym-red hover:bg-red-950/40"
                  >
                    <Sparkles className="w-4 h-4 mr-2.5 text-gym-red" />
                    <div>
                      <span className="block font-bold text-white">AI Fitness &amp; Diet Planner</span>
                      <span className="text-[10px] text-red-300/80">Personalized sports science generator</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/transformations"
              className={`px-3 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all ${
                pathname === '/transformations' ? 'text-white bg-white/10 font-bold' : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Transformations
            </Link>

            <Link
              href="/pricing"
              className={`px-3 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all ${
                pathname === '/pricing' ? 'text-white bg-white/10 font-bold' : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Memberships
            </Link>

            <Link
              href="/contact"
              className={`px-3 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all ${
                pathname === '/contact' ? 'text-white bg-white/10 font-bold' : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Right Action: Portals Dropdown + Join Button */}
          <div className="hidden lg:flex items-center space-x-3">
            <div
              className="relative"
              onMouseEnter={() => setPortalsDropdownOpen(true)}
              onMouseLeave={() => setPortalsDropdownOpen(false)}
            >
              <button className="flex items-center space-x-1.5 text-xs uppercase tracking-wider font-bold bg-[#181818] text-zinc-200 border border-[#303030] px-3.5 py-2.5 rounded-xl hover:border-gym-red/50 hover:text-white transition-all">
                <Lock className="w-3.5 h-3.5 text-gym-red" />
                <span>Portals</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {portalsDropdownOpen && (
                <div className="absolute right-0 mt-1 w-60 bg-[#161616] border border-[#282828] rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Access Dashboard
                  </div>
                  <Link
                    href="/admin"
                    onClick={() => setPortalsDropdownOpen(false)}
                    className="flex items-center px-4 py-2.5 text-xs font-semibold text-white hover:bg-gym-red/10 hover:text-gym-red transition-colors"
                  >
                    <Shield className="w-4 h-4 mr-2.5 text-gym-red" />
                    <span>Dave Admin Dashboard</span>
                  </Link>
                  <Link
                    href="/portal/member"
                    onClick={() => setPortalsDropdownOpen(false)}
                    className="flex items-center px-4 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <Dumbbell className="w-4 h-4 mr-2.5 text-zinc-400" />
                    <span>Member Athlete Portal</span>
                  </Link>
                  <Link
                    href="/portal/employee"
                    onClick={() => setPortalsDropdownOpen(false)}
                    className="flex items-center px-4 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <UserCheck className="w-4 h-4 mr-2.5 text-zinc-400" />
                    <span>Staff &amp; Coach Portal</span>
                  </Link>
                  <div className="border-t border-[#262626] my-1" />
                  <Link
                    href="/auth/login"
                    onClick={() => setPortalsDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
                  >
                    <span>Sign In / Demo Login</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/pricing"
              className="bg-gym-red hover:bg-gym-redHover text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-md shadow-red-950/60 hover:scale-105"
            >
              Join Now
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-zinc-300 hover:text-white p-2.5 rounded-xl bg-[#181818] border border-[#282828]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#101010] border-b border-[#262626] px-4 pt-4 pb-6 space-y-2 max-h-[80vh] overflow-y-auto">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-zinc-200 hover:bg-[#181818]"
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-zinc-200 hover:bg-[#181818]"
          >
            About the Gym
          </Link>
          <Link
            href="/programs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-zinc-200 hover:bg-[#181818]"
          >
            Workout Programs
          </Link>
          <Link
            href="/exercises"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-zinc-200 hover:bg-[#181818]"
          >
            Exercise Library
          </Link>
          <Link
            href="/nutrition"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-zinc-200 hover:bg-[#181818]"
          >
            Diet &amp; Nutrition Guide
          </Link>
          <Link
            href="/ai-planner"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-sm font-bold text-red-300 bg-red-950/20 border border-gym-red/30"
          >
            <Sparkles className="w-4 h-4 inline mr-2 text-gym-red" />
            AI Fitness &amp; Diet Planner
          </Link>
          <Link
            href="/videos"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-zinc-200 hover:bg-[#181818]"
          >
            YouTube Video Hub
          </Link>
          <Link
            href="/trainers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-zinc-200 hover:bg-[#181818]"
          >
            Certified Trainers
          </Link>
          <Link
            href="/transformations"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-zinc-200 hover:bg-[#181818]"
          >
            Transformations
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-zinc-200 hover:bg-[#181818]"
          >
            Membership Plans
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-zinc-200 hover:bg-[#181818]"
          >
            Contact
          </Link>

          <div className="border-t border-[#262626] pt-4 mt-3 space-y-2">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3.5 py-2.5 rounded-xl text-sm font-bold text-white bg-gym-red"
            >
              <Shield className="w-4 h-4 mr-2.5" />
              <span>Dave Admin Dashboard</span>
            </Link>
            <Link
              href="/portal/member"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3.5 py-2.5 rounded-xl text-sm font-semibold text-zinc-200 bg-[#181818]"
            >
              <Dumbbell className="w-4 h-4 mr-2.5 text-zinc-400" />
              <span>Member Athlete Portal</span>
            </Link>
            <Link
              href="/portal/employee"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3.5 py-2.5 rounded-xl text-sm font-semibold text-zinc-200 bg-[#181818]"
            >
              <UserCheck className="w-4 h-4 mr-2.5 text-zinc-400" />
              <span>Staff &amp; Coach Portal</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
