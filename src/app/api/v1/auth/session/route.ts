import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgSlug = searchParams.get('org') || 'apex-global';
  const role = searchParams.get('role') || 'ORG_ADMIN';

  const org = db.organizations.find(o => o.slug === orgSlug) || db.organizations[0];
  const user = db.users.find(u => u.organizationId === org.id && u.role === role) || db.users[0];

  return NextResponse.json({
    organization: org,
    user,
    availableOrganizations: db.organizations,
    availableRoles: [
      'SUPER_ADMIN', 'ORG_ADMIN', 'OPERATIONS_MANAGER', 'DISPATCHER',
      'FLEET_MANAGER', 'DRIVER', 'FINANCE_MANAGER', 'CUSTOMER_ADMIN'
    ],
  });
}
