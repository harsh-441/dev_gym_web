'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, Dumbbell, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { BRAND, validateMemberRegistration } from '@parshuram/shared';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('muscle_gain');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = validateMemberRegistration({ fullName, email, password, phone, fitnessGoal });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setSuccess(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('pfg_user_email', email);
        localStorage.setItem('pfg_user_role', 'member');
        localStorage.setItem('pfg_user_name', fullName);
      }
      setTimeout(() => {
        router.push('/portal/member');
      }, 1000);
    }, 600);
  };

  return (
    <div className="bg-gym-black min-h-screen py-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gym-card rounded-2xl border border-gym-border p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gym-red flex items-center justify-center font-black text-white text-xl mx-auto mb-3 shadow-lg shadow-red-950/60">
            PFG
          </div>
          <h1 className="text-2xl font-black uppercase font-display text-white">
            Create Member Account
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Free attendance, synced workout logs &amp; AI nutrition
          </p>
        </div>

        {success ? (
          <div className="bg-emerald-950/40 border border-emerald-600 rounded-xl p-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Registration Successful!</h4>
            <p className="text-xs text-zinc-300">
              Welcome to Parshuram Fitness Gym. Redirecting to your Member Portal...
            </p>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Arjun Kapoor"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-gym-charcoal border border-gym-border text-white text-xs placeholder-zinc-500 focus:border-gym-red focus:outline-none"
              />
              {errors.fullName && <p className="text-[10px] text-gym-red mt-0.5">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="arjun@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-gym-charcoal border border-gym-border text-white text-xs placeholder-zinc-500 focus:border-gym-red focus:outline-none"
              />
              {errors.email && <p className="text-[10px] text-gym-red mt-0.5">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-gym-charcoal border border-gym-border text-white text-xs placeholder-zinc-500 focus:border-gym-red focus:outline-none"
              />
              {errors.phone && <p className="text-[10px] text-gym-red mt-0.5">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Primary Fitness Goal</label>
              <select
                value={fitnessGoal}
                onChange={(e) => setFitnessGoal(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-gym-charcoal border border-gym-border text-white text-xs focus:border-gym-red focus:outline-none"
              >
                <option value="muscle_gain">Muscle Hypertrophy</option>
                <option value="fat_loss">Fat Loss &amp; Lean Conditioning</option>
                <option value="weight_gain">Healthy Mass Gain</option>
                <option value="strength">Barbell Power &amp; Strength</option>
                <option value="general_fitness">General Health &amp; Stamina</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-gym-charcoal border border-gym-border text-white text-xs placeholder-zinc-500 focus:border-gym-red focus:outline-none"
              />
              {errors.password && <p className="text-[10px] text-gym-red mt-0.5">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gym-red hover:bg-gym-redHover text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-red-950/60 disabled:opacity-50"
            >
              {loading ? 'Creating Member Profile...' : 'Complete Registration'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-zinc-400">
          Already a member?{' '}
          <Link href="/auth/login" className="text-gym-red font-bold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
