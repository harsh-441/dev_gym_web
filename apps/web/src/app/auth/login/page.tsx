'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, User, Lock, ArrowRight, UserCheck, Dumbbell, Sparkles } from 'lucide-react';
import { BRAND, UserRole } from '@parshuram/shared';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('super_admin');
  const [loading, setLoading] = useState(false);

  const presetProfiles = [
    {
      label: 'Dave (Super Admin / Owner)',
      role: 'super_admin' as UserRole,
      email: 'dave@parshuramgym.com',
      destination: '/admin',
      desc: 'Full administrative control, leaves, attendance QR, finances, settings'
    },
    {
      label: 'Vikram Rathore (Trainer / Coach)',
      role: 'trainer' as UserRole,
      email: 'vikram@parshuramgym.com',
      destination: '/portal/employee',
      desc: 'Trainer schedules, staff QR check-in & check-out, leave requests'
    },
    {
      label: 'Amit Patel (Operations Staff)',
      role: 'employee' as UserRole,
      email: 'amit@parshuramgym.com',
      destination: '/portal/employee',
      desc: 'Staff attendance clock-in, leave application & balance tracking'
    },
    {
      label: 'Rahul Varma (Gym Member)',
      role: 'member' as UserRole,
      email: 'rahul@example.com',
      destination: '/portal/member',
      desc: 'Free QR attendance check-in, workouts, diet plans, progress charts'
    }
  ];

  const handleLogin = (selectedEmail: string, selectedRole: UserRole, targetRoute: string) => {
    setLoading(true);
    // Store active session profile in local storage for browser persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('pfg_user_email', selectedEmail);
      localStorage.setItem('pfg_user_role', selectedRole);
    }
    setTimeout(() => {
      router.push(targetRoute);
    }, 400);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    let targetRoute = '/portal/member';
    if (role === 'super_admin' || role === 'admin') {
      targetRoute = '/admin';
    } else if (role === 'employee' || role === 'trainer') {
      targetRoute = '/portal/employee';
    }

    handleLogin(email, role, targetRoute);
  };

  return (
    <div className="bg-gym-black min-h-screen py-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gym-card rounded-2xl border border-gym-border p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gym-red flex items-center justify-center font-black text-white text-xl mx-auto mb-3 shadow-lg shadow-red-950/60">
            PFG
          </div>
          <h1 className="text-2xl font-black uppercase font-display text-white">
            Access The Platform
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Unified access for Dave (Admin), Trainers, Staff &amp; Members
          </p>
        </div>

        {/* Quick Demo Role Selector */}
        <div className="mb-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gym-silver block mb-2">
            One-Click Sign-In as:
          </span>
          <div className="space-y-2">
            {presetProfiles.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLogin(p.email, p.role, p.destination)}
                className="w-full text-left p-3 rounded-xl bg-gym-charcoal hover:bg-zinc-800 border border-gym-border hover:border-gym-red/50 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    {p.role === 'super_admin' ? (
                      <Shield className="w-3.5 h-3.5 text-gym-red" />
                    ) : p.role === 'trainer' || p.role === 'employee' ? (
                      <UserCheck className="w-3.5 h-3.5 text-gym-silver" />
                    ) : (
                      <Dumbbell className="w-3.5 h-3.5 text-white" />
                    )}
                    <span className="text-xs font-bold text-white group-hover:text-gym-red transition-colors">
                      {p.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5">{p.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gym-border" /></div>
          <span className="relative bg-gym-card px-3 text-[10px] uppercase font-bold text-zinc-400">Or Custom Credentials</span>
        </div>

        {/* Manual Login Form */}
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="dave@parshuramgym.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-gym-charcoal border border-gym-border text-white text-xs placeholder-zinc-500 focus:border-gym-red focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-gym-charcoal border border-gym-border text-white text-xs placeholder-zinc-500 focus:border-gym-red focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Select Intended Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2.5 rounded-xl bg-gym-charcoal border border-gym-border text-white text-xs focus:border-gym-red focus:outline-none"
            >
              <option value="super_admin">Super Admin / Dave</option>
              <option value="admin">Admin</option>
              <option value="trainer">Trainer</option>
              <option value="employee">Employee / Staff</option>
              <option value="member">Gym Member</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gym-red hover:bg-gym-redHover text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-red-950/60 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-zinc-400">
          New member?{' '}
          <Link href="/auth/register" className="text-gym-red font-bold hover:underline">
            Register Account
          </Link>
        </div>
      </div>
    </div>
  );
}
