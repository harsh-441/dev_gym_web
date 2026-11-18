'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, User, Lock, ArrowRight, UserCheck, Dumbbell, AlertCircle, CheckCircle2 } from 'lucide-react';
import { BRAND, UserRole } from '@parshuram/shared';
import BrandLogo from '@/components/BrandLogo';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const presetProfiles = [
    {
      label: 'Dave (Owner & Super Admin)',
      email: 'dave@parshuramgym.com',
      password: 'DaveAdmin2026!',
      role: 'super_admin' as UserRole,
      desc: 'Full administrative control, leaves, attendance QR, finances, settings'
    },
    {
      label: 'Vikram Rathore (Strength Coach)',
      email: 'vikram@parshuramgym.com',
      password: 'VikramTrainer2026!',
      role: 'trainer' as UserRole,
      desc: 'Trainer schedules, staff QR check-in & check-out, leave requests'
    },
    {
      label: 'Rahul Varma (Active Member)',
      email: 'rahul@example.com',
      password: 'RahulMember2026!',
      role: 'member' as UserRole,
      desc: 'Free QR attendance check-in, workouts, diet plans, progress charts'
    }
  ];

  const handleLoginSubmit = async (loginEmail: string, loginPass: string) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPass })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Failed to authenticate.');
        setLoading(false);
        return;
      }

      // Store authenticated session
      if (typeof window !== 'undefined') {
        localStorage.setItem('pfg_user_token', data.token);
        localStorage.setItem('pfg_user_email', data.user.email);
        localStorage.setItem('pfg_user_role', data.user.role);
        localStorage.setItem('pfg_user_name', data.user.name);
        if (data.user.memberId) localStorage.setItem('pfg_member_id', data.user.memberId);
        if (data.user.employeeId) localStorage.setItem('pfg_employee_id', data.user.employeeId);
      }

      router.push(data.dashboardRoute);
    } catch (err: any) {
      setErrorMessage('Network error during login. Please try again.');
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    handleLoginSubmit(email, password);
  };

  return (
    <div className="bg-[#050B17] min-h-screen py-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#101B37] rounded-2xl border border-[#1E305C] p-8 shadow-2xl shadow-black/60">
        <div className="mb-8">
          <BrandLogo variant="auth" />
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-700 text-red-200 text-xs flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Real Authentication Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. dave@parshuramgym.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A1128] border border-[#1E305C] text-white text-xs placeholder-slate-500 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold uppercase text-slate-300">
                Password
              </label>
              <span className="text-[10px] text-slate-400">Database verified</span>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A1128] border border-[#1E305C] text-white text-xs placeholder-slate-500 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#E5C158] hover:to-[#D4AF37] text-[#050B17] font-black uppercase tracking-wider text-xs transition-all shadow-md shadow-black/50 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Credentials for Reviewers */}
        <div className="mt-8 pt-6 border-t border-[#1E305C]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
            Instant Test Accounts (Auto-fill &amp; Login):
          </span>
          <div className="space-y-2">
            {presetProfiles.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setEmail(p.email);
                  setPassword(p.password);
                  handleLoginSubmit(p.email, p.password);
                }}
                className="w-full text-left p-3 rounded-xl bg-[#0A1128] hover:bg-[#17254A] border border-[#1E305C] hover:border-[#D4AF37]/50 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    {p.role === 'super_admin' ? (
                      <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
                    ) : p.role === 'trainer' ? (
                      <UserCheck className="w-3.5 h-3.5 text-slate-300" />
                    ) : (
                      <Dumbbell className="w-3.5 h-3.5 text-slate-300" />
                    )}
                    <span className="text-xs font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                      {p.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{p.email}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          <span>Don&apos;t have an athlete account? </span>
          <Link href="/auth/register" className="text-[#D4AF37] font-bold hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}


