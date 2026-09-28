import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { RouteCheckpoint } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('organizationId') || 'org-apex-001';

  const corridors = db.getCorridorsByOrg(orgId);

  return NextResponse.json({
    total: corridors.length,
    corridors,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { corridorId, name, slaHours, geofenceRadiusKm, status } = body;

    const corridors = db.getCorridorsByOrg('org-apex-001');
    const corridor = corridors.find((c: any) => c.id === corridorId);

    if (!corridor) {
      return NextResponse.json({ error: 'Corridor not found' }, { status: 404 });
    }

    const newCp: RouteCheckpoint = {
      id: `CP-${Date.now().toString().slice(-4)}`,
      name,
      slaHours: Number(slaHours) || 1,
      geofenceRadiusKm: Number(geofenceRadiusKm) || 1,
      status: status || 'NORMAL',
    };

    if (!corridor.checkpoints) corridor.checkpoints = [];
    corridor.checkpoints.push(newCp);
    corridor.checkpointsCount = corridor.checkpoints.length;

    return NextResponse.json({ success: true, checkpoint: newCp, corridor }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const corridorId = searchParams.get('corridorId');
    const checkpointId = searchParams.get('checkpointId');

    const corridors = db.getCorridorsByOrg('org-apex-001');
    const corridor = corridors.find((c: any) => c.id === corridorId);

    if (!corridor) {
      return NextResponse.json({ error: 'Corridor not found' }, { status: 404 });
    }

    if (checkpointId && corridor.checkpoints) {
      corridor.checkpoints = corridor.checkpoints.filter((cp: any) => cp.id !== checkpointId);
      corridor.checkpointsCount = corridor.checkpoints.length;
    }

    return NextResponse.json({ success: true, corridor });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
