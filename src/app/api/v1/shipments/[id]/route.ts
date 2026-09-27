import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const shipment = db.shipments.find(s => s.id === params.id || s.shipmentNumber === params.id);

  if (!shipment) {
    return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
  }

  const timeline = db.timelineEvents
    .filter(e => e.shipmentId === shipment.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const truck = shipment.truckId ? db.trucks.find(t => t.id === shipment.truckId) : null;
  const driver = shipment.driverId ? db.drivers.find(d => d.id === shipment.driverId) : null;
  const customer = db.customers.find(c => c.id === shipment.customerId);
  const exceptions = db.exceptions.filter(e => e.shipmentId === shipment.id);
  const invoice = db.invoices.find(i => i.shipmentId === shipment.id);

  return NextResponse.json({
    shipment,
    timeline,
    truck,
    driver,
    customer,
    exceptions,
    invoice,
  });
}
