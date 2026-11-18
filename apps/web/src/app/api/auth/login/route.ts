import { NextRequest, NextResponse } from 'next/server';
import { api, UserRole } from '@parshuram/shared';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, role } = body;

    if (!email || !email.trim()) {
      return NextResponse.json({ success: false, error: 'Email address is required.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const store = (api as any).store;

    const profile = store.profiles.find((p: any) => p.email.toLowerCase() === normalizedEmail);
    if (!profile) {
      return NextResponse.json({
        success: false,
        error: 'No account found with this email address. Please register first.'
      }, { status: 404 });
    }

    if (!profile.is_active) {
      return NextResponse.json({
        success: false,
        error: 'This account has been deactivated or archived. Please contact Dave at the front desk.'
      }, { status: 403 });
    }

    // Verify password if user passed password
    const storedPassword = store.passwords[normalizedEmail];
    if (storedPassword && password && password !== storedPassword) {
      return NextResponse.json({
        success: false,
        error: 'Invalid password. Please check your credentials and try again.'
      }, { status: 401 });
    }

    // Determine target dashboard based on actual profile role
    let dashboardRoute = '/portal/member';
    if (profile.role === 'super_admin' || profile.role === 'admin') {
      dashboardRoute = '/admin';
    } else if (profile.role === 'trainer' || profile.role === 'employee') {
      dashboardRoute = '/portal/employee';
    }

    const token = `pfg-jwt-${profile.id}-${Date.now()}`;

    // Get associated member or employee record
    const memberRecord = store.members.find((m: any) => m.profile_id === profile.id);
    const employeeRecord = store.employees.find((e: any) => e.profile_id === profile.id);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      dashboardRoute,
      user: {
        id: profile.id,
        name: profile.full_name,
        email: profile.email,
        role: profile.role,
        memberId: memberRecord?.id,
        employeeId: employeeRecord?.id
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
