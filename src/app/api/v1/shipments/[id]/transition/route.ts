import { NextResponse } from 'next/server';
import { transitionShipmentStatus } from '@/lib/state-machine';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { targetStatus, remarks, userName } = body;

    if (!targetStatus) {
      return NextResponse.json({ error: 'targetStatus is required' }, { status: 400 });
    }

    const result = transitionShipmentStatus(
      params.id,
      targetStatus,
      undefined,
      userName || 'Operations Executive',
      remarks
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 422 });
    }

    return NextResponse.json({
      success: true,
      shipment: result.shipment,
      event: result.event,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Transition failed' }, { status: 500 });
  }
}
