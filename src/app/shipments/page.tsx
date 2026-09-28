'use client';

import React, { useState, useEffect } from 'react';
import { ShipmentTable } from '@/components/shipments/ShipmentTable';
import { ShipmentDetailDrawer } from '@/components/shipments/ShipmentDetailDrawer';
import { CreateShipmentModal } from '@/components/shipments/CreateShipmentModal';
import { Shipment, ShipmentStatus, ShipmentTimelineEvent } from '@/types';
import { Boxes, Plus, Search, Filter } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ShipmentsPage() {
  const { currentRole } = useAuth();
  const canCreateShipment = ['ORG_ADMIN', 'SUPER_ADMIN', 'OPERATIONS_MANAGER', 'DISPATCHER', 'CUSTOMER_ADMIN'].includes(currentRole);

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [timeline, setTimeline] = useState<ShipmentTimelineEvent[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const orgId = 'org-apex-001';

  const loadShipments = () => {
    fetch(`/api/v1/shipments?organizationId=${orgId}&status=${statusFilter}&search=${search}`)
      .then((res) => res.json())
      .then((data) => setShipments(data.shipments || []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadShipments();
  }, [statusFilter, search]);

  const handleSelectShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    fetch(`/api/v1/shipments/${shipment.id}`)
      .then((res) => res.json())
      .then((data) => setTimeline(data.timeline || []));
  };

  const handleTransitionStatus = async (shipmentId: string, status: ShipmentStatus, remarks: string = 'Updated status via Shipments Portal') => {
    const res = await fetch(`/api/v1/shipments/${shipmentId}/transition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetStatus: status, remarks }),
    });
    const data = await res.json();
    if (data.success) {
      loadShipments();
      if (selectedShipment?.id === shipmentId) {
        handleSelectShipment(data.shipment);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Boxes className="w-5 h-5 text-sky-400" />
            <span>Shipments Management Workspace</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete lifecycle registry for all active, in-transit, delivered, and delayed shipments.
          </p>
        </div>

        {canCreateShipment && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-lg shadow-sky-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create Booking</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by shipment #, container, customer, truck..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {['ALL', 'BOOKED', 'IN_TRANSIT', 'CHECKPOINT', 'BORDER_PROCESSING', 'DELIVERED', 'DELAYED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                statusFilter === st ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-950 dark:bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      <ShipmentTable
        shipments={shipments}
        onSelectShipment={handleSelectShipment}
        onTransition={handleTransitionStatus}
      />

      <ShipmentDetailDrawer
        shipment={selectedShipment}
        onClose={() => setSelectedShipment(null)}
        onTransitionStatus={handleTransitionStatus}
        timeline={timeline}
      />

      <CreateShipmentModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreateShipment={async (payload) => {
          await fetch('/api/v1/shipments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...payload, organizationId: orgId }),
          });
          loadShipments();
        }}
        customers={[
          { id: 'cust-1', name: 'Global Mining Corp' },
          { id: 'cust-2', name: 'Trans-Continental Retail' },
          { id: 'cust-3', name: 'Apex Agro Exporters' },
        ]}
      />
    </div>
  );
}
