import { NextResponse } from 'next/server';
import { supabaseRest } from '@/lib/supabase-rest';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const plans = await supabaseRest<any[]>('membership_plans', { query: { select: 'id,name,description,duration_months,price,features,is_active,created_at', is_active: 'eq.true', order: 'duration_months.asc' } });
    return NextResponse.json({ success: true, plans }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Could not load membership plans.' }, { status: 503 });
  }
}
