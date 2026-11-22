'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, User, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { BRAND } from '@parshuram/shared';
import BrandLogo from '@/components/BrandLogo';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      }

      router.push(data.dashboardRoute);
    } catch (err: any) {
      setErrorMessage('Network connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#050B17] text-white min-h-screen py-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <BrandLogo variant="auth" />

        <div className="bg-[#101B37] rounded-2xl border border-[#1E305C] p-8 shadow-2xl space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-black uppercase font-display text-white">
              Sign In To Your Account
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Enter your credentials to access your designated role portal
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLoginSubmit(email, password);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0A1128] border border-[#1E305C] text-white text-xs placeholder-slate-500 focus:border-[#D4AF37] focus:outline-none"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0A1128] border border-[#1E305C] text-white text-xs placeholder-slate-500 focus:border-[#D4AF37] focus:outline-none"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black hover:bg-[#E5C158] text-xs uppercase tracking-wider transition-all shadow-lg shadow-black/60 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-400">
              Not registered yet?{' '}
              <Link href="/auth/register" className="text-[#D4AF37] hover:underline font-bold">
                Create Member Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
