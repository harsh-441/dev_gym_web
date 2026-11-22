import { NextRequest, NextResponse } from 'next/server';
import { getVerifiedAdminIdentity } from '@/lib/admin-auth';
import { supabaseRest } from '@/lib/supabase-rest';

export const dynamic = 'force-dynamic';

function isCalendarDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) === value;
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const owner = await getVerifiedAdminIdentity(request);
  if (!owner) return NextResponse.json({ success: false, error: 'Owner access is required.' }, { status: 401 });
  try {
    const body = await request.json();
    const date = typeof body.date === 'string' ? body.date : '';
    const checkInTime = typeof body.checkInTime === 'string' ? new Date(body.checkInTime) : null;
    const reason = typeof body.reason === 'string' ? body.reason.trim() : '';
    if (!isCalendarDate(date) || !checkInTime || Number.isNaN(checkInTime.getTime()) || reason.length < 3 || reason.length > 500) {
      return NextResponse.json({ success: false, error: 'Provide a valid date, time, and correction reason (3–500 characters).' }, { status: 400 });
    }
    const updated = await supabaseRest<any>('rpc/correct_member_attendance', {
      method: 'POST', body: { target_id: params.id, corrected_date: date, corrected_time: checkInTime.toISOString(), owner_id: owner.id, correction_reason: reason }
    });
    return NextResponse.json({ success: true, attendance: updated });
  } catch (error: any) {
    if (error.message?.includes('idx_member_attendance_one_per_day') || error.message?.includes('duplicate key')) {
      return NextResponse.json({ success: false, error: 'Another attendance record already exists for that member and date.' }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: error.message || 'Could not correct attendance.' }, { status: 503 });
  }
}
