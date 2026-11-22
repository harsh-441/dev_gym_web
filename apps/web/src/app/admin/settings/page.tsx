'use client';

import React, { useEffect, useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { AppSettings, DEFAULT_APP_SETTINGS } from '@parshuram/shared';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AppSettings>({ ...DEFAULT_APP_SETTINGS });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('pfg_user_token') || '';
    fetch('/api/admin/settings', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
      .then(async response => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Could not load settings.');
        setSettings(result.settings);
      })
      .catch((cause: Error) => setError(cause.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setWorking(true); setSaved(false);
    try {
      const token = localStorage.getItem('pfg_user_token') || '';
      const response = await fetch('/api/admin/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(settings) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not save settings.');
      setSettings(result.settings); setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch (cause: any) { setError(cause.message || 'Could not save settings.'); }
    finally { setWorking(false); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101B37] p-6 rounded-2xl border border-[#1E305C] shadow-xl">
        <div>
          <span className="text-xs uppercase font-bold text-[#D4AF37] tracking-wider">Module H</span>
          <h1 className="text-2xl font-black uppercase font-display text-white mt-0.5">
            System &amp; Gym Facility Settings
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Owner&apos;s master configuration: gym contact information and operating hours.
          </p>
        </div>

        {saved && (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-600 text-emerald-300 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      {error && <p role="alert" className="rounded-lg border border-red-900 bg-red-950/30 p-3 text-sm text-red-200">{error}</p>}
      {loading && <p role="status" className="text-sm text-slate-400">Loading saved gym settings…</p>}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Brand & Owner */}
        <div className="bg-[#101B37] rounded-2xl border border-[#1E305C] p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold uppercase font-display text-white border-b border-[#1E305C] pb-2">
            Gym Brand &amp; Ownership
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Gym Name</label>
              <input
                type="text"
                value={settings.gym_name}
                onChange={(e) => setSettings({ ...settings, gym_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Owner Name</label>
              <input
                type="text"
                value={settings.owner_name}
                onChange={(e) => setSettings({ ...settings, owner_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Official Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Contact & Hours */}
        <div className="bg-[#101B37] rounded-2xl border border-[#1E305C] p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold uppercase font-display text-white border-b border-[#1E305C] pb-2">
            Facility Location &amp; Hours (Verified Information)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Contact Phone</label>
              <input
                type="text"
                value={settings.contact_phone}
                onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Contact Email</label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Address Line</label>
              <input
                type="text"
                value={settings.address_line1}
                onChange={(e) => setSettings({ ...settings, address_line1: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">City / State</label>
              <input
                type="text"
                value={settings.city}
                onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Weekday Hours</label>
              <input
                type="text"
                value={settings.opening_hours_weekdays}
                onChange={(e) => setSettings({ ...settings, opening_hours_weekdays: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Weekend Hours</label>
              <input
                type="text"
                value={settings.opening_hours_weekends}
                onChange={(e) => setSettings({ ...settings, opening_hours_weekends: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || working}
          className="px-6 py-3 rounded-xl bg-[#D4AF37] text-[#050B17] hover:bg-[#D4AF37] text-[#050B17]Hover text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-black/60 flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{working ? 'Saving…' : 'Save System Settings'}</span>
        </button>
      </form>
    </div>
  );
}


