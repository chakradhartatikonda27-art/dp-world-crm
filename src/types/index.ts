export type UserRole =
  | 'SUPER_ADMIN'
  | 'ORG_ADMIN'
  | 'OPERATIONS_MANAGER'
  | 'OPERATIONS_EXECUTIVE'
  | 'FLEET_MANAGER'
  | 'DISPATCHER'
  | 'DRIVER'
  | 'WAREHOUSE_MANAGER'
  | 'WAREHOUSE_OPERATOR'
  | 'FINANCE_MANAGER'
  | 'FINANCE_EXECUTIVE'
  | 'CUSTOMER_ADMIN'
  | 'CUSTOMER_USER'
  | 'MANAGEMENT_VIEWER';

export type Permission =
  | 'shipment.view'
  | 'shipment.create'
  | 'shipment.edit'
  | 'shipment.assign'
  | 'shipment.cancel'
  | 'shipment.track'
  | 'driver.view'
  | 'driver.create'
  | 'driver.assign'
  | 'truck.view'
  | 'truck.create'
  | 'truck.maintenance'
  | 'invoice.view'
  | 'invoice.create'
  | 'invoice.approve'
  | 'invoice.send'
  | 'exception.view'
  | 'exception.create'
  | 'exception.resolve'
  | 'analytics.view'
  | 'workflow.manage'
  | 'audit.view';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  logoUrl?: string;
  currency: string;
  settings: Record<string, any>;
  createdAt: string;
}

export interface User {
  id: string;
  organizationId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
}

export interface Customer {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  creditLimit: number;
  activeShipmentsCount: number;
  createdAt: string;
}

export interface Truck {
  id: string;
  organizationId: string;
  registrationNumber: string;
  vehicleType: 'CONTAINER_33FT' | 'FLATBED_40FT' | 'TANKER' | 'REFRIGERATED' | 'SMALL_VAN';
  capacityTons: number;
  make: string;
  model: string;
  year: number;
  odometerKm: number;
  status: 'AVAILABLE' | 'ASSIGNED' | 'IN_TRANSIT' | 'LOADING' | 'MAINTENANCE' | 'OFFLINE';
  lastServiceDate?: string;
  nextServiceKm?: number;
  fuelLevelPercent?: number;
  gpsDeviceId?: string;
  createdAt: string;
}

export interface Driver {
  id: string;
  organizationId: string;
  userId?: string;
  name: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  assignedTruckId?: string;
  status: 'AVAILABLE' | 'ON_TRIP' | 'OFF_DUTY' | 'REST';
  rating: number;
  onTimeRatePercent: number;
  totalTripsCount: number;
  createdAt: string;
}

export type ShipmentStatus =
  | 'DRAFT'
  | 'BOOKED'
  | 'CONFIRMED'
  | 'DOCUMENTS_PENDING'
  | 'TRUCK_PENDING'
  | 'TRUCK_ASSIGNED'
  | 'DRIVER_ASSIGNED'
  | 'READY_FOR_LOADING'
  | 'AT_ORIGIN'
  | 'LOADING_STARTED'
  | 'LOADED'
  | 'DEPARTED'
  | 'IN_TRANSIT'
  | 'CHECKPOINT'
  | 'BORDER_ARRIVED'
  | 'BORDER_PROCESSING'
  | 'BORDER_DEPARTED'
  | 'AT_DESTINATION'
  | 'UNLOADING_STARTED'
  | 'UNLOADED'
  | 'POD_PENDING'
  | 'DELIVERED'
  | 'INVOICED'
  | 'PAID'
  | 'CLOSED'
  | 'CANCELLED'
  | 'ON_HOLD'
  | 'DELAYED';

export interface LocationCoordinates {
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Shipment {
  id: string;
  organizationId: string;
  shipmentNumber: string;
  customerId: string;
  customerName?: string;
  bookingId?: string;
  
  origin: LocationCoordinates;
  destination: LocationCoordinates;

  cargoType: string;
  cargoDescription: string;
  weightKg: number;
  volumeCbm: number;
  packageCount: number;
  containerNumber?: string;
  sealNumber?: string;
  billOfLadingNumber?: string;
  referenceNumber?: string;
  transportMode: 'ROAD' | 'RAIL' | 'SEA' | 'MULTIMODAL';

  truckId?: string;
  truckRegistration?: string;
  trailerId?: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;

  plannedPickupAt: string;
  actualPickupAt?: string;
  plannedDeliveryAt: string;
  estimatedDeliveryAt: string;
  actualDeliveryAt?: string;

  status: ShipmentStatus;
  priority: 'CRITICAL' | 'HIGH' | 'STANDARD' | 'LOW';

  currentLatitude?: number;
  currentLongitude?: number;
  speedKmh?: number;
  distanceRemainingKm?: number;

  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentTimelineEvent {
  id: string;
  organizationId: string;
  shipmentId: string;
  eventType: string;
  status: ShipmentStatus;
  timestamp: string;
  userId?: string;
  userName?: string;
  latitude?: number;
  longitude?: number;
  source: 'MANUAL' | 'GPS_AUTOMATION' | 'GEOFENCE' | 'DRIVER_APP' | 'SYSTEM';
  remarks?: string;
  metadata?: Record<string, any>;
  attachmentUrls?: string[];
}

export interface GPSPosition {
  id: string;
  organizationId: string;
  truckId: string;
  driverId?: string;
  shipmentId?: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  altitude: number;
  batteryLevel: number;
  timestamp: string;
  source: 'DRIVER_APP' | 'OBD2_HARNESS' | 'SIM_TRIANGULATION';
}

export interface ProofOfDelivery {
  id: string;
  organizationId: string;
  shipmentId: string;
  recipientName: string;
  recipientPhone?: string;
  signatureUrl: string;
  photoUrls: string[];
  notes?: string;
  damageReported: boolean;
  damageNotes?: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface Invoice {
  id: string;
  organizationId: string;
  invoiceNumber: string;
  customerId: string;
  customerName?: string;
  shipmentId: string;
  shipmentNumber?: string;
  subtotalAmount: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  status: 'DRAFT' | 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  dueDate: string;
  createdAt: string;
  lineItems: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
}

export interface ExceptionItem {
  id: string;
  organizationId: string;
  shipmentId: string;
  shipmentNumber: string;
  truckId?: string;
  truckRegistration?: string;
  type:
    | 'STATIONARY_TOO_LONG'
    | 'DRIVER_OFFLINE'
    | 'ROUTE_DEVIATION'
    | 'ETA_BREACH'
    | 'LOADING_DELAY'
    | 'BORDER_DELAY'
    | 'VEHICLE_BREAKDOWN'
    | 'ACCIDENT'
    | 'MISSING_DOCUMENT'
    | 'CARGO_DAMAGE';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  ownerId?: string;
  ownerName?: string;
  rootCause?: string;
  resolution?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface DocumentItem {
  id: string;
  organizationId: string;
  shipmentId: string;
  title: string;
  documentType: 'BILL_OF_LADING' | 'COMMERCIAL_INVOICE' | 'PACKING_LIST' | 'CUSTOMS' | 'POD' | 'OTHER';
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  ocrData?: Record<string, any>;
}

export interface WorkflowRule {
  id: string;
  organizationId: string;
  name: string;
  eventType: string;
  conditionJson: {
    field: string;
    operator: 'EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS';
    value: any;
  };
  actionType: 'CREATE_EXCEPTION' | 'UPDATE_STATUS' | 'SEND_NOTIFICATION';
  actionPayload: Record<string, any>;
  active: boolean;
  triggerCount: number;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  organizationId: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  beforeState?: any;
  afterState?: any;
  ipAddress: string;
  timestamp: string;
}
