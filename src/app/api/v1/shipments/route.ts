import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Shipment } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('organizationId') || 'org-apex-001';
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  const priority = searchParams.get('priority');

  let shipments = db.getShipmentsByOrg(orgId);

  if (status && status !== 'ALL') {
    shipments = shipments.filter(s => s.status === status);
  }

  if (priority && priority !== 'ALL') {
    shipments = shipments.filter(s => s.priority === priority);
  }

  if (search) {
    const q = search.toLowerCase();
    shipments = shipments.filter(s =>
      s.shipmentNumber.toLowerCase().includes(q) ||
      s.customerName?.toLowerCase().includes(q) ||
      s.containerNumber?.toLowerCase().includes(q) ||
      s.truckRegistration?.toLowerCase().includes(q) ||
      s.driverName?.toLowerCase().includes(q) ||
      s.origin.name.toLowerCase().includes(q) ||
      s.destination.name.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    total: shipments.length,
    shipments: shipments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orgId = body.organizationId || 'org-apex-001';
    
    const count = db.shipments.length + 1;
    const shipmentNumber = `SHP-2026-${10000 + count}`;

    const newShipment: Shipment = {
      id: `shp-${Date.now()}`,
      organizationId: orgId,
      shipmentNumber,
      customerId: body.customerId || 'cust-1',
      customerName: body.customerName || 'Global Mining Corp',
      bookingId: `BK-${5000 + count}`,
      origin: body.origin || { name: 'Kigali Port / Depot', latitude: -1.9441, longitude: 30.0619 },
      destination: body.destination || { name: 'Mombasa Ocean Terminal', latitude: -4.0435, longitude: 39.6682 },
      cargoType: body.cargoType || 'Industrial Equipment',
      cargoDescription: body.cargoDescription || 'Standard Cargo Container Payload',
      weightKg: body.weightKg || 15000,
      volumeCbm: body.volumeCbm || 40,
      packageCount: body.packageCount || 20,
      containerNumber: body.containerNumber || `MSCU-${500000 + count}`,
      sealNumber: body.sealNumber || `SL-KE-${100000 + count}`,
      transportMode: 'ROAD',
      plannedPickupAt: body.plannedPickupAt || new Date().toISOString(),
      plannedDeliveryAt: body.plannedDeliveryAt || new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      estimatedDeliveryAt: body.estimatedDeliveryAt || new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      status: 'BOOKED',
      priority: body.priority || 'STANDARD',
      specialInstructions: body.specialInstructions || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.shipments.push(newShipment);

    // Initial timeline event
    db.timelineEvents.push({
      id: `evt-${Date.now()}`,
      organizationId: orgId,
      shipmentId: newShipment.id,
      eventType: 'SHIPMENT_BOOKED',
      status: 'BOOKED',
      timestamp: new Date().toISOString(),
      userName: 'Operations Dispatcher',
      source: 'MANUAL',
      remarks: 'Shipment booking created successfully.',
    });

    return NextResponse.json({ success: true, shipment: newShipment }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create shipment' }, { status: 400 });
  }
}
