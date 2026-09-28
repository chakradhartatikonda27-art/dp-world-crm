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

    // 1. Organizations (Streamlined for Demo)
    const orgDpw = 'org-dpw-rwanda';
    const orgApex = 'org-apex-001';

    this.organizations = [
      {
        id: orgDpw,
        name: 'DP World Rwanda',
        slug: 'dpw-rwanda',
        plan: 'ENTERPRISE',
        currency: 'USD',
        settings: { timeZone: 'Africa/Kigali', autoInvoiceOnDelivery: true },
        createdAt: '2025-01-01T08:00:00Z',
      },
      {
        id: orgApex,
        name: 'Apex Global Logistics',
        slug: 'apex-global',
        plan: 'ENTERPRISE',
        currency: 'USD',
        settings: { timeZone: 'UTC', autoInvoiceOnDelivery: true },
        createdAt: '2025-01-10T08:00:00Z',
      },
    ];

    // 2. Users (Role Scoped Demo Accounts)
    this.users = [
      {
        id: 'usr-1',
        organizationId: orgDpw,
        email: 'admin@dpworld.rw',
        firstName: 'Alex',
        lastName: 'Ndagijimana',
        phone: '+250 788 100 001',
        role: 'ORG_ADMIN',
        status: 'ACTIVE',
        createdAt: '2025-01-01T08:00:00Z',
      },
      {
        id: 'usr-2',
        organizationId: orgDpw,
        email: 'ops@dpworld.rw',
        firstName: 'Marcus',
        lastName: 'Vance',
        phone: '+250 788 100 002',
        role: 'OPERATIONS_MANAGER',
        status: 'ACTIVE',
        createdAt: '2025-01-01T08:00:00Z',
      },
      {
        id: 'usr-3',
        organizationId: orgDpw,
        email: 'finance@dpworld.rw',
        firstName: 'Sarah',
        lastName: 'Jenkins',
        phone: '+250 788 100 003',
        role: 'FINANCE_MANAGER',
        status: 'ACTIVE',
        createdAt: '2025-01-01T08:00:00Z',
      },
      {
        id: 'usr-4',
        organizationId: orgDpw,
        email: 'fleet@dpworld.rw',
        firstName: 'Eric',
        lastName: 'Kwizera',
        phone: '+250 788 100 004',
        role: 'FLEET_MANAGER',
        status: 'ACTIVE',
        createdAt: '2025-01-01T08:00:00Z',
      },
      {
        id: 'usr-5',
        organizationId: orgDpw,
        email: 'driver@dpworld.rw',
        firstName: 'John',
        lastName: 'Mwangi',
        phone: '+250 788 123 456',
        role: 'DRIVER',
        status: 'ACTIVE',
        createdAt: '2025-01-01T08:00:00Z',
      },
      {
        id: 'usr-6',
        organizationId: orgDpw,
        email: 'client@kigalihub.rw',
        firstName: 'Claire',
        lastName: 'Mutoni',
        phone: '+250 788 100 006',
        role: 'CUSTOMER_ADMIN',
        status: 'ACTIVE',
        createdAt: '2025-01-01T08:00:00Z',
      },
    ];

    // 3. Customers (3 Primary Enterprise Clients for Demo)
    this.customers = [
      {
        id: 'cust-1',
        organizationId: orgDpw,
        name: 'Kigali Industrial & Commercial Hub',
        code: 'CUST-1001',
        email: 'logistics@kigalihub.rw',
        phone: '+250 788 900 111',
        address: 'Plot 45, Masaka Industrial Zone, Kigali, Rwanda',
        creditLimit: 250000,
        activeShipmentsCount: 2,
        createdAt: '2025-01-05T08:00:00Z',
      },
      {
        id: 'cust-2',
        organizationId: orgDpw,
        name: 'East Africa Pharma Supply Ltd',
        code: 'CUST-1002',
        email: 'supply@eapharma.co.ke',
        phone: '+254 20 555 4321',
        address: 'Pharma Park, Mombasa Road, Nairobi, Kenya',
        creditLimit: 180000,
        activeShipmentsCount: 1,
        createdAt: '2025-01-10T08:00:00Z',
      },
      {
        id: 'cust-3',
        organizationId: orgDpw,
        name: 'Apex Agro Exporters Rwanda',
        code: 'CUST-1003',
        email: 'export@apexagro.rw',
        phone: '+250 788 888 222',
        address: 'Kicukiro Logistics Yard, Kigali, Rwanda',
        creditLimit: 150000,
        activeShipmentsCount: 1,
        createdAt: '2025-01-15T08:00:00Z',
      },
    ];

    // 4. Trucks (4 Essential Demo Vehicles)
    this.trucks = [
      {
        id: 'truck-rwa-1',
        organizationId: orgDpw,
        registrationNumber: 'RAB 123A',
        vehicleType: 'CONTAINER_33FT',
        capacityTons: 28,
        make: 'Volvo',
        model: 'FH16',
        year: 2025,
        odometerKm: 48200,
        status: 'IN_TRANSIT',
        fuelLevelPercent: 92,
        gpsDeviceId: 'GPS-DEV-901',
        createdAt: '2025-01-01T08:00:00Z',
      },
      {
        id: 'truck-rwa-2',
        organizationId: orgDpw,
        registrationNumber: 'RAB 456B',
        vehicleType: 'REFRIGERATED',
        capacityTons: 24,
        make: 'Scania',
        model: 'R500',
        year: 2024,
        odometerKm: 62100,
        status: 'IN_TRANSIT',
        fuelLevelPercent: 84,
        gpsDeviceId: 'GPS-DEV-902',
        createdAt: '2025-01-05T08:00:00Z',
      },
      {
        id: 'truck-rwa-3',
        organizationId: orgDpw,
        registrationNumber: 'RAD 789C',
        vehicleType: 'FLATBED_40FT',
        capacityTons: 32,
        make: 'Volvo',
        model: 'FH16',
        year: 2024,
        odometerKm: 51000,
        status: 'LOADING',
        fuelLevelPercent: 78,
        gpsDeviceId: 'GPS-DEV-903',
        createdAt: '2025-01-10T08:00:00Z',
      },
      {
        id: 'truck-rwa-4',
        organizationId: orgDpw,
        registrationNumber: 'RAE 101D',
        vehicleType: 'TANKER',
        capacityTons: 30,
        make: 'MAN',
        model: 'TGX',
        year: 2023,
        odometerKm: 74500,
        status: 'AVAILABLE',
        fuelLevelPercent: 95,
        gpsDeviceId: 'GPS-DEV-904',
        createdAt: '2025-01-12T08:00:00Z',
      },
    ];

    // 5. Drivers (4 Essential Demo Drivers)
    this.drivers = [
      {
        id: 'driver-rwa-1',
        organizationId: orgDpw,
        userId: 'usr-5',
        name: 'John',
        phone: '+250 788 123 456',
        licenseNumber: 'DL-RWA-99210',
        licenseExpiry: '2028-12-31',
        assignedTruckId: 'truck-rwa-1',
        status: 'ON_TRIP',
        rating: 4.9,
        onTimeRatePercent: 98,
        totalTripsCount: 142,
        createdAt: '2025-01-01T08:00:00Z',
      },
      {
        id: 'driver-rwa-2',
        organizationId: orgDpw,
        name: 'Jean Baptiste Hakizimana',
        phone: '+250 788 222 333',
        licenseNumber: 'DL-RWA-99211',
        licenseExpiry: '2027-10-15',
        assignedTruckId: 'truck-rwa-2',
        status: 'ON_TRIP',
        rating: 4.8,
        onTimeRatePercent: 95,
        totalTripsCount: 96,
        createdAt: '2025-01-05T08:00:00Z',
      },
      {
        id: 'driver-rwa-3',
        organizationId: orgDpw,
        name: 'Eric Ndayisaba',
        phone: '+250 788 333 444',
        licenseNumber: 'DL-RWA-99212',
        licenseExpiry: '2028-06-30',
        assignedTruckId: 'truck-rwa-3',
        status: 'ON_TRIP',
        rating: 4.7,
        onTimeRatePercent: 92,
        totalTripsCount: 78,
        createdAt: '2025-01-10T08:00:00Z',
      },
      {
        id: 'driver-rwa-4',
        organizationId: orgDpw,
        name: 'Amani Mugisha',
        phone: '+250 788 444 555',
        licenseNumber: 'DL-RWA-99213',
        licenseExpiry: '2029-01-20',
        assignedTruckId: 'truck-rwa-4',
        status: 'AVAILABLE',
        rating: 5.0,
        onTimeRatePercent: 100,
        totalTripsCount: 54,
        createdAt: '2025-01-12T08:00:00Z',
      },
    ];

    // 6. Curated Demo Shipments (4 Core Workflow Stage Demonstration Shipments)
    this.shipments = [
      // 1. Flagship User Requested Shipment
      {
        id: 'shp-rwa-125',
        organizationId: orgDpw,
        shipmentNumber: 'RWA-2026-000125',
        customerId: 'cust-1',
        customerName: 'Kigali Industrial & Commercial Hub',
        bookingId: 'BK-RWA-00125',
        origin: { name: 'Dar es Salaam Port', latitude: -6.7924, longitude: 39.2083 },
        destination: { name: 'Kigali, Rwanda', latitude: -1.9441, longitude: 30.0619 },
        cargoType: 'Refrigerated & Containerized Freight',
        cargoDescription: 'High-Value Commercial Freight (Container MSCU1234567)',
        weightKg: 24000,
        volumeCbm: 60,
        packageCount: 32,
        containerNumber: 'MSCU1234567',
        sealNumber: 'SL-TZ-88491',
        billOfLadingNumber: 'BOL-DAR-99210',
        referenceNumber: 'PO-RWA-2026',
        transportMode: 'ROAD',
        truckId: 'truck-rwa-1',
        truckRegistration: 'RAB 123A',
        driverId: 'driver-rwa-1',
        driverName: 'John',
        driverPhone: '+250 788 123 456',
        plannedPickupAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
        actualPickupAt: new Date(Date.now() - 32 * 3600 * 1000).toISOString(),
        plannedDeliveryAt: new Date(Date.now() + 28 * 3600 * 1000).toISOString(),
        estimatedDeliveryAt: new Date(Date.now() + 28 * 3600 * 1000).toISOString(),
        status: 'IN_TRANSIT',
        priority: 'HIGH',
        currentLatitude: -2.3845,
        currentLongitude: 30.7850,
        speedKmh: 58,
        distanceRemainingKm: 180,
        specialInstructions: 'Currently at Rusumo Border. Distance remaining: 180 km. Dynamic ETA: Tomorrow 14:30.',
        createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },

      // 2. Border Clearance Shipment
      {
        id: 'shp-rwa-126',
        organizationId: orgDpw,
        shipmentNumber: 'SHP-2026-10012',
        customerId: 'cust-2',
        customerName: 'East Africa Pharma Supply Ltd',
        bookingId: 'BK-RWA-00126',
        origin: { name: 'Mombasa Ocean Terminal', latitude: -4.0435, longitude: 39.6682 },
        destination: { name: 'Kigali Dry Port, Rwanda', latitude: -1.9441, longitude: 30.0619 },
        cargoType: 'Refrigerated Pharmaceuticals',
        cargoDescription: 'Temperature-Controlled Vaccines & Medical Supplies',
        weightKg: 16500,
        volumeCbm: 42,
        packageCount: 18,
        containerNumber: 'HLXU9982310',
        sealNumber: 'SL-KE-77120',
        billOfLadingNumber: 'BOL-MOM-44102',
        referenceNumber: 'PO-PHARMA-901',
        transportMode: 'ROAD',
        truckId: 'truck-rwa-2',
        truckRegistration: 'RAB 456B',
        driverId: 'driver-rwa-2',
        driverName: 'Jean Baptiste Hakizimana',
        driverPhone: '+250 788 222 333',
        plannedPickupAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        actualPickupAt: new Date(Date.now() - 44 * 3600 * 1000).toISOString(),
        plannedDeliveryAt: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
        estimatedDeliveryAt: new Date(Date.now() + 16 * 3600 * 1000).toISOString(),
        status: 'BORDER_PROCESSING',
        priority: 'CRITICAL',
        currentLatitude: -2.1482,
        currentLongitude: 30.5401,
        speedKmh: 0,
        distanceRemainingKm: 95,
        specialInstructions: 'Undergoing customs inspection at Nemba Border post.',
        createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },

      // 3. Loading Dock Active Shipment
      {
        id: 'shp-rwa-127',
        organizationId: orgDpw,
        shipmentNumber: 'SHP-2026-10018',
        customerId: 'cust-3',
        customerName: 'Apex Agro Exporters Rwanda',
        bookingId: 'BK-RWA-00127',
        origin: { name: 'Kigali Inland Container Depot', latitude: -1.9441, longitude: 30.0619 },
        destination: { name: 'Mombasa Port, Kenya', latitude: -4.0435, longitude: 39.6682 },
        cargoType: 'Agricultural Coffee Exports',
        cargoDescription: 'Premium Specialty Coffee Beans (Export Grade)',
        weightKg: 28000,
        volumeCbm: 68,
        packageCount: 40,
        containerNumber: 'CMAU3381029',
        sealNumber: 'SL-RW-55019',
        billOfLadingNumber: 'BOL-KIG-11092',
        referenceNumber: 'PO-COFFEE-004',
        transportMode: 'ROAD',
        truckId: 'truck-rwa-3',
        truckRegistration: 'RAD 789C',
        driverId: 'driver-rwa-3',
        driverName: 'Eric Ndayisaba',
        driverPhone: '+250 788 333 444',
        plannedPickupAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        actualPickupAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        plannedDeliveryAt: new Date(Date.now() + 52 * 3600 * 1000).toISOString(),
        estimatedDeliveryAt: new Date(Date.now() + 52 * 3600 * 1000).toISOString(),
        status: 'LOADING_STARTED',
        priority: 'STANDARD',
        currentLatitude: -1.9441,
        currentLongitude: 30.0619,
        speedKmh: 0,
        distanceRemainingKm: 1450,
        specialInstructions: 'Currently at Kigali ICD Dock Bay 1 undergoing seal application.',
        createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },

      // 4. Delivered & POD Verified Shipment
      {
        id: 'shp-rwa-129',
        organizationId: orgDpw,
        shipmentNumber: 'SHP-2026-10025',
        customerId: 'cust-1',
        customerName: 'Kigali Industrial & Commercial Hub',
        bookingId: 'BK-RWA-00129',
        origin: { name: 'Mombasa Port, Kenya', latitude: -4.0435, longitude: 39.6682 },
        destination: { name: 'Kigali Industrial Hub', latitude: -1.9441, longitude: 30.0619 },
        cargoType: 'Commercial Electronics',
        cargoDescription: 'Smart Monitors, Servers & Telecommunications Gear',
        weightKg: 14200,
        volumeCbm: 38,
        packageCount: 150,
        containerNumber: 'SUDU9920192',
        sealNumber: 'SL-KE-88190',
        billOfLadingNumber: 'BOL-MOM-77102',
        referenceNumber: 'PO-ELEC-404',
        transportMode: 'ROAD',
        truckId: 'truck-rwa-4',
        truckRegistration: 'RAE 101D',
        driverId: 'driver-rwa-4',
        driverName: 'Amani Mugisha',
        driverPhone: '+250 788 444 555',
        plannedPickupAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
        actualPickupAt: new Date(Date.now() - 70 * 3600 * 1000).toISOString(),
        plannedDeliveryAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
        estimatedDeliveryAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
        actualDeliveryAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
        status: 'DELIVERED',
        priority: 'STANDARD',
        currentLatitude: -1.9441,
        currentLongitude: 30.0619,
        speedKmh: 0,
        distanceRemainingKm: 0,
        specialInstructions: 'Proof of Delivery signed by Claire Mutoni (Kigali Hub Warehouse Manager).',
        createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Timeline events for Flagship Shipment RWA-2026-000125
    this.timelineEvents = [
      { id: 'evt-rwa-1', organizationId: orgDpw, shipmentId: 'shp-rwa-125', eventType: 'BOOKING_CREATED', status: 'BOOKED', timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(), userName: 'System Auto-Booking', source: 'SYSTEM', remarks: 'Freight booking created for Container MSCU1234567.' },
      { id: 'evt-rwa-2', organizationId: orgDpw, shipmentId: 'shp-rwa-125', eventType: 'DOCUMENTS_VERIFIED', status: 'DOCUMENTS_PENDING', timestamp: new Date(Date.now() - 34 * 3600 * 1000).toISOString(), userName: 'Customs Officer', source: 'SYSTEM', remarks: 'C17 & COMESA transit documentation cleared at Dar Port.' },
      { id: 'evt-rwa-3', organizationId: orgDpw, shipmentId: 'shp-rwa-125', eventType: 'TRUCK_ASSIGNED', status: 'TRUCK_ASSIGNED', timestamp: new Date(Date.now() - 32 * 3600 * 1000).toISOString(), userName: 'Dispatcher', source: 'MANUAL', remarks: 'Assigned Truck RAB 123A and Driver John.' },
      { id: 'evt-rwa-4', organizationId: orgDpw, shipmentId: 'shp-rwa-125', eventType: 'DEPARTED', status: 'IN_TRANSIT', timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), userName: 'John (Driver)', source: 'DRIVER_APP', remarks: 'Departed Dar es Salaam Port in-transit to Kigali, Rwanda.' },
      { id: 'evt-rwa-5', organizationId: orgDpw, shipmentId: 'shp-rwa-125', eventType: 'CHECKPOINT', status: 'IN_TRANSIT', timestamp: new Date().toISOString(), userName: 'GPS Telemetry', source: 'GPS_AUTOMATION', remarks: 'Currently at Rusumo Border. Distance remaining: 180 km. Dynamic ETA: Tomorrow 14:30.' },
    ];

    // GPS Positions for Active Telemetry Stream
    this.gpsPositions = [
      {
        id: 'gps-rwa-125',
        organizationId: orgDpw,
        truckId: 'truck-rwa-1',
        driverId: 'driver-rwa-1',
        shipmentId: 'shp-rwa-125',
        latitude: -2.3845,
        longitude: 30.7850,
        speed: 58,
        heading: 285,
        altitude: 1350,
        batteryLevel: 94,
        networkStatus: 'CELLULAR 4G (ONLINE)',
        timestamp: new Date().toISOString(),
        source: 'DRIVER_APP',
      },
      {
        id: 'gps-rwa-126',
        organizationId: orgDpw,
        truckId: 'truck-rwa-2',
        driverId: 'driver-rwa-2',
        shipmentId: 'shp-rwa-126',
        latitude: -2.1482,
        longitude: 30.5401,
        speed: 0,
        heading: 180,
        altitude: 1400,
        batteryLevel: 88,
        networkStatus: 'CELLULAR 4G (ONLINE)',
        timestamp: new Date().toISOString(),
        source: 'DRIVER_APP',
      },
    ];

    // Proof of Delivery for Delivered Demo Shipment
    this.pods = [
      {
        id: 'pod-rwa-1',
        organizationId: orgDpw,
        shipmentId: 'shp-rwa-129',
        recipientName: 'Claire Mutoni',
        recipientPhone: '+250 788 100 006',
        signatureUrl: 'https://placehold.co/300x120/png?text=Signed+Claire+Mutoni',
        photoUrls: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500'],
        notes: 'Delivered in pristine condition with bolt seal intact.',
        damageReported: false,
        latitude: -1.9441,
        longitude: 30.0619,
        timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
      },
    ];

    // Invoices for Demo
    this.invoices = [
      {
        id: 'inv-rwa-1',
        organizationId: orgDpw,
        invoiceNumber: 'INV-2026-3001',
        customerId: 'cust-2',
        customerName: 'East Africa Pharma Supply Ltd',
        shipmentId: 'shp-rwa-130',
        shipmentNumber: 'SHP-2026-10030',
        subtotalAmount: 3200,
        taxAmount: 576,
        totalAmount: 3776,
        paidAmount: 3776,
        status: 'PAID',
        dueDate: '2026-10-15',
        createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        lineItems: [
          { description: 'Refrigerated Pharma Corridor Transport (Dar → Kigali)', quantity: 1, unitPrice: 2900, total: 2900 },
          { description: 'Border Clearance & Customs Handling Surcharge', quantity: 1, unitPrice: 300, total: 300 },
        ],
      },
      {
        id: 'inv-rwa-2',
        organizationId: orgDpw,
        invoiceNumber: 'INV-2026-3002',
        customerId: 'cust-1',
        customerName: 'Kigali Industrial & Commercial Hub',
        shipmentId: 'shp-rwa-129',
        shipmentNumber: 'SHP-2026-10025',
        subtotalAmount: 2640,
        taxAmount: 475.2,
        totalAmount: 3115.2,
        paidAmount: 0,
        status: 'UNPAID',
        dueDate: '2026-10-25',
        createdAt: new Date().toISOString(),
        lineItems: [
          { description: 'Electronics Container Transport (Mombasa → Kigali)', quantity: 1, unitPrice: 2640, total: 2640 },
        ],
      },
    ];

    // Operational Exceptions
    this.exceptions = [
      {
        id: 'exc-rwa-1',
        organizationId: orgDpw,
        shipmentId: 'shp-rwa-126',
        shipmentNumber: 'SHP-2026-10012',
        truckId: 'truck-rwa-2',
        truckRegistration: 'RAB 456B',
        type: 'BORDER_DELAY',
        severity: 'HIGH',
        status: 'OPEN',
        ownerName: 'Marcus Vance',
        rootCause: 'Heavy customs clearance backlog at Nemba border crossing.',
        resolution: 'Contacted customs clearing agent to expedite document review.',
        createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      },
    ];

    // Documents Vault
    this.documents = [
      {
        id: 'doc-rwa-1',
        organizationId: orgDpw,
        shipmentId: 'shp-rwa-125',
        shipmentNumber: 'RWA-2026-000125',
        docType: 'COMESA Transit Permit',
        fileName: 'COMESA_PERMIT_RWA125.pdf',
        fileUrl: '#',
        uploadedBy: 'Customs Officer',
        clearanceStatus: 'CLEARED',
        notes: 'Verified valid COMESA transit license.',
        createdAt: new Date(Date.now() - 34 * 3600 * 1000).toISOString(),
      },
      {
        id: 'doc-rwa-2',
        organizationId: orgDpw,
        shipmentId: 'shp-rwa-125',
        shipmentNumber: 'RWA-2026-000125',
        docType: 'C17 Customs Declaration',
        fileName: 'C17_DECLARATION_MSCU1234567.pdf',
        fileUrl: '#',
        uploadedBy: 'Elena Rostova',
        clearanceStatus: 'CLEARED',
        notes: 'Customs duty tax exempt certificate attached.',
        createdAt: new Date(Date.now() - 35 * 3600 * 1000).toISOString(),
      },
    ];

    // Automation Rules
    this.workflowRules = [
      {
        id: 'wf-geofence-1',
        organizationId: orgDpw,
        name: 'Truck Enters Port → Status: "ARRIVED AT PORT" + Client Notification',
        eventType: 'PORT_GEOFENCE_ENTRY',
        conditionJson: { field: 'geofence_type', operator: 'EQUALS', value: 'PORT' },
        actionType: 'UPDATE_STATUS',
        actionPayload: { nextStatus: 'ARRIVED_AT_PORT', notifyClient: true, channel: 'SMS_AND_WHATSAPP' },
        active: true,
        triggerCount: 88,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'wf-geofence-2',
        organizationId: orgDpw,
        name: 'Truck Enters Destination → Status: "ARRIVED" + Warehouse Notified + Unloading Task Created',
        eventType: 'DESTINATION_GEOFENCE_ENTRY',
        conditionJson: { field: 'geofence_type', operator: 'EQUALS', value: 'DESTINATION' },
        actionType: 'UPDATE_STATUS',
        actionPayload: { nextStatus: 'ARRIVED', notifyWarehouse: true, autoCreateDockTask: true },
        active: true,
        triggerCount: 64,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'wf-1',
        organizationId: orgDpw,
        name: 'Stationary Truck Delay Alert (>90m)',
        eventType: 'GPS_PING',
        conditionJson: { field: 'stationary_duration_min', operator: 'GREATER_THAN', value: 90 },
        actionType: 'CREATE_EXCEPTION',
        actionPayload: { severity: 'HIGH', type: 'STATIONARY_TOO_LONG' },
        active: true,
        triggerCount: 14,
        createdAt: '2025-01-10T08:00:00Z',
      },
    ];

    this.isInitialized = true;
  }

  public fuelRecords: any[] = [];
  public corridors: any[] = [];
  public loadingDocks: any[] = [];
  public inventoryItems: any[] = [];
  public maintenanceOrders: any[] = [];

  // Tenant-Scoped Filter Query Helpers
  public getShipmentsByOrg(orgId: string): Shipment[] {
    return this.shipments.filter(s => s.organizationId === orgId || orgId === 'org-dpw-rwanda' || orgId === 'org-apex-001');
  }

  public getTrucksByOrg(orgId: string): Truck[] {
    return this.trucks.filter(t => t.organizationId === orgId || orgId === 'org-dpw-rwanda' || orgId === 'org-apex-001');
  }

  public getDriversByOrg(orgId: string): Driver[] {
    return this.drivers.filter(d => d.organizationId === orgId || orgId === 'org-dpw-rwanda' || orgId === 'org-apex-001');
  }

  public getCustomersByOrg(orgId: string): Customer[] {
    return this.customers.filter(c => c.organizationId === orgId || orgId === 'org-dpw-rwanda' || orgId === 'org-apex-001');
  }

  public getExceptionsByOrg(orgId: string): ExceptionItem[] {
    return this.exceptions.filter(e => e.organizationId === orgId || orgId === 'org-dpw-rwanda' || orgId === 'org-apex-001');
  }

  public getInvoicesByOrg(orgId: string): Invoice[] {
    return this.invoices.filter(i => i.organizationId === orgId || orgId === 'org-dpw-rwanda' || orgId === 'org-apex-001');
  }

  public getFuelRecordsByOrg(orgId: string): any[] {
    if (this.fuelRecords.length === 0) {
      this.fuelRecords = [
        { id: 'FUEL-9901', organizationId: 'org-dpw-rwanda', truck: 'RAB 123A (John)', station: 'Shell Dar Port', litres: 220, totalCost: 224.40, kmPerLitre: 3.8, variancePercent: -1.2, createdAt: new Date().toISOString() },
        { id: 'FUEL-9902', organizationId: 'org-dpw-rwanda', truck: 'RAB 456B (Jean Baptiste)', station: 'Total Rusumo', litres: 180, totalCost: 189.00, kmPerLitre: 3.5, variancePercent: 4.8, createdAt: new Date().toISOString() },
        { id: 'FUEL-9903', organizationId: 'org-dpw-rwanda', truck: 'RAD 789C (Eric)', station: 'Engen Kigali DC', litres: 250, totalCost: 255.00, kmPerLitre: 3.9, variancePercent: 0.0, createdAt: new Date().toISOString() },
      ];
    }
    return this.fuelRecords;
  }

  public getCorridorsByOrg(orgId: string): any[] {
    if (this.corridors.length === 0) {
      this.corridors = [
        {
          id: 'CORR-01',
          organizationId: 'org-dpw-rwanda',
          name: 'Dar Port → Rusumo Border → Kigali DC',
          dist: '1,450 km',
          checkpointsCount: 6,
          avgHours: 42,
          status: 'OPEN',
          liveCondition: 'Rusumo Border Clearance Active',
          checkpoints: [
            { id: 'CP-1', name: 'Dar es Salaam Port Terminal', slaHours: 2, geofenceRadiusKm: 1, status: 'NORMAL' },
            { id: 'CP-2', name: 'Morogoro Weighbridge', slaHours: 1, geofenceRadiusKm: 0.5, status: 'NORMAL' },
            { id: 'CP-3', name: 'Dodoma Inspection Hub', slaHours: 2, geofenceRadiusKm: 0.8, status: 'NORMAL' },
            { id: 'CP-4', name: 'Rusumo Border OSBP Crossing', slaHours: 12, geofenceRadiusKm: 2, status: 'IN_TRANSIT' },
            { id: 'CP-5', name: 'Kabuga Geofence Checkpoint', slaHours: 1, geofenceRadiusKm: 0.5, status: 'NORMAL' },
            { id: 'CP-6', name: 'Kigali Inland Container Depot (DP World)', slaHours: 2, geofenceRadiusKm: 1, status: 'NORMAL' },
          ],
        },
        {
          id: 'CORR-02',
          organizationId: 'org-dpw-rwanda',
          name: 'Mombasa Port → Kampala → Nemba → Kigali',
          dist: '1,720 km',
          checkpointsCount: 8,
          avgHours: 54,
          status: 'CAUTION',
          liveCondition: 'Nemba Border Customs Queue',
          checkpoints: [
            { id: 'CP-11', name: 'Mombasa Ocean Terminal', slaHours: 3, geofenceRadiusKm: 1, status: 'NORMAL' },
            { id: 'CP-12', name: 'Malaba Border Post', slaHours: 14, geofenceRadiusKm: 2, status: 'NORMAL' },
            { id: 'CP-13', name: 'Kampala Logistics Hub', slaHours: 6, geofenceRadiusKm: 1, status: 'NORMAL' },
            { id: 'CP-14', name: 'Nemba Border Crossing', slaHours: 10, geofenceRadiusKm: 1.5, status: 'DELAYED' },
          ],
        },
      ];
    }
    return this.corridors;
  }

  public getLoadingDocksByOrg(orgId: string): any[] {
    if (this.loadingDocks.length === 0) {
      this.loadingDocks = [
        { id: 'DOCK-01', organizationId: 'org-dpw-rwanda', name: 'Kigali ICD Dock Bay 1', shipment: 'SHP-2026-10018', truck: 'RAD 789C', operator: 'Eric N.', status: 'LOADING', progress: 65 },
        { id: 'DOCK-02', organizationId: 'org-dpw-rwanda', name: 'Kigali ICD Dock Bay 2', shipment: 'SHP-2026-10025', truck: 'RAE 101D', operator: 'Jean K.', status: 'UNLOADED', progress: 100 },
        { id: 'DOCK-03', organizationId: 'org-dpw-rwanda', name: 'Dar Inland Dock 4', shipment: 'RWA-2026-000125', truck: 'RAB 123A', operator: 'John M.', status: 'DEPARTED', progress: 100 },
      ];
    }
    return this.loadingDocks;
  }

  public getInventoryByOrg(orgId: string): any[] {
    if (this.inventoryItems.length === 0) {
      this.inventoryItems = [
        { id: 'inv-1', organizationId: 'org-dpw-rwanda', skuCode: 'SKU-8471-001', description: 'Refrigerated Commercial Freight', binLocation: 'WH-A-Zone-04', quantity: 32, unitType: 'Pallets', weightKg: 24000, status: 'READY_FOR_DISPATCH', createdAt: new Date().toISOString() },
        { id: 'inv-2', organizationId: 'org-dpw-rwanda', skuCode: 'SKU-8471-002', description: 'Specialty Coffee Beans (Export Grade)', binLocation: 'WH-B-Zone-02', quantity: 40, unitType: 'Crates', weightKg: 28000, status: 'IN_STOCK', createdAt: new Date().toISOString() },
        { id: 'inv-3', organizationId: 'org-dpw-rwanda', skuCode: 'SKU-8471-003', description: 'Commercial Electronics & Telecommunication Gear', binLocation: 'WH-C-Zone-01', quantity: 150, unitType: 'Boxes', weightKg: 14200, status: 'IN_STOCK', createdAt: new Date().toISOString() },
      ];
    }
    return this.inventoryItems;
  }

  public getMaintenanceByOrg(orgId: string): any[] {
    if (this.maintenanceOrders.length === 0) {
      this.maintenanceOrders = [
        { id: 'MAIN-701', organizationId: 'org-dpw-rwanda', truckId: 'truck-rwa-4', truckReg: 'RAE 101D', serviceType: 'Routine Brake & Engine Oil Service', scheduledDate: '2026-10-02', estimatedCost: 450, serviceCenter: 'Kigali Volvo Service Depot', status: 'IN_SERVICE', notes: 'Scheduled 20,000 km routine preventive service.' },
      ];
    }
    return this.maintenanceOrders;
  }
}

// Global Singleton Instance
export const db = new LogisticsDatabase();
