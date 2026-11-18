import { NextRequest, NextResponse } from 'next/server';
import { api } from '@parshuram/shared';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email');
    if (!email) {
      return NextResponse.json({ success: false, error: 'Email parameter required' }, { status: 400 });
    }

    const store = (api as any).store;
    const profile = store.profiles.find((p: any) => p.email.toLowerCase() === email.trim().toLowerCase());

    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }

    const member = store.members.find((m: any) => m.profile_id === profile.id);
    const employee = store.employees.find((e: any) => e.profile_id === profile.id);
    const plan = member?.active_membership_id
      ? store.membershipPlans.find((p: any) => p.id === member.active_membership_id)
      : null;

    return NextResponse.json({
      success: true,
      profile,
      member: member || null,
      employee: employee || null,
      plan: plan || store.membershipPlans[0]
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
