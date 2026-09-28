import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { LoadingDock } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('organizationId') || 'org-apex-001';

  const loadingDocks = db.getLoadingDocksByOrg(orgId);

  return NextResponse.json({
    total: loadingDocks.length,
    loadingDocks,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newDock: LoadingDock = {
      id: `DOCK-0${db.getLoadingDocksByOrg('org-apex-001').length + 1}`,
      organizationId: body.organizationId || 'org-apex-001',
      name: body.name,
      shipment: body.shipment,
      truck: body.truck,
      operator: body.operator || 'Dock Operator',
      status: body.status || 'LOADING',
      progress: Number(body.progress) || 10,
    };

    const docks = db.getLoadingDocksByOrg('org-apex-001');
    docks.unshift(newDock);

    return NextResponse.json({ success: true, loadingDock: newDock }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, shipment, truck, operator, status, progress } = body;
    const docks = db.getLoadingDocksByOrg('org-apex-001');
    const dock = docks.find((d: any) => d.id === id);

    if (!dock) {
      return NextResponse.json({ error: 'Loading dock not found' }, { status: 404 });
    }

    if (name) dock.name = name;
    if (shipment) dock.shipment = shipment;
    if (truck) dock.truck = truck;
    if (operator) dock.operator = operator;
    if (status) dock.status = status;
    if (progress !== undefined) dock.progress = Number(progress);

    return NextResponse.json({ success: true, loadingDock: dock });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { dockId, progress, status } = body;

    const docks = db.getLoadingDocksByOrg('org-apex-001');
    const dock = docks.find((d: any) => d.id === dockId);

    if (!dock) {
      return NextResponse.json({ error: 'Loading dock not found' }, { status: 404 });
    }

    if (progress !== undefined) dock.progress = Math.min(100, Math.max(0, progress));
    if (status) dock.status = status;

    if (dock.progress === 100 && status !== 'AVAILABLE') {
      dock.status = 'INSPECTION';
    }

    return NextResponse.json({ success: true, loadingDock: dock });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Dock ID required' }, { status: 400 });

    const docks = db.getLoadingDocksByOrg('org-apex-001');
    const idx = docks.findIndex((d: any) => d.id === id);
    if (idx !== -1) {
      docks.splice(idx, 1);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
