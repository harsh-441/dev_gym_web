import { NextRequest, NextResponse } from 'next/server';
import { validateMemberRegistration } from '@parshuram/shared';
import { supabaseRest } from '@/lib/supabase-rest';
import { createAuthToken } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, password, phone, fitnessGoal } = body;
    const validation = validateMemberRegistration({ fullName, email, password, phone, fitnessGoal });
    if (!validation.isValid) return NextResponse.json({ success: false, error: 'Validation failed', details: validation.errors }, { status: 400 });
    const normalizedEmail = email.trim().toLowerCase();
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) return NextResponse.json({ success: false, error: 'Authentication is not configured.' }, { status: 503 });
    const existing = await supabaseRest<any[]>('profiles', { query: { select: 'id', email: `eq.${normalizedEmail}`, limit: '1' } });
    if (existing.length) return NextResponse.json({ success: false, error: 'An account with this email already exists. Please sign in.' }, { status: 409 });
    const authResponse = await fetch(`${url.replace(/\/$/, '')}/auth/v1/signup`, {
      method: 'POST', cache: 'no-store', headers: { apikey: anonKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalizedEmail, password, data: { full_name: fullName.trim() } })
    });
    const authData = await authResponse.json();
    if (!authResponse.ok || !authData.user?.id) return NextResponse.json({ success: false, error: authData.msg || authData.message || 'Could not create the account.' }, { status: 400 });
    const profileRows = await supabaseRest<any[]>('profiles', {
      method: 'POST', query: { select: '*' }, prefer: 'return=representation',
      body: { user_id: authData.user.id, full_name: fullName.trim(), email: normalizedEmail, phone: phone?.trim() || null, role: 'member', is_active: true }
    });
    const profile = profileRows[0];
    const memberRows = await supabaseRest<any[]>('members', {
      method: 'POST', query: { select: '*' }, prefer: 'return=representation',
      body: { profile_id: profile.id, fitness_goal: fitnessGoal || 'general_fitness', status: 'active' }
    });
    const member = memberRows[0];
    const token = authData.access_token ? createAuthToken({ id: profile.id, email: profile.email, role: profile.role }) : null;
    return NextResponse.json({
      success: true,
      message: token ? 'Account created successfully.' : 'Account created. Check your email to confirm the account, then sign in.',
      requiresEmailConfirmation: !token,
      user: { id: profile.id, email: profile.email, name: profile.full_name, role: profile.role, memberId: member.id },
      token
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Could not create the account.' }, { status: 503 });
  }
}
