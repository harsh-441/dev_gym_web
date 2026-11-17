'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  CalendarCheck,
  TrendingUp,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api, Member, Profile } from '@parshuram/shared';

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([...(api as any).store.members]);
  const [profiles, setProfiles] = useState<Profile[]>([...(api as any).store.profiles]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Form states for Add Member
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newGoal, setNewGoal] = useState('muscle_gain');
  const [newHeight, setNewHeight] = useState(175);
  const [newWeight, setNewWeight] = useState(72);
  const [newPlan, setNewPlan] = useState('plan-monthly');

  const filtered = members.filter((m) => {
    const p = profiles.find((prof) => prof.id === m.profile_id);
    const q = search.toLowerCase();
    return (
      (p?.full_name?.toLowerCase().includes(q) || false) ||
      (p?.email?.toLowerCase().includes(q) || false) ||
      (m.fitness_goal?.toLowerCase().includes(q) || false)
    );
  });

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newEmail) return;

    const res = await api.registerMember({
      fullName: newFullName,
      email: newEmail,
      phone: newPhone,
      fitnessGoal: newGoal as any,
      heightCm: Number(newHeight),
      weightKg: Number(newWeight)
    });

    setMembers([...(api as any).store.members]);
    setProfiles([...(api as any).store.profiles]);
    setShowAddModal(false);
    setNewFullName('');
    setNewEmail('');
    setNewPhone('');
  };

  const toggleMemberStatus = (memberId: string) => {
    const target = members.find((m) => m.id === memberId);
    if (!target) return;
    target.status = target.status === 'active' ? 'inactive' : 'active';
    setMembers([...members]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gym-card p-6 rounded-2xl border border-gym-border shadow-xl">
        <div>
          <span className="text-xs uppercase font-bold text-gym-red tracking-wider">Module A</span>
          <h1 className="text-2xl font-black uppercase font-display text-white mt-0.5">
            Member Management
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Dave&apos;s directory of registered athletes, profile edits, attendance records, and active plans.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gym-red hover:bg-gym-redHover text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 shadow-md shadow-red-950/60 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Member</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-gym-card p-4 rounded-xl border border-gym-border flex items-center space-x-3">
        <Search className="w-5 h-5 text-zinc-400 shrink-0" />
        <input
          type="text"
          placeholder="Search by member name, email address, or goal..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-white text-xs placeholder-zinc-500 focus:outline-none"
        />
      </div>

      {/* Members Table */}
      <div className="bg-gym-card rounded-2xl border border-gym-border overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gym-charcoal text-zinc-400 uppercase font-bold text-[10px] border-b border-gym-border">
              <tr>
                <th className="py-3.5 px-4">Member Name</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Goal &amp; Biometrics</th>
                <th className="py-3.5 px-4">Membership Plan</th>
                <th className="py-3.5 px-4">Join Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gym-border">
              {filtered.map((member) => {
                const profile = profiles.find((p) => p.id === member.profile_id);
                const plan = (api as any).store.membershipPlans.find(
                  (mp: any) => mp.id === member.active_membership_id
                );

                return (
                  <tr key={member.id} className="hover:bg-gym-charcoal/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-gym-red/20 border border-gym-red/40 flex items-center justify-center font-bold text-gym-red uppercase text-xs">
                          {profile?.full_name?.charAt(0) || 'M'}
                        </div>
                        <div>
                          <span className="font-bold text-white block">{profile?.full_name || 'Member'}</span>
                          <span className="text-[10px] text-zinc-400">ID: {member.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="text-zinc-200">{profile?.email}</p>
                      <p className="text-[10px] text-zinc-400">{profile?.phone || 'No phone'}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-gym-silver capitalize block">
                        {member.fitness_goal?.replace('_', ' ') || 'General'}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {member.height_cm ? `${member.height_cm} cm` : '—'} • {member.weight_kg ? `${member.weight_kg} kg` : '—'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-xs font-semibold text-white">
                        {plan?.name || 'Standard Monthly'}
                      </span>
                      <span className="block text-[10px] text-zinc-400">
                        {plan?.duration_months || 1} Month Access
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-zinc-300">
                      {member.join_date}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleMemberStatus(member.id)}
                        className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border transition-colors ${
                          member.status === 'active'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-700 hover:bg-emerald-900'
                            : 'bg-red-950 text-red-300 border-red-700 hover:bg-red-900'
                        }`}
                      >
                        {member.status}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedMember(member)}
                          className="px-2.5 py-1 rounded bg-gym-charcoal border border-gym-border text-zinc-300 hover:text-white text-[11px] font-semibold"
                        >
                          View Logs
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gym-card border border-gym-border rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-gym-border pb-3 mb-4">
              <h3 className="text-lg font-bold uppercase font-display text-white">
                Register New Gym Member
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tarun Gill"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="tarun@example.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 00000"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Goal</label>
                  <select
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
                  >
                    <option value="muscle_gain">Muscle</option>
                    <option value="fat_loss">Fat Loss</option>
                    <option value="strength">Strength</option>
                    <option value="general_fitness">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={newHeight}
                    onChange={(e) => setNewHeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={newWeight}
                    onChange={(e) => setNewWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gym-red hover:bg-gym-redHover text-white font-bold uppercase tracking-wider transition-colors"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gym-card border border-gym-border rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-gym-border pb-3 mb-4">
              <h3 className="text-lg font-bold uppercase font-display text-white">
                Member History &amp; Progress
              </h3>
              <button onClick={() => setSelectedMember(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-gym-charcoal p-4 rounded-xl border border-gym-border space-y-1">
                <span className="text-zinc-400 block">Attendance History</span>
                <p className="text-white font-semibold">
                  {(api as any).store.memberAttendance.filter((a: any) => a.member_id === selectedMember.id).length} recorded visits
                </p>
                <p className="text-[11px] text-emerald-400">All visits 100% free with QR validation.</p>
              </div>

              <div className="bg-gym-charcoal p-4 rounded-xl border border-gym-border space-y-1">
                <span className="text-zinc-400 block">Physical Progress Record</span>
                <p className="text-white font-semibold">
                  Weight: {selectedMember.weight_kg} kg • Height: {selectedMember.height_cm} cm
                </p>
                <p className="text-[11px] text-zinc-400">Target Goal: {selectedMember.fitness_goal?.replace('_', ' ')}</p>
              </div>

              <button
                onClick={() => setSelectedMember(null)}
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
