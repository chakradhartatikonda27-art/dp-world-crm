import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

let quotesStore: any[] = [
  {
    id: 'QTE-2026-901',
    customerName: 'Kigali Industrial Hub',
    origin: 'Dar es Salaam Port, Tanzania',
    destination: 'Kigali Dry Port, Rwanda',
    cargoType: 'Industrial Steel Coils',
    weightTons: 24,
    ratePerTon: 110,
    totalPrice: 2640,
    status: 'APPROVED',
    expiryDate: '2026-10-15',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'QTE-2026-902',
    customerName: 'East Africa Pharma Supply',
    origin: 'Mombasa Port, Kenya',
    destination: 'Kampala Freight Depot, Uganda',
    cargoType: 'Refrigerated Pharmaceuticals',
    weightTons: 15,
    ratePerTon: 145,
    totalPrice: 2175,
    status: 'PENDING',
    expiryDate: '2026-10-10',
    createdAt: new Date().toISOString(),
  },
];

export async function GET(request: Request) {
  return NextResponse.json({
    total: quotesStore.length,
    quotes: quotesStore,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const weightTons = Number(body.weightTons) || 10;
    const ratePerTon = Number(body.ratePerTon) || 120;
    const totalPrice = weightTons * ratePerTon;

    const newQuote = {
      id: `QTE-2026-${Math.floor(900 + Math.random() * 100)}`,
      customerName: body.customerName || 'Global Mining Corp',
      origin: body.origin || 'Dar Port, Tanzania',
      destination: body.destination || 'Kigali ICD, Rwanda',
      cargoType: body.cargoType || 'General Freight',
      weightTons,
      ratePerTon,
      totalPrice,
      status: 'APPROVED',
      expiryDate: body.expiryDate || '2026-10-25',
      createdAt: new Date().toISOString(),
    };

    quotesStore.unshift(newQuote);
    return NextResponse.json({ success: true, quote: newQuote }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, customerName, origin, destination, cargoType, weightTons, ratePerTon, status, expiryDate } = body;
    const quote = quotesStore.find((q) => q.id === id);

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    if (customerName) quote.customerName = customerName;
    if (origin) quote.origin = origin;
    if (destination) quote.destination = destination;
    if (cargoType) quote.cargoType = cargoType;
    if (weightTons !== undefined) quote.weightTons = Number(weightTons);
    if (ratePerTon !== undefined) quote.ratePerTon = Number(ratePerTon);
    if (weightTons !== undefined || ratePerTon !== undefined) {
      quote.totalPrice = (quote.weightTons || 0) * (quote.ratePerTon || 0);
    }
    if (status) quote.status = status;
    if (expiryDate) quote.expiryDate = expiryDate;

    return NextResponse.json({ success: true, quote });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { quoteId, status } = body;
    const quote = quotesStore.find((q) => q.id === quoteId);

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    if (status) quote.status = status;

    return NextResponse.json({ success: true, quote });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Quote ID required' }, { status: 400 });

    quotesStore = quotesStore.filter((q) => q.id !== id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
