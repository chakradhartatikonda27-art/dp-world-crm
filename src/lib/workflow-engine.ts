import { db } from './db';
import { ExceptionItem } from '@/types';

export function processWorkflowEvents(eventType: string, eventPayload: Record<string, any>): void {
  const orgId = eventPayload.shipment?.organizationId || 'org-apex-001';
  const activeRules = db.workflowRules.filter(r => r.organizationId === orgId && r.active);

  for (const rule of activeRules) {
    // Evaluate conditions
    const fieldVal = eventPayload[rule.conditionJson.field] ?? eventPayload.shipment?.[rule.conditionJson.field];
    let conditionMet = false;

    if (rule.conditionJson.operator === 'EQUALS' && fieldVal === rule.conditionJson.value) {
      conditionMet = true;
    } else if (rule.conditionJson.operator === 'GREATER_THAN' && fieldVal > rule.conditionJson.value) {
      conditionMet = true;
    } else if (rule.conditionJson.operator === 'LESS_THAN' && fieldVal < rule.conditionJson.value) {
      conditionMet = true;
    }

    if (conditionMet) {
      rule.triggerCount += 1;

      // Execute Action
      if (rule.actionType === 'CREATE_EXCEPTION' && eventPayload.shipment) {
        const existingExc = db.exceptions.find(
          e => e.shipmentId === eventPayload.shipment.id && e.status === 'OPEN'
        );
        if (!existingExc) {
          const newExc: ExceptionItem = {
            id: `exc-auto-${Date.now()}`,
            organizationId: orgId,
            shipmentId: eventPayload.shipment.id,
            shipmentNumber: eventPayload.shipment.shipmentNumber,
            truckId: eventPayload.shipment.truckId,
            truckRegistration: eventPayload.shipment.truckRegistration,
            type: rule.actionPayload.type || 'STATIONARY_TOO_LONG',
            severity: rule.actionPayload.severity || 'HIGH',
            status: 'OPEN',
            ownerName: 'Workflow Automation',
            rootCause: `Triggered by rule: ${rule.name}`,
            createdAt: new Date().toISOString(),
          };
          db.exceptions.push(newExc);
        }
      }
    }
  }
}
