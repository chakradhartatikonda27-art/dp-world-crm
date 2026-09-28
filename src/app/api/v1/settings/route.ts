import { NextResponse } from 'next/server';

let settingsStore = {
  orgName: 'DP World Rwanda Logistics Hub',
  currency: 'USD',
  timezone: 'Africa/Kigali',
  autoInvoiceOnPOD: true,
  gpsPollingIntervalSec: 15,
  apiKey: 'dpw_live_sk_9940182749102948',
  webhookUrl: 'https://api.dpworld.rw/v1/telemetry-webhook',
};

export async function GET(request: Request) {
  return NextResponse.json({ settings: settingsStore });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === 'GENERATE_API_KEY') {
      settingsStore.apiKey = `dpw_live_sk_${Math.random().toString(36).substring(2)}${Date.now()}`;
    } else {
      settingsStore = { ...settingsStore, ...body };
    }
    return NextResponse.json({ success: true, settings: settingsStore });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
