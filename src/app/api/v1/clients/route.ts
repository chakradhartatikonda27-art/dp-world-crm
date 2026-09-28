import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Customer } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('organizationId') || 'org-apex-001';

  const customers = db.getCustomersByOrg(orgId);

  return NextResponse.json({
    total: customers.length,
    clients: customers,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      organizationId: body.organizationId || 'org-apex-001',
      name: body.name,
      code: body.code || `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      email: body.email,
      phone: body.phone,
      address: body.address || 'Kigali Industrial Zone',
      creditLimit: Number(body.creditLimit) || 100000,
      activeShipmentsCount: 0,
      createdAt: new Date().toISOString(),
    };

    db.customers.unshift(newCustomer);
    return NextResponse.json({ success: true, client: newCustomer }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { clientId, creditLimit } = body;
    const customer = db.customers.find((c) => c.id === clientId);

    if (!customer) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    if (creditLimit !== undefined) customer.creditLimit = Number(creditLimit);

    return NextResponse.json({ success: true, client: customer });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
