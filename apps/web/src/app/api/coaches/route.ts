import { NextRequest, NextResponse } from 'next/server';
import { api } from '@parshuram/shared';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const coaches = await api.getPublicCoaches();
    return NextResponse.json({ success: true, coaches }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
