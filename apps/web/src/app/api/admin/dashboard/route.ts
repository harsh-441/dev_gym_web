import { NextRequest, NextResponse } from 'next/server';
import { getVerifiedAdminIdentity } from '@/lib/admin-auth';
import { supabaseRest } from '@/lib/supabase-rest';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  if (!await getVerifiedAdminIdentity(request)) return NextResponse.json({ success: false, error: 'Owner access is required.' }, { status: 401 });
  try {
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
    const [members, attendance, enquiries] = await Promise.all([
      supabaseRest<any[]>('members', { query: { select: 'id,status', deleted_at: 'is.null', limit: '10000' } }),
      supabaseRest<any[]>('member_attendance', { query: { select: 'id', attendance_date: `eq.${today}`, limit: '10000' } }),
      supabaseRest<any[]>('enquiries', { query: { select: 'id', status: 'eq.new', limit: '10000' } })
    ]);
    return NextResponse.json({ success: true, metrics: { totalMembers: members.length, activeMembers: members.filter(member => member.status === 'active').length, todayMemberAttendance: attendance.length, newEnquiries: enquiries.length } }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Could not load dashboard.' }, { status: 503 });
  }
}
