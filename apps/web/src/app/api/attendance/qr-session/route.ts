import { NextRequest, NextResponse } from 'next/server';
import { api } from '@parshuram/shared';

export async function GET() {
  try {
    const session = await api.getActiveQRSession();
    return NextResponse.json({ success: true, session });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const type = body.type || 'universal';
    const duration = body.durationSeconds ?? 60;
    if (!['member', 'staff', 'universal'].includes(type)) {
      return NextResponse.json({ error: 'Type must be member, staff, or universal.' }, { status: 400 });
    }
    if (!Number.isInteger(duration) || duration < 1 || duration > 300) {
      return NextResponse.json({ error: 'Duration must be between 1 and 300 seconds.' }, { status: 400 });
    }
    const session = await api.generateOrRefreshQRSession(type, duration);
    return NextResponse.json({ success: true, session });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
