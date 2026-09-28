import { NextResponse } from 'next/server';

let vendorsStore: any[] = [
  {
    id: 'VEND-101',
    name: 'Rwanda Transporter Co-op (RTC)',
    serviceType: '3PL Heavy Trucking',
    fleetSize: 45,
    rating: 4.8,
    phone: '+250 788 111 222',
    email: 'ops@rwandatransporters.rw',
    status: 'ACTIVE',
  },
  {
    id: 'VEND-102',
    name: 'East Africa Clearing & Customs Agency',
    serviceType: 'Customs & Border Agent',
    fleetSize: 12,
    rating: 4.9,
    phone: '+255 22 211 4455',
    email: 'clearing@eacc-agency.co.tz',
    status: 'ACTIVE',
  },
  {
    id: 'VEND-103',
    name: 'TotalEnergies East Africa Fuel Network',
    serviceType: 'Fuel Supplier & IoT Cards',
    fleetSize: 150,
    rating: 4.7,
    phone: '+254 20 271 0000',
    email: 'fleet@totalenergies.ke',
    status: 'ACTIVE',
  },
];

export async function GET(request: Request) {
  return NextResponse.json({
    total: vendorsStore.length,
    vendors: vendorsStore,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newVendor = {
      id: `VEND-${Math.floor(100 + Math.random() * 900)}`,
      name: body.name,
      serviceType: body.serviceType || 'Subcontractor Fleet',
      fleetSize: Number(body.fleetSize) || 5,
      rating: 5.0,
      phone: body.phone || '+250 780 000 000',
      email: body.email || 'contact@vendor.com',
      status: 'ACTIVE',
    };

    vendorsStore.unshift(newVendor);
    return NextResponse.json({ success: true, vendor: newVendor }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
