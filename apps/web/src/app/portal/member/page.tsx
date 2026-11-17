'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  QrCode,
  CalendarCheck,
  Dumbbell,
  Utensils,
  TrendingUp,
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { api, BRAND, MemberAttendance } from '@parshuram/shared';

export default function MemberPortalPage() {
  const [member, setMember] = useState<any>((api as any).store.members[0]);
  const [profile, setProfile] = useState<any>((api as any).store.profiles.find((p: any) => p.id === (api as any).store.members[0]?.profile_id));
  const [plan, setPlan] = useState<any>((api as any).store.membershipPlans[1]);
  const [attendance, setAttendance] = useState<MemberAttendance[]>([...(api as any).store.memberAttendance]);

  const [qrTokenInput, setQrTokenInput] = useState('');
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<{ success: boolean; message: string } | null>(null);

  // New weight entry state
  const [currentWeight, setCurrentWeight] = useState(member?.weight_kg || 74);
  const [weightLogged, setWeightLogged] = useState(false);

  const handleMemberCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckInLoading(true);
    setCheckInStatus(null);

    try {
      const active = await api.getActiveQRSession();
      const tokenToUse = qrTokenInput.trim() || active.token;

      const res = await fetch('/api/attendance/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: member.id,
          userType: 'member',
          token: tokenToUse,
          method: 'qr'
        })
      });

      const data = await res.json();
      if (res.ok) {
        setCheckInStatus({ success: true, message: data.message });
        setAttendance([...(api as any).store.memberAttendance]);
        setQrTokenInput('');
      } else {
        setCheckInStatus({ success: false, message: data.error || 'Check-in failed' });
      }
    } catch (err: any) {
      setCheckInStatus({ success: false, message: 'Network error. Please try again.' });
    } finally {
      setCheckInLoading(false);
    }
  };

  return (
    <div className="bg-gym-black min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Greeting Banner */}
        <div className="bg-gym-card rounded-2xl border border-gym-border p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gym-red to-zinc-950 flex items-center justify-center font-black text-2xl text-white border border-gym-red shadow-lg">
              {profile?.full_name?.charAt(0) || 'R'}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gym-silver tracking-widest">
                Parshuram Warrior Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-black uppercase font-display text-white mt-0.5">
                Namaste, {profile?.full_name || 'Rahul Varma'}
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Goal: <span className="text-gym-red font-semibold capitalize">{member?.fitness_goal?.replace('_', ' ')}</span> • Plan: {plan?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <Link
              href="/ai-planner"
              className="px-4 py-2.5 rounded-xl bg-gym-charcoal hover:bg-zinc-800 border border-gym-border text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4 text-gym-red" />
              <span>AI Planner</span>
            </Link>
            <Link
              href="/exercises"
              className="px-4 py-2.5 rounded-xl bg-gym-red hover:bg-gym-redHover text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 shadow-md shadow-red-950/60"
            >
              <Dumbbell className="w-4 h-4" />
              <span>Exercise Guide</span>
            </Link>
          </div>
        </div>

        {/* 100% Free Daily QR Check-In Terminal Card */}
        <div className="bg-gym-card rounded-2xl border border-gym-red/40 p-6 sm:p-8 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="w-36 h-36 rounded-2xl bg-gym-black border-2 border-gym-red flex flex-col items-center justify-center p-4 shadow-xl">
                <QrCode className="w-24 h-24 text-gym-red" />
                <span className="text-[9px] uppercase font-bold text-white mt-1">Free Floor Check-In</span>
              </div>
              <p className="text-[10px] text-emerald-400 mt-2 font-bold uppercase">
                Zero Fees • Free For All Members
              </p>
            </div>

            <div className="lg:col-span-8 space-y-4 border-t lg:border-t-0 lg:border-l border-gym-border pt-6 lg:pt-0 lg:pl-8 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-gym-red">Daily Attendance Marker</span>
                <span className="text-[10px] text-zinc-400">Timestamped by Server</span>
              </div>

              <p className="text-zinc-300 leading-relaxed">
                Scan the active display QR terminal located at the entrance desk of Parshuram Fitness Gym to record your daily attendance. You can also paste the session code or tap check-in below.
              </p>

              <form onSubmit={handleMemberCheckIn} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Enter or scan active QR token (or leave blank to auto-sync)..."
                    value={qrTokenInput}
                    onChange={(e) => setQrTokenInput(e.target.value)}
                    className="flex-grow px-3.5 py-2.5 rounded-xl bg-gym-charcoal border border-gym-border text-white text-xs placeholder-zinc-500 focus:border-gym-red focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={checkInLoading}
                    className="px-6 py-2.5 rounded-xl bg-gym-red hover:bg-gym-redHover text-white font-bold uppercase tracking-wider text-xs transition-colors shadow-md shadow-red-950/60 shrink-0 disabled:opacity-50"
                  >
                    {checkInLoading ? 'Checking In...' : 'Confirm Free Check-In'}
                  </button>
                </div>
              </form>

              {checkInStatus && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center space-x-2 ${
                    checkInStatus.success
                      ? 'bg-emerald-950/40 border-emerald-600 text-emerald-300'
                      : 'bg-red-950/40 border-red-600 text-red-300'
                  }`}
                >
                  {checkInStatus.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{checkInStatus.message}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3 Grid Widgets: Today's Workout, Diet Shortcut, Weight Tracker */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Today's Workout */}
          <div className="bg-gym-card rounded-2xl border border-gym-border p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase font-bold text-gym-red">Today&apos;s Workout</span>
                <Dumbbell className="w-4 h-4 text-gym-silver" />
              </div>
              <h3 className="text-lg font-bold uppercase font-display text-white mb-2">
                Heavy Compound Push Day
              </h3>
              <p className="text-xs text-zinc-400 mb-4">
                Barbell Flat Bench Press, Incline Dumbbell Press, Standing Overhead Military Press, and Dips.
              </p>
              <div className="space-y-1.5 text-xs text-zinc-300 bg-gym-charcoal p-3 rounded-xl border border-gym-border">
                <p>• Bench Press: 4 Sets × 8 Reps</p>
                <p>• Overhead Press: 3 Sets × 8-10 Reps</p>
                <p>• Parallel Dips: 3 Sets × 12 Reps</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gym-border mt-6">
              <Link
                href="/exercises"
                className="w-full py-2.5 rounded-lg bg-gym-charcoal hover:bg-gym-red text-white text-xs font-bold uppercase tracking-wider border border-gym-border transition-colors flex items-center justify-center space-x-1"
              >
                <span>View Movement Cues</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Diet Shortcut */}
          <div className="bg-gym-card rounded-2xl border border-gym-border p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase font-bold text-gym-silver">Nutrition Protocol</span>
                <Utensils className="w-4 h-4 text-gym-silver" />
              </div>
              <h3 className="text-lg font-bold uppercase font-display text-white mb-2">
                High-Protein Indian Plan
              </h3>
              <p className="text-xs text-zinc-400 mb-4">
                Target: 2,600 kcal • 145g Protein • Soya chunks, paneer, double dal, and oats.
              </p>
              <div className="space-y-1.5 text-xs text-zinc-300 bg-gym-charcoal p-3 rounded-xl border border-gym-border">
                <p>• Breakfast: Oats + Almonds + 1 scoop protein</p>
                <p>• Lunch: 150g Paneer + Dal Tadka + 3 Rotis</p>
                <p>• Dinner: 65g Soya chunks curry + Curd</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gym-border mt-6">
              <Link
                href="/nutrition"
                className="w-full py-2.5 rounded-lg bg-gym-charcoal hover:bg-gym-red text-white text-xs font-bold uppercase tracking-wider border border-gym-border transition-colors flex items-center justify-center space-x-1"
              >
                <span>Full Diet Library</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="bg-gym-card rounded-2xl border border-gym-border p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase font-bold text-gym-silver">Body Composition</span>
                <TrendingUp className="w-4 h-4 text-gym-red" />
              </div>
              <h3 className="text-lg font-bold uppercase font-display text-white mb-2">
                Log Today&apos;s Body Weight
              </h3>
              <p className="text-xs text-zinc-400 mb-4">
                Track morning fasting weight weekly to verify caloric adherence and lean muscle gains.
              </p>
              <div className="space-y-3 bg-gym-charcoal p-3 rounded-xl border border-gym-border text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Current Logged:</span>
                  <span className="font-bold text-white text-sm">{currentWeight} kg</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    step="0.1"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded bg-gym-black border border-gym-border text-white text-xs focus:border-gym-red focus:outline-none"
                  />
                  <button
                    onClick={() => setWeightLogged(true)}
                    className="px-3 py-1.5 rounded bg-gym-red hover:bg-gym-redHover text-white font-bold uppercase text-[10px] shrink-0"
                  >
                    Save
                  </button>
                </div>
                {weightLogged && (
                  <p className="text-[10px] text-emerald-400 font-semibold">Weight entry recorded for today!</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gym-border mt-6">
              <Link
                href="/transformations"
                className="w-full py-2.5 rounded-lg bg-gym-charcoal hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider border border-gym-border transition-colors flex items-center justify-center space-x-1"
              >
                <span>View Gym Hall of Fame</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Member Attendance History List */}
        <div className="bg-gym-card rounded-2xl border border-gym-border p-6 shadow-xl">
          <h3 className="text-lg font-bold uppercase font-display text-white mb-4 flex items-center justify-between">
            <span>Your Attendance History</span>
            <span className="text-xs text-zinc-400 font-normal">{attendance.length} Total Gym Visits</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gym-charcoal text-zinc-400 uppercase font-bold text-[10px] border-b border-gym-border">
                <tr>
                  <th className="py-3 px-4">Visit Date &amp; Time</th>
                  <th className="py-3 px-4">Check-In Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Fee Charged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gym-border">
                {attendance.map((att) => (
                  <tr key={att.id} className="hover:bg-gym-charcoal/50">
                    <td className="py-3 px-4 text-white font-semibold">
                      {new Date(att.check_in_time).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 uppercase text-gym-silver font-bold text-[10px]">
                      {att.check_in_method} Code Scan
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        {att.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-emerald-400 font-bold">
                      ₹0.00 (Free)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
