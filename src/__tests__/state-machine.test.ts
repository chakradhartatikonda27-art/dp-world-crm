import { transitionShipmentStatus } from '../lib/state-machine';
import { db } from '../lib/db';

describe('Shipment State Machine Engine', () => {
  test('allows valid transition from BOOKED to CONFIRMED', () => {
    const shipment = db.shipments.find(s => s.status === 'BOOKED');
    if (shipment) {
      const result = transitionShipmentStatus(shipment.id, 'CONFIRMED', undefined, 'Test Dispatcher', 'Valid transition test');
      expect(result.success).toBe(true);
      expect(result.shipment?.status).toBe('CONFIRMED');
    }
  });

  test('rejects illegal status transition from BOOKED directly to DELIVERED', () => {
    const shipment = db.shipments.find(s => s.status === 'BOOKED');
    if (shipment) {
      const result = transitionShipmentStatus(shipment.id, 'DELIVERED', undefined, 'Test Dispatcher', 'Illegal transition test');
      expect(result.success).toBe(false);
      expect(result.error).toContain('ILLEGAL_TRANSITION');
    }
  });
});
