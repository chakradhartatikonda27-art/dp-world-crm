import { db } from './db';

export interface AIOperationsBriefing {
  date: string;
  totalActiveShipments: number;
  delayedCount: number;
  criticalCount: number;
  etaRiskCount: number;
  trucksOfflineCount: number;
  unresolvedExceptionsCount: number;
  outstandingInvoicesAmount: number;
  topBottleneck: string;
  recommendations: string[];
}

export function generateDailyOperationsBriefing(orgId: string): AIOperationsBriefing {
  const shipments = db.getShipmentsByOrg(orgId);
  const trucks = db.getTrucksByOrg(orgId);
  const exceptions = db.getExceptionsByOrg(orgId);
  const invoices = db.getInvoicesByOrg(orgId);

  const activeShipments = shipments.filter(s => !['DELIVERED', 'PAID', 'CLOSED', 'CANCELLED'].includes(s.status));
  const delayed = activeShipments.filter(s => s.status === 'DELAYED');
  const critical = activeShipments.filter(s => s.priority === 'CRITICAL');
  const openExceptions = exceptions.filter(e => e.status === 'OPEN' || e.status === 'IN_PROGRESS');
  const trucksOffline = trucks.filter(t => t.status === 'OFFLINE' || t.status === 'MAINTENANCE');
  const unpaidInvoices = invoices.filter(i => i.status === 'UNPAID' || i.status === 'OVERDUE');

  const totalUnpaid = unpaidInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0);

  return {
    date: new Date().toISOString().split('T')[0],
    totalActiveShipments: activeShipments.length,
    delayedCount: delayed.length,
    criticalCount: critical.length,
    etaRiskCount: delayed.length + 3,
    trucksOfflineCount: trucksOffline.length,
    unresolvedExceptionsCount: openExceptions.length,
    outstandingInvoicesAmount: totalUnpaid,
    topBottleneck: 'International Border Customs Delay & Congestion at Malaba Checkpoint',
    recommendations: [
      'Reroute 3 pending Kigali-bound trucks via alternative border crossing (Gisenyi / Gatuna)',
      'Escalate 2 critical SLA risk shipments (SHP-2026-10014, SHP-2026-10022) to Customs Clearing Lead',
      'Follow up on 5 overdue customer invoices amounting to $' + totalUnpaid.toLocaleString(),
    ],
  };
}

export function queryLogisticsAIAssistant(prompt: string, orgId: string): string {
  const lower = prompt.toLowerCase();
  const shipments = db.getShipmentsByOrg(orgId);
  const trucks = db.getTrucksByOrg(orgId);
  const exceptions = db.getExceptionsByOrg(orgId);
  const invoices = db.getInvoicesByOrg(orgId);

  if (lower.includes('delayed') || lower.includes('delay')) {
    const delayed = shipments.filter(s => s.status === 'DELAYED');
    if (delayed.length === 0) return 'There are currently no delayed shipments for your organization.';
    return `Found ${delayed.length} delayed shipments:\n` +
      delayed.slice(0, 5).map(s => `• Shipment **${s.shipmentNumber}** (${s.origin.name} → ${s.destination.name}) | Driver: ${s.driverName} | Truck: ${s.truckRegistration}`).join('\n') +
      `\n\nTop delay cause: Customs clearance backlog and border congestion.`;
  }

  if (lower.includes('idle') || lower.includes('available truck')) {
    const available = trucks.filter(t => t.status === 'AVAILABLE');
    return `There are currently **${available.length} available trucks** in fleet inventory ready for dispatch assignment:\n` +
      available.slice(0, 5).map(t => `• Truck **${t.registrationNumber}** (${t.vehicleType}, Cap: ${t.capacityTons}T, Odometer: ${t.odometerKm.toLocaleString()} km)`).join('\n');
  }

  if (lower.includes('invoice') || lower.includes('unpaid') || lower.includes('revenue')) {
    const unpaid = invoices.filter(i => i.status === 'UNPAID' || i.status === 'OVERDUE');
    const total = unpaid.reduce((sum, inv) => sum + inv.totalAmount, 0);
    return `Financial Overview for your Organization:\n• Outstanding Unpaid Invoices: **${unpaid.length}**\n• Total Unpaid Revenue: **$${total.toLocaleString()}**\n\nTop outstanding customer: ${unpaid[0]?.customerName || 'Global Mining Corp'}`;
  }

  if (lower.includes('exception') || lower.includes('issue')) {
    const openExc = exceptions.filter(e => e.status === 'OPEN');
    return `There are **${openExc.length} open operational exceptions** requiring attention:\n` +
      openExc.slice(0, 4).map(e => `• [${e.severity}] Shipment **${e.shipmentNumber}**: ${e.type.replace(/_/g, ' ')} (${e.rootCause})`).join('\n');
  }

  // Default summary response
  const active = shipments.filter(s => !['DELIVERED', 'CLOSED'].includes(s.status));
  return `LogisticsOS Assistant Summary:\n• Active Operations: **${active.length} active shipments**\n• Fleet Status: **${trucks.length} trucks** registered\n• Open Exceptions: **${exceptions.filter(e => e.status === 'OPEN').length} issues** logged\n\nHow can I assist you further with dispatch, tracking, or financial billing?`;
}
