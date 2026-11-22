'use client';

import React, { useEffect, useState } from 'react';
import { CreditCard, Edit, Plus, Check, HelpCircle, Save, X } from 'lucide-react';
import { MembershipPlan } from '@parshuram/shared';

export default function AdminMembershipsPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('pfg_user_token') || '';
        const response = await fetch('/api/admin/membership-plans', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Could not load plans.');
        setPlans(data.plans || []);
      } catch (caught: any) { setError(caught.message || 'Could not load plans.'); }
    };
    load();
  }, []);

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    setSaving(true); setError('');
    try {
      const token = localStorage.getItem('pfg_user_token') || '';
      const method = editingPlan.id ? 'PATCH' : 'POST';
      const response = await fetch('/api/admin/membership-plans', { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(editingPlan) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Could not save plan.');
      setPlans((current) => editingPlan.id ? current.map((plan) => plan.id === data.plan.id ? data.plan : plan) : [...current, data.plan]);
      setEditingPlan(null);
    } catch (caught: any) { setError(caught.message || 'Could not save plan.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101B37] p-6 rounded-2xl border border-[#1E305C] shadow-xl">
        <div>
          <span className="text-xs uppercase font-bold text-[#D4AF37] tracking-wider">Module F</span>
          <h1 className="text-2xl font-black uppercase font-display text-white mt-0.5">
            Membership Plans &amp; Pricing Management
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Owner&apos;s direct pricing control: update rates, plan durations, and member inclusions.
          </p>
        </div>
        <button onClick={() => setEditingPlan({ id: '', name: '', description: '', duration_months: 1, price: 0, features: [], is_active: true, created_at: new Date().toISOString() })} className="flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-xs font-bold uppercase text-[#050B17]"><Plus className="h-4 w-4"/>Add plan</button>
      </div>

      {error && <p role="alert" className="rounded-lg border border-red-800 bg-red-950/40 p-3 text-sm text-red-200">{error}</p>}

      {/* Owner Pricing Notice */}
      <div className="bg-[#0A1128] border border-[#1E305C] rounded-xl p-4 flex items-center space-x-3 text-xs text-zinc-300">
        <HelpCircle className="w-5 h-5 text-gym-silver shrink-0" />
        <span>
          <strong>Owner Rule:</strong> Prices below are configured as initial editable placeholders. Owner Kapil Dev can edit any rate, duration, or feature list below at any time without developer intervention.
        </span>
      </div>

      {/* Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-[#101B37] rounded-2xl border border-[#1E305C] p-6 flex flex-col justify-between hover:border-[#D4AF37]/50 transition-all shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase text-gym-silver">
                  {plan.duration_months} Month Duration
                </span>
                <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  {plan.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <h3 className="text-xl font-bold uppercase font-display text-white mb-2">
                {plan.name}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                {plan.description}
              </p>

              <div className="py-4 border-y border-[#1E305C] mb-6">
                <span className="text-3xl font-black font-display text-white">
                  ₹{plan.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-zinc-400 ml-2">/ term</span>
              </div>

              <div className="space-y-2 mb-6">
                <span className="text-[11px] font-bold uppercase text-gym-silver block">Inclusions</span>
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-center text-xs text-zinc-300">
                    <Check className="w-3.5 h-3.5 text-[#D4AF37] mr-2 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#1E305C]">
              <button
                onClick={() => setEditingPlan({ ...plan })}
                className="w-full py-2.5 rounded-xl bg-[#0A1128] hover:bg-[#D4AF37] text-[#050B17] text-white text-xs font-bold uppercase tracking-wider border border-[#1E305C] transition-colors flex items-center justify-center space-x-1.5"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Price &amp; Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Plan Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#101B37] border border-[#1E305C] rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#1E305C] pb-3 mb-4">
              <h3 className="text-base font-bold uppercase font-display text-white">
                {editingPlan.id ? `Edit ${editingPlan.name}` : 'Add membership plan'}
              </h3>
              <button onClick={() => setEditingPlan(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Plan Name</label>
                <input
                  type="text"
                  required
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={editingPlan.price}
                    onChange={(e) => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Duration (Months)</label>
                  <input
                    type="number"
                    required
                    value={editingPlan.duration_months}
                    onChange={(e) => setEditingPlan({ ...editingPlan, duration_months: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingPlan.description}
                  onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#D4AF37] text-[#050B17] hover:bg-[#D4AF37] text-[#050B17]Hover text-white font-bold uppercase tracking-wider transition-colors"
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


