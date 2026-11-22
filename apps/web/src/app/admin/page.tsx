'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarCheck, CreditCard, MessageSquare, RefreshCw, Users } from 'lucide-react';
import { BRAND } from '@parshuram/shared';

type Metrics = { totalMembers: number; activeMembers: number; todayMemberAttendance: number; newEnquiries: number };

export default function AdminOverviewPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    try {
      const token = localStorage.getItem('pfg_user_token') || '';
      const response = await fetch('/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not load owner dashboard.');
      setMetrics(data.metrics); setError('');
    } catch (caught: any) { setError(caught.message || 'Could not load dashboard data.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const cards = [
    { label: 'Members', value: metrics?.totalMembers, note: `${metrics?.activeMembers ?? 0} active`, icon: Users },
    { label: "Today's attendance", value: metrics?.todayMemberAttendance, note: 'Gym local date', icon: CalendarCheck },
    { label: 'New enquiries', value: metrics?.newEnquiries, note: 'Awaiting follow-up', icon: MessageSquare }
  ];
  return <div className="space-y-8">
    <header className="flex flex-col gap-4 rounded-2xl border border-[#1E305C] bg-[#101B37] p-6 sm:flex-row sm:items-center sm:justify-between"><div><span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">{BRAND.name} · Owner administration</span><h1 className="mt-2 text-3xl font-black uppercase">Owner Dashboard</h1><p className="mt-2 text-sm text-slate-400">Member operations, attendance history, and gym management.</p></div><button onClick={load} className="rounded-lg border border-[#1E305C] px-4 py-2 text-xs font-bold"><RefreshCw className="mr-2 inline h-4 w-4"/>Refresh</button></header>
    {error && <p role="alert" className="rounded-xl border border-red-800 bg-red-950/40 p-4 text-sm text-red-200">{error}</p>}
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(({ label, value, note, icon: Icon }) => <div key={label} className="rounded-2xl border border-[#1E305C] bg-[#101B37] p-5"><div className="flex items-center justify-between text-slate-400"><span className="text-xs font-bold uppercase">{label}</span><Icon className="h-5 w-5 text-[#D4AF37]"/></div><p className="mt-4 text-3xl font-black">{loading ? '…' : value ?? '—'}</p><p className="mt-1 text-xs text-slate-400">{note}</p></div>)}</section>
    <section className="grid gap-4 sm:grid-cols-2"><Link href="/admin/members" className="rounded-2xl border border-[#1E305C] bg-[#101B37] p-6 hover:border-[#D4AF37]"><Users className="mb-3 h-6 w-6 text-[#D4AF37]"/><h2 className="font-bold uppercase">Manage members</h2><p className="mt-2 text-sm text-slate-400">Member profiles and account status.</p></Link><Link href="/admin/attendance" className="rounded-2xl border border-[#1E305C] bg-[#101B37] p-6 hover:border-[#D4AF37]"><CalendarCheck className="mb-3 h-6 w-6 text-[#D4AF37]"/><h2 className="font-bold uppercase">Attendance history</h2><p className="mt-2 text-sm text-slate-400">Search visits, mark attendance, correct entries, and export records.</p></Link><Link href="/admin/memberships" className="rounded-2xl border border-[#1E305C] bg-[#101B37] p-6 hover:border-[#D4AF37]"><CreditCard className="mb-3 h-6 w-6 text-[#D4AF37]"/><h2 className="font-bold uppercase">Membership plans</h2><p className="mt-2 text-sm text-slate-400">Review gym plan options and pricing.</p></Link></section>
  </div>;
}
