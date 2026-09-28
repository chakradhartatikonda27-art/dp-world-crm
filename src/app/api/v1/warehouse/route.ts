import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { WarehouseItem } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('organizationId') || 'org-apex-001';

  const inventory = db.getInventoryByOrg(orgId);

  return NextResponse.json({
    total: inventory.length,
    inventory,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    const inventory = db.getInventoryByOrg('org-apex-001');

    if (action === 'OUTBOUND_DISPATCH') {
      const item = inventory.find((i: any) => i.id === body.itemId || i.skuCode === body.skuCode);
      if (!item) {
        return NextResponse.json({ error: 'SKU not found' }, { status: 404 });
      }
      const qtyToDispatch = Number(body.quantity) || 1;
      item.quantity = Math.max(0, item.quantity - qtyToDispatch);
      if (item.quantity === 0) {
        item.status = 'READY_FOR_DISPATCH';
      }
      return NextResponse.json({ success: true, item });
    }

    // Default: INBOUND_RECEIPT
    const newItem: WarehouseItem = {
      id: `inv-${Date.now()}`,
      organizationId: body.organizationId || 'org-apex-001',
      skuCode: body.skuCode || `SKU-${Math.floor(1000 + Math.random() * 9000)}-001`,
      description: body.description,
      binLocation: body.binLocation || 'WH-A-Zone-01',
      quantity: Number(body.quantity) || 10,
      weightKg: Number(body.weightKg) || 1000,
      status: body.status || 'IN_STOCK',
      unitType: body.unitType || 'Units',
      createdAt: new Date().toISOString(),
    };

    inventory.unshift(newItem);

    return NextResponse.json({ success: true, item: newItem }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, skuCode, description, binLocation, quantity, weightKg, status, unitType } = body;
    const inventory = db.getInventoryByOrg('org-apex-001');
    const item = inventory.find((i: any) => i.id === id);

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    if (skuCode) item.skuCode = skuCode;
    if (description) item.description = description;
    if (binLocation) item.binLocation = binLocation;
    if (quantity !== undefined) item.quantity = Number(quantity);
    if (weightKg !== undefined) item.weightKg = Number(weightKg);
    if (status) item.status = status;
    if (unitType) item.unitType = unitType;

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Item ID required' }, { status: 400 });

    const inventory = db.getInventoryByOrg('org-apex-001');
    const idx = inventory.findIndex((i: any) => i.id === id);
    if (idx !== -1) {
      inventory.splice(idx, 1);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
