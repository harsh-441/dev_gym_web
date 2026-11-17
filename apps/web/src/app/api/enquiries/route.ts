import { NextRequest, NextResponse } from 'next/server';
import { api, validateEnquiry } from '@parshuram/shared';

export async function GET() {
  try {
    const enquiries = (api as any).store.enquiries;
    return NextResponse.json({ success: true, enquiries });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = validateEnquiry({
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      message: body.message
    });

    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 });
    }

    const record = await api.submitEnquiry({
      full_name: body.fullName,
      email: body.email,
      phone: body.phone,
      preferred_plan: body.preferredPlan,
      message: body.message
    });

    return NextResponse.json({ success: true, enquiry: record });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
