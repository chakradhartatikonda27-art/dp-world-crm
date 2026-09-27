import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('organizationId') || 'org-apex-001';

  const shipments = db.getShipmentsByOrg(orgId).filter(s =>
    ['IN_TRANSIT', 'CHECKPOINT', 'BORDER_PROCESSING', 'LOADING_STARTED', 'UNLOADING_STARTED', 'DELAYED'].includes(s.status)
  );

  const trucks = db.getTrucksByOrg(orgId);

  const liveVehicles = shipments.map(s => {
    const truck = trucks.find(t => t.id === s.truckId);
    return {
      shipmentId: s.id,
      shipmentNumber: s.shipmentNumber,
      customerName: s.customerName,
      status: s.status,
      priority: s.priority,
      truckRegistration: s.truckRegistration,
      driverName: s.driverName,
      origin: s.origin,
      destination: s.destination,
      latitude: s.currentLatitude || s.origin.latitude,
      longitude: s.currentLongitude || s.origin.longitude,
      speedKmh: s.speedKmh || 0,
      distanceRemainingKm: s.distanceRemainingKm || 0,
      estimatedDeliveryAt: s.estimatedDeliveryAt,
      fuelLevelPercent: truck?.fuelLevelPercent || 85,
    };
  });

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    count: liveVehicles.length,
    vehicles: liveVehicles,
  });
}
