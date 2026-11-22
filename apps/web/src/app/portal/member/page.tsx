'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CalendarCheck,
  Dumbbell,
  Utensils,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  LogOut,
  ShieldAlert
} from 'lucide-react';
import { MemberAttendance } from '@parshuram/shared';

export default function MemberPortalPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [member, setMember] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);
  const [membership, setMembership] = useState<any>(null);
  const [attendance, setAttendance] = useState<MemberAttendance[]>([]);
  const [loading, setLoading] = useState(true);

  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<{ success: boolean; message: string } | null>(null);

  const [currentWeight, setCurrentWeight] = useState(74);
  const [weightLogged, setWeightLogged] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('pfg_user_token');

    // Access control: only members or admins can view
    if (!token || localStorage.getItem('pfg_user_role') !== 'member') {
      router.push('/auth/login');
      return;
    }

    const loadMemberData = async () => {
      try {
        const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
        const data = await res.json();

        if (data.success && data.profile) {
          setProfile(data.profile);
          setMember(data.member);
          setPlan(data.plan);
          setMembership(data.membership);
          if (data.member?.weight_kg) {
            setCurrentWeight(data.member.weight_kg);
          }

          const attendanceResponse = await fetch('/api/attendance', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
          const attendanceData = await attendanceResponse.json();
          if (!attendanceResponse.ok) throw new Error(attendanceData.error || 'Could not load attendance.');
          setAttendance(attendanceData.attendance || []);
        } else {
          throw new Error(data.error || 'Could not load member profile.');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMemberData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('pfg_user_token');
    localStorage.removeItem('pfg_user_email');
    localStorage.removeItem('pfg_user_role');
    localStorage.removeItem('pfg_user_name');
    router.push('/auth/login');
  };

  const handleMemberCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;

    setCheckInLoading(true);
    setCheckInStatus(null);

    try {
      const token = localStorage.getItem('pfg_user_token') || '';
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({})
      });

      const data = await res.json();
      if (res.ok) {
        setCheckInStatus({ success: true, message: data.message });
        const attendanceResponse = await fetch('/api/attendance', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
        const attendanceData = await attendanceResponse.json();
        setAttendance(attendanceData.attendance || []);
      } else {
        setCheckInStatus({ success: false, message: data.error || 'Check-in failed' });
      }
    } catch (err: any) {
      setCheckInStatus({ success: false, message: 'Network error. Please try again.' });
    } finally {
      setCheckInLoading(false);
    }
  };

  const membershipValid = membership?.status === 'active' && membership?.end_date && new Date(`${membership.end_date}T23:59:59+05:30`).getTime() >= Date.now();

  if (loading) {
    return (
      <div className="bg-[#050B17] min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs uppercase font-bold text-slate-400">Loading Athlete Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#050B17] min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Greeting Banner */}
        <div className="bg-[#101B37] rounded-2xl border border-[#1E305C] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1E305C] to-[#0A1128] border border-[#D4AF37] flex items-center justify-center font-black text-2xl text-[#D4AF37] shadow-lg">
              {profile?.full_name?.charAt(0) || 'A'}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest">
                Parshuram Warrior Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-black uppercase font-display text-white mt-0.5">
                Namaste, {profile?.full_name || 'Athlete'}
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                Goal: <span className="text-[#D4AF37] font-semibold capitalize">{member?.fitness_goal?.replace('_', ' ') || 'General Fitness'}</span> • Plan: {plan?.name || 'Quarterly Warrior'} • Email: {profile?.email}
              </p>
              <p className="mt-2 text-xs text-slate-300">
                Membership: <span className="font-semibold capitalize text-[#D4AF37]">{membership ? (membershipValid ? 'Valid' : 'Expired') : 'No membership recorded'}</span>
                {membership?.end_date ? ` · ${membership.start_date} to ${membership.end_date}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <Link
              href="/ai-planner"
              className="px-4 py-2.5 rounded-xl bg-[#0A1128] hover:bg-[#17254A] border border-[#1E305C] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>AI Planner</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl bg-[#0A1128] hover:bg-red-950/40 border border-[#1E305C] text-red-300 text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Member self check-in */}
        <div className="bg-[#101B37] rounded-2xl border border-[#D4AF37]/40 p-6 sm:p-8 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="w-36 h-36 rounded-2xl bg-[#050B17] border-2 border-[#D4AF37] flex flex-col items-center justify-center p-4 shadow-xl">
                <CheckCircle2 className="w-20 h-20 text-[#D4AF37]" />
                <span className="text-[9px] uppercase font-bold text-white mt-1">Member Check-In</span>
              </div>
              <p className="text-[10px] text-emerald-400 mt-2 font-bold uppercase">
                Zero Fees • Free For All Registered Athletes
              </p>
            </div>

            <div className="lg:col-span-8 space-y-4 border-t lg:border-t-0 lg:border-l border-[#1E305C] pt-6 lg:pt-0 lg:pl-8 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-[#D4AF37]">Daily Attendance Marker</span>
                <span className="text-[10px] text-slate-400">Database Timestamped</span>
              </div>

              <p className="text-slate-300 leading-relaxed">
                Check in from your member account. Your visit is saved with today&apos;s gym date and server-recorded time.
              </p>

              <form onSubmit={handleMemberCheckIn} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={checkInLoading}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#E5C158] hover:to-[#D4AF37] text-[#050B17] font-black uppercase tracking-wider text-xs transition-all shadow-md shadow-black/50 shrink-0 disabled:opacity-50"
                  >
                    {checkInLoading ? 'Checking In...' : 'Check In Today'}
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

        {/* 3 Grid Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Today's Workout */}
          <div className="bg-[#101B37] rounded-2xl border border-[#1E305C] p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase font-bold text-[#D4AF37]">Today&apos;s Workout</span>
                <Dumbbell className="w-4 h-4 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold uppercase font-display text-white mb-2">
                Heavy Compound Push Day
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Barbell Flat Bench Press, Incline Dumbbell Press, Standing Overhead Military Press, and Dips.
              </p>
              <div className="space-y-1.5 text-xs text-slate-300 bg-[#0A1128] p-3 rounded-xl border border-[#1E305C]">
                <p>• Bench Press: 4 Sets × 8 Reps</p>
                <p>• Overhead Press: 3 Sets × 8-10 Reps</p>
                <p>• Parallel Dips: 3 Sets × 12 Reps</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1E305C] mt-6">
              <Link
                href="/exercises"
                className="w-full py-2.5 rounded-lg bg-[#0A1128] hover:bg-[#17254A] text-white text-xs font-bold uppercase tracking-wider border border-[#1E305C] transition-colors flex items-center justify-center space-x-1"
              >
                <span>View Movement Cues</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Diet Shortcut */}
          <div className="bg-[#101B37] rounded-2xl border border-[#1E305C] p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase font-bold text-[#D4AF37]">Nutrition Protocol</span>
                <Utensils className="w-4 h-4 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold uppercase font-display text-white mb-2">
                High-Protein Indian Plan
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Target: 2,600 kcal • 145g Protein • Soya chunks, paneer, double dal, and oats.
              </p>
              <div className="space-y-1.5 text-xs text-slate-300 bg-[#0A1128] p-3 rounded-xl border border-[#1E305C]">
                <p>• Breakfast: Oats + Almonds + 1 scoop protein</p>
                <p>• Lunch: 150g Paneer + Dal Tadka + 3 Rotis</p>
                <p>• Dinner: 65g Soya chunks curry + Curd</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1E305C] mt-6">
              <Link
                href="/nutrition"
                className="w-full py-2.5 rounded-lg bg-[#0A1128] hover:bg-[#17254A] text-white text-xs font-bold uppercase tracking-wider border border-[#1E305C] transition-colors flex items-center justify-center space-x-1"
              >
                <span>Full Diet Library</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="bg-[#101B37] rounded-2xl border border-[#1E305C] p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase font-bold text-[#D4AF37]">Body Composition</span>
                <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <h3 className="text-lg font-bold uppercase font-display text-white mb-2">
                Log Today&apos;s Body Weight
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Track morning fasting weight weekly to verify caloric adherence and lean muscle gains.
              </p>
              <div className="space-y-3 bg-[#0A1128] p-3 rounded-xl border border-[#1E305C] text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Current Logged:</span>
                  <span className="font-bold text-white text-sm">{currentWeight} kg</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    step="0.1"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded bg-[#050B17] border border-[#1E305C] text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                  <button
                    onClick={() => setWeightLogged(true)}
                    className="px-3 py-1.5 rounded bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black uppercase text-[10px] shrink-0"
                  >
                    Save
                  </button>
                </div>
                {weightLogged && (
                  <p className="text-[10px] text-emerald-400 font-semibold">Weight entry recorded for today!</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[#1E305C] mt-6">
              <Link
                href="/transformations"
                className="w-full py-2.5 rounded-lg bg-[#0A1128] hover:bg-[#17254A] text-white text-xs font-bold uppercase tracking-wider border border-[#1E305C] transition-colors flex items-center justify-center space-x-1"
              >
                <span>View Gym Hall of Fame</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Member Attendance History List */}
        <div className="bg-[#101B37] rounded-2xl border border-[#1E305C] p-6 shadow-xl">
          <h3 className="text-lg font-bold uppercase font-display text-white mb-4 flex items-center justify-between">
            <span>Your Attendance History</span>
            <span className="text-xs text-slate-400 font-normal">{attendance.length} Total Gym Visits</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A1128] text-slate-400 uppercase font-bold text-[10px] border-b border-[#1E305C]">
                <tr>
                  <th className="py-3 px-4">Visit Date &amp; Time</th>
                  <th className="py-3 px-4">Check-In Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Fee Charged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E305C]">
                {attendance.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400">
                      No visits recorded yet. Use Check In Today to record a visit.
                    </td>
                  </tr>
                ) : (
                  attendance.map((att) => (
                    <tr key={att.id} className="hover:bg-[#0A1128]/50">
                      <td className="py-3 px-4 text-white font-semibold">
                        {new Date(att.check_in_time).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 uppercase text-[#D4AF37] font-bold text-[10px]">
                        {att.check_in_method} Code Scan
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                          {att.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-emerald-400 font-bold">
                        ₹0.00 (Free)
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


