import { NextRequest, NextResponse } from 'next/server';
import { api, validateMemberRegistration } from '@parshuram/shared';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, password, phone, fitnessGoal } = body;

    const validation = validateMemberRegistration({
      fullName,
      email,
      password,
      phone,
      fitnessGoal
    });

    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const store = (api as any).store;

    // Check if account already exists
    const existing = store.profiles.find((p: any) => p.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return NextResponse.json({
        success: false,
        error: 'An account with this email address already exists. Please log in.'
      }, { status: 409 });
    }

    // Register member in database store
    const { profile, member } = await api.registerMember({
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: phone?.trim(),
      fitnessGoal: fitnessGoal || 'general_fitness'
    });

    // Store password
    store.passwords[normalizedEmail] = password;

    const sessionToken = `pfg-jwt-${profile.id}-${Date.now()}`;

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.full_name,
        role: profile.role,
        memberId: member.id
      },
      token: sessionToken
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
