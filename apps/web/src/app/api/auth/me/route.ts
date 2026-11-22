import { NextRequest, NextResponse } from 'next/server';
import { getAuthIdentity } from '@/lib/admin-auth';
import { supabaseRest } from '@/lib/supabase-rest';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const identity = getAuthIdentity(req);
    if (!identity) return NextResponse.json({ success: false, error: 'Please sign in.' }, { status: 401 });
    const profiles = await supabaseRest<any[]>('profiles', { query: { select: '*', id: `eq.${identity.id}`, is_active: 'eq.true', limit: '1' } });
    const profile = profiles[0];
    if (!profile || profile.role !== identity.role) return NextResponse.json({ success: false, error: 'Profile not found, inactive, or the session has expired.' }, { status: 404 });
    if (profile.role !== 'member' && !['admin', 'super_admin'].includes(profile.role)) {
      return NextResponse.json({ success: false, error: 'This portal is available to members only.' }, { status: 403 });
    }
    const memberRows = profile.role === 'member'
      ? await supabaseRest<any[]>('members', { query: { select: '*', profile_id: `eq.${profile.id}`, deleted_at: 'is.null', limit: '1' } })
      : [];
    const member = memberRows[0] || null;
    const memberships = member ? await supabaseRest<any[]>('memberships', { query: { select: '*,membership_plans(*)', member_id: `eq.${member.id}`, order: 'end_date.desc', limit: '1' } }) : [];
    const plan = memberships[0]?.membership_plans || null;

    return NextResponse.json({
      success: true,
      profile,
      member: member || null,
      membership: memberships[0] || null,
      plan
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
