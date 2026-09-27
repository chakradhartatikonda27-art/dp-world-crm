import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('organizationId') || 'org-apex-001';
  const status = searchParams.get('status');

  let invoices = db.getInvoicesByOrg(orgId);

  if (status && status !== 'ALL') {
    invoices = invoices.filter(i => i.status === status);
  }

  return NextResponse.json({
    total: invoices.length,
    invoices: invoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  });
}
