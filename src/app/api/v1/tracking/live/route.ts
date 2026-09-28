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
      truckRegistration: s.truckRegistration || 'RAB 123A',
      driverName: s.driverName || 'John',
      origin: s.origin,
      destination: s.destination,
      latitude: s.currentLatitude || -2.3845,
      longitude: s.currentLongitude || 30.7850,
      speedKmh: s.speedKmh || 58,
      heading: 285,
      directionText: '285° WNW',
      distanceRemainingKm: s.distanceRemainingKm || 180,
      estimatedDeliveryAt: s.estimatedDeliveryAt || 'Tomorrow 14:30',
      etaText: '14:30 (Tomorrow)',
      lastUpdateText: '14:22',
      fuelLevelPercent: truck?.fuelLevelPercent || 92,
      batteryLevel: 94,
      networkStatus: 'CELLULAR 4G (ONLINE)',
      locationName: s.shipmentNumber === 'RWA-2026-000125' ? 'Rusumo Border' : s.origin.name,
      geofenceStatus: s.status === 'IN_TRANSIT' ? 'GEOFENCE: Rusumo Border Checkpoint Active' : 'GEOFENCE: Corridor Active',
    };
  });

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    count: liveVehicles.length,
    vehicles: liveVehicles,
  });
}
