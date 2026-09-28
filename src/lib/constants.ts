import { ShipmentStatus, UserRole, Permission } from '@/types';

export const VALID_SHIPMENT_TRANSITIONS: Record<ShipmentStatus, ShipmentStatus[]> = {
  DRAFT: ['BOOKED', 'CANCELLED'],
  BOOKED: ['CONFIRMED', 'DOCUMENTS_PENDING', 'CANCELLED'],
  CONFIRMED: ['DOCUMENTS_PENDING', 'TRUCK_PENDING', 'TRUCK_ASSIGNED', 'CANCELLED'],
  DOCUMENTS_PENDING: ['TRUCK_PENDING', 'TRUCK_ASSIGNED', 'ON_HOLD', 'CANCELLED'],
  TRUCK_PENDING: ['TRUCK_ASSIGNED', 'CANCELLED'],
  TRUCK_ASSIGNED: ['DRIVER_ASSIGNED', 'READY_FOR_LOADING', 'CANCELLED'],
  DRIVER_ASSIGNED: ['READY_FOR_LOADING', 'AT_ORIGIN', 'CANCELLED'],
  READY_FOR_LOADING: ['AT_ORIGIN', 'LOADING_STARTED', 'CANCELLED'],
  AT_ORIGIN: ['LOADING_STARTED', 'CANCELLED'],
  LOADING_STARTED: ['LOADED', 'DELAYED', 'ON_HOLD'],
  LOADED: ['DEPARTED', 'DELAYED'],
  DEPARTED: ['IN_TRANSIT', 'CHECKPOINT', 'DELAYED'],
  IN_TRANSIT: ['CHECKPOINT', 'BORDER_ARRIVED', 'AT_DESTINATION', 'DELIVERED', 'DELAYED', 'ON_HOLD'],
  CHECKPOINT: ['IN_TRANSIT', 'BORDER_ARRIVED', 'AT_DESTINATION', 'DELIVERED', 'DELAYED'],
  BORDER_ARRIVED: ['BORDER_PROCESSING', 'DELAYED'],
  BORDER_PROCESSING: ['BORDER_DEPARTED', 'DELAYED', 'ON_HOLD'],
  BORDER_DEPARTED: ['IN_TRANSIT', 'AT_DESTINATION', 'DELIVERED', 'DELAYED'],
  AT_DESTINATION: ['UNLOADING_STARTED', 'DELIVERED', 'DELAYED'],
  UNLOADING_STARTED: ['UNLOADED', 'DELAYED'],
  UNLOADED: ['POD_PENDING', 'DELIVERED'],
  POD_PENDING: ['DELIVERED', 'ON_HOLD'],
  DELIVERED: ['INVOICED', 'CLOSED'],
  INVOICED: ['PAID', 'CLOSED'],
  PAID: ['CLOSED'],
  CLOSED: [],
  CANCELLED: [],
  ON_HOLD: ['IN_TRANSIT', 'READY_FOR_LOADING', 'POD_PENDING', 'CANCELLED'],
  DELAYED: ['IN_TRANSIT', 'AT_DESTINATION', 'BORDER_PROCESSING', 'LOADING_STARTED', 'UNLOADING_STARTED'],
};

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    'shipment.view', 'shipment.create', 'shipment.edit', 'shipment.assign', 'shipment.cancel', 'shipment.track',
    'driver.view', 'driver.create', 'driver.assign',
    'truck.view', 'truck.create', 'truck.maintenance',
    'invoice.view', 'invoice.create', 'invoice.approve', 'invoice.send',
    'exception.view', 'exception.create', 'exception.resolve',
    'analytics.view', 'workflow.manage', 'audit.view'
  ],
  ORG_ADMIN: [
    'shipment.view', 'shipment.create', 'shipment.edit', 'shipment.assign', 'shipment.cancel', 'shipment.track',
    'driver.view', 'driver.create', 'driver.assign',
    'truck.view', 'truck.create', 'truck.maintenance',
    'invoice.view', 'invoice.create', 'invoice.approve', 'invoice.send',
    'exception.view', 'exception.create', 'exception.resolve',
    'analytics.view', 'workflow.manage', 'audit.view'
  ],
  OPERATIONS_MANAGER: [
    'shipment.view', 'shipment.create', 'shipment.edit', 'shipment.assign', 'shipment.cancel', 'shipment.track',
    'driver.view', 'driver.assign', 'truck.view', 'truck.maintenance',
    'invoice.view', 'invoice.create', 'exception.view', 'exception.create', 'exception.resolve',
    'analytics.view', 'workflow.manage'
  ],
  OPERATIONS_EXECUTIVE: [
    'shipment.view', 'shipment.create', 'shipment.edit', 'shipment.assign', 'shipment.track',
    'driver.view', 'truck.view', 'exception.view', 'exception.create'
  ],
  FLEET_MANAGER: [
    'truck.view', 'truck.create', 'truck.maintenance', 'driver.view', 'driver.create', 'driver.assign',
    'shipment.view', 'shipment.track', 'analytics.view'
  ],
  DISPATCHER: [
    'shipment.view', 'shipment.assign', 'shipment.track', 'driver.view', 'driver.assign',
    'truck.view', 'exception.view', 'exception.create'
  ],
  DRIVER: [
    'shipment.view', 'shipment.track', 'driver.view'
  ],
  WAREHOUSE_MANAGER: [
    'shipment.view', 'shipment.track', 'exception.view', 'exception.create'
  ],
  WAREHOUSE_OPERATOR: [
    'shipment.view', 'shipment.track'
  ],
  FINANCE_MANAGER: [
    'invoice.view', 'invoice.create', 'invoice.approve', 'invoice.send', 'shipment.view', 'analytics.view'
  ],
  FINANCE_EXECUTIVE: [
    'invoice.view', 'invoice.create', 'invoice.send', 'shipment.view'
  ],
  CUSTOMER_ADMIN: [
    'shipment.view', 'shipment.create', 'shipment.track', 'invoice.view'
  ],
  CUSTOMER_USER: [
    'shipment.view', 'shipment.track', 'invoice.view'
  ],
  MANAGEMENT_VIEWER: [
    'shipment.view', 'shipment.track', 'analytics.view', 'truck.view', 'driver.view', 'invoice.view', 'audit.view'
  ]
};
