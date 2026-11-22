import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_APP_SETTINGS } from '@parshuram/shared';
import { getVerifiedAdminIdentity } from '@/lib/admin-auth';
import { supabaseRest } from '@/lib/supabase-rest';

export const dynamic = 'force-dynamic';

const settingsKey = 'gym';
const editableFields = [
  'gym_name', 'owner_name', 'tagline', 'contact_phone', 'contact_email',
  'address_line1', 'city', 'opening_hours_weekdays', 'opening_hours_weekends', 'announcement_banner'
] as const;

export async function GET(request: NextRequest) {
  if (!await getVerifiedAdminIdentity(request)) return NextResponse.json({ success: false, error: 'Owner access is required.' }, { status: 401 });
  try {
    const rows = await supabaseRest<Array<{ value: Record<string, unknown> }>>('app_settings', {
      query: { select: 'value', key: `eq.${settingsKey}`, limit: '1' }
    });
    return NextResponse.json({ success: true, settings: { ...DEFAULT_APP_SETTINGS, ...(rows[0]?.value || {}) } }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Could not load gym settings.' }, { status: 503 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!await getVerifiedAdminIdentity(request)) return NextResponse.json({ success: false, error: 'Owner access is required.' }, { status: 401 });
  try {
    const body = await request.json();
    const updates: Record<string, string> = {};
    for (const field of editableFields) {
      if (body[field] === undefined) continue;
      if (typeof body[field] !== 'string' || body[field].trim().length < 1 || body[field].length > 300) {
        return NextResponse.json({ success: false, error: `${field} must be a non-empty string of at most 300 characters.` }, { status: 400 });
      }
      updates[field] = body[field].trim();
    }
    if (Object.keys(updates).length === 0) return NextResponse.json({ success: false, error: 'Provide at least one setting to save.' }, { status: 400 });
    if (updates.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.contact_email)) {
      return NextResponse.json({ success: false, error: 'Enter a valid contact email.' }, { status: 400 });
    }

    const existing = await supabaseRest<Array<{ value: Record<string, unknown> }>>('app_settings', {
      query: { select: 'value', key: `eq.${settingsKey}`, limit: '1' }
    });
    const value = { ...DEFAULT_APP_SETTINGS, ...(existing[0]?.value || {}), ...updates };
    await supabaseRest('app_settings', {
      method: 'POST', query: { on_conflict: 'key' }, body: { key: settingsKey, value, updated_at: new Date().toISOString() },
      prefer: 'resolution=merge-duplicates,return=minimal'
    });
    return NextResponse.json({ success: true, settings: value });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Could not save gym settings.' }, { status: 503 });
  }
}
