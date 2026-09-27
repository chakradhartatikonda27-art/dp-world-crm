import { calculateHaversineDistanceKm, ingestGPSTelemetry } from '../lib/gps-engine';
import { db } from '../lib/db';

describe('GPS Telemetry & Geofencing Engine', () => {
  test('calculates Haversine distance accurately', () => {
    // Distance between Kigali (-1.9441, 30.0619) and Mombasa (-4.0435, 39.6682) is ~1090 km
    const dist = calculateHaversineDistanceKm(-1.9441, 30.0619, -4.0435, 39.6682);
    expect(dist).toBeGreaterThan(1000);
    expect(dist).toBeLessThan(1200);
  });

  test('ingests GPS telemetry ping and records position', () => {
    const truck = db.trucks[0];
    const res = ingestGPSTelemetry({
      organizationId: truck.organizationId,
      truckId: truck.id,
      latitude: -1.9500,
      longitude: 30.0700,
      speed: 65,
      heading: 120,
    });
    expect(res.success).toBe(true);
    expect(res.position.latitude).toBe(-1.9500);
  });
});
