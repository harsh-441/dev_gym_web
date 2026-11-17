'use client';

import React, { useState } from 'react';
import {
  CalendarOff,
  CheckCircle2,
  XCircle,
  Filter,
  MessageSquare,
  Shield,
  Download,
  AlertCircle,
  X
} from 'lucide-react';
import { api, LeaveApplication, LeaveType } from '@parshuram/shared';

export default function AdminLeavesPage() {
  const [leaves, setLeaves] = useState<LeaveApplication[]>([...(api as any).store.leaveApplications]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLeave, setSelectedLeave] = useState<LeaveApplication | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const filteredLeaves = statusFilter === 'all'
    ? leaves
    : leaves.filter((l) => l.status === statusFilter);

  const handleReview = async (leaveId: string, status: 'approved' | 'rejected') => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'review',
          leaveId,
          status,
          adminNote
        })
      });

      const data = await res.json();
      if (data.success) {
        const target = leaves.find((l) => l.id === leaveId);
        if (target) {
          target.status = status;
          target.admin_note = adminNote;
          target.reviewed_by = 'Dave';
          target.reviewed_at = new Date().toISOString();
        }
        setLeaves([...leaves]);
        setSelectedLeave(null);
        setAdminNote('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gym-card p-6 rounded-2xl border border-gym-border shadow-xl">
        <div>
          <span className="text-xs uppercase font-bold text-gym-red tracking-wider">Module D</span>
          <h1 className="text-2xl font-black uppercase font-display text-white mt-0.5">
            Employee Leave Approvals
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Dave&apos;s authoritative review panel: approve or reject leave requests with administrative notes.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-1.5 bg-gym-charcoal p-1.5 rounded-xl border border-gym-border">
          {['all', 'pending', 'approved', 'rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                statusFilter === st
                  ? 'bg-gym-red text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Leave List */}
      <div className="bg-gym-card rounded-2xl border border-gym-border overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gym-charcoal text-zinc-400 uppercase font-bold text-[10px] border-b border-gym-border">
              <tr>
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Leave Category</th>
                <th className="py-3.5 px-4">Dates</th>
                <th className="py-3.5 px-4">Reason</th>
                <th className="py-3.5 px-4">Dave&apos;s Review / Note</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gym-border">
              {filteredLeaves.map((leave) => {
                const emp = (api as any).store.employees.find((e: any) => e.id === leave.employee_id);
                const prof = emp ? (api as any).store.profiles.find((p: any) => p.id === emp.profile_id) : null;
                const leaveType = (api as any).store.leaveTypes.find((lt: any) => lt.id === leave.leave_type_id);

                return (
                  <tr key={leave.id} className="hover:bg-gym-charcoal/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white block">{prof?.full_name || 'Staff Member'}</span>
                      <span className="text-[10px] text-zinc-400">{emp?.designation}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-gym-silver font-semibold">{leaveType?.name || 'Leave'}</span>
                    </td>

                    <td className="py-3.5 px-4 text-zinc-300">
                      <p>{leave.start_date}</p>
                      <p className="text-[10px] text-zinc-400">to {leave.end_date}</p>
                    </td>

                    <td className="py-3.5 px-4 text-zinc-300 max-w-xs leading-relaxed">
                      {leave.reason}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-zinc-400">
                      {leave.admin_note ? (
                        <span className="italic text-zinc-300">&quot;{leave.admin_note}&quot;</span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
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

                    <td className="py-3.5 px-4 text-right">
                      {leave.status === 'pending' ? (
                        <button
                          onClick={() => {
                            setSelectedLeave(leave);
                            setAdminNote('');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-gym-red hover:bg-gym-redHover text-white text-[11px] font-bold uppercase tracking-wider transition-colors"
                        >
                          Review Request
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedLeave(leave);
                            setAdminNote(leave.admin_note || '');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-gym-charcoal border border-gym-border text-zinc-300 hover:text-white text-[11px] font-semibold"
                        >
                          Edit Decision
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedLeave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gym-card border border-gym-border rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-gym-border pb-3 mb-4">
              <h3 className="text-base font-bold uppercase font-display text-white">
                Review Leave Application
              </h3>
              <button onClick={() => setSelectedLeave(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-gym-charcoal p-4 rounded-xl border border-gym-border space-y-1.5">
                <p className="text-white font-bold text-sm">
                  {(api as any).store.employees.find((e: any) => e.id === selectedLeave.employee_id)?.designation}
                </p>
                <p className="text-zinc-300">
                  Dates: <strong>{selectedLeave.start_date}</strong> to <strong>{selectedLeave.end_date}</strong>
                </p>
                <p className="text-zinc-400 italic bg-gym-black/40 p-2.5 rounded border border-gym-border">
                  &quot;{selectedLeave.reason}&quot;
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">
                  Dave&apos;s Administrative Note (Sent directly to employee)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Approved. Please coordinate evening shifts with Coach Vikram."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white text-xs placeholder-zinc-500 focus:border-gym-red focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleReview(selectedLeave.id, 'approved')}
                  className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Leave</span>
                </button>

                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleReview(selectedLeave.id, 'rejected')}
                  className="py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5 disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Leave</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
