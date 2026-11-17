import { NextRequest, NextResponse } from 'next/server';
import { api, validateAttendanceCheckIn } from '@parshuram/shared';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, userType, token, method } = body;
    const checkInMethod = method || 'qr';

    const validation = validateAttendanceCheckIn({ userId, userType, token, method: checkInMethod });
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 });
    }

    if (userType === 'member') {
      const result = await api.memberCheckIn(userId, token, checkInMethod);
      if (!result.success) {
        return NextResponse.json({ error: result.message }, { status: 409 });
      }
      return NextResponse.json(result);
    } else {
      // Staff attendance (strict separation)
      const result = await api.employeeCheckIn(userId, token, checkInMethod);
      if (!result.success) {
        return NextResponse.json({ error: result.message }, { status: 409 });
      }
      return NextResponse.json(result);
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
