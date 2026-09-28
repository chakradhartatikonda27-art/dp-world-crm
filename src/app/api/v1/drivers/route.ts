import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Driver } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('organizationId') || 'org-apex-001';
  const status = searchParams.get('status');

  let drivers = db.getDriversByOrg(orgId);

  if (status && status !== 'ALL') {
    drivers = drivers.filter((d) => d.status === status);
  }

  return NextResponse.json({
    total: drivers.length,
    drivers,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newDriver: Driver = {
      id: `driver-${Date.now()}`,
      organizationId: body.organizationId || 'org-apex-001',
      name: body.name,
      phone: body.phone,
      licenseNumber: body.licenseNumber,
      licenseExpiry: body.licenseExpiry || '2028-12-31',
      assignedTruckId: body.assignedTruckId,
      status: body.status || 'AVAILABLE',
      rating: 5.0,
      onTimeRatePercent: 100,
      totalTripsCount: 0,
      createdAt: new Date().toISOString(),
    };

    db.drivers.unshift(newDriver);
    return NextResponse.json({ success: true, driver: newDriver }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, phone, licenseNumber, licenseExpiry, status } = body;
    const driver = db.drivers.find((d) => d.id === id);

    if (!driver) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
    }

    if (name) driver.name = name;
    if (phone) driver.phone = phone;
    if (licenseNumber) driver.licenseNumber = licenseNumber;
    if (licenseExpiry) driver.licenseExpiry = licenseExpiry;
    if (status) driver.status = status;

    return NextResponse.json({ success: true, driver });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { driverId, status } = body;
    const driver = db.drivers.find((d) => d.id === driverId);

    if (!driver) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
    }

    if (status) driver.status = status;

    return NextResponse.json({ success: true, driver });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Driver ID required' }, { status: 400 });

    db.drivers = db.drivers.filter((d) => d.id !== id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
