'use client';

import React, { useState, useEffect } from 'react';
import {
  QrCode,
  CalendarCheck,
  RefreshCw,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  ShieldAlert,
  AlertTriangle,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { api, AttendanceQRSession, MemberAttendance, StaffAttendance } from '@parshuram/shared';

export default function AdminAttendancePage() {
  const [activeTab, setActiveTab] = useState<'members' | 'staff'>('members');
  const [memberAttendance, setMemberAttendance] = useState<MemberAttendance[]>([...(api as any).store.memberAttendance]);
  const [staffAttendance, setStaffAttendance] = useState<StaffAttendance[]>([...(api as any).store.staffAttendance]);
  const [qrSession, setQrSession] = useState<AttendanceQRSession | null>(null);
  const [qrDuration, setQrDuration] = useState(60);
  const [refreshing, setRefreshing] = useState(false);

  // Correction Modal
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionTarget, setCorrectionTarget] = useState<any>(null);
  const [correctionReason, setCorrectionReason] = useState('');
  const [newCheckInTime, setNewCheckInTime] = useState('');

  const loadData = async () => {
    const session = await api.getActiveQRSession();
    setQrSession(session);
    setMemberAttendance([...(api as any).store.memberAttendance]);
    setStaffAttendance([...(api as any).store.staffAttendance]);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRefreshQR = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/attendance/qr-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ durationSeconds: qrDuration, type: 'universal' })
      });
      const data = await res.json();
      if (data.session) {
        setQrSession(data.session);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (activeTab === 'members') {
      csvContent += 'ID,Member_ID,CheckIn_Time,CheckIn_Method,Status\n';
      memberAttendance.forEach((a) => {
        csvContent += `${a.id},${a.member_id},${a.check_in_time},${a.check_in_method},${a.status}\n`;
      });
    } else {
      csvContent += 'ID,Employee_ID,CheckIn_Time,CheckOut_Time,Shift_Hours,Status\n';
      staffAttendance.forEach((a) => {
        csvContent += `${a.id},${a.employee_id},${a.check_in_time},${a.check_out_time || 'ACTIVE'},${a.shift_hours || '—'},${a.status}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `parshuram_gym_${activeTab}_attendance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenCorrection = (record: any) => {
    setCorrectionTarget(record);
    setNewCheckInTime(record.check_in_time);
    setCorrectionReason('');
    setShowCorrectionModal(true);
  };

  const handleSaveCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionTarget || !correctionReason || !newCheckInTime) return;

    if (activeTab === 'members') {
      const rec = memberAttendance.find((m) => m.id === correctionTarget.id);
      if (rec) rec.check_in_time = new Date(newCheckInTime).toISOString();
      setMemberAttendance([...memberAttendance]);
    } else {
      const rec = staffAttendance.find((s) => s.id === correctionTarget.id);
      if (rec) rec.check_in_time = new Date(newCheckInTime).toISOString();
      setStaffAttendance([...staffAttendance]);
    }

    setShowCorrectionModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gym-card p-6 rounded-2xl border border-gym-border shadow-xl">
        <div>
          <span className="text-xs uppercase font-bold text-gym-red tracking-wider">Module C</span>
          <h1 className="text-2xl font-black uppercase font-display text-white mt-0.5">
            Attendance &amp; Live QR Terminal
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Server-recorded timestamps, anti-spoofing rotating tokens, separate staff shifts, and audit logs.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-xl bg-gym-charcoal hover:bg-zinc-800 border border-gym-border text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4 text-gym-silver" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* QR Control & Terminal Display */}
      <div className="bg-gym-card rounded-2xl border border-gym-red/50 p-6 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex flex-col items-center text-center">
            <div className="p-4 bg-white rounded-2xl shadow-xl border-4 border-gym-red inline-block mb-3">
              <QrCode className="w-40 h-40 text-black" />
            </div>
            <span className="text-[10px] font-mono font-bold text-gym-silver bg-gym-black px-3 py-1 rounded border border-gym-border">
              TOKEN: {qrSession?.token}
            </span>
          </div>

          <div className="lg:col-span-8 space-y-4 border-t lg:border-t-0 lg:border-l border-gym-border pt-6 lg:pt-0 lg:pl-8 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-gym-red tracking-wider">
                Front Entrance Terminal Controller
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 font-bold uppercase">
                Session Active
              </span>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              Display this QR terminal at the Parshuram Gym reception desk. Members scan with the Member Mobile App to mark their <strong>100% free</strong> gym visit. Employees scan with the Employee App to begin/end their shift.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gym-charcoal p-4 rounded-xl border border-gym-border">
              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">
                  Token Validity Window (Seconds)
                </label>
                <select
                  value={qrDuration}
                  onChange={(e) => setQrDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-gym-black border border-gym-border text-white text-xs focus:border-gym-red focus:outline-none"
                >
                  <option value={30}>30 Seconds (Strict Security)</option>
                  <option value={60}>60 Seconds (Recommended)</option>
                  <option value={120}>120 Seconds (High Traffic)</option>
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <button
                  onClick={handleRefreshQR}
                  disabled={refreshing}
                  className="w-full py-2.5 rounded-lg bg-gym-red hover:bg-gym-redHover text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5 shadow-md shadow-red-950/60"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>Generate New QR Token</span>
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-[11px] text-zinc-400">
              <ShieldAlert className="w-4 h-4 text-gym-silver shrink-0" />
              <span>Duplicate check-ins are blocked automatically by the server.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for Member vs Staff Attendance */}
      <div className="flex border-b border-gym-border">
        <button
          onClick={() => setActiveTab('members')}
          className={`py-3 px-6 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'members'
              ? 'border-gym-red text-gym-red'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Member Gym Visits ({memberAttendance.length})
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`py-3 px-6 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'staff'
              ? 'border-gym-red text-gym-red'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Staff Shift Clock-In/Out ({staffAttendance.length})
        </button>
      </div>

      {/* Attendance Records Table */}
      <div className="bg-gym-card rounded-2xl border border-gym-border overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gym-charcoal text-zinc-400 uppercase font-bold text-[10px] border-b border-gym-border">
              {activeTab === 'members' ? (
                <tr>
                  <th className="py-3.5 px-4">Member Name</th>
                  <th className="py-3.5 px-4">Check-In Time</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Audit &amp; Correction</th>
                </tr>
              ) : (
                <tr>
                  <th className="py-3.5 px-4">Staff Member</th>
                  <th className="py-3.5 px-4">Check-In Time</th>
                  <th className="py-3.5 px-4">Check-Out Time</th>
                  <th className="py-3.5 px-4">Total Hours</th>
                  <th className="py-3.5 px-4">Shift Status</th>
                  <th className="py-3.5 px-4 text-right">Audit &amp; Correction</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-gym-border">
              {activeTab === 'members' ? (
                memberAttendance.map((rec) => {
                  const member = (api as any).store.members.find((m: any) => m.id === rec.member_id);
                  const profile = member
                    ? (api as any).store.profiles.find((p: any) => p.id === member.profile_id)
                    : null;

                  return (
                    <tr key={rec.id} className="hover:bg-gym-charcoal/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white block">{profile?.full_name || 'Member'}</span>
                        <span className="text-[10px] text-zinc-400">{profile?.email}</span>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-300">
                        {new Date(rec.check_in_time).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold uppercase text-gym-silver bg-gym-charcoal px-2 py-0.5 rounded border border-gym-border">
                          {rec.check_in_method}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800">
                          {rec.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenCorrection(rec)}
                          className="px-2.5 py-1 rounded bg-gym-charcoal border border-gym-border text-zinc-300 hover:text-white text-[11px] font-semibold"
                        >
                          Manual Correction
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                staffAttendance.map((rec) => {
                  const emp = (api as any).store.employees.find((e: any) => e.id === rec.employee_id);
                  const profile = emp
                    ? (api as any).store.profiles.find((p: any) => p.id === emp.profile_id)
                    : null;

                  return (
                    <tr key={rec.id} className="hover:bg-gym-charcoal/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white block">{profile?.full_name || 'Staff Member'}</span>
                        <span className="text-[10px] text-zinc-400">{emp?.designation}</span>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-300">
                        {new Date(rec.check_in_time).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-300">
                        {rec.check_out_time ? new Date(rec.check_out_time).toLocaleString() : 'Shift In Progress'}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        {rec.shift_hours ? `${rec.shift_hours} hrs` : 'Active'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold uppercase text-gym-silver bg-gym-charcoal px-2 py-0.5 rounded border border-gym-border">
                          {rec.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenCorrection(rec)}
                          className="px-2.5 py-1 rounded bg-gym-charcoal border border-gym-border text-zinc-300 hover:text-white text-[11px] font-semibold"
                        >
                          Manual Correction
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Correction Modal with Audit Log */}
      {showCorrectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gym-card border border-gym-border rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-gym-border pb-3 mb-4">
              <h3 className="text-base font-bold uppercase font-display text-white">
                Authorized Attendance Correction
              </h3>
              <button onClick={() => setShowCorrectionModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCorrection} className="space-y-4 text-xs">
              <div className="bg-gym-charcoal p-3 rounded-lg border border-gym-border">
                <p className="text-zinc-300">
                  Target Record: <span className="font-bold text-white">{correctionTarget?.id}</span>
                </p>
                <p className="text-[10px] text-zinc-400 mt-1">
                  Original Time: {new Date(correctionTarget?.check_in_time).toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">New Check-In Timestamp</label>
                <input
                  type="datetime-local"
                  required
                  value={newCheckInTime ? new Date(newCheckInTime).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setNewCheckInTime(new Date(e.target.value).toISOString())}
                  className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Reason for Dave&apos;s Correction (Audit Log)</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Member phone ran out of battery at turnstile; verified by front desk..."
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white placeholder-zinc-500 focus:border-gym-red focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gym-red hover:bg-gym-redHover text-white font-bold uppercase tracking-wider transition-colors"
                >
                  Save &amp; Log Audit Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
