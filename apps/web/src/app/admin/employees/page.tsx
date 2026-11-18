'use client';

import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  Filter,
  CalendarCheck,
  CalendarOff,
  Clock,
  Shield,
  Edit,
  Archive,
  RotateCcw,
  Trash2,
  Eye,
  X,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Mail,
  Briefcase
} from 'lucide-react';
import { api, Employee, Profile, UserRole } from '@parshuram/shared';

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([...(api as any).store.employees]);
  const [profiles, setProfiles] = useState<Profile[]>([...(api as any).store.profiles]);
  const [staffAttendance] = useState<any[]>([...(api as any).store.staffAttendance]);
  const [leaves] = useState<any[]>([...(api as any).store.leaveApplications]);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'archived'>('all');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
  const [viewingEmp, setViewingEmp] = useState<Employee | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'deactivate' | 'activate' | 'archive' | 'restore' | 'delete';
    emp: Employee;
  } | null>(null);

  // Form states (Add / Edit)
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formDept, setFormDept] = useState('Fitness Training');
  const [formDesignation, setFormDesignation] = useState('Strength Coach');
  const [formSalaryType, setFormSalaryType] = useState<'monthly' | 'hourly' | 'per_session'>('monthly');
  const [formRole, setFormRole] = useState<UserRole>('trainer');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive' | 'archived'>('active');

  const filteredEmployees = employees.filter((emp) => {
    const prof = profiles.find((p) => p.id === emp.profile_id);
    const matchesSearch =
      (prof?.full_name?.toLowerCase().includes(search.toLowerCase()) || false) ||
      (prof?.email?.toLowerCase().includes(search.toLowerCase()) || false) ||
      emp.designation.toLowerCase().includes(search.toLowerCase()) ||
      emp.department.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'all') return true;
    return emp.status === statusFilter;
  });

  const activeCount = employees.filter((e) => e.status === 'active').length;
  const inactiveCount = employees.filter((e) => e.status === 'inactive').length;
  const archivedCount = employees.filter((e) => e.status === 'archived').length;

  const handleOpenAdd = () => {
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormDept('Fitness Training');
    setFormDesignation('Strength Coach');
    setFormSalaryType('monthly');
    setFormRole('trainer');
    setShowAddModal(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) return;

    const newProfile: Profile = {
      id: `prof-emp-${Date.now()}`,
      user_id: `usr-emp-${Date.now()}`,
      full_name: formName.trim(),
      email: formEmail.trim().toLowerCase(),
      phone: formPhone.trim() || '+91 99999 00000',
      role: formRole,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      profile_id: newProfile.id,
      department: formDept,
      designation: formDesignation,
      salary_type: formSalaryType,
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
  };

  const handleOpenEdit = (emp: Employee) => {
    const prof = profiles.find((p) => p.id === emp.profile_id);
    setEditingEmp(emp);
    setFormName(prof?.full_name || '');
    setFormPhone(prof?.phone || '');
    setFormDept(emp.department);
    setFormDesignation(emp.designation);
    setFormSalaryType(emp.salary_type);
    setFormStatus(emp.status);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmp) return;

    const targetEmp = employees.find((e) => e.id === editingEmp.id);
    const targetProf = profiles.find((p) => p.id === editingEmp.profile_id);

    if (targetEmp) {
      targetEmp.department = formDept;
      targetEmp.designation = formDesignation;
      targetEmp.salary_type = formSalaryType;
      targetEmp.status = formStatus;
      targetEmp.updated_at = new Date().toISOString();
    }

    if (targetProf) {
      targetProf.full_name = formName;
      targetProf.phone = formPhone;
      targetProf.is_active = formStatus === 'active';
      targetProf.updated_at = new Date().toISOString();
    }

    setEmployees([...employees]);
    setProfiles([...profiles]);
    setEditingEmp(null);
  };

  const executeConfirmedAction = () => {
    if (!confirmAction) return;
    const { type, emp } = confirmAction;

    if (type === 'delete') {
      // Safeguarded soft/hard delete: remove from roster while retaining attendance integrity
      const remaining = employees.filter((e) => e.id !== emp.id);
      setEmployees(remaining);
      (api as any).store.employees = remaining;
    } else {
      const target = employees.find((e) => e.id === emp.id);
      const targetProf = profiles.find((p) => p.id === emp.profile_id);
      if (target) {
        if (type === 'deactivate') {
          target.status = 'inactive';
          if (targetProf) targetProf.is_active = false;
        } else if (type === 'activate' || type === 'restore') {
          target.status = 'active';
          if (targetProf) targetProf.is_active = true;
        } else if (type === 'archive') {
          target.status = 'archived';
          if (targetProf) targetProf.is_active = false;
        }
        target.updated_at = new Date().toISOString();
      }
      setEmployees([...employees]);
      setProfiles([...profiles]);
    }
    setConfirmAction(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141414] p-6 rounded-2xl border border-[#242424] shadow-xl">
        <div>
          <span className="text-[11px] uppercase font-bold text-[#D4AF37] tracking-widest block">
            Owner Command • Module B
          </span>
          <h1 className="text-2xl font-black uppercase text-white font-display mt-0.5">
            Employee &amp; Staff Management
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Full staff lifecycle administration: add coaches, update designations, review schedules, deactivate departed personnel, and safeguard historical shift data.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#D4AF37] text-[#050B17] hover:bg-[#D4AF37] text-[#050B17]Hover text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 shadow-lg shadow-black/60 shrink-0 hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#161616] p-4 rounded-xl border border-[#262626]">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Total Roster</span>
          <span className="text-2xl font-black text-white font-display mt-1 block">{employees.length}</span>
        </div>
        <div className="bg-[#161616] p-4 rounded-xl border border-[#262626]">
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">Active On Duty</span>
          <span className="text-2xl font-black text-emerald-400 font-display mt-1 block">{activeCount}</span>
        </div>
        <div className="bg-[#161616] p-4 rounded-xl border border-[#262626]">
          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">Inactive</span>
          <span className="text-2xl font-black text-amber-400 font-display mt-1 block">{inactiveCount}</span>
        </div>
        <div className="bg-[#161616] p-4 rounded-xl border border-[#262626]">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Archived</span>
          <span className="text-2xl font-black text-zinc-400 font-display mt-1 block">{archivedCount}</span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-[#141414] p-4 rounded-xl border border-[#262626] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, email, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#1c1c1c] border border-[#2e2e2e] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {(['all', 'active', 'inactive', 'archived'] as const).map((filterKey) => (
            <button
              key={filterKey}
              onClick={() => setStatusFilter(filterKey)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                statusFilter === filterKey
                  ? 'bg-[#D4AF37] text-[#050B17] text-white'
                  : 'bg-[#1c1c1c] text-zinc-400 hover:text-white hover:bg-[#252525]'
              }`}
            >
              {filterKey} ({filterKey === 'all' ? employees.length : employees.filter((e) => e.status === filterKey).length})
            </button>
          ))}
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-[#141414] rounded-2xl border border-[#242424] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-[#181818] text-zinc-400 text-[10px] uppercase tracking-wider border-b border-[#262626]">
              <tr>
                <th className="py-3.5 px-4 font-bold">Staff Member</th>
                <th className="py-3.5 px-4 font-bold">Role &amp; Department</th>
                <th className="py-3.5 px-4 font-bold">Designation</th>
                <th className="py-3.5 px-4 font-bold">Compensation</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    No employees matching current filter.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => {
                  const prof = profiles.find((p) => p.id === emp.profile_id);
                  const isDave = prof?.role === 'super_admin';

                  return (
                    <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-[#D4AF37] text-[#050B17]/20 border border-[#D4AF37]/40 flex items-center justify-center font-bold text-white text-xs shrink-0">
                            {prof?.full_name?.charAt(0) || 'E'}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center space-x-1.5">
                              <span>{prof?.full_name}</span>
                              {isDave && (
                                <span className="text-[9px] bg-red-950/80 text-red-200 border border-[#D4AF37]/50 px-1.5 py-0.2 rounded font-bold uppercase">
                                  Owner
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-zinc-400 block">{prof?.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-zinc-200 font-semibold">{emp.department}</span>
                        <span className="text-[10px] text-zinc-500 block uppercase">{prof?.role}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-white">
                        {emp.designation}
                      </td>
                      <td className="py-3 px-4 capitalize text-zinc-400">
                        {emp.salary_type.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            emp.status === 'active'
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                              : emp.status === 'inactive'
                              ? 'bg-amber-950/60 text-amber-300 border border-amber-800'
                              : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                          }`}
                        >
                          {emp.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setViewingEmp(emp)}
                            title="View Full Profile"
                            className="p-1.5 rounded-lg bg-[#1e1e1e] hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleOpenEdit(emp)}
                            title="Edit Details"
                            className="p-1.5 rounded-lg bg-[#1e1e1e] hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {!isDave && (
                            <>
                              {emp.status === 'active' && (
                                <button
                                  onClick={() => setConfirmAction({ type: 'deactivate', emp })}
                                  title="Deactivate Staff"
                                  className="p-1.5 rounded-lg bg-[#1e1e1e] hover:bg-amber-950/60 text-amber-400 transition-colors"
                                >
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {emp.status === 'inactive' && (
                                <button
                                  onClick={() => setConfirmAction({ type: 'activate', emp })}
                                  title="Reactivate Staff"
                                  className="p-1.5 rounded-lg bg-[#1e1e1e] hover:bg-emerald-950/60 text-emerald-400 transition-colors"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {emp.status !== 'archived' ? (
                                <button
                                  onClick={() => setConfirmAction({ type: 'archive', emp })}
                                  title="Archive Departed Employee"
                                  className="p-1.5 rounded-lg bg-[#1e1e1e] hover:bg-zinc-700 text-zinc-400 transition-colors"
                                >
                                  <Archive className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => setConfirmAction({ type: 'restore', emp })}
                                  title="Restore from Archive"
                                  className="p-1.5 rounded-lg bg-[#1e1e1e] hover:bg-emerald-950/60 text-emerald-400 transition-colors"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <button
                                onClick={() => setConfirmAction({ type: 'delete', emp })}
                                title="Safeguarded Delete"
                                className="p-1.5 rounded-lg bg-[#1e1e1e] hover:bg-red-950/60 text-red-400 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD EMPLOYEE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#282828] pb-3">
              <h3 className="text-lg font-bold text-white uppercase font-display flex items-center space-x-2">
                <Plus className="w-5 h-5 text-[#D4AF37]" />
                <span>Add Staff Member</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#222222] border border-[#303030] text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="coach@parshuramgym.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#222222] border border-[#303030] text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 00000"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#222222] border border-[#303030] text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Department</label>
                  <input
                    type="text"
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#222222] border border-[#303030] text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Designation</label>
                  <input
                    type="text"
                    value={formDesignation}
                    onChange={(e) => setFormDesignation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#222222] border border-[#303030] text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Role Permission</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#222222] border border-[#303030] text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="trainer">Trainer (Shift + Workouts)</option>
                    <option value="employee">Staff Employee (Shift Clock)</option>
                    <option value="admin">Admin (Floor Supervisor)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Compensation</label>
                  <select
                    value={formSalaryType}
                    onChange={(e) => setFormSalaryType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#222222] border border-[#303030] text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="monthly">Monthly Salary</option>
                    <option value="hourly">Hourly Basis</option>
                    <option value="per_session">Per Training Session</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-[#282828]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#242424] text-zinc-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#D4AF37] text-[#050B17] hover:bg-[#D4AF37] text-[#050B17]Hover text-white font-bold uppercase"
                >
                  Confirm &amp; Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT EMPLOYEE MODAL */}
      {editingEmp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#282828] pb-3">
              <h3 className="text-lg font-bold text-white uppercase font-display flex items-center space-x-2">
                <Edit className="w-5 h-5 text-[#D4AF37]" />
                <span>Edit Staff Member</span>
              </h3>
              <button onClick={() => setEditingEmp(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#222222] border border-[#303030] text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#222222] border border-[#303030] text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Department</label>
                  <input
                    type="text"
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#222222] border border-[#303030] text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Designation</label>
                  <input
                    type="text"
                    value={formDesignation}
                    onChange={(e) => setFormDesignation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#222222] border border-[#303030] text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Compensation</label>
                  <select
                    value={formSalaryType}
                    onChange={(e) => setFormSalaryType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#222222] border border-[#303030] text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="monthly">Monthly Salary</option>
                    <option value="hourly">Hourly Basis</option>
                    <option value="per_session">Per Session</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Employment Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#222222] border border-[#303030] text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="archived">Archived (Departed)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-[#282828]">
                <button
                  type="button"
                  onClick={() => setEditingEmp(null)}
                  className="px-4 py-2 rounded-lg bg-[#242424] text-zinc-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#D4AF37] text-[#050B17] hover:bg-[#D4AF37] text-[#050B17]Hover text-white font-bold uppercase"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW EMPLOYEE PROFILE MODAL */}
      {viewingEmp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            {(() => {
              const prof = profiles.find((p) => p.id === viewingEmp.profile_id);
              const empShifts = staffAttendance.filter((a) => a.employee_id === viewingEmp.id);
              const empLeaves = leaves.filter((l) => l.employee_id === viewingEmp.id);

              return (
                <>
                  <div className="flex items-center justify-between border-b border-[#282828] pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-[#D4AF37] text-[#050B17] flex items-center justify-center font-bold text-white text-lg">
                        {prof?.full_name?.charAt(0) || 'E'}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white font-display uppercase">{prof?.full_name}</h3>
                        <p className="text-xs text-zinc-400">{viewingEmp.designation} • {viewingEmp.department}</p>
                      </div>
                    </div>
                    <button onClick={() => setViewingEmp(null)} className="text-zinc-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-[#141414] p-4 rounded-xl border border-[#262626]">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block">Email</span>
                      <span className="text-zinc-200">{prof?.email}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block">Phone</span>
                      <span className="text-zinc-200">{prof?.phone || 'Not configured'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block">Joined Date</span>
                      <span className="text-zinc-200">{viewingEmp.joining_date}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block">Compensation</span>
                      <span className="text-zinc-200 capitalize">{viewingEmp.salary_type.replace('_', ' ')}</span>
                    </div>
                  </div>

                  {/* Attendance & Leave Records Preservation */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase text-white tracking-wider">
                      Preserved Shift History ({empShifts.length} Recorded Shifts)
                    </h4>
                    {empShifts.length === 0 ? (
                      <p className="text-xs text-zinc-500 italic">No shift records on file.</p>
                    ) : (
                      <div className="max-h-36 overflow-y-auto space-y-1.5 text-xs">
                        {empShifts.map((shift, i) => (
                          <div key={i} className="p-2 rounded bg-[#1c1c1c] border border-[#282828] flex items-center justify-between">
                            <div>
                              <span className="text-white font-semibold">
                                {new Date(shift.check_in_time).toLocaleDateString()}
                              </span>
                              <span className="text-[10px] text-zinc-400 ml-2">
                                In: {new Date(shift.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <span className="text-emerald-400 text-[10px] font-bold uppercase">
                              {shift.check_out_time ? 'Completed' : 'Shift Active'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-3 border-t border-[#282828]">
                    <button
                      onClick={() => setViewingEmp(null)}
                      className="px-4 py-2 rounded-lg bg-[#242424] text-zinc-300 hover:text-white text-xs font-bold uppercase"
                    >
                      Close Profile
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL DIALOG */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-amber-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-white uppercase font-display">
                Confirm {confirmAction.type}
              </h3>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              {confirmAction.type === 'delete' ? (
                <>
                  Are you sure you want to permanently delete this employee record? Historical shift attendance records will remain preserved in the audit database.
                </>
              ) : confirmAction.type === 'archive' ? (
                <>
                  Archiving this staff member will remove them from the active duty roster while preserving all historical shift, salary, and leave records. You can restore them at any time.
                </>
              ) : confirmAction.type === 'deactivate' ? (
                <>
                  Deactivating this staff member will disable shift clocking and portal access.
                </>
              ) : (
                <>
                  Reactivating this staff member will restore full duty access and shift clocking.
                </>
              )}
            </p>

            <div className="flex justify-end space-x-3 pt-3 border-t border-[#282828] text-xs font-bold uppercase">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 rounded-lg bg-[#242424] text-zinc-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={executeConfirmedAction}
                className={`px-4 py-2 rounded-lg text-white ${
                  confirmAction.type === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-[#D4AF37] text-[#050B17] hover:bg-[#D4AF37] text-[#050B17]Hover'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


