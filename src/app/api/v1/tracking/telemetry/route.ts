import { NextResponse } from 'next/server';
import { ingestGPSTelemetry } from '@/lib/gps-engine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = ingestGPSTelemetry({
      organizationId: body.organizationId || 'org-apex-001',
      truckId: body.truckId,
      driverId: body.driverId,
      shipmentId: body.shipmentId,
      latitude: body.latitude,
      longitude: body.longitude,
      speed: body.speed || 0,
      heading: body.heading || 0,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Telemetry ingestion failed' }, { status: 400 });
  }
}
