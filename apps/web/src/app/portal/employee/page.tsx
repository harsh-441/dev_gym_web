'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  UserCheck,
  CalendarCheck,
  CalendarOff,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  X
} from 'lucide-react';
import { api, BRAND, StaffAttendance, LeaveApplication, validateLeaveApplication } from '@parshuram/shared';

export default function EmployeePortalPage() {
  const [employee, setEmployee] = useState<any>((api as any).store.employees[1]); // Coach Vikram
  const [profile, setProfile] = useState<any>((api as any).store.profiles.find((p: any) => p.id === (api as any).store.employees[1]?.profile_id));
  const [staffAttendance, setStaffAttendance] = useState<StaffAttendance[]>([...(api as any).store.staffAttendance]);
  const [leaves, setLeaves] = useState<LeaveApplication[]>([...(api as any).store.leaveApplications]);
  const [leaveTypes, setLeaveTypes] = useState<any[]>([...(api as any).store.leaveTypes]);

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

  const activeShift = staffAttendance.find(
    (a) => a.employee_id === employee.id && !a.check_out_time
  );

  const handleClockIn = async () => {
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
        setStaffAttendance([...(api as any).store.staffAttendance]);
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
        setStaffAttendance([...(api as any).store.staffAttendance]);
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
        setLeaves([...(api as any).store.leaveApplications]);
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

  const myLeaves = leaves.filter((l) => l.employee_id === employee.id);

  return (
    <div className="bg-gym-black min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Greeting */}
        <div className="bg-gym-card rounded-2xl border border-gym-border p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gym-charcoal via-zinc-800 to-gym-black flex items-center justify-center font-black text-2xl text-white border border-gym-silver shadow-lg">
              {profile?.full_name?.charAt(0) || 'V'}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gym-silver tracking-widest">
                Parshuram Staff &amp; Coach Terminal
              </span>
              <h1 className="text-2xl sm:text-3xl font-black uppercase font-display text-white mt-0.5">
                {profile?.full_name || 'Vikram Rathore'}
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                {employee?.designation} • Department: {employee?.department}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setShowLeaveModal(true);
              setLeaveSuccess(false);
            }}
            className="px-4 py-2.5 rounded-xl bg-gym-red hover:bg-gym-redHover text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 shadow-md shadow-red-950/60 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Apply For Leave</span>
          </button>
        </div>

        {/* Staff Shift Clock In / Clock Out Card */}
        <div className="bg-gym-card rounded-2xl border border-gym-border p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gym-border pb-4 mb-6">
            <div>
              <span className="text-xs uppercase font-bold text-gym-silver">Daily Shift Tracker</span>
              <h3 className="text-xl font-black uppercase font-display text-white mt-0.5">
                Today&apos;s Work Shift Status
              </h3>
            </div>
            <div>
              <span className={`text-xs font-bold uppercase px-3 py-1.5 rounded-full border ${
                activeShift
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}>
                {activeShift ? 'Currently Shift Active' : 'Off Shift / Checked Out'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-xs text-zinc-300 leading-relaxed mb-4">
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
                    className="px-6 py-3 rounded-xl bg-gym-red hover:bg-gym-redHover text-white font-bold uppercase tracking-wider text-xs transition-colors flex items-center space-x-2 shadow-lg disabled:opacity-50"
                  >
                    <Clock className="w-4 h-4" />
                    <span>{clockLoading ? 'Recording...' : 'Clock Out (End Shift)'}</span>
                  </button>
                )}
              </div>

              {clockMessage && (
                <p className="text-xs text-gym-silver mt-3 bg-gym-charcoal p-2.5 rounded-lg border border-gym-border">
                  {clockMessage}
                </p>
              )}
            </div>

            <div className="bg-gym-charcoal p-5 rounded-xl border border-gym-border text-xs space-y-2">
              <span className="font-bold uppercase text-white block mb-1">Standard Shift Schedule</span>
              <p className="text-zinc-300">Morning Shift: 05:30 AM – 01:30 PM</p>
              <p className="text-zinc-300">Evening Shift: 02:30 PM – 10:30 PM</p>
              <p className="text-[11px] text-zinc-400 pt-1 border-t border-gym-border">
                Late threshold: 15 minutes. Supervised directly by Dave.
              </p>
            </div>
          </div>
        </div>

        {/* Leave Applications History */}
        <div className="bg-gym-card rounded-2xl border border-gym-border p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-gym-border pb-3">
            <h3 className="text-lg font-bold uppercase font-display text-white">
              My Leave Applications &amp; Status
            </h3>
            <span className="text-xs text-zinc-400">Authoritative Supabase Record</span>
          </div>

          {myLeaves.length === 0 ? (
            <p className="text-xs text-zinc-400 py-6 text-center">No leave applications submitted yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gym-charcoal text-zinc-400 uppercase font-bold text-[10px] border-b border-gym-border">
                  <tr>
                    <th className="py-3 px-4">Dates</th>
                    <th className="py-3 px-4">Leave Type</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4">Dave&apos;s Review Note</th>
                    <th className="py-3 px-4">Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gym-border">
                  {myLeaves.map((leave) => (
                    <tr key={leave.id} className="hover:bg-gym-charcoal/50">
                      <td className="py-3 px-4 text-white font-semibold">
                        {leave.start_date} to {leave.end_date}
                      </td>
                      <td className="py-3 px-4 text-gym-silver">
                        {leaveTypes.find((lt) => lt.id === leave.leave_type_id)?.name || 'Casual'}
                      </td>
                      <td className="py-3 px-4 text-zinc-300 max-w-xs">{leave.reason}</td>
                      <td className="py-3 px-4 text-zinc-400 italic">
                        {leave.admin_note || 'Awaiting Dave review...'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                          leave.status === 'approved'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                            : leave.status === 'rejected'
                            ? 'bg-red-950 text-red-300 border-red-700'
                            : 'bg-amber-950 text-amber-300 border-amber-700'
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
            <div className="bg-gym-card border border-gym-border rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-gym-border pb-3 mb-4">
                <h3 className="text-base font-bold uppercase font-display text-white">
                  Apply for Leave
                </h3>
                <button onClick={() => setShowLeaveModal(false)} className="text-zinc-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {leaveSuccess ? (
                <div className="bg-emerald-950/40 border border-emerald-600 rounded-xl p-6 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-sm font-bold text-white">Leave Submitted to Dave!</h4>
                  <p className="text-xs text-zinc-300">
                    Application created with Pending status. Dave will review and notify you.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApplyLeave} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Leave Category</label>
                    <select
                      value={leaveTypeId}
                      onChange={(e) => setLeaveTypeId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
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
                      <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Start Date</label>
                      <input
                        type="date"
                        required
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
                      />
                      {leaveErrors.startDate && <p className="text-[10px] text-gym-red mt-0.5">{leaveErrors.startDate}</p>}
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">End Date</label>
                      <input
                        type="date"
                        required
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
                      />
                      {leaveErrors.endDate && <p className="text-[10px] text-gym-red mt-0.5">{leaveErrors.endDate}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Reason for Leave</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="e.g. Attending family function in Jaipur, shift coverage arranged..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white placeholder-zinc-500 focus:border-gym-red focus:outline-none"
                    />
                    {leaveErrors.reason && <p className="text-[10px] text-gym-red mt-0.5">{leaveErrors.reason}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={leaveSubmitting}
                    className="w-full py-2.5 rounded-xl bg-gym-red hover:bg-gym-redHover text-white font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
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
