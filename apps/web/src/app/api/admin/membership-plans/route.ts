import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { getVerifiedAdminIdentity } from '@/lib/admin-auth';
import { supabaseRest } from '@/lib/supabase-rest';

export const dynamic = 'force-dynamic';
const denied = () => NextResponse.json({ success: false, error: 'Owner access is required.' }, { status: 401 });

export async function GET(request: NextRequest) {
  if (!await getVerifiedAdminIdentity(request)) return denied();
  try {
    const plans = await supabaseRest<any[]>('membership_plans', { query: { select: '*', order: 'duration_months.asc' } });
    return NextResponse.json({ success: true, plans }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message || 'Could not load plans.' }, { status: 503 }); }
}

async function save(request: NextRequest, update: boolean) {
  if (!await getVerifiedAdminIdentity(request)) return denied();
  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const duration = Number(body.duration_months);
    const price = Number(body.price);
    const features = Array.isArray(body.features) ? body.features.filter((item: unknown) => typeof item === 'string' && item.trim()).map((item: string) => item.trim()).slice(0, 20) : [];
    if (name.length < 2 || name.length > 100 || description.length > 1000 || !Number.isInteger(duration) || duration < 1 || duration > 60 || !Number.isFinite(price) || price < 0 || price > 10000000) {
      return NextResponse.json({ success: false, error: 'Enter a plan name, valid duration, and non-negative price.' }, { status: 400 });
    }
    const id = update && typeof body.id === 'string' ? body.id : randomUUID();
    if (update && !/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ success: false, error: 'A valid plan ID is required.' }, { status: 400 });
    const plan = { name, description, duration_months: duration, price, features, is_active: body.is_active !== false };
    const rows = await supabaseRest<any[]>('membership_plans', { method: update ? 'PATCH' : 'POST', query: { ...(update ? { id: `eq.${id}` } : {}), select: '*' }, body: update ? plan : { id, ...plan }, prefer: 'return=representation' });
    if (!rows[0]) return NextResponse.json({ success: false, error: 'Plan not found.' }, { status: 404 });
    return NextResponse.json({ success: true, plan: rows[0] });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message || 'Could not save plan.' }, { status: 503 }); }
}

export async function POST(request: NextRequest) { return save(request, false); }
export async function PATCH(request: NextRequest) { return save(request, true); }
