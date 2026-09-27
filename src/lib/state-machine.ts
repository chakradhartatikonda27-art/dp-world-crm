import { Shipment, ShipmentStatus, ShipmentTimelineEvent } from '@/types';
import { VALID_SHIPMENT_TRANSITIONS } from './constants';
import { db } from './db';
import { processWorkflowEvents } from './workflow-engine';

export interface TransitionResult {
  success: boolean;
  shipment?: Shipment;
  event?: ShipmentTimelineEvent;
  error?: string;
}

export function transitionShipmentStatus(
  shipmentId: string,
  targetStatus: ShipmentStatus,
  userId?: string,
  userName: string = 'Operations Dispatcher',
  remarks?: string,
  metadata?: Record<string, any>
): TransitionResult {
  const shipment = db.shipments.find(s => s.id === shipmentId);

  if (!shipment) {
    return { success: false, error: `Shipment with ID ${shipmentId} not found.` };
  }

  const currentStatus = shipment.status;

  // Check valid transitions
  const allowedNextStatuses = VALID_SHIPMENT_TRANSITIONS[currentStatus] || [];
  if (!allowedNextStatuses.includes(targetStatus)) {
    return {
      success: false,
      error: `ILLEGAL_TRANSITION: Cannot transition shipment ${shipment.shipmentNumber} from ${currentStatus} to ${targetStatus}. Allowed next states: [${allowedNextStatuses.join(', ')}]`,
    };
  }

  // Perform state mutation
  shipment.status = targetStatus;
  shipment.updatedAt = new Date().toISOString();

  // Timestamp updates based on key milestones
  if (targetStatus === 'LOADING_STARTED' && !shipment.actualPickupAt) {
    shipment.actualPickupAt = new Date().toISOString();
  } else if (targetStatus === 'DELIVERED' && !shipment.actualDeliveryAt) {
    shipment.actualDeliveryAt = new Date().toISOString();
  }

  // Create immutable timeline audit event
  const newEvent: ShipmentTimelineEvent = {
    id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    organizationId: shipment.organizationId,
    shipmentId: shipment.id,
    eventType: `STATUS_CHANGED_${targetStatus}`,
    status: targetStatus,
    timestamp: new Date().toISOString(),
    userId,
    userName,
    latitude: shipment.currentLatitude,
    longitude: shipment.currentLongitude,
    source: 'MANUAL',
    remarks: remarks || `Status updated from ${currentStatus} to ${targetStatus}`,
    metadata,
  };

  db.timelineEvents.push(newEvent);

  // Trigger background automation workflow processing
  processWorkflowEvents('SHIPMENT_STATUS_CHANGED', {
    shipment,
    previousStatus: currentStatus,
    newStatus: targetStatus,
  });

  return {
    success: true,
    shipment,
    event: newEvent,
  };
}
