'use client';

import React, { useState } from 'react';
import { MessageSquare, Phone, Mail, CheckCircle2, Clock, Edit, X } from 'lucide-react';
import { api, Enquiry } from '@parshuram/shared';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([...(api as any).store.enquiries]);
  const [selectedEnq, setSelectedEnq] = useState<Enquiry | null>(null);
  const [status, setStatus] = useState<any>('new');
  const [notes, setNotes] = useState('');

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnq) return;

    const target = enquiries.find((enq) => enq.id === selectedEnq.id);
    if (target) {
      target.status = status;
      target.notes = notes;
      setEnquiries([...enquiries]);
    }
    setSelectedEnq(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101B37] p-6 rounded-2xl border border-[#1E305C] shadow-xl">
        <div>
          <span className="text-xs uppercase font-bold text-[#D4AF37] tracking-wider">Module G</span>
          <h1 className="text-2xl font-black uppercase font-display text-white mt-0.5">
            Prospective Member Enquiries
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Lead capture CRM: manage web submissions, follow-up calls, and conversion notes.
          </p>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-[#101B37] rounded-2xl border border-[#1E305C] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0A1128] text-zinc-400 uppercase font-bold text-[10px] border-b border-[#1E305C]">
              <tr>
                <th className="py-3.5 px-4">Prospect Name</th>
                <th className="py-3.5 px-4">Contact Details</th>
                <th className="py-3.5 px-4">Plan Interest</th>
                <th className="py-3.5 px-4">Message / Goal</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Follow-up Notes</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gym-border">
              {enquiries.map((enq) => (
                <tr key={enq.id} className="hover:bg-[#0A1128]/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{enq.full_name}</td>
                  <td className="py-3.5 px-4 text-zinc-300">
                    <p>{enq.phone}</p>
                    <p className="text-[10px] text-zinc-400">{enq.email}</p>
                  </td>
                  <td className="py-3.5 px-4 text-gym-silver">{enq.preferred_plan || 'General Visit'}</td>
                  <td className="py-3.5 px-4 text-zinc-300 max-w-xs leading-relaxed">{enq.message}</td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                      enq.status === 'converted'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                        : enq.status === 'contacted'
                        ? 'bg-blue-950 text-blue-300 border-blue-700'
                        : 'bg-[#D4AF37] text-[#050B17]/20 text-[#D4AF37] border-[#D4AF37]/40'
                    }`}>
                      {enq.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[11px] text-zinc-400 italic">
                    {enq.notes || 'No notes yet.'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedEnq(enq);
                        setStatus(enq.status);
                        setNotes(enq.notes || '');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#0A1128] border border-[#1E305C] text-zinc-300 hover:text-white text-[11px] font-semibold"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {selectedEnq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#101B37] border border-[#1E305C] rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#1E305C] pb-3 mb-4">
              <h3 className="text-base font-bold uppercase font-display text-white">
                Update Prospect: {selectedEnq.full_name}
              </h3>
              <button onClick={() => setSelectedEnq(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="new">New Lead</option>
                  <option value="contacted">Contacted via Phone/WhatsApp</option>
                  <option value="converted">Converted to Enrolled Member</option>
                  <option value="closed">Closed / Not Interested</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Owner Follow-up Notes</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Called and invited for floor tour on Saturday with Coach Vikram..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#D4AF37] text-[#050B17] hover:bg-[#D4AF37] text-[#050B17]Hover text-white font-bold uppercase tracking-wider transition-colors"
              >
                Save Follow-Up
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


