'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { CalendarCheck, Download, RefreshCw, Search } from 'lucide-react';

type Attendance = { id: string; member_id: string; attendance_date: string; check_in_time: string; check_in_method: string; record_source: string; members?: { profiles?: { full_name?: string; email?: string } } };
type Member = { id: string; profiles?: { full_name?: string; email?: string } };
const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());

export default function AdminAttendancePage() {
  const [rows, setRows] = useState<Attendance[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [date, setDate] = useState(today());
  const [month, setMonth] = useState('');
  const [search, setSearch] = useState('');
  const [memberId, setMemberId] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [editing, setEditing] = useState<Attendance | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [reason, setReason] = useState('');
  const token = () => localStorage.getItem('pfg_user_token') || '';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [attendanceResponse, membersResponse] = await Promise.all([
        fetch(`/api/attendance?${month ? `month=${encodeURIComponent(month)}` : `date=${encodeURIComponent(date)}`}&search=${encodeURIComponent(search)}`, { headers: { Authorization: `Bearer ${token()}` }, cache: 'no-store' }),
        fetch('/api/admin/members', { headers: { Authorization: `Bearer ${token()}` }, cache: 'no-store' })
      ]);
      const attendanceData = await attendanceResponse.json();
      const memberData = await membersResponse.json();
      if (!attendanceResponse.ok) throw new Error(attendanceData.error || 'Could not load attendance.');
      setRows(attendanceData.attendance || []);
      setMembers((memberData.members || []).map((member: any) => ({ ...member, profiles: memberData.profiles?.find((profile: any) => profile.id === member.profile_id) })));
    } catch (error: any) { setNotice(error.message || 'Could not load attendance.'); }
    finally { setLoading(false); }
  }, [date, month, search]);

  useEffect(() => { load(); }, [load]);

  const markManual = async (event: React.FormEvent) => {
    event.preventDefault(); setNotice(''); setWorking(true);
    try {
      const response = await fetch('/api/attendance', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` }, body: JSON.stringify({ memberId, date }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not record attendance.');
      setNotice(result.message); await load();
    } catch (error: any) { setNotice(error.message || 'Could not record attendance.'); }
    finally { setWorking(false); }
  };

  const saveCorrection = async (event: React.FormEvent) => {
    event.preventDefault(); if (!editing) return; setWorking(true); setNotice('');
    try {
      const time = new Date(`${editDate}T${editTime}:00+05:30`).toISOString();
      const response = await fetch(`/api/attendance/${encodeURIComponent(editing.id)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` }, body: JSON.stringify({ date: editDate, checkInTime: time, reason }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not correct attendance.');
      setEditing(null); setNotice('Attendance correction saved.'); await load();
    } catch (error: any) { setNotice(error.message || 'Could not correct attendance.'); }
    finally { setWorking(false); }
  };

  const exportCsv = () => {
    const escape = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`;
    const data = [['Member', 'Member ID', 'Date', 'Check-in time', 'Source'], ...rows.map(row => [row.members?.profiles?.full_name, row.member_id, row.attendance_date, row.check_in_time, row.record_source])];
    const blob = new Blob([data.map(line => line.map(escape).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `attendance-${month || date}.csv`; link.click(); URL.revokeObjectURL(link.href);
  };

  return <div className="space-y-6">
    <header className="rounded-2xl border border-[#1E305C] bg-[#101B37] p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div><span className="text-xs uppercase font-bold text-[#D4AF37]">Member attendance</span><h1 className="mt-1 text-2xl font-black uppercase">Attendance history</h1><p className="mt-1 text-xs text-slate-400">Daily and historical records, manual entry, corrections, and CSV export.</p></div>
      <button onClick={exportCsv} disabled={!rows.length} className="flex items-center justify-center gap-2 rounded-lg border border-[#1E305C] px-4 py-2 text-xs font-bold disabled:opacity-50"><Download className="h-4 w-4"/>Export CSV</button>
    </header>
    <form onSubmit={markManual} className="grid gap-3 rounded-2xl border border-[#1E305C] bg-[#101B37] p-5 md:grid-cols-[1fr_180px_auto]">
      <label className="text-[11px] font-bold uppercase text-slate-300">Member<select required value={memberId} onChange={event => setMemberId(event.target.value)} className="mt-2 w-full rounded-lg border border-[#1E305C] bg-[#0A1128] px-3 py-2.5 text-sm text-white"><option value="">Select a member</option>{members.map(member => <option key={member.id} value={member.id}>{member.profiles?.full_name || member.profiles?.email || member.id}</option>)}</select></label>
      <label className="text-[11px] font-bold uppercase text-slate-300">Attendance date<input required type="date" value={date} onChange={event => { setDate(event.target.value); setMonth(''); }} className="mt-2 w-full rounded-lg border border-[#1E305C] bg-[#0A1128] px-3 py-2.5 text-sm text-white"/></label>
      <button disabled={working || !memberId} className="self-end rounded-lg bg-[#D4AF37] px-4 py-3 text-xs font-black uppercase text-[#050B17] disabled:opacity-50">{working ? 'Saving…' : 'Mark attendance'}</button>
    </form>
    <div className="flex flex-col gap-3 rounded-2xl border border-[#1E305C] bg-[#101B37] p-4 sm:flex-row">
      <label className="flex items-center gap-2 rounded-lg border border-[#1E305C] bg-[#0A1128] px-3"><CalendarCheck className="h-4 w-4 text-[#D4AF37]"/><input aria-label="Filter attendance date" type="date" value={date} onChange={event => setDate(event.target.value)} className="bg-transparent py-2.5 text-sm text-white outline-none"/></label>
      <label className="flex items-center gap-2 rounded-lg border border-[#1E305C] bg-[#0A1128] px-3 text-xs text-slate-400">Month<input aria-label="Filter attendance month" type="month" value={month} onChange={event => setMonth(event.target.value)} className="bg-transparent py-2.5 text-sm text-white outline-none"/></label>
      <label className="flex flex-1 items-center gap-2 rounded-lg border border-[#1E305C] bg-[#0A1128] px-3"><Search className="h-4 w-4 text-slate-400"/><input aria-label="Search member attendance" placeholder="Search by member name or ID" value={search} onChange={event => setSearch(event.target.value)} className="w-full bg-transparent py-2.5 text-sm text-white outline-none"/></label>
      <button onClick={load} className="rounded-lg border border-[#1E305C] px-4 py-2 text-xs font-bold"><RefreshCw className="mr-2 inline h-4 w-4"/>Refresh</button>
    </div>
    {notice && <p role="status" className="rounded-lg border border-[#1E305C] bg-[#0A1128] p-3 text-sm text-slate-200">{notice}</p>}
    <div className="overflow-x-auto rounded-2xl border border-[#1E305C] bg-[#101B37]"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-[#0A1128] text-[10px] uppercase text-slate-400"><tr><th className="p-4">Member</th><th className="p-4">Member ID</th><th className="p-4">Date</th><th className="p-4">Check-in time</th><th className="p-4">Recorded by</th><th className="p-4">Action</th></tr></thead><tbody className="divide-y divide-[#1E305C]">{loading ? <tr><td colSpan={6} className="p-8 text-center text-slate-400">Loading attendance…</td></tr> : rows.length ? rows.map(row => <tr key={row.id}><td className="p-4">{row.members?.profiles?.full_name || 'Member'}</td><td className="p-4 font-mono text-xs">{row.member_id}</td><td className="p-4">{row.attendance_date}</td><td className="p-4">{new Date(row.check_in_time).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })}</td><td className="p-4 capitalize">{row.record_source === 'owner' ? 'Owner manual' : 'Member check-in'}</td><td className="p-4"><button onClick={() => { setEditing(row); setEditDate(row.attendance_date); setEditTime(new Date(row.check_in_time).toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })); setReason(''); }} className="font-bold text-[#D4AF37]">Correct</button></td></tr>) : <tr><td colSpan={6} className="p-8 text-center text-slate-400">No attendance records for this date.</td></tr>}</tbody></table></div>
    {editing && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"><form onSubmit={saveCorrection} className="w-full max-w-md space-y-4 rounded-2xl border border-[#1E305C] bg-[#101B37] p-6"><h2 className="text-lg font-black">Correct attendance</h2><label className="block text-xs">Date<input type="date" required value={editDate} onChange={event => setEditDate(event.target.value)} className="mt-1 w-full rounded border border-[#1E305C] bg-[#0A1128] p-2"/></label><label className="block text-xs">Check-in time<input type="time" required value={editTime} onChange={event => setEditTime(event.target.value)} className="mt-1 w-full rounded border border-[#1E305C] bg-[#0A1128] p-2"/></label><label className="block text-xs">Reason<input required minLength={3} maxLength={500} value={reason} onChange={event => setReason(event.target.value)} className="mt-1 w-full rounded border border-[#1E305C] bg-[#0A1128] p-2"/></label><div className="flex justify-end gap-2"><button type="button" onClick={() => setEditing(null)} className="rounded border border-[#1E305C] px-4 py-2 text-xs">Cancel</button><button disabled={working} className="rounded bg-[#D4AF37] px-4 py-2 text-xs font-black text-[#050B17]">Save correction</button></div></form></div>}
  </div>;
}
