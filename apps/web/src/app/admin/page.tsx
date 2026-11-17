'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  UserCheck,
  CalendarCheck,
  CalendarOff,
  QrCode,
  RefreshCw,
  MessageSquare,
  ArrowRight,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api, AttendanceQRSession, BRAND } from '@parshuram/shared';

export default function AdminOverviewPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [qrSession, setQrSession] = useState<AttendanceQRSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshingQR, setRefreshingQR] = useState(false);

  const fetchMetrics = async () => {
    try {
      const data = await api.getAdminDashboardMetrics();
      setMetrics(data);
      const session = await api.getActiveQRSession();
      setQrSession(session);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleRefreshQR = async () => {
    setRefreshingQR(true);
    try {
      const res = await fetch('/api/attendance/qr-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ durationSeconds: 60, type: 'universal' })
      });
      const data = await res.json();
      if (data.session) {
        setQrSession(data.session);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshingQR(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-gym-red animate-spin mx-auto mb-3" />
          <p className="text-xs text-zinc-400 uppercase tracking-wider">Loading Dave&apos;s Central Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gym-card p-6 rounded-2xl border border-gym-border shadow-xl">
        <div>
          <span className="text-xs uppercase font-bold text-gym-red tracking-widest">
            {BRAND.name} • Executive Center
          </span>
          <h1 className="text-3xl font-black uppercase font-display text-white mt-1">
            Welcome, Dave
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Centralized operations command: members, staff attendance, leave approvals, and front desk enquiries.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/attendance"
            className="px-4 py-2.5 rounded-xl bg-gym-red hover:bg-gym-redHover text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-red-950/60 flex items-center space-x-2"
          >
            <QrCode className="w-4 h-4" />
            <span>Launch Floor QR</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Members */}
        <div className="bg-gym-card p-4 rounded-xl border border-gym-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-bold uppercase">Total Members</span>
            <Users className="w-4 h-4 text-gym-silver" />
          </div>
          <div>
            <p className="text-2xl font-black text-white font-display">{metrics?.totalMembers || 0}</p>
            <span className="text-[10px] text-emerald-400 font-semibold">{metrics?.activeMembers || 0} Active</span>
          </div>
        </div>

        {/* Total Employees */}
        <div className="bg-gym-card p-4 rounded-xl border border-gym-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-bold uppercase">Staff &amp; Coaches</span>
            <UserCheck className="w-4 h-4 text-gym-red" />
          </div>
          <div>
            <p className="text-2xl font-black text-white font-display">{metrics?.totalEmployees || 0}</p>
            <span className="text-[10px] text-zinc-400">Trainers + Operations</span>
          </div>
        </div>

        {/* Today's Member Attendance */}
        <div className="bg-gym-card p-4 rounded-xl border border-gym-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-bold uppercase">Member Visits Today</span>
            <CalendarCheck className="w-4 h-4 text-gym-silver" />
          </div>
          <div>
            <p className="text-2xl font-black text-gym-red font-display">{metrics?.todayMemberAttendance || 0}</p>
            <span className="text-[10px] text-emerald-400 font-semibold">100% Free Check-ins</span>
          </div>
        </div>

        {/* Today's Staff Attendance */}
        <div className="bg-gym-card p-4 rounded-xl border border-gym-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-bold uppercase">Staff Shifts Today</span>
            <CalendarCheck className="w-4 h-4 text-gym-red" />
          </div>
          <div>
            <p className="text-2xl font-black text-white font-display">{metrics?.todayStaffAttendance || 0}</p>
            <span className="text-[10px] text-zinc-400">Separate Shift Log</span>
          </div>
        </div>

        {/* Pending Leaves */}
        <div className="bg-gym-card p-4 rounded-xl border border-gym-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-bold uppercase">Pending Leaves</span>
            <CalendarOff className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-black text-amber-400 font-display">{metrics?.pendingLeaves || 0}</p>
            <Link href="/admin/leaves" className="text-[10px] text-gym-red font-bold hover:underline">
              Action Required →
            </Link>
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="bg-gym-card p-4 rounded-xl border border-gym-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-[11px] font-bold uppercase">New Enquiries</span>
            <MessageSquare className="w-4 h-4 text-gym-silver" />
          </div>
          <div>
            <p className="text-2xl font-black text-white font-display">{metrics?.recentEnquiries?.length || 0}</p>
            <Link href="/admin/enquiries" className="text-[10px] text-gym-silver font-bold hover:underline">
              View Leads →
            </Link>
          </div>
        </div>
      </div>

      {/* Real-Time Live QR Attendance Widget + Pending Leaves Action Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Active QR Session Display */}
        <div className="lg:col-span-6 bg-gym-card rounded-2xl border border-gym-border p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-gym-border pb-3">
              <div>
                <span className="text-xs uppercase font-bold text-gym-red">Live Gym Entrance Terminal</span>
                <h3 className="text-lg font-black uppercase text-white font-display mt-0.5">
                  Rotating QR Code Session
                </h3>
              </div>
              <button
                onClick={handleRefreshQR}
                disabled={refreshingQR}
                className="px-3 py-1.5 rounded-lg bg-gym-charcoal hover:bg-zinc-800 border border-gym-border text-xs font-bold text-white flex items-center space-x-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-gym-red ${refreshingQR ? 'animate-spin' : ''}`} />
                <span>Refresh Code</span>
              </button>
            </div>

            <div className="bg-gym-black rounded-xl p-6 border border-gym-border text-center flex flex-col items-center justify-center my-4">
              {/* Stylized QR Visual Frame */}
              <div className="p-4 bg-white rounded-2xl shadow-xl border-4 border-gym-red">
                <div className="w-44 h-44 flex flex-col items-center justify-center text-black">
                  <QrCode className="w-36 h-36" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-black mt-1">
                    PARSHURAM GYM QR
                  </span>
                </div>
              </div>

              <div className="mt-4 text-center">
                <span className="text-[11px] font-mono text-gym-silver bg-gym-charcoal px-3 py-1 rounded-md border border-gym-border">
                  Token: {qrSession?.token}
                </span>
                <p className="text-[11px] text-zinc-400 mt-2">
                  Expires in ~{qrSession?.valid_duration_seconds || 60} seconds. Auto-rotates to prevent screenshot sharing.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gym-border flex items-center justify-between text-xs text-zinc-400">
            <span>Free Attendance Mode: Active</span>
            <Link href="/admin/attendance" className="text-gym-red font-bold hover:underline">
              View Detailed Logs &amp; Reports →
            </Link>
          </div>
        </div>

        {/* Quick Review of Pending Leaves */}
        <div className="lg:col-span-6 bg-gym-card rounded-2xl border border-gym-border p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-gym-border pb-3">
              <div>
                <span className="text-xs uppercase font-bold text-amber-400">Staff Management</span>
                <h3 className="text-lg font-black uppercase text-white font-display mt-0.5">
                  Pending Leave Applications
                </h3>
              </div>
              <Link
                href="/admin/leaves"
                className="text-xs font-bold text-gym-silver hover:text-white uppercase flex items-center"
              >
                <span>All Leaves</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="space-y-3">
              {(api as any).store.leaveApplications.filter((l: any) => l.status === 'pending').length === 0 ? (
                <div className="text-center py-10 bg-gym-charcoal rounded-xl border border-gym-border">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-white uppercase">All caught up!</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">No pending employee leave requests awaiting Dave&apos;s review.</p>
                </div>
              ) : (
                (api as any).store.leaveApplications
                  .filter((l: any) => l.status === 'pending')
                  .map((leave: any) => {
                    const emp = (api as any).store.employees.find((e: any) => e.id === leave.employee_id);
                    const prof = emp ? (api as any).store.profiles.find((p: any) => p.id === emp.profile_id) : null;
                    return (
                      <div
                        key={leave.id}
                        className="bg-gym-charcoal p-4 rounded-xl border border-gym-border flex flex-col justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">
                              {prof?.full_name || 'Staff Member'}
                            </span>
                            <span className="text-[10px] font-bold uppercase text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800">
                              Pending
                            </span>
                          </div>
                          <p className="text-[11px] text-gym-silver mt-0.5">
                            {leave.start_date} to {leave.end_date}
                          </p>
                          <p className="text-xs text-zinc-300 mt-2 italic bg-gym-black/40 p-2 rounded border border-gym-border/40">
                            &quot;{leave.reason}&quot;
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 pt-2 border-t border-gym-border">
                          <Link
                            href="/admin/leaves"
                            className="w-full py-2 rounded-lg bg-gym-red hover:bg-gym-redHover text-white text-center text-xs font-bold uppercase tracking-wider transition-colors"
                          >
                            Review &amp; Decide
                          </Link>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gym-border flex items-center justify-between text-xs text-zinc-400">
            <span>Authoritative Leave Record: Supabase Database</span>
            <span className="text-emerald-400 font-semibold">Configurable Allowance</span>
          </div>
        </div>
      </div>

      {/* Prospective Member Enquiries Feed */}
      <div className="bg-gym-card rounded-2xl border border-gym-border p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4 border-b border-gym-border pb-3">
          <div>
            <span className="text-xs uppercase font-bold text-gym-silver">Lead Pipeline</span>
            <h3 className="text-lg font-black uppercase text-white font-display mt-0.5">
              Recent Website Enquiries
            </h3>
          </div>
          <Link
            href="/admin/enquiries"
            className="text-xs font-bold text-gym-silver hover:text-white uppercase flex items-center"
          >
            <span>Manage All Enquiries</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gym-charcoal text-zinc-400 uppercase font-bold text-[10px] border-b border-gym-border">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Plan / Interest</th>
                <th className="py-3 px-4">Message</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gym-border">
              {metrics?.recentEnquiries?.map((enq: any) => (
                <tr key={enq.id} className="hover:bg-gym-charcoal/50">
                  <td className="py-3 px-4 font-bold text-white">{enq.full_name}</td>
                  <td className="py-3 px-4 text-zinc-300">
                    <p>{enq.phone}</p>
                    <p className="text-[10px] text-zinc-400">{enq.email}</p>
                  </td>
                  <td className="py-3 px-4 text-gym-silver">{enq.preferred_plan || 'General Tour'}</td>
                  <td className="py-3 px-4 text-zinc-400 max-w-xs truncate">{enq.message}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-gym-red/20 text-gym-red border border-gym-red/40">
                      {enq.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link href="/admin/enquiries" className="text-gym-silver hover:text-white font-bold underline">
                      Follow Up
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
