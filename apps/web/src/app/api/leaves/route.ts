import { NextRequest, NextResponse } from 'next/server';
import { api, validateLeaveApplication } from '@parshuram/shared';

export async function GET() {
  try {
    const metrics = await api.getAdminDashboardMetrics();
    // Return all leave applications stored
    const leaves = (api as any).store.leaveApplications;
    const leaveTypes = (api as any).store.leaveTypes;
    return NextResponse.json({ success: true, leaves, leaveTypes });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Review action by Dave
    if (body.action === 'review') {
      const { leaveId, status, adminNote } = body;
      const result = await api.reviewLeave(leaveId, status, adminNote);
      return NextResponse.json(result);
    }

    // Apply for leave action
    const validation = validateLeaveApplication({
      employeeId: body.employeeId,
      leaveTypeId: body.leaveTypeId,
      startDate: body.startDate,
      endDate: body.endDate,
      reason: body.reason
    });

    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 });
    }

    const result = await api.applyLeave({
      employeeId: body.employeeId,
      leaveTypeId: body.leaveTypeId,
      startDate: body.startDate,
      endDate: body.endDate,
      reason: body.reason
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
