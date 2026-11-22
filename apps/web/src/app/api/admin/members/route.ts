import { NextRequest, NextResponse } from 'next/server';
import { getVerifiedAdminIdentity } from '@/lib/admin-auth';
import { supabaseRest } from '@/lib/supabase-rest';

export const dynamic = 'force-dynamic';

function unauthorized() {
  return NextResponse.json({ success: false, error: 'Please sign in with an owner or admin account.' }, { status: 401 });
}

export async function GET(request: NextRequest) {
  if (!await getVerifiedAdminIdentity(request)) return unauthorized();
  try {
    const members = await supabaseRest<any[]>('members', {
      query: { select: '*', deleted_at: 'is.null', order: 'created_at.desc' }
    });
    const profileIds = [...new Set(members.map((member) => member.profile_id).filter(Boolean))];
    const profiles = profileIds.length
      ? await supabaseRest<any[]>('profiles', {
          query: { select: '*', id: `in.(${profileIds.join(',')})` }
        })
      : [];
    const membershipPlans = await supabaseRest<any[]>('membership_plans', { query: { select: '*', is_active: 'eq.true', order: 'duration_months.asc' } });
    const memberIds = members.map((member) => member.id);
    const memberships = memberIds.length ? await supabaseRest<any[]>('memberships', { query: { select: '*,membership_plans(name)', member_id: `in.(${memberIds.join(',')})`, order: 'end_date.desc' } }) : [];
    return NextResponse.json({ success: true, members, profiles, membershipPlans, memberships }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Could not load members.' }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  if (!await getVerifiedAdminIdentity(request)) return unauthorized();
  try {
    const body = await request.json();
    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const planId = typeof body.planId === 'string' ? body.planId : '';
    if (fullName.length < 2 || fullName.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: 'Enter a valid member name and email.' }, { status: 400 });
    }
    if (body.phone && !/^\+?[0-9\s\-()]{7,15}$/.test(String(body.phone).trim())) return NextResponse.json({ success: false, error: 'Enter a valid phone number.' }, { status: 400 });
    const goals = ['muscle_gain', 'fat_loss', 'weight_gain', 'strength', 'endurance', 'general_fitness'];
    if (body.fitnessGoal && !goals.includes(body.fitnessGoal)) return NextResponse.json({ success: false, error: 'Select a valid fitness goal.' }, { status: 400 });
    if ((body.heightCm && (!Number.isFinite(Number(body.heightCm)) || Number(body.heightCm) < 50 || Number(body.heightCm) > 250)) || (body.weightKg && (!Number.isFinite(Number(body.weightKg)) || Number(body.weightKg) < 20 || Number(body.weightKg) > 400))) return NextResponse.json({ success: false, error: 'Height or weight is outside the allowed range.' }, { status: 400 });
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) return NextResponse.json({ success: false, error: 'Member invitations are not configured.' }, { status: 503 });
    const invited = await fetch(`${url.replace(/\/$/, '')}/auth/v1/invite`, {
      method: 'POST', cache: 'no-store', headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, data: { full_name: fullName } })
    });
    const invitedUser = await invited.json();
    if (!invited.ok || !invitedUser.id) return NextResponse.json({ success: false, error: invitedUser.msg || invitedUser.message || 'Could not send the member invitation.' }, { status: 400 });
    const profileRows = await supabaseRest<any[]>('profiles', { method: 'POST', query: { select: '*' }, prefer: 'return=representation', body: { user_id: invitedUser.id, full_name: fullName, email, phone: body.phone || null, role: 'member', is_active: true } });
    const profile = profileRows[0];
    const memberRows = await supabaseRest<any[]>('members', { method: 'POST', query: { select: '*' }, prefer: 'return=representation', body: { profile_id: profile.id, emergency_contact: body.emergencyContact || null, blood_group: body.bloodGroup || null, fitness_goal: body.fitnessGoal || 'general_fitness', height_cm: body.heightCm || null, weight_kg: body.weightKg || null, status: 'active' } });
    const member = memberRows[0];
    let membership = null;
    if (planId) {
      const plans = await supabaseRest<any[]>('membership_plans', { query: { select: '*', id: `eq.${planId}`, is_active: 'eq.true', limit: '1' } });
      if (plans[0]) {
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + plans[0].duration_months);
        const created = await supabaseRest<any[]>('memberships', { method: 'POST', query: { select: '*,membership_plans(name)' }, body: { member_id: member.id, plan_id: plans[0].id, start_date: startDate.toISOString().slice(0, 10), end_date: endDate.toISOString().slice(0, 10), status: 'active', amount_paid: 0, payment_method: 'cash' }, prefer: 'return=representation' });
        membership = created[0] || null;
      }
    }
    return NextResponse.json({ success: true, member, profile, membership, message: 'Member invitation sent.' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Could not add member.' }, { status: 503 });
  }
}

export async function PATCH(request: NextRequest) {
  const owner = await getVerifiedAdminIdentity(request);
  if (!owner) return unauthorized();
  try {
    const body = await request.json();
    const memberId = typeof body.memberId === 'string' ? body.memberId.trim() : '';
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(memberId)) return NextResponse.json({ success: false, error: 'A valid member ID is required.' }, { status: 400 });
    const current = await supabaseRest<any[]>('members', { query: { select: 'id,profile_id', id: `eq.${memberId}`, deleted_at: 'is.null', limit: '1' } });
    if (!current[0]) return NextResponse.json({ success: false, error: 'Member not found.' }, { status: 404 });
    const status = body.status === 'inactive' ? 'inactive' : body.status === 'active' ? 'active' : null;
    if ('status' in body && !status) return NextResponse.json({ success: false, error: 'Member status must be active or inactive.' }, { status: 400 });
    const patch: Record<string, unknown> = {};
    for (const field of ['emergency_contact', 'blood_group', 'fitness_goal', 'height_cm', 'weight_kg'] as const) if (field in body) patch[field] = body[field];
    if (typeof body.fullName === 'string' && (body.fullName.trim().length < 2 || body.fullName.trim().length > 120)) return NextResponse.json({ success: false, error: 'Member name must be 2 to 120 characters.' }, { status: 400 });
    if (typeof body.phone === 'string' && body.phone && !/^\+?[0-9\s\-()]{7,15}$/.test(body.phone.trim())) return NextResponse.json({ success: false, error: 'Enter a valid phone number.' }, { status: 400 });
    if (typeof body.emergency_contact === 'string' && body.emergency_contact.length > 120) return NextResponse.json({ success: false, error: 'Emergency contact must be 120 characters or fewer.' }, { status: 400 });
    if (typeof body.blood_group === 'string' && !['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(body.blood_group)) return NextResponse.json({ success: false, error: 'Select a valid blood group.' }, { status: 400 });
    if ('fitness_goal' in body && !['muscle_gain', 'fat_loss', 'weight_gain', 'strength', 'endurance', 'general_fitness'].includes(body.fitness_goal)) return NextResponse.json({ success: false, error: 'Select a valid fitness goal.' }, { status: 400 });
    if (('height_cm' in body && body.height_cm !== null && (!Number.isFinite(Number(body.height_cm)) || Number(body.height_cm) < 50 || Number(body.height_cm) > 250)) || ('weight_kg' in body && body.weight_kg !== null && (!Number.isFinite(Number(body.weight_kg)) || Number(body.weight_kg) < 20 || Number(body.weight_kg) > 400))) return NextResponse.json({ success: false, error: 'Height or weight is outside the allowed range.' }, { status: 400 });
    if (status) patch.status = status;
    patch.updated_at = new Date().toISOString();
    await supabaseRest('members', { method: 'PATCH', query: { id: `eq.${memberId}` }, body: patch });
    if (status) await supabaseRest('profiles', { method: 'PATCH', query: { id: `eq.${current[0].profile_id}` }, body: { is_active: status === 'active', updated_at: new Date().toISOString() } });
    if (typeof body.fullName === 'string' || typeof body.phone === 'string') {
      await supabaseRest('profiles', { method: 'PATCH', query: { id: `eq.${current[0].profile_id}` }, body: { ...(typeof body.fullName === 'string' ? { full_name: body.fullName.trim() } : {}), ...(typeof body.phone === 'string' ? { phone: body.phone.trim() } : {}), updated_at: new Date().toISOString() } });
    }
    return NextResponse.json({ success: true, message: 'Member updated.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Could not update member.' }, { status: 503 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!await getVerifiedAdminIdentity(request)) return unauthorized();
  try {
    const body = await request.json();
    const memberId = typeof body.memberId === 'string' ? body.memberId.trim() : '';
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(memberId)) {
      return NextResponse.json({ success: false, error: 'A valid member ID is required.' }, { status: 400 });
    }

    const deleted = await supabaseRest<boolean>('rpc/soft_delete_member', {
      method: 'POST',
      body: { target_member_id: memberId }
    });
    if (!deleted) return NextResponse.json({ success: false, error: 'Member was not found or is already deleted.' }, { status: 404 });
    return NextResponse.json({ success: true, memberId });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Could not remove member.' }, { status: 503 });
  }
}
