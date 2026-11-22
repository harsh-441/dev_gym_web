import { NextRequest, NextResponse } from 'next/server';
import { createAuthToken } from '@/lib/admin-auth';
import { supabaseRest } from '@/lib/supabase-rest';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password || password.length > 256) {
      return NextResponse.json({ success: false, error: 'Enter a valid email and password.' }, { status: 400 });
    }
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) return NextResponse.json({ success: false, error: 'Authentication is not configured.' }, { status: 503 });
    const authResponse = await fetch(`${url.replace(/\/$/, '')}/auth/v1/token?grant_type=password`, {
      method: 'POST', cache: 'no-store', headers: { apikey: anonKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const authData = await authResponse.json();
    if (!authResponse.ok || !authData.user?.id) return NextResponse.json({ success: false, error: 'Invalid email or password.' }, { status: 401 });
    const profiles = await supabaseRest<any[]>('profiles', { query: { select: 'id,email,full_name,role,is_active', user_id: `eq.${authData.user.id}`, limit: '1' } });
    const profile = profiles[0];
    if (!profile || !profile.is_active || !['member', 'admin', 'super_admin'].includes(profile.role)) {
      return NextResponse.json({ success: false, error: 'This account is unavailable. Contact the gym owner.' }, { status: 403 });
    }
    const members = profile.role === 'member' ? await supabaseRest<any[]>('members', { query: { select: 'id', profile_id: `eq.${profile.id}`, deleted_at: 'is.null', limit: '1' } }) : [];
    if (profile.role === 'member' && !members[0]) return NextResponse.json({ success: false, error: 'Member profile is unavailable.' }, { status: 403 });
    const dashboardRoute = ['admin', 'super_admin'].includes(profile.role) ? '/admin' : '/portal/member';
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token: createAuthToken({ id: profile.id, email: profile.email, role: profile.role }),
      dashboardRoute,
      user: { id: profile.id, name: profile.full_name, email: profile.email, role: profile.role, memberId: members[0]?.id }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Could not sign in.' }, { status: 503 });
  }
}
