import { NextRequest, NextResponse } from 'next/server';
import { getAuthIdentity, getVerifiedAdminIdentity } from '@/lib/admin-auth';
import { supabaseRest } from '@/lib/supabase-rest';

export const dynamic = 'force-dynamic';

const unauthorized = (message = 'Sign in to view attendance.') =>
  NextResponse.json({ success: false, error: message }, { status: 401 });
const ownerOnly = () =>
  NextResponse.json({ success: false, error: 'Owner access is required.' }, { status: 403 });

function gymDate() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
}
function isCalendarDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) === value;
}

export async function GET(request: NextRequest) {
  const identity = getAuthIdentity(request);
  if (!identity) return unauthorized();
  const owner = await getVerifiedAdminIdentity(request);
  try {
    const query = request.nextUrl.searchParams;
    const date = query.get('date');
    const month = query.get('month');
    const searchTerm = (query.get('search') || '').trim();
    if (date && !isCalendarDate(date)) return NextResponse.json({ success: false, error: 'Date must use YYYY-MM-DD.' }, { status: 400 });
    if (month && (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month))) return NextResponse.json({ success: false, error: 'Month must use YYYY-MM.' }, { status: 400 });
    if (searchTerm.length > 120) return NextResponse.json({ success: false, error: 'Search text must be 120 characters or fewer.' }, { status: 400 });
    const filters: Record<string, string> = { select: '*,members!inner(id,profile_id,profiles!inner(full_name,email))', order: 'attendance_date.desc,check_in_time.desc', limit: '1000' };
    if (date && isCalendarDate(date)) filters.attendance_date = `eq.${date}`;
    else if (month && /^\d{4}-\d{2}$/.test(month)) {
      const from = `${month}-01`;
      const to = new Date(Date.UTC(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 1)).toISOString().slice(0, 10);
      filters.and = `(attendance_date.gte.${from},attendance_date.lt.${to})`;
    }
    if (!owner) {
      if (identity.role !== 'member') return unauthorized('This portal is available to members only.');
      const profiles = await supabaseRest<any[]>('profiles', { query: { select: 'id,role', id: `eq.${identity.id}`, is_active: 'eq.true' } });
      if (!profiles[0] || profiles[0].role !== identity.role) return unauthorized('Member account is inactive or unavailable.');
      const members = await supabaseRest<any[]>('members', { query: { select: 'id', profile_id: `eq.${identity.id}`, deleted_at: 'is.null', status: 'eq.active' } });
      if (!members[0]) return unauthorized('Member profile is unavailable.');
      filters.member_id = `eq.${members[0].id}`;
    } else if (query.get('memberId')) {
      const memberId = query.get('memberId')!;
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(memberId)) return NextResponse.json({ success: false, error: 'A valid member ID is required.' }, { status: 400 });
      filters.member_id = `eq.${memberId}`;
    }
    const rows = await supabaseRest<any[]>('member_attendance', { query: filters });
    const search = owner ? searchTerm.toLowerCase() : '';
    const attendance = search ? rows.filter((row) =>
      row.members?.profiles?.full_name?.toLowerCase().includes(search) || row.member_id.toLowerCase().includes(search)
    ) : rows;
    return NextResponse.json({ success: true, attendance }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Could not load attendance.' }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  const identity = getAuthIdentity(request);
  if (!identity) return unauthorized();
  const owner = await getVerifiedAdminIdentity(request);
  try {
    const body = await request.json();
    const date = typeof body.date === 'string' ? body.date : gymDate();
    if (!isCalendarDate(date)) {
      return NextResponse.json({ success: false, error: 'A valid attendance date is required.' }, { status: 400 });
    }
    let memberId: string;
    if (owner) {
      memberId = typeof body.memberId === 'string' ? body.memberId.trim() : '';
      if (!memberId) return NextResponse.json({ success: false, error: 'Select a member.' }, { status: 400 });
      const matching = await supabaseRest<any[]>('members', { query: { select: 'id', id: `eq.${memberId}`, deleted_at: 'is.null' } });
      if (!matching[0]) return NextResponse.json({ success: false, error: 'Member not found.' }, { status: 404 });
    } else {
      if (identity.role !== 'member') return ownerOnly();
      const profiles = await supabaseRest<any[]>('profiles', { query: { select: 'id,role', id: `eq.${identity.id}`, is_active: 'eq.true', limit: '1' } });
      if (!profiles[0] || profiles[0].role !== 'member') return unauthorized('Member account is inactive or unavailable.');
      const members = await supabaseRest<any[]>('members', { query: { select: 'id', profile_id: `eq.${identity.id}`, deleted_at: 'is.null', status: 'eq.active' } });
      if (!members[0]) return unauthorized('Member profile is unavailable.');
      memberId = members[0].id;
    }
    const suppliedTime = typeof body.checkInTime === 'string' ? new Date(body.checkInTime) : null;
    if (suppliedTime && Number.isNaN(suppliedTime.getTime())) return NextResponse.json({ success: false, error: 'Check-in time is invalid.' }, { status: 400 });
    const row = {
      member_id: memberId,
      attendance_date: date,
      check_in_time: suppliedTime?.toISOString() || (date === gymDate() ? new Date().toISOString() : `${date}T12:00:00.000Z`),
      check_in_method: owner ? 'manual' : 'portal',
      record_source: owner ? 'owner' : 'member',
      created_by: owner ? identity.id : null,
      updated_by: owner ? identity.id : null
    };
    const inserted = await supabaseRest<any[]>('member_attendance', { method: 'POST', body: row, query: { select: '*' }, prefer: 'return=representation' });
    return NextResponse.json({ success: true, attendance: inserted[0], message: owner ? 'Manual attendance recorded.' : 'Your check-in was recorded successfully.' }, { status: 201 });
  } catch (error: any) {
    if (error.message?.includes('idx_member_attendance_one_per_day') || error.message?.includes('duplicate key')) {
      return NextResponse.json({ success: false, error: 'Attendance is already recorded for this member on that date.' }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: error.message || 'Could not record attendance.' }, { status: 503 });
  }
}
