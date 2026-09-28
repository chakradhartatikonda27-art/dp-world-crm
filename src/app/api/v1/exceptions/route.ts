import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ExceptionItem } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('organizationId') || 'org-apex-001';
  const status = searchParams.get('status');

  let exceptions = db.getExceptionsByOrg(orgId);

  if (status && status !== 'ALL') {
    exceptions = exceptions.filter((e) => e.status === status);
  }

  return NextResponse.json({
    total: exceptions.length,
    exceptions: exceptions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newException: ExceptionItem = {
      id: `EXC-${Math.floor(8000 + Math.random() * 1000)}`,
      organizationId: body.organizationId || 'org-apex-001',
      shipmentId: body.shipmentId || 'shp-1',
      shipmentNumber: body.shipmentNumber || 'SHP-2026-10012',
      truckRegistration: body.truckRegistration || 'RAB123A',
      type: body.type || 'BORDER_DELAY',
      severity: body.severity || 'MEDIUM',
      status: 'OPEN',
      rootCause: body.rootCause || 'Unscheduled border delay along transit corridor.',
      createdAt: new Date().toISOString(),
    };

    db.exceptions.unshift(newException);
    return NextResponse.json({ success: true, exception: newException }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, rootCause, severity, status, resolution } = body;
    const exception = db.exceptions.find((e) => e.id === id);

    if (!exception) {
      return NextResponse.json({ error: 'Exception not found' }, { status: 404 });
    }

    if (rootCause) exception.rootCause = rootCause;
    if (severity) exception.severity = severity;
    if (status) exception.status = status;
    if (resolution) exception.resolution = resolution;

    return NextResponse.json({ success: true, exception });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { exceptionId, status, resolution } = body;

    const exception = db.exceptions.find((e) => e.id === exceptionId);
    if (!exception) {
      return NextResponse.json({ error: 'Exception not found' }, { status: 404 });
    }

    if (status) exception.status = status;
    if (resolution) exception.resolution = resolution;
    if (status === 'RESOLVED' || status === 'CLOSED') {
      exception.resolvedAt = new Date().toISOString();
    }

    return NextResponse.json({ success: true, exception });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Exception update failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Exception ID required' }, { status: 400 });

    db.exceptions = db.exceptions.filter((e) => e.id !== id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
