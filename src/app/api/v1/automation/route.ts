import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { WorkflowRule } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('organizationId') || 'org-apex-001';

  let rules = db.workflowRules.filter((w) => w.organizationId === orgId || orgId === 'org-dpw-rwanda');
  if (rules.length === 0) {
    rules = db.workflowRules;
  }

  return NextResponse.json({ total: rules.length, rules });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newRule: WorkflowRule = {
      id: `wf-${Date.now()}`,
      organizationId: body.organizationId || 'org-apex-001',
      name: body.name,
      eventType: body.eventType || 'GPS_PING',
      conditionJson: body.conditionJson || { field: 'speed_kmh', operator: 'GREATER_THAN', value: 80 },
      actionType: body.actionType || 'CREATE_EXCEPTION',
      actionPayload: body.actionPayload || { severity: 'HIGH' },
      active: true,
      triggerCount: 0,
      createdAt: new Date().toISOString(),
    };

    db.workflowRules.unshift(newRule);
    return NextResponse.json({ success: true, rule: newRule }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { ruleId, active } = body;
    const rule = db.workflowRules.find((r) => r.id === ruleId);

    if (!rule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
    }

    if (active !== undefined) rule.active = active;

    return NextResponse.json({ success: true, rule });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
