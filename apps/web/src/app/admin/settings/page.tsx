'use client';

import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { api, AppSettings, DEFAULT_APP_SETTINGS } from '@parshuram/shared';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AppSettings>({ ...(api as any).store.settings });
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    (api as any).store.settings = { ...settings };
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gym-card p-6 rounded-2xl border border-gym-border shadow-xl">
        <div>
          <span className="text-xs uppercase font-bold text-gym-red tracking-wider">Module H</span>
          <h1 className="text-2xl font-black uppercase font-display text-white mt-0.5">
            System &amp; Gym Facility Settings
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Dave&apos;s master configuration: contact info, facility hours, QR rotation timing, and gym policies.
          </p>
        </div>

        {saved && (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-600 text-emerald-300 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Brand & Owner */}
        <div className="bg-gym-card rounded-2xl border border-gym-border p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold uppercase font-display text-white border-b border-gym-border pb-2">
            Gym Brand &amp; Ownership
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Gym Name</label>
              <input
                type="text"
                value={settings.gym_name}
                onChange={(e) => setSettings({ ...settings, gym_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Owner Name</label>
              <input
                type="text"
                value={settings.owner_name}
                onChange={(e) => setSettings({ ...settings, owner_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Official Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Contact & Hours */}
        <div className="bg-gym-card rounded-2xl border border-gym-border p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold uppercase font-display text-white border-b border-gym-border pb-2">
            Facility Location &amp; Hours (Dave Placeholders)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Contact Phone</label>
              <input
                type="text"
                value={settings.contact_phone}
                onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Contact Email</label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Address Line</label>
              <input
                type="text"
                value={settings.address_line1}
                onChange={(e) => setSettings({ ...settings, address_line1: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">City / State</label>
              <input
                type="text"
                value={settings.city}
                onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Weekday Hours</label>
              <input
                type="text"
                value={settings.opening_hours_weekdays}
                onChange={(e) => setSettings({ ...settings, opening_hours_weekdays: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Weekend Hours</label>
              <input
                type="text"
                value={settings.opening_hours_weekends}
                onChange={(e) => setSettings({ ...settings, opening_hours_weekends: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* QR & Attendance Policies */}
        <div className="bg-gym-card rounded-2xl border border-gym-border p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold uppercase font-display text-white border-b border-gym-border pb-2">
            Attendance &amp; QR Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">
                Rotating QR Lifetime (Seconds)
              </label>
              <input
                type="number"
                min="15"
                max="300"
                value={settings.qr_token_validity_seconds}
                onChange={(e) => setSettings({ ...settings, qr_token_validity_seconds: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-gym-charcoal border border-gym-border text-white focus:border-gym-red focus:outline-none"
              />
              <span className="text-[10px] text-zinc-400 mt-1 block">Default: 60s to prevent forwarded QR codes</span>
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <input
                type="checkbox"
                id="enableManual"
                checked={settings.enable_manual_checkin}
                onChange={(e) => setSettings({ ...settings, enable_manual_checkin: e.target.checked })}
                className="w-4 h-4 rounded text-gym-red focus:ring-gym-red"
              />
              <label htmlFor="enableManual" className="text-xs text-white font-semibold">
                Allow Front Desk Manual Check-in Fallback
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-gym-red hover:bg-gym-redHover text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-red-950/60 flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save System Settings</span>
        </button>
      </form>
    </div>
  );
}
