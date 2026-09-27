import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('organizationId') || 'org-apex-001';
  const status = searchParams.get('status');

  let trucks = db.getTrucksByOrg(orgId);

  if (status && status !== 'ALL') {
    trucks = trucks.filter(t => t.status === status);
  }

  return NextResponse.json({
    total: trucks.length,
    trucks,
  });
}
