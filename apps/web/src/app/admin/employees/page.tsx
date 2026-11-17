'use client';

import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  CalendarCheck,
  CalendarOff,
  Clock,
  Shield,
  X,
  CheckCircle2
} from 'lucide-react';
import { api, Employee, Profile, UserRole } from '@parshuram/shared';

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([...(api as any).store.employees]);
  const [profiles, setProfiles] = useState<Profile[]>([...(api as any).store.profiles]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Fitness Training');
  const [designation, setDesignation] = useState('Strength Coach');
  const [role, setRole] = useState<UserRole>('trainer');

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newProfile: Profile = {
      id: `prof-emp-${Date.now()}`,
      user_id: `usr-emp-${Date.now()}`,
      full_name: name,
      email: email.toLowerCase(),
      phone,
      role,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      profile_id: newProfile.id,
      department,
      designation,
      salary_type: 'monthly',
      joining_date: new Date().toISOString().split('T')[0],
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    (api as any).store.profiles.push(newProfile);
    (api as any).store.employees.push(newEmp);

    setProfiles([...(api as any).store.profiles]);
    setEmployees([...(api as any).store.employees]);
    setShowAddModal(false);
    setName('');
    setEmail('');
    setPhone('');
  };

  const toggleEmployeeStatus = (empId: string) => {
    const target = employees.find((e) => e.id === empId);
    if (!target) return;
    target.status = target.status === 'active' ? 'inactive' : 'active';
    setEmployees([...employees]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gym-card p-6 rounded-2xl border border-gym-border shadow-xl">
        <div>
          <span className="text-xs uppercase font-bold text-gym-red tracking-wider">Module B</span>
          <h1 className="text-2xl font-black uppercase font-display text-white mt-0.5">
            Employee &amp; Trainer Management
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Dave&apos;s staff directory: role assignments, shift schedules, and individual attendance history.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gym-red hover:bg-gym-redHover text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 shadow-md shadow-red-950/60 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-gym-card rounded-2xl border border-gym-border overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gym-charcoal text-zinc-400 uppercase font-bold text-[10px] border-b border-gym-border">
              <tr>
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Role &amp; Department</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Joining Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gym-border">
              {employees.map((emp) => {
                const profile = profiles.find((p) => p.id === emp.profile_id);
                const isDave = emp.id === 'emp-dave';

                return (
                  <tr key={emp.id} className="hover:bg-gym-charcoal/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-gym-charcoal border border-gym-silver/40 flex items-center justify-center font-bold text-white uppercase text-xs">
                          {profile?.full_name?.charAt(0) || 'E'}
                        </div>
                        <div>
                          <span className="font-bold text-white block flex items-center">
                            {profile?.full_name}
                            {isDave && (
                              <span className="ml-1.5 text-[9px] font-black uppercase text-gym-red bg-gym-red/20 px-1.5 py-0.5 rounded border border-gym-red/40">
                                Owner
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-zinc-400">{emp.designation}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-gym-silver font-semibold block uppercase text-[11px]">
                        {profile?.role.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-zinc-400">{emp.department}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="text-zinc-200">{profile?.email}</p>
                      <p className="text-[10px] text-zinc-400">{profile?.phone || 'No phone'}</p>
                    </td>

                    <td className="py-3.5 px-4 text-zinc-300">
                      {emp.joining_date}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => !isDave && toggleEmployeeStatus(emp.id)}
                        disabled={isDave}
                        className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border transition-colors ${
                          emp.status === 'active'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                            : 'bg-red-950 text-red-300 border-red-700'
                        } ${isDave ? 'opacity-80 cursor-default' : 'hover:opacity-90'}`}
                      >
                        {emp.status}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedEmp(emp)}
                        className="px-2.5 py-1 rounded bg-gym-charcoal border border-gym-border text-zinc-300 hover:text-white text-[11px] font-semibold"
                      >
                        Shifts &amp; History
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gym-card border border-gym-border rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-gym-border pb-3 mb-4">
              <h3 className="text-lg font-bold uppercase font-display text-white">
                Register Staff / Trainer
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Karan Singhania"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="karan@parshuramgym.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 99999 55555"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
                  >
                    <option value="trainer">Trainer</option>
                    <option value="employee">Staff / Operations</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gym-red hover:bg-gym-redHover text-white font-bold uppercase tracking-wider transition-colors"
                >
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Shifts Modal */}
      {selectedEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gym-card border border-gym-border rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-gym-border pb-3 mb-4">
              <h3 className="text-lg font-bold uppercase font-display text-white">
                Staff Shifts &amp; Work Records
              </h3>
              <button onClick={() => setSelectedEmp(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-gym-charcoal p-4 rounded-xl border border-gym-border space-y-1">
                <span className="text-zinc-400 block">Staff Attendance Summary</span>
                <p className="text-white font-semibold">
                  {(api as any).store.staffAttendance.filter((a: any) => a.employee_id === selectedEmp.id).length} recorded shift entries
                </p>
                <p className="text-[11px] text-zinc-400">Strictly tracked in staff_attendance table separate from member gym visits.</p>
              </div>

              <div className="bg-gym-charcoal p-4 rounded-xl border border-gym-border space-y-1">
                <span className="text-zinc-400 block">Leave History</span>
                <p className="text-white font-semibold">
                  {(api as any).store.leaveApplications.filter((l: any) => l.employee_id === selectedEmp.id).length} total leave requests submitted
                </p>
              </div>

              <button
                onClick={() => setSelectedEmp(null)}
                className="w-full py-2 rounded-lg bg-gym-charcoal hover:bg-zinc-800 text-white font-bold uppercase text-xs border border-gym-border"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
