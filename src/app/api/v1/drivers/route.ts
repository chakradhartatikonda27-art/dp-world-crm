import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('organizationId') || 'org-apex-001';
  const status = searchParams.get('status');

  let drivers = db.getDriversByOrg(orgId);

  if (status && status !== 'ALL') {
    drivers = drivers.filter(d => d.status === status);
  }

  return NextResponse.json({
    total: drivers.length,
    drivers,
  });
}
