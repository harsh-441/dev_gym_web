'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, Dumbbell, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { BRAND, validateMemberRegistration } from '@parshuram/shared';
import BrandLogo from '@/components/BrandLogo';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('muscle_gain');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    const validation = validateMemberRegistration({ fullName, email, password, phone, fitnessGoal });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          password,
          fitnessGoal
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setServerError(data.error || 'Failed to create account.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setSuccessMessage(data.message || 'Account created successfully.');
      if (data.token && typeof window !== 'undefined') {
        localStorage.setItem('pfg_user_token', data.token);
        localStorage.setItem('pfg_user_email', data.user.email);
        localStorage.setItem('pfg_user_role', data.user.role);
        localStorage.setItem('pfg_user_name', data.user.name);
        if (data.user.memberId) localStorage.setItem('pfg_member_id', data.user.memberId);
      }

      if (data.token) setTimeout(() => router.push('/portal/member'), 1200);
      else setTimeout(() => router.push('/auth/login'), 3000);
    } catch (err: any) {
      setServerError('Network error. Could not register account.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#050B17] min-h-screen py-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#101B37] rounded-2xl border border-[#1E305C] p-8 shadow-2xl shadow-black/60">
        <div className="mb-8">
          <BrandLogo variant="auth" />
        </div>

        {serverError && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-700 text-red-200 text-xs flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span>{serverError}</span>
          </div>
        )}

        {success ? (
          <div className="bg-emerald-950/40 border border-emerald-600 rounded-xl p-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Account Created</h4>
            <p className="text-xs text-slate-300">
              {successMessage}
            </p>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Arjun Kapoor"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A1128] border border-[#1E305C] text-white text-xs placeholder-slate-500 focus:border-[#D4AF37] focus:outline-none"
              />
              {errors.fullName && <p className="text-[10px] text-red-400 mt-0.5">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="arjun@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A1128] border border-[#1E305C] text-white text-xs placeholder-slate-500 focus:border-[#D4AF37] focus:outline-none"
              />
              {errors.email && <p className="text-[10px] text-red-400 mt-0.5">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A1128] border border-[#1E305C] text-white text-xs placeholder-slate-500 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Primary Fitness Goal</label>
              <select
                value={fitnessGoal}
                onChange={(e) => setFitnessGoal(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A1128] border border-[#1E305C] text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="muscle_gain">Muscle Hypertrophy</option>
                <option value="strength_powerlifting">Strength &amp; Powerlifting</option>
                <option value="fat_loss">Fat Loss &amp; Conditioning</option>
                <option value="endurance">Functional Endurance</option>
                <option value="general_fitness">General Wellness</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A1128] border border-[#1E305C] text-white text-xs placeholder-slate-500 focus:border-[#D4AF37] focus:outline-none"
              />
              {errors.password && <p className="text-[10px] text-red-400 mt-0.5">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#E5C158] hover:to-[#D4AF37] text-[#050B17] font-black uppercase tracking-wider text-xs transition-all shadow-md shadow-black/50 disabled:opacity-50"
            >
              {loading ? 'Creating Account in Database...' : 'Register Athlete Profile'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-slate-400">
          <span>Already registered? </span>
          <Link href="/auth/login" className="text-[#D4AF37] font-bold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
