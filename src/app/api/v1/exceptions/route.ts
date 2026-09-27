import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('organizationId') || 'org-apex-001';
  const status = searchParams.get('status');

  let exceptions = db.getExceptionsByOrg(orgId);

  if (status && status !== 'ALL') {
    exceptions = exceptions.filter(e => e.status === status);
  }

  return NextResponse.json({
    total: exceptions.length,
    exceptions: exceptions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { exceptionId, status, resolution } = body;

    const exception = db.exceptions.find(e => e.id === exceptionId);
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
