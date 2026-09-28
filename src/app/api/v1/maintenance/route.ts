import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { MaintenanceOrder } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('organizationId') || 'org-apex-001';

  const maintenanceOrders = db.getMaintenanceByOrg(orgId);

  return NextResponse.json({
    total: maintenanceOrders.length,
    maintenanceOrders,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newOrder: MaintenanceOrder = {
      id: `WO-${Math.floor(8000 + Math.random() * 1000)}`,
      organizationId: body.organizationId || 'org-apex-001',
      truckId: body.truckId || 'truck-1',
      truckReg: body.truckReg,
      serviceType: body.serviceType,
      scheduledDate: body.scheduledDate || new Date().toISOString().split('T')[0],
      estimatedCost: Number(body.estimatedCost) || 0,
      serviceCenter: body.serviceCenter,
      status: body.status || 'SCHEDULED',
      notes: body.notes || 'Preventive service scheduled.',
    };

    const orders = db.getMaintenanceByOrg('org-apex-001');
    orders.unshift(newOrder);

    // Also update truck status to MAINTENANCE if in service
    const truck = db.trucks.find((t) => t.registrationNumber === body.truckReg || t.id === body.truckId);
    if (truck) {
      truck.status = 'MAINTENANCE';
    }

    return NextResponse.json({ success: true, maintenanceOrder: newOrder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    const orders = db.getMaintenanceByOrg('org-apex-001');
    const order = orders.find((o: any) => o.id === orderId);

    if (!order) {
      return NextResponse.json({ error: 'Work order not found' }, { status: 404 });
    }

    if (status) order.status = status;

    if (status === 'COMPLETED') {
      const truck = db.trucks.find((t) => t.registrationNumber === order.truckReg || t.id === order.truckId);
      if (truck) {
        truck.status = 'AVAILABLE';
        truck.lastServiceDate = new Date().toISOString().split('T')[0];
      }
    }

    return NextResponse.json({ success: true, maintenanceOrder: order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
