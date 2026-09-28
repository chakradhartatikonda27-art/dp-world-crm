import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { FuelRecord } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('organizationId') || 'org-apex-001';

  const fuelRecords = db.getFuelRecordsByOrg(orgId);

  return NextResponse.json({
    total: fuelRecords.length,
    fuelRecords,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const litres = Number(body.litres) || 0;
    const totalCost = Number(body.totalCost) || 0;
    const distanceKm = Number(body.distanceKm) || 750;
    const expectedKmPerLitre = 3.8;
    const kmPerLitre = litres > 0 ? +(distanceKm / litres).toFixed(1) : 0;
    const variancePercent = +(((kmPerLitre - expectedKmPerLitre) / expectedKmPerLitre) * 100).toFixed(1);

    const newRecord: FuelRecord = {
      id: `FUEL-${Math.floor(1000 + Math.random() * 9000)}`,
      organizationId: body.organizationId || 'org-apex-001',
      truck: body.truck,
      driver: body.driver,
      station: body.station,
      litres,
      totalCost,
      kmPerLitre,
      variancePercent,
      createdAt: new Date().toISOString(),
    };

    const fuelRecords = db.getFuelRecordsByOrg('org-apex-001');
    fuelRecords.unshift(newRecord);

    return NextResponse.json({ success: true, fuelRecord: newRecord }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
