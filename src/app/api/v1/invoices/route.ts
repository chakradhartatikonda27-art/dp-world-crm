import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Invoice } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('organizationId') || 'org-apex-001';
  const status = searchParams.get('status');

  let invoices = db.getInvoicesByOrg(orgId);

  if (status && status !== 'ALL') {
    invoices = invoices.filter((i) => i.status === status);
  }

  return NextResponse.json({
    total: invoices.length,
    invoices: invoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const subtotal = Number(body.subtotalAmount) || 1000;
    const tax = Number(body.taxAmount) || subtotal * 0.18;
    const total = subtotal + tax;

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      organizationId: body.organizationId || 'org-apex-001',
      invoiceNumber: body.invoiceNumber || `INV-2026-${Math.floor(3000 + Math.random() * 1000)}`,
      customerId: body.customerId || 'cust-1',
      customerName: body.customerName || 'Global Mining Corp',
      shipmentId: body.shipmentId || 'shp-1',
      shipmentNumber: body.shipmentNumber || 'SHP-2026-10001',
      subtotalAmount: subtotal,
      taxAmount: tax,
      totalAmount: total,
      paidAmount: body.status === 'PAID' ? total : 0,
      status: body.status || 'UNPAID',
      dueDate: body.dueDate || new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      lineItems: body.lineItems || [
        { description: 'Freight Transport Surcharge', quantity: 1, unitPrice: subtotal, total: subtotal },
      ],
    };

    db.invoices.unshift(newInvoice);

    return NextResponse.json({ success: true, invoice: newInvoice }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { invoiceId, status } = body;

    const invoices = db.getInvoicesByOrg('org-apex-001');
    const invoice = invoices.find((i) => i.id === invoiceId);

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    if (status) {
      invoice.status = status;
      if (status === 'PAID') {
        invoice.paidAmount = invoice.totalAmount;
      }
    }

    return NextResponse.json({ success: true, invoice });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
