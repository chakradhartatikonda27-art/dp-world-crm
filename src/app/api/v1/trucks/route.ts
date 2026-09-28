import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Truck } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('organizationId') || 'org-apex-001';
  const status = searchParams.get('status');

  let trucks = db.getTrucksByOrg(orgId);

  if (status && status !== 'ALL') {
    trucks = trucks.filter((t) => t.status === status);
  }

  return NextResponse.json({
    total: trucks.length,
    trucks,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newTruck: Truck = {
      id: `truck-${Date.now()}`,
      organizationId: body.organizationId || 'org-apex-001',
      registrationNumber: body.registrationNumber,
      vehicleType: body.vehicleType || 'CONTAINER_33FT',
      capacityTons: Number(body.capacityTons) || 20,
      make: body.make || 'Volvo',
      model: body.model || 'FH16',
      year: Number(body.year) || 2024,
      odometerKm: Number(body.odometerKm) || 0,
      status: body.status || 'AVAILABLE',
      fuelLevelPercent: Number(body.fuelLevelPercent) || 100,
      createdAt: new Date().toISOString(),
    };

    db.trucks.unshift(newTruck);
    return NextResponse.json({ success: true, truck: newTruck }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { truckId, status } = body;
    const truck = db.trucks.find((t) => t.id === truckId);

    if (!truck) {
      return NextResponse.json({ error: 'Truck not found' }, { status: 404 });
    }

    if (status) truck.status = status;

    return NextResponse.json({ success: true, truck });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
