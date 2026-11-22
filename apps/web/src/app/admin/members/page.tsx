'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Archive,
  RotateCcw,
  CalendarCheck,
  TrendingUp,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  RefreshCw,
  Phone,
  Mail,
  Heart
} from 'lucide-react';
import { Member, Profile, FitnessGoalType } from '@parshuram/shared';

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [memberAttendance, setMemberAttendance] = useState<any[]>([]);
  const [membershipPlans, setMembershipPlans] = useState<any[]>([]);
  const [memberships, setMemberships] = useState<any[]>([]);

  useEffect(() => {
    const loadMembers = async () => {
      const token = localStorage.getItem('pfg_user_token');
      try {
        const response = await fetch('/api/admin/members', {
          headers: { Authorization: `Bearer ${token || ''}` },
          cache: 'no-store'
        });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.error || 'Could not load members.');
        setMembers(data.members);
        setProfiles(data.profiles);
        setMembershipPlans(data.membershipPlans || []);
        setMemberships(data.memberships || []);
        if (data.membershipPlans?.length) setNewPlanId(data.membershipPlans[0].id);
      } catch (error: any) {
        setLoadError(error.message || 'Could not load members.');
      }
    };
    loadMembers();
  }, []);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'archived'>('all');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'deactivate' | 'activate' | 'archive' | 'restore' | 'delete' | 'renew';
    member: Member;
  } | null>(null);

  // Form states for Add Member
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmergency, setNewEmergency] = useState('');
  const [newBloodGroup, setNewBloodGroup] = useState('O+');
  const [newGoal, setNewGoal] = useState<FitnessGoalType>('muscle_gain');
  const [newHeight, setNewHeight] = useState(175);
  const [newWeight, setNewWeight] = useState(72);
  const [newPlanId, setNewPlanId] = useState('plan-quarterly');

  // Form states for Edit Member
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmergency, setEditEmergency] = useState('');
  const [editHeight, setEditHeight] = useState(175);
  const [editWeight, setEditWeight] = useState(72);
  const [editStatus, setEditStatus] = useState<'active' | 'inactive' | 'archived'>('active');

  const filteredMembers = members.filter((m) => {
    const prof = profiles.find((p) => p.id === m.profile_id);
    const q = search.toLowerCase();
    const matchesSearch =
      (prof?.full_name?.toLowerCase().includes(q) || false) ||
      (prof?.email?.toLowerCase().includes(q) || false) ||
      (m.fitness_goal?.toLowerCase().includes(q) || false) ||
      (prof?.phone?.includes(q) || false);

    if (!matchesSearch) return false;
    if (statusFilter === 'all') return true;
    return m.status === statusFilter;
  });

  const activeCount = members.filter((m) => m.status === 'active').length;
  const inactiveCount = members.filter((m) => m.status === 'inactive').length;
  const archivedCount = members.filter((m) => m.status === 'archived').length;

  const openMember = async (member: Member) => {
    setViewingMember(member);
    setMemberAttendance([]);
    try {
      const token = localStorage.getItem('pfg_user_token') || '';
      const response = await fetch(`/api/attendance?memberId=${encodeURIComponent(member.id)}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
      const data = await response.json();
      if (response.ok) setMemberAttendance(data.attendance || []);
    } catch { setMemberAttendance([]); }
  };

  const handleOpenAdd = () => {
    setNewFullName('');
    setNewEmail('');
    setNewPhone('');
    setNewEmergency('');
    setNewBloodGroup('O+');
    setNewGoal('muscle_gain');
    setNewHeight(175);
    setNewWeight(72);
    setNewPlanId('plan-quarterly');
    setShowAddModal(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newEmail.trim()) return;

    setActionLoading(true);
    setActionError(null);
    try {
      const token = localStorage.getItem('pfg_user_token') || '';
      const response = await fetch('/api/admin/members', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ fullName: newFullName, email: newEmail, phone: newPhone, emergencyContact: newEmergency, bloodGroup: newBloodGroup, fitnessGoal: newGoal, heightCm: Number(newHeight), weightKg: Number(newWeight), planId: newPlanId }) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Could not invite member.');
      setMembers((current) => [data.member, ...current]);
      setProfiles((current) => [data.profile, ...current]);
      if (data.membership) setMemberships((current) => [data.membership, ...current]);
      setShowAddModal(false);
      setActionError(data.message || 'Member invitation sent.');
    } catch (error: any) { setActionError(error.message || 'Could not invite member.'); }
    finally { setActionLoading(false); }
  };

  const handleOpenEdit = (m: Member) => {
    const prof = profiles.find((p) => p.id === m.profile_id);
    setEditingMember(m);
    setEditName(prof?.full_name || '');
    setEditPhone(prof?.phone || '');
    setEditEmergency(m.emergency_contact || '');
    setEditHeight(m.height_cm || 175);
    setEditWeight(m.weight_kg || 72);
    setEditStatus(m.status as any);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    const targetMem = members.find((m) => m.id === editingMember.id);
    const targetProf = profiles.find((p) => p.id === editingMember.profile_id);

    setActionLoading(true);
    setActionError(null);
    try {
      const token = localStorage.getItem('pfg_user_token') || '';
      const response = await fetch('/api/admin/members', { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ memberId: editingMember.id, fullName: editName, phone: editPhone, emergency_contact: editEmergency, height_cm: Number(editHeight), weight_kg: Number(editWeight), status: editStatus }) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Could not update member.');
    } catch (error: any) { setActionError(error.message || 'Could not update member.'); setActionLoading(false); return; }
    finally { setActionLoading(false); }

    if (targetMem) {
      targetMem.emergency_contact = editEmergency;
      targetMem.height_cm = Number(editHeight);
      targetMem.weight_kg = Number(editWeight);
      targetMem.status = editStatus;
      targetMem.updated_at = new Date().toISOString();
    }

    if (targetProf) {
      targetProf.full_name = editName;
      targetProf.phone = editPhone;
      targetProf.is_active = editStatus === 'active';
      targetProf.updated_at = new Date().toISOString();
    }

    setMembers([...members]);
    setProfiles([...profiles]);
    setEditingMember(null);
  };

  const executeConfirmedAction = async () => {
    if (!confirmAction) return;
    const { type, member } = confirmAction;

    if (type === 'delete') {
      setActionLoading(true);
      setActionError(null);
      try {
        const token = localStorage.getItem('pfg_user_token');
        const response = await fetch('/api/admin/members', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token || ''}` },
          body: JSON.stringify({ memberId: member.id })
        });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.error || 'Could not remove member.');
        setMembers((current) => current.filter((item) => item.id !== member.id));
        setProfiles((current) => current.map((profile) => profile.id === member.profile_id
          ? { ...profile, is_active: false }
          : profile));
        setConfirmAction(null);
      } catch (error: any) {
        setActionError(error.message || 'Could not remove member.');
      } finally {
        setActionLoading(false);
      }
      return;
    } else {
      const nextStatus = ['activate', 'restore', 'renew'].includes(type) ? 'active' : 'inactive';
      setActionLoading(true); setActionError(null);
      try {
        const token = localStorage.getItem('pfg_user_token') || '';
        const response = await fetch('/api/admin/members', { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ memberId: member.id, status: nextStatus }) });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.error || 'Could not update member status.');
        setMembers((current) => current.map((item) => item.id === member.id ? { ...item, status: nextStatus } : item));
        setProfiles((current) => current.map((profile) => profile.id === member.profile_id ? { ...profile, is_active: nextStatus === 'active' } : profile));
      } catch (error: any) { setActionError(error.message || 'Could not update member status.'); }
      finally { setActionLoading(false); }
    }
    setConfirmAction(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141414] p-6 rounded-2xl border border-[#242424] shadow-xl">
        <div>
          <span className="text-[11px] uppercase font-bold text-[#D4AF37] tracking-widest block">
            Owner Command • Module A
          </span>
          <h1 className="text-2xl font-black uppercase text-white font-display mt-0.5">
            Member Athlete Management
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Athlete database: track memberships, log check-in frequency, renew subscriptions, archive departed accounts, and safeguard member attendance history.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#D4AF37] text-[#050B17] hover:bg-[#D4AF37] text-[#050B17]Hover text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 shadow-lg shadow-black/60 shrink-0 hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Member</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#161616] p-4 rounded-xl border border-[#262626]">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Total Athletes</span>
          <span className="text-2xl font-black text-white font-display mt-1 block">{members.length}</span>
        </div>
        <div className="bg-[#161616] p-4 rounded-xl border border-[#262626]">
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">Active Memberships</span>
          <span className="text-2xl font-black text-emerald-400 font-display mt-1 block">{activeCount}</span>
        </div>
        <div className="bg-[#161616] p-4 rounded-xl border border-[#262626]">
          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">Inactive / Expired</span>
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
            placeholder="Search by name, email, phone, goal..."
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
              {filterKey} ({filterKey === 'all' ? members.length : members.filter((m) => m.status === filterKey).length})
            </button>
          ))}
        </div>
      </div>

      {/* Member Table */}
      {(loadError || actionError) && (
        <div role="alert" className="rounded-xl border border-red-800 bg-red-950/40 px-4 py-3 text-xs text-red-200">
          {actionError || loadError}
        </div>
      )}
      <div className="bg-[#141414] rounded-2xl border border-[#242424] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-[#181818] text-zinc-400 text-[10px] uppercase tracking-wider border-b border-[#262626]">
              <tr>
                <th className="py-3.5 px-4 font-bold">Athlete</th>
                <th className="py-3.5 px-4 font-bold">Fitness Goal</th>
                <th className="py-3.5 px-4 font-bold">Body Metrics</th>
                <th className="py-3.5 px-4 font-bold">Joined Date</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    No member records matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((mem) => {
                  const prof = profiles.find((p) => p.id === mem.profile_id);

                  return (
                    <tr key={mem.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-white text-xs shrink-0">
                            {prof?.full_name?.charAt(0) || 'M'}
                          </div>
                          <div>
                            <span className="font-bold text-white block">{prof?.full_name}</span>
                            <span className="text-[10px] text-zinc-400 block">{prof?.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize text-zinc-200 font-semibold">
                          {mem.fitness_goal?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-400">
                        {mem.height_cm ? `${mem.height_cm} cm` : '—'} • {mem.weight_kg ? `${mem.weight_kg} kg` : '—'}
                      </td>
                      <td className="py-3 px-4 text-zinc-400">
                        {mem.join_date}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            mem.status === 'active'
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                              : mem.status === 'inactive'
                              ? 'bg-amber-950/60 text-amber-300 border border-amber-800'
                              : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                          }`}
                        >
                          {mem.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => openMember(mem)}
                            title="View Full Details"
                            className="p-1.5 rounded-lg bg-[#1e1e1e] hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleOpenEdit(mem)}
                            title="Edit Profile"
                            className="p-1.5 rounded-lg bg-[#1e1e1e] hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setConfirmAction({ type: 'renew', member: mem })}
                            title="Renew Membership"
                            className="p-1.5 rounded-lg bg-[#1e1e1e] hover:bg-emerald-950/60 text-emerald-400 transition-colors"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>

                          {mem.status === 'active' && (
                            <button
                              onClick={() => setConfirmAction({ type: 'deactivate', member: mem })}
                              title="Deactivate Member"
                              className="p-1.5 rounded-lg bg-[#1e1e1e] hover:bg-amber-950/60 text-amber-400 transition-colors"
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {mem.status === 'inactive' && (
                            <button
                              onClick={() => setConfirmAction({ type: 'activate', member: mem })}
                              title="Reactivate Member"
                              className="p-1.5 rounded-lg bg-[#1e1e1e] hover:bg-emerald-950/60 text-emerald-400 transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {mem.status !== 'archived' ? (
                            <button
                              onClick={() => setConfirmAction({ type: 'archive', member: mem })}
                              title="Archive Member"
                              className="p-1.5 rounded-lg bg-[#1e1e1e] hover:bg-zinc-700 text-zinc-400 transition-colors"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => setConfirmAction({ type: 'restore', member: mem })}
                              title="Restore Member"
                              className="p-1.5 rounded-lg bg-[#1e1e1e] hover:bg-emerald-950/60 text-emerald-400 transition-colors"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => setConfirmAction({ type: 'delete', member: mem })}
                            title="Safeguarded Delete"
                            className="p-1.5 rounded-lg bg-[#1e1e1e] hover:bg-red-950/60 text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* ADD MEMBER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#282828] pb-3">
              <h3 className="text-lg font-bold text-white uppercase font-display flex items-center space-x-2">
                <Plus className="w-5 h-5 text-[#D4AF37]" />
                <span>Register New Athlete</span>
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
                  placeholder="e.g. Siddharth Rao"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#222222] border border-[#303030] text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="athlete@example.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#222222] border border-[#303030] text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98765 11111"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#222222] border border-[#303030] text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Primary Goal</label>
                  <select
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#222222] border border-[#303030] text-white focus:outline-none focus:border-[#D4AF37] capitalize"
                  >
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="fat_loss">Fat Loss</option>
                    <option value="strength">Strength</option>
                    <option value="endurance">Endurance</option>
                    <option value="general_fitness">General Fitness</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={newHeight}
                    onChange={(e) => setNewHeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-[#222222] border border-[#303030] text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={newWeight}
                    onChange={(e) => setNewWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-[#222222] border border-[#303030] text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    placeholder="+91 98888 00000"
                    value={newEmergency}
                    onChange={(e) => setNewEmergency(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#222222] border border-[#303030] text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Blood Group</label>
                  <select
                    value={newBloodGroup}
                    onChange={(e) => setNewBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#222222] border border-[#303030] text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
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
                  Create Member Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MEMBER MODAL */}
      {editingMember && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#282828] pb-3">
              <h3 className="text-lg font-bold text-white uppercase font-display flex items-center space-x-2">
                <Edit className="w-5 h-5 text-[#D4AF37]" />
                <span>Edit Member Athlete</span>
              </h3>
              <button onClick={() => setEditingMember(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#222222] border border-[#303030] text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#222222] border border-[#303030] text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    value={editEmergency}
                    onChange={(e) => setEditEmergency(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#222222] border border-[#303030] text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={editHeight}
                    onChange={(e) => setEditHeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-[#222222] border border-[#303030] text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={editWeight}
                    onChange={(e) => setEditWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-[#222222] border border-[#303030] text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#222222] border border-[#303030] text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-[#282828]">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 rounded-lg bg-[#242424] text-zinc-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#D4AF37] text-[#050B17] hover:bg-[#D4AF37] text-[#050B17]Hover text-white font-bold uppercase"
                >
                  Save Athlete Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MEMBER DETAILS MODAL */}
      {viewingMember && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            {(() => {
              const prof = profiles.find((p) => p.id === viewingMember.profile_id);
              const memVisits = memberAttendance.filter((a) => a.member_id === viewingMember.id);
              const currentMembership = memberships.find((item) => item.member_id === viewingMember.id);

              return (
                <>
                  <div className="flex items-center justify-between border-b border-[#282828] pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-[#D4AF37] text-[#050B17] flex items-center justify-center font-bold text-white text-lg">
                        {prof?.full_name?.charAt(0) || 'M'}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white font-display uppercase">{prof?.full_name}</h3>
                        <p className="text-xs text-zinc-400 capitalize">Goal: {viewingMember.fitness_goal?.replace('_', ' ')}</p>
                        <p className="text-xs text-zinc-400">Plan: {currentMembership?.membership_plans?.name || 'No membership recorded'} · {currentMembership?.start_date || '—'} to {currentMembership?.end_date || '—'} ({currentMembership?.status || 'none'})</p>
                      </div>
                    </div>
                    <button onClick={() => setViewingMember(null)} className="text-zinc-400 hover:text-white">
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
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block">Emergency Contact</span>
                      <span className="text-zinc-200">{viewingMember.emergency_contact || 'None'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block">Blood Group</span>
                      <span className="text-zinc-200">{viewingMember.blood_group || 'O+'}</span>
                    </div>
                  </div>

                  {/* Free Attendance Log History */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase text-white tracking-wider">
                        Attendance History ({memVisits.length} Visits Logged)
                      </h4>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase">100% Free Access</span>
                    </div>

                    {memVisits.length === 0 ? (
                      <p className="text-xs text-zinc-500 italic">No attendance visits recorded yet.</p>
                    ) : (
                      <div className="max-h-36 overflow-y-auto space-y-1.5 text-xs">
                        {memVisits.map((visit, i) => (
                          <div key={i} className="p-2 rounded bg-[#1c1c1c] border border-[#282828] flex items-center justify-between">
                            <div>
                              <span className="text-white font-semibold">
                                {new Date(visit.check_in_time).toLocaleDateString()}
                              </span>
                              <span className="text-[10px] text-zinc-400 ml-2">
                                Time: {new Date(visit.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <span className="text-emerald-400 text-[10px] font-bold uppercase">
                              {visit.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-3 border-t border-[#282828]">
                    <button
                      onClick={() => setViewingMember(null)}
                      className="px-4 py-2 rounded-lg bg-[#242424] text-zinc-300 hover:text-white text-xs font-bold uppercase"
                    >
                      Close Details
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
                    Remove this member from active records? Their membership, attendance, and progress history will be retained.
                </>
              ) : confirmAction.type === 'renew' ? (
                <>
                  Renew this member&apos;s active subscription? This will update their active status and extend their facility access.
                </>
              ) : confirmAction.type === 'archive' ? (
                <>
                  Archiving this member will remove them from the active list while preserving all historical attendance and payment records. You can restore them anytime.
                </>
              ) : confirmAction.type === 'deactivate' ? (
                <>
                  Deactivating this member will temporarily pause their turnstile check-in privileges.
                </>
              ) : (
                <>
                  Reactivating this member will immediately restore their active gym attendance privileges.
                </>
              )}
            </p>

            <div className="flex justify-end space-x-3 pt-3 border-t border-[#282828] text-xs font-bold uppercase">
              <button
                onClick={() => !actionLoading && setConfirmAction(null)}
                className="px-4 py-2 rounded-lg bg-[#242424] text-zinc-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={executeConfirmedAction}
                disabled={actionLoading}
                className={`px-4 py-2 rounded-lg text-white ${
                  confirmAction.type === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-[#D4AF37] text-[#050B17] hover:bg-[#D4AF37] text-[#050B17]Hover'
                }`}
              >
                {actionLoading ? 'Saving...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


