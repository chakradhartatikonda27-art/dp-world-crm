import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuditLog } from '@/types';

export async function GET(request: Request) {
  let logs = db.auditLogs;
  if (logs.length === 0) {
    db.auditLogs = [
      {
        id: 'aud-101',
        organizationId: 'org-apex-001',
        userId: 'usr-admin-1',
        userName: 'Sarah Jenkins',
        action: 'UPDATE_ORGANIZATION_SETTINGS',
        entity: 'ORGANIZATION',
        entityId: 'org-apex-001',
        ipAddress: '197.243.0.42',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'aud-102',
        organizationId: 'org-apex-001',
        userId: 'usr-ops-1',
        userName: 'Marcus Vance',
        action: 'ASSIGN_DRIVER_TRUCK',
        entity: 'SHIPMENT',
        entityId: 'SHP-2026-10001',
        ipAddress: '197.243.0.48',
        timestamp: new Date(Date.now() - 3600 * 1000).toISOString(),
      },
      {
        id: 'aud-103',
        organizationId: 'org-apex-001',
        userId: 'usr-fin-1',
        userName: 'Rachel Green',
        action: 'APPROVE_FREIGHT_INVOICE',
        entity: 'INVOICE',
        entityId: 'INV-2026-3001',
        ipAddress: '197.243.0.99',
        timestamp: new Date(Date.now() - 7200 * 1000).toISOString(),
      },
    ];
    logs = db.auditLogs;
  }

  return NextResponse.json({ total: logs.length, auditLogs: logs });
}
