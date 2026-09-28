import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { FuelRecord } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('organizationId') || 'org-dpw-rwanda';

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
    const pricePerLitre = Number(body.pricePerLitre) || 1.15;
    const totalCost = Number(body.totalCost) || +(litres * pricePerLitre).toFixed(2);
    
    const openingFuelLitres = Number(body.openingFuelLitres) || 300;
    const openingOdometerKm = Number(body.openingOdometerKm) || 48000;
    const currentOdometerKm = Number(body.currentOdometerKm) || (openingOdometerKm + (body.gpsDistanceKm || 750));
    
    const odometerDistanceKm = Math.max(0, currentOdometerKm - openingOdometerKm);
    const gpsDistanceKm = Number(body.gpsDistanceKm) || odometerDistanceKm || 750;
    
    const expectedKmPerLitre = Number(body.expectedKmPerLitre) || 3.1;
    const expectedFuelConsumed = +(gpsDistanceKm / expectedKmPerLitre).toFixed(1);
    
    const totalAvailableFuel = openingFuelLitres + litres;
    const expectedRemainingFuel = +(totalAvailableFuel - expectedFuelConsumed).toFixed(1);
    
    const kmPerLitre = totalAvailableFuel > 0 ? +(gpsDistanceKm / totalAvailableFuel).toFixed(2) : expectedKmPerLitre;
    const fuelVarianceLitres = +(totalAvailableFuel - expectedFuelConsumed).toFixed(1);
    const fuelVarianceCost = +(fuelVarianceLitres * pricePerLitre).toFixed(2);
    const variancePercent = +(((kmPerLitre - expectedKmPerLitre) / expectedKmPerLitre) * 100).toFixed(1);

    const locationMismatch = Boolean(body.locationMismatch);
    const receiptOcrLitres = body.receiptOcrLitres ? Number(body.receiptOcrLitres) : undefined;
    const receiptMismatch = receiptOcrLitres !== undefined ? Math.abs(receiptOcrLitres - litres) > 2 : Boolean(body.receiptMismatch);
    const odometerMismatch = Math.abs(odometerDistanceKm - gpsDistanceKm) > 50 || Boolean(body.odometerMismatch);

    let status: FuelRecord['status'] = 'OK';
    if (locationMismatch) {
      status = 'LOCATION_MISMATCH';
    } else if (receiptMismatch) {
      status = 'RECEIPT_MISMATCH';
    } else if (odometerMismatch) {
      status = 'REVIEW_REQUIRED';
    } else if (Math.abs(variancePercent) > 10 || fuelVarianceLitres > 25) {
      status = 'HIGH_VARIANCE';
    }

    const newRecord: FuelRecord = {
      id: `FUEL-${Math.floor(1000 + Math.random() * 9000)}`,
      organizationId: body.organizationId || 'org-dpw-rwanda',
      shipmentId: body.shipmentId || 'shp-rwa-125',
      shipmentNumber: body.shipmentNumber || 'RWA-2026-000125',
      truck: body.truck || 'RAB 123A',
      driver: body.driver || 'John',
      station: body.station || 'En Route Station',
      pricePerLitre,
      litres,
      totalCost,
      openingFuelLitres,
      openingOdometerKm,
      gpsDistanceKm,
      odometerDistanceKm,
      expectedKmPerLitre,
      kmPerLitre,
      expectedFuelConsumed,
      expectedRemainingFuel,
      fuelVarianceLitres,
      fuelVarianceCost,
      variancePercent,
      locationMismatch,
      receiptMismatch,
      odometerMismatch,
      receiptOcrLitres,
      status,
      rootCauseInvestigation: body.rootCauseInvestigation || (
        locationMismatch ? 'Driver refueling GPS location differs from registered fuel station radius.' :
        receiptMismatch ? `Receipt OCR extracted ${receiptOcrLitres}L does not match driver entered ${litres}L.` :
        odometerMismatch ? 'Odometer trip distance diverges from independent satellite GPS tracking path.' :
        status === 'HIGH_VARIANCE' ? 'Excessive fuel consumption detected. Requires fleet manager review.' :
        'Fuel record verified within normal operational thresholds.'
      ),
      receiptPhotoUrl: body.receiptPhotoUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500',
      odometerPhotoUrl: body.odometerPhotoUrl || 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=500',
      createdAt: new Date().toISOString(),
    };

    const fuelRecords = db.getFuelRecordsByOrg('org-dpw-rwanda');
    fuelRecords.unshift(newRecord);

    return NextResponse.json({ success: true, fuelRecord: newRecord }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, truck, station, litres, totalCost, status, rootCauseInvestigation } = body;
    const fuelRecords = db.getFuelRecordsByOrg('org-dpw-rwanda');
    const record = fuelRecords.find((f: any) => f.id === id);

    if (!record) {
      return NextResponse.json({ error: 'Fuel record not found' }, { status: 404 });
    }

    if (truck) record.truck = truck;
    if (station) record.station = station;
    if (litres) record.litres = Number(litres);
    if (totalCost) record.totalCost = Number(totalCost);
    if (status) record.status = status;
    if (rootCauseInvestigation) record.rootCauseInvestigation = rootCauseInvestigation;

    return NextResponse.json({ success: true, fuelRecord: record });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const fuelRecords = db.getFuelRecordsByOrg('org-dpw-rwanda');
    const idx = fuelRecords.findIndex((f: any) => f.id === id);
    if (idx !== -1) {
      fuelRecords.splice(idx, 1);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
