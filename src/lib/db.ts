import {
  Organization,
  User,
  Customer,
  Truck,
  Driver,
  Shipment,
  ShipmentTimelineEvent,
  GPSPosition,
  ProofOfDelivery,
  Invoice,
  ExceptionItem,
  DocumentItem,
  WorkflowRule,
  AuditLog,
  ShipmentStatus,
} from '@/types';

class LogisticsDatabase {
  public organizations: Organization[] = [];
  public users: User[] = [];
  public customers: Customer[] = [];
  public trucks: Truck[] = [];
  public drivers: Driver[] = [];
  public shipments: Shipment[] = [];
  public timelineEvents: ShipmentTimelineEvent[] = [];
  public gpsPositions: GPSPosition[] = [];
  public pods: ProofOfDelivery[] = [];
  public invoices: Invoice[] = [];
  public exceptions: ExceptionItem[] = [];
  public documents: DocumentItem[] = [];
  public workflowRules: WorkflowRule[] = [];
  public auditLogs: AuditLog[] = [];

  private isInitialized = false;

  constructor() {
    this.seedDefaults();
  }

  public seedDefaults() {
    if (this.isInitialized) return;

    // 1. Organizations
    const org1Id = 'org-apex-001';
    const org2Id = 'org-transafrica-002';
    const org3Id = 'org-silkroad-003';
    const org4Id = 'org-metrocargo-004';
    const org5Id = 'org-horizon-005';

    this.organizations = [
      {
        id: org1Id,
        name: 'Apex Global Logistics',
        slug: 'apex-global',
        plan: 'ENTERPRISE',
        currency: 'USD',
        settings: { timeZone: 'UTC', autoInvoiceOnDelivery: true },
        createdAt: '2025-01-10T08:00:00Z',
      },
      {
        id: org2Id,
        name: 'TransAfrica Express',
        slug: 'transafrica',
        plan: 'ENTERPRISE',
        currency: 'USD',
        settings: { timeZone: 'Africa/Nairobi', autoInvoiceOnDelivery: true },
        createdAt: '2025-02-01T08:00:00Z',
      },
      {
        id: org3Id,
        name: 'SilkRoad Freight Ltd',
        slug: 'silkroad',
        plan: 'PRO',
        currency: 'EUR',
        settings: { timeZone: 'Asia/Dubai', autoInvoiceOnDelivery: false },
        createdAt: '2025-03-15T08:00:00Z',
      },
      {
        id: org4Id,
        name: 'Metro Cargo Systems',
        slug: 'metrocargo',
        plan: 'PRO',
        currency: 'USD',
        settings: { timeZone: 'America/New_York', autoInvoiceOnDelivery: true },
        createdAt: '2025-04-01T08:00:00Z',
      },
      {
        id: org5Id,
        name: 'Horizon Transports',
        slug: 'horizon',
        plan: 'ENTERPRISE',
        currency: 'USD',
        settings: { timeZone: 'UTC', autoInvoiceOnDelivery: true },
        createdAt: '2025-05-10T08:00:00Z',
      },
    ];

    // 2. Users
    this.users = [
      {
        id: 'usr-admin-1',
        organizationId: org1Id,
        email: 'admin@apexlogistics.com',
        firstName: 'Sarah',
        lastName: 'Jenkins',
        phone: '+1 555-0192',
        role: 'ORG_ADMIN',
        status: 'ACTIVE',
        createdAt: '2025-01-10T08:00:00Z',
      },
      {
        id: 'usr-ops-1',
        organizationId: org1Id,
        email: 'ops@apexlogistics.com',
        firstName: 'Marcus',
        lastName: 'Vance',
        phone: '+1 555-0193',
        role: 'OPERATIONS_MANAGER',
        status: 'ACTIVE',
        createdAt: '2025-01-11T08:00:00Z',
      },
      {
        id: 'usr-dispatch-1',
        organizationId: org1Id,
        email: 'dispatch@apexlogistics.com',
        firstName: 'Elena',
        lastName: 'Rostova',
        phone: '+1 555-0194',
        role: 'DISPATCHER',
        status: 'ACTIVE',
        createdAt: '2025-01-12T08:00:00Z',
      },
      {
        id: 'usr-driver-1',
        organizationId: org1Id,
        email: 'driver.john@apexlogistics.com',
        firstName: 'John',
        lastName: 'Kabuya',
        phone: '+254 712 345678',
        role: 'DRIVER',
        status: 'ACTIVE',
        createdAt: '2025-01-15T08:00:00Z',
      },
      {
        id: 'usr-cust-1',
        organizationId: org1Id,
        email: 'logistics@miningcorp.com',
        firstName: 'David',
        lastName: 'Miller',
        phone: '+1 555-0299',
        role: 'CUSTOMER_ADMIN',
        status: 'ACTIVE',
        createdAt: '2025-01-20T08:00:00Z',
      },
      {
        id: 'usr-fin-1',
        organizationId: org1Id,
        email: 'finance@apexlogistics.com',
        firstName: 'Rachel',
        lastName: 'Green',
        phone: '+1 555-0311',
        role: 'FINANCE_MANAGER',
        status: 'ACTIVE',
        createdAt: '2025-01-15T08:00:00Z',
      },
    ];

    // 3. Customers
    const customerNames = [
      'Global Mining Corp', 'Trans-Continental Retail', 'Apex Agro Exporters',
      'Kigali Industrial Hub', 'East Africa Pharma Supply', 'Universal Freight Co',
      'Mombasa Port Terminal Ltd', 'BlueWave Energy', 'Zenith Motors', 'Atlas Steel Distributors',
      'Solaris Green Energy', 'Pacific Trade Partners', 'Summit Agri Processing',
      'Nile Basin Commodities', 'Savannah Coffee Co', 'Victoria Tech Importers',
      'Highland Fresh Produce', 'Kilimanjaro Chemicals', 'Great Lakes Logistics LLC', 'Zambezi Power Equipment'
    ];

    this.customers = customerNames.map((name, i) => {
      const orgId = i % 2 === 0 ? org1Id : org2Id;
      return {
        id: `cust-${i + 1}`,
        organizationId: orgId,
        name,
        code: `CUST-${1000 + i}`,
        email: `contact@${name.toLowerCase().replace(/[^a-z]/g, '')}.com`,
        phone: `+1 555-0${100 + i}`,
        address: `${100 + i * 5} Commerce Way, Industrial Zone`,
        creditLimit: 100000 + i * 25000,
        activeShipmentsCount: Math.floor(Math.random() * 8) + 1,
        createdAt: '2025-01-15T08:00:00Z',
      };
    });

    // 4. Trucks
    const truckTypes: ('CONTAINER_33FT' | 'FLATBED_40FT' | 'TANKER' | 'REFRIGERATED' | 'SMALL_VAN')[] = [
      'CONTAINER_33FT', 'FLATBED_40FT', 'TANKER', 'REFRIGERATED', 'SMALL_VAN'
    ];

    for (let i = 1; i <= 50; i++) {
      const orgId = i <= 25 ? org1Id : org2Id;
      const type = truckTypes[i % truckTypes.length];
      this.trucks.push({
        id: `truck-${i}`,
        organizationId: orgId,
        registrationNumber: `KBC-${100 + i}X`,
        vehicleType: type,
        capacityTons: type === 'FLATBED_40FT' ? 32 : type === 'TANKER' ? 28 : 20,
        make: i % 2 === 0 ? 'Scania' : 'Volvo',
        model: i % 2 === 0 ? 'R500' : 'FH16',
        year: 2022 + (i % 4),
        odometerKm: 45000 + i * 3200,
        status: i % 7 === 0 ? 'MAINTENANCE' : i % 3 === 0 ? 'IN_TRANSIT' : 'AVAILABLE',
        fuelLevelPercent: Math.floor(Math.random() * 60) + 40,
        gpsDeviceId: `GPS-DEV-${900 + i}`,
        createdAt: '2025-01-10T08:00:00Z',
      });
    }

    // 5. Drivers
    const driverFirstNames = ['John', 'Peter', 'Samuel', 'Daniel', 'Emmanuel', 'Grace', 'Moses', 'Isaac', 'Joseph', 'David'];
    const driverLastNames = ['Kabuya', 'Mutua', 'Ochieng', 'Njoroge', 'Kamau', 'Wanjiru', 'Mwangi', 'Otieno', 'Kipchirchir', 'Maina'];

    for (let i = 1; i <= 80; i++) {
      const orgId = i <= 40 ? org1Id : org2Id;
      const fn = driverFirstNames[i % driverFirstNames.length];
      const ln = driverLastNames[i % driverLastNames.length];
      this.drivers.push({
        id: `driver-${i}`,
        organizationId: orgId,
        name: `${fn} ${ln} #${i}`,
        phone: `+254 7${10000000 + i * 111111}`,
        licenseNumber: `DL-KE-${200000 + i}`,
        licenseExpiry: '2028-12-31',
        assignedTruckId: i <= 50 ? `truck-${i}` : undefined,
        status: i % 3 === 0 ? 'ON_TRIP' : 'AVAILABLE',
        rating: +(4.2 + (i % 8) * 0.1).toFixed(1),
        onTimeRatePercent: Math.min(99, 88 + (i % 12)),
        totalTripsCount: 40 + i * 3,
        createdAt: '2025-01-10T08:00:00Z',
      });
    }

    // 6. Routes & Coordinates
    const cities = [
      { name: 'Kigali Port / Depot', lat: -1.9441, lng: 30.0619 },
      { name: 'Mombasa Ocean Terminal', lat: -4.0435, lng: 39.6682 },
      { name: 'Nairobi Freight Hub', lat: -1.286389, lng: 36.817223 },
      { name: 'Dar es Salaam Customs', lat: -6.7924, lng: 39.2083 },
      { name: 'Kampala Logistics Yard', lat: 0.3476, lng: 32.5825 },
      { name: 'Gisenyi Border Checkpoint', lat: -1.6792, lng: 29.2612 },
    ];

    const statuses: ShipmentStatus[] = [
      'BOOKED', 'TRUCK_ASSIGNED', 'LOADING_STARTED', 'IN_TRANSIT',
      'CHECKPOINT', 'BORDER_PROCESSING', 'AT_DESTINATION', 'UNLOADED',
      'DELIVERED', 'INVOICED', 'DELAYED'
    ];

    // 7. Generate 100 Realistic Shipments
    for (let i = 1; i <= 100; i++) {
      const orgId = i <= 60 ? org1Id : org2Id;
      const customer = this.customers[i % this.customers.length];
      const status = statuses[i % statuses.length];
      const origin = cities[i % cities.length];
      const dest = cities[(i + 2) % cities.length];
      const truck = this.trucks[(i - 1) % 50];
      const driver = this.drivers[(i - 1) % 80];

      // calculate current simulated lat/lng
      let currentLat = origin.lat + (dest.lat - origin.lat) * 0.45;
      let currentLng = origin.lng + (dest.lng - origin.lng) * 0.45;

      const shipmentId = `shp-${1000 + i}`;
      const shpNum = `SHP-2026-${10000 + i}`;

      const shipment: Shipment = {
        id: shipmentId,
        organizationId: orgId,
        shipmentNumber: shpNum,
        customerId: customer.id,
        customerName: customer.name,
        bookingId: `BK-${5000 + i}`,
        origin: { name: origin.name, latitude: origin.lat, longitude: origin.lng },
        destination: { name: dest.name, latitude: dest.lat, longitude: dest.lng },
        cargoType: i % 4 === 0 ? 'Industrial Machinery' : i % 3 === 0 ? 'Agricultural Coffee Exports' : 'Consumer Electronics',
        cargoDescription: `Standard High-Value Palletised Freight (${20 + (i % 10)} Pallets)`,
        weightKg: 18000 + (i % 12) * 1000,
        volumeCbm: 45 + (i % 5) * 5,
        packageCount: 24 + (i % 10),
        containerNumber: `MSCU-${450000 + i}`,
        sealNumber: `SL-KE-${90000 + i}`,
        billOfLadingNumber: `BOL-${700000 + i}`,
        referenceNumber: `PO-890${i}`,
        transportMode: 'ROAD',
        truckId: truck.id,
        truckRegistration: truck.registrationNumber,
        driverId: driver.id,
        driverName: driver.name,
        driverPhone: driver.phone,
        plannedPickupAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
        actualPickupAt: new Date(Date.now() - 32 * 3600 * 1000).toISOString(),
        plannedDeliveryAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        estimatedDeliveryAt: new Date(Date.now() + (status === 'DELAYED' ? 36 : 20) * 3600 * 1000).toISOString(),
        actualDeliveryAt: status === 'DELIVERED' || status === 'INVOICED' ? new Date(Date.now() - 4 * 3600 * 1000).toISOString() : undefined,
        status,
        priority: i % 8 === 0 ? 'CRITICAL' : i % 3 === 0 ? 'HIGH' : 'STANDARD',
        currentLatitude: currentLat,
        currentLongitude: currentLng,
        speedKmh: status === 'IN_TRANSIT' ? 62 : 0,
        distanceRemainingKm: Math.floor(120 + (i % 15) * 25),
        specialInstructions: 'Temperature controlled payload. Requires border clearance seal inspection at checkpoint.',
        createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.shipments.push(shipment);

      // Create initial timeline events
      this.timelineEvents.push(
        {
          id: `evt-${i}-1`,
          organizationId: orgId,
          shipmentId,
          eventType: 'BOOKING_CREATED',
          status: 'BOOKED',
          timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
          userName: 'Elena Rostova',
          source: 'SYSTEM',
          remarks: 'Shipment created and confirmed with customer.',
        },
        {
          id: `evt-${i}-2`,
          organizationId: orgId,
          shipmentId,
          eventType: 'DISPATCH_ASSIGNED',
          status: 'TRUCK_ASSIGNED',
          timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
          userName: 'Marcus Vance',
          source: 'MANUAL',
          remarks: `Assigned truck ${truck.registrationNumber} and driver ${driver.name}.`,
        }
      );

      // Add GPS Telemetry if active
      if (['IN_TRANSIT', 'BORDER_PROCESSING', 'CHECKPOINT', 'DELAYED'].includes(status)) {
        this.gpsPositions.push({
          id: `gps-pos-${i}`,
          organizationId: orgId,
          truckId: truck.id,
          driverId: driver.id,
          shipmentId,
          latitude: currentLat,
          longitude: currentLng,
          speed: status === 'IN_TRANSIT' ? 64.5 : 0,
          heading: 142.5,
          altitude: 1240,
          batteryLevel: 88,
          timestamp: new Date().toISOString(),
          source: 'DRIVER_APP',
        });
      }

      // Add Exception if delayed or critical
      if (status === 'DELAYED' || i % 10 === 0) {
        this.exceptions.push({
          id: `exc-${i}`,
          organizationId: orgId,
          shipmentId,
          shipmentNumber: shpNum,
          truckId: truck.id,
          truckRegistration: truck.registrationNumber,
          type: i % 2 === 0 ? 'BORDER_DELAY' : 'STATIONARY_TOO_LONG',
          severity: status === 'DELAYED' ? 'HIGH' : 'MEDIUM',
          status: 'OPEN',
          ownerName: 'Marcus Vance',
          rootCause: 'Heavy customs clearance backlog at international border crossing.',
          resolution: 'Contacted customs clearing agent to expedite document review.',
          createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        });
      }

      // Add Invoices for delivered
      if (status === 'INVOICED' || status === 'DELIVERED') {
        const subtotal = 2800 + (i % 5) * 450;
        const tax = subtotal * 0.18;
        this.invoices.push({
          id: `inv-${i}`,
          organizationId: orgId,
          invoiceNumber: `INV-2026-${3000 + i}`,
          customerId: customer.id,
          customerName: customer.name,
          shipmentId,
          shipmentNumber: shpNum,
          subtotalAmount: subtotal,
          taxAmount: tax,
          totalAmount: subtotal + tax,
          paidAmount: status === 'INVOICED' ? 0 : subtotal + tax,
          status: status === 'INVOICED' ? 'UNPAID' : 'PAID',
          dueDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
          lineItems: [
            { description: 'Long Haul Container Freight Transport', quantity: 1, unitPrice: subtotal - 300, total: subtotal - 300 },
            { description: 'Border Clearance & Handling Surcharge', quantity: 1, unitPrice: 300, total: 300 },
          ],
        });
      }
    }

    // 8. Default Automation Rules
    this.workflowRules = [
      {
        id: 'wf-1',
        organizationId: org1Id,
        name: 'Stationary Truck Delay Alert (>90m)',
        eventType: 'GPS_PING',
        conditionJson: { field: 'stationary_duration_min', operator: 'GREATER_THAN', value: 90 },
        actionType: 'CREATE_EXCEPTION',
        actionPayload: { severity: 'HIGH', type: 'STATIONARY_TOO_LONG' },
        active: true,
        triggerCount: 14,
        createdAt: '2025-01-10T08:00:00Z',
      },
      {
        id: 'wf-2',
        organizationId: org1Id,
        name: 'Auto-Invoice Generation on POD Upload',
        eventType: 'POD_COMPLETED',
        conditionJson: { field: 'status', operator: 'EQUALS', value: 'DELIVERED' },
        actionType: 'UPDATE_STATUS',
        actionPayload: { nextStatus: 'INVOICED' },
        active: true,
        triggerCount: 42,
        createdAt: '2025-01-10T08:00:00Z',
      },
    ];

    this.isInitialized = true;
  }

  // Tenant-Scoped Filter Query Helpers
  public getShipmentsByOrg(orgId: string): Shipment[] {
    return this.shipments.filter(s => s.organizationId === orgId);
  }

  public getTrucksByOrg(orgId: string): Truck[] {
    return this.trucks.filter(t => t.organizationId === orgId);
  }

  public getDriversByOrg(orgId: string): Driver[] {
    return this.drivers.filter(d => d.organizationId === orgId);
  }

  public getCustomersByOrg(orgId: string): Customer[] {
    return this.customers.filter(c => c.organizationId === orgId);
  }

  public getExceptionsByOrg(orgId: string): ExceptionItem[] {
    return this.exceptions.filter(e => e.organizationId === orgId);
  }

  public getInvoicesByOrg(orgId: string): Invoice[] {
    return this.invoices.filter(i => i.organizationId === orgId);
  }
}

// Global Singleton Instance
export const db = new LogisticsDatabase();
