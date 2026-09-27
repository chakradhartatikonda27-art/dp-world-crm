import { GPSPosition, Shipment } from '@/types';
import { db } from './db';
import { transitionShipmentStatus } from './state-machine';

export function calculateHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function ingestGPSTelemetry(ping: {
  organizationId: string;
  truckId: string;
  driverId?: string;
  shipmentId?: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  altitude?: number;
  batteryLevel?: number;
}): { success: boolean; position: GPSPosition; geofenceAlert?: string } {
  const position: GPSPosition = {
    id: `gps-telemetry-${Date.now()}`,
    organizationId: ping.organizationId,
    truckId: ping.truckId,
    driverId: ping.driverId,
    shipmentId: ping.shipmentId,
    latitude: ping.latitude,
    longitude: ping.longitude,
    speed: ping.speed,
    heading: ping.heading,
    altitude: ping.altitude || 1100,
    batteryLevel: ping.batteryLevel || 95,
    timestamp: new Date().toISOString(),
    source: 'DRIVER_APP',
  };

  db.gpsPositions.push(position);

  // Update associated truck position
  const truck = db.trucks.find(t => t.id === ping.truckId);
  if (truck) {
    truck.status = ping.speed > 5 ? 'IN_TRANSIT' : 'AVAILABLE';
  }

  // Update associated active shipment current position & distance remaining
  let geofenceAlert: string | undefined = undefined;
  if (ping.shipmentId) {
    const shipment = db.shipments.find(s => s.id === ping.shipmentId);
    if (shipment) {
      shipment.currentLatitude = ping.latitude;
      shipment.currentLongitude = ping.longitude;
      shipment.speedKmh = ping.speed;

      const distToDest = calculateHaversineDistanceKm(
        ping.latitude,
        ping.longitude,
        shipment.destination.latitude,
        shipment.destination.longitude
      );
      shipment.distanceRemainingKm = +distToDest.toFixed(1);

      // Auto Geofence Check: if within 2 km of destination and status is IN_TRANSIT
      if (distToDest <= 2.0 && shipment.status === 'IN_TRANSIT') {
        transitionShipmentStatus(shipment.id, 'AT_DESTINATION', undefined, 'GPS Geofence Engine', 'Vehicle entered destination geofence boundary (2km radius).');
        geofenceAlert = `GEOFENCE: Truck entered Destination Boundary for Shipment ${shipment.shipmentNumber}`;
      }
    }
  }

  return { success: true, position, geofenceAlert };
}
