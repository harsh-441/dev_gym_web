'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  UserCheck,
  CalendarCheck,
  CalendarOff,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  X,
  LogOut
} from 'lucide-react';
import { api, BRAND, StaffAttendance, LeaveApplication, validateLeaveApplication } from '@parshuram/shared';

export default function EmployeePortalPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [employee, setEmployee] = useState<any>(null);
  const [staffAttendance, setStaffAttendance] = useState<StaffAttendance[]>([]);
  const [leaves, setLeaves] = useState<LeaveApplication[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Check in/out state
  const [clockLoading, setClockLoading] = useState(false);
  const [clockMessage, setClockMessage] = useState<string | null>(null);

  // Leave Form modal state
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveTypeId, setLeaveTypeId] = useState('lt-1');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [leaveErrors, setLeaveErrors] = useState<Record<string, string>>({});
  const [leaveSubmitting, setLeaveSubmitting] = useState(false);
  const [leaveSuccess, setLeaveSuccess] = useState(false);

  useEffect(() => {
    const userEmail = localStorage.getItem('pfg_user_email');
    if (!userEmail) {
      router.push('/auth/login');
      return;
    }

    const loadStaffData = async () => {
      try {
        const res = await fetch(`/api/auth/me?email=${encodeURIComponent(userEmail)}`);
        const data = await res.json();

        setLeaveTypes([...(api as any).store.leaveTypes]);

        if (data.success && data.profile) {
          setProfile(data.profile);
          setEmployee(data.employee);

          const allStaffAtt: StaffAttendance[] = (api as any).store.staffAttendance;
          const allLeaves: LeaveApplication[] = (api as any).store.leaveApplications;

          if (data.employee) {
            setStaffAttendance(allStaffAtt.filter((a) => a.employee_id === data.employee.id));
            setLeaves(allLeaves.filter((l) => l.employee_id === data.employee.id));
          } else {
            setStaffAttendance(allStaffAtt);
            setLeaves(allLeaves);
          }
        } else {
          // Fallback to first trainer
          setProfile((api as any).store.profiles.find((p: any) => p.role === 'trainer'));
          setEmployee((api as any).store.employees[1]);
          setStaffAttendance([...(api as any).store.staffAttendance]);
          setLeaves([...(api as any).store.leaveApplications]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStaffData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('pfg_user_token');
    localStorage.removeItem('pfg_user_email');
    localStorage.removeItem('pfg_user_role');
    localStorage.removeItem('pfg_user_name');
    router.push('/auth/login');
  };

  const activeShift = staffAttendance.find(
    (a) => employee && a.employee_id === employee.id && !a.check_out_time
  );

  const handleClockIn = async () => {
    if (!employee) return;
    setClockLoading(true);
    setClockMessage(null);
    try {
      const active = await api.getActiveQRSession();
      const res = await fetch('/api/attendance/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: employee.id,
          userType: 'staff',
          token: active.token,
          method: 'qr'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setClockMessage(data.message);
        const allAtt: StaffAttendance[] = (api as any).store.staffAttendance;
        setStaffAttendance(allAtt.filter((a) => a.employee_id === employee.id));
      } else {
        setClockMessage(data.error);
      }
    } catch (err: any) {
      setClockMessage('Error recording check-in.');
    } finally {
      setClockLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!employee) return;
    setClockLoading(true);
    setClockMessage(null);
    try {
      const res = await fetch('/api/attendance/check-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: employee.id })
      });
      const data = await res.json();
      if (res.ok) {
        setClockMessage(data.message);
        const allAtt: StaffAttendance[] = (api as any).store.staffAttendance;
        setStaffAttendance(allAtt.filter((a) => a.employee_id === employee.id));
      } else {
        setClockMessage(data.error);
      }
    } catch (err: any) {
      setClockMessage('Error recording check-out.');
    } finally {
      setClockLoading(false);
    }
  };

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;
    setLeaveErrors({});
    setLeaveSuccess(false);

    const validation = validateLeaveApplication({
      employeeId: employee.id,
      leaveTypeId,
      startDate,
      endDate,
      reason
    });

    if (!validation.isValid) {
      setLeaveErrors(validation.errors);
      return;
    }

    setLeaveSubmitting(true);
    try {
      const res = await fetch('/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: employee.id,
          leaveTypeId,
          startDate,
          endDate,
          reason
        })
      });

      const data = await res.json();
      if (res.ok) {
        setLeaveSuccess(true);
        const allLeaves: LeaveApplication[] = (api as any).store.leaveApplications;
        setLeaves(allLeaves.filter((l) => l.employee_id === employee.id));
        setReason('');
        setTimeout(() => setShowLeaveModal(false), 1200);
      } else {
        alert(data.error || 'Failed to submit leave.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLeaveSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#050B17] min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs uppercase font-bold text-slate-400">Loading Staff Terminal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#050B17] min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Greeting */}
        <div className="bg-[#101B37] rounded-2xl border border-[#1E305C] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1E305C] via-[#101B37] to-[#0A1128] border border-[#D4AF37] flex items-center justify-center font-black text-2xl text-[#D4AF37] shadow-lg">
              {profile?.full_name?.charAt(0) || 'S'}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest">
                Parshuram Staff &amp; Coach Terminal
              </span>
              <h1 className="text-2xl sm:text-3xl font-black uppercase font-display text-white mt-0.5">
                {profile?.full_name || 'Staff Member'}
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                {employee?.designation || 'Strength Coach'} • Department: {employee?.department || 'Fitness Training'} • Status: <span className="text-emerald-400 font-bold uppercase">{employee?.status || 'Active'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => {
                setShowLeaveModal(true);
                setLeaveSuccess(false);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#E5C158] hover:to-[#D4AF37] text-[#050B17] text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-1.5 shadow-md shadow-black/50"
            >
              <Plus className="w-4 h-4" />
              <span>Apply For Leave</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl bg-[#0A1128] hover:bg-red-950/40 border border-[#1E305C] text-red-300 text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Staff Shift Clock In / Clock Out Card */}
        <div className="bg-[#101B37] rounded-2xl border border-[#1E305C] p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E305C] pb-4 mb-6">
            <div>
              <span className="text-xs uppercase font-bold text-[#D4AF37]">Daily Shift Tracker</span>
              <h3 className="text-xl font-black uppercase font-display text-white mt-0.5">
                Today&apos;s Work Shift Status
              </h3>
            </div>
            <div>
              <span className={`text-xs font-bold uppercase px-3 py-1.5 rounded-full border ${
                activeShift
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-600'
                  : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}>
                {activeShift ? 'Currently Shift Active' : 'Off Shift / Checked Out'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Staff and coach attendance is strictly recorded on the server with exact check-in and check-out timestamps to compute daily work duration. Member gym visits and staff shifts are maintained in distinct database tables.
              </p>

              <div className="flex items-center space-x-3">
                {!activeShift ? (
                  <button
                    onClick={handleClockIn}
                    disabled={clockLoading}
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider text-xs transition-colors flex items-center space-x-2 shadow-lg disabled:opacity-50"
                  >
                    <Clock className="w-4 h-4" />
                    <span>{clockLoading ? 'Recording...' : 'Clock In (Start Shift)'}</span>
                  </button>
                ) : (
                  <button
                    onClick={handleClockOut}
                    disabled={clockLoading}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#E5C158] hover:to-[#D4AF37] text-[#050B17] font-black uppercase tracking-wider text-xs transition-all flex items-center space-x-2 shadow-lg disabled:opacity-50"
                  >
                    <Clock className="w-4 h-4" />
                    <span>{clockLoading ? 'Recording...' : 'Clock Out (End Shift)'}</span>
                  </button>
                )}
              </div>

              {clockMessage && (
                <p className="text-xs text-[#CBD5E1] mt-3 bg-[#0A1128] p-2.5 rounded-lg border border-[#1E305C]">
                  {clockMessage}
                </p>
              )}
            </div>

            <div className="bg-[#0A1128] p-5 rounded-xl border border-[#1E305C] text-xs space-y-2">
              <span className="font-bold uppercase text-white block mb-1">Standard Shift Schedule</span>
              <p className="text-slate-300">Morning Shift: 05:30 AM – 01:30 PM</p>
              <p className="text-slate-300">Evening Shift: 02:30 PM – 10:30 PM</p>
              <p className="text-[11px] text-slate-400 pt-1 border-t border-[#1E305C]">
                Late threshold: 15 minutes. Supervised directly by Dave.
              </p>
            </div>
          </div>
        </div>

        {/* Leave Applications History */}
        <div className="bg-[#101B37] rounded-2xl border border-[#1E305C] p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-[#1E305C] pb-3">
            <h3 className="text-lg font-bold uppercase font-display text-white">
              My Leave Applications &amp; Status
            </h3>
            <span className="text-xs text-slate-400">Database Record</span>
          </div>

          {leaves.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No leave applications submitted yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0A1128] text-slate-400 uppercase font-bold text-[10px] border-b border-[#1E305C]">
                  <tr>
                    <th className="py-3 px-4">Dates</th>
                    <th className="py-3 px-4">Leave Type</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4">Dave&apos;s Review Note</th>
                    <th className="py-3 px-4">Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E305C]">
                  {leaves.map((leave) => (
                    <tr key={leave.id} className="hover:bg-[#0A1128]/50">
                      <td className="py-3 px-4 text-white font-semibold">
                        {leave.start_date} to {leave.end_date}
                      </td>
                      <td className="py-3 px-4 text-[#D4AF37]">
                        {leaveTypes.find((lt) => lt.id === leave.leave_type_id)?.name || 'Casual'}
                      </td>
                      <td className="py-3 px-4 text-slate-300 max-w-xs">{leave.reason}</td>
                      <td className="py-3 px-4 text-slate-400 italic">
                        {leave.admin_note || 'Awaiting Dave review...'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                          leave.status === 'approved'
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700'
                            : leave.status === 'rejected'
                            ? 'bg-red-950/60 text-red-300 border-red-700'
                            : 'bg-amber-950/60 text-amber-300 border-amber-700'
                        }`}>
                          {leave.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Apply Leave Modal */}
        {showLeaveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#101B37] border border-[#1E305C] rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-[#1E305C] pb-3 mb-4">
                <h3 className="text-base font-bold uppercase font-display text-white">
                  Apply for Leave
                </h3>
                <button onClick={() => setShowLeaveModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {leaveSuccess ? (
                <div className="bg-emerald-950/40 border border-emerald-600 rounded-xl p-6 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-sm font-bold text-white">Leave Submitted to Dave!</h4>
                  <p className="text-xs text-slate-300">
                    Application created with Pending status. Dave will review and notify you.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApplyLeave} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Leave Category</label>
                    <select
                      value={leaveTypeId}
                      onChange={(e) => setLeaveTypeId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
                    >
                      {leaveTypes.map((lt) => (
                        <option key={lt.id} value={lt.id}>
                          {lt.name} (Max {lt.max_days_per_year} days/yr)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Start Date</label>
                      <input
                        type="date"
                        required
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
                      />
                      {leaveErrors.startDate && <p className="text-[10px] text-red-400 mt-0.5">{leaveErrors.startDate}</p>}
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">End Date</label>
                      <input
                        type="date"
                        required
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
                      />
                      {leaveErrors.endDate && <p className="text-[10px] text-red-400 mt-0.5">{leaveErrors.endDate}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Reason for Leave</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="e.g. Attending family function in Jaipur, shift coverage arranged..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white placeholder-slate-500 focus:border-[#D4AF37] focus:outline-none"
                    />
                    {leaveErrors.reason && <p className="text-[10px] text-red-400 mt-0.5">{leaveErrors.reason}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={leaveSubmitting}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#E5C158] hover:to-[#D4AF37] text-[#050B17] font-black uppercase tracking-wider transition-all disabled:opacity-50"
                  >
                    {leaveSubmitting ? 'Submitting...' : 'Submit to Dave for Approval'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


