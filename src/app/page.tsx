'use client';

import React, { useState, useEffect } from 'react';
import { ControlTowerMap } from '@/components/map/ControlTowerMap';
import { ShipmentTable } from '@/components/shipments/ShipmentTable';
import { ShipmentDetailDrawer } from '@/components/shipments/ShipmentDetailDrawer';
import { CreateShipmentModal } from '@/components/shipments/CreateShipmentModal';
import { Shipment, ShipmentStatus, ShipmentTimelineEvent, ExceptionItem } from '@/types';
import {
  Truck,
  MapPin,
  Clock,
  AlertTriangle,
  Plus,
  Play,
  RefreshCw,
  TrendingUp,
  ShieldAlert,
  Zap,
} from 'lucide-react';

export default function ControlTowerDashboard() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [liveVehicles, setLiveVehicles] = useState<any[]>([]);
  const [exceptions, setExceptions] = useState<ExceptionItem[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [timeline, setTimeline] = useState<ShipmentTimelineEvent[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const orgId = 'org-apex-001';

  const loadData = () => {
    fetch(`/api/v1/shipments?organizationId=${orgId}&status=${filterStatus}`)
      .then((res) => res.json())
      .then((data) => setShipments(data.shipments || []))
      .catch((err) => console.error(err));

    fetch(`/api/v1/tracking/live?organizationId=${orgId}`)
      .then((res) => res.json())
      .then((data) => setLiveVehicles(data.vehicles || []))
      .catch((err) => console.error(err));

    fetch(`/api/v1/exceptions?organizationId=${orgId}`)
      .then((res) => res.json())
      .then((data) => setExceptions(data.exceptions || []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [filterStatus]);

  const handleSelectShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    fetch(`/api/v1/shipments/${shipment.id}`)
      .then((res) => res.json())
      .then((data) => setTimeline(data.timeline || []));
  };

  const handleTransitionStatus = async (shipmentId: string, status: ShipmentStatus, remarks: string = 'Status updated via Control Tower') => {
    try {
      const res = await fetch(`/api/v1/shipments/${shipmentId}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetStatus: status, remarks, userName: 'Operations Dispatcher' }),
      });
      const data = await res.json();
      if (data.success) {
        loadData();
        if (selectedShipment?.id === shipmentId) {
          handleSelectShipment(data.shipment);
        }
      } else {
        alert(`State Transition Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateShipment = async (payload: any) => {
    try {
      const res = await fetch('/api/v1/shipments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, organizationId: orgId }),
      });
      const data = await res.json();
      if (data.success) {
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSimulateTelemetryPing = async () => {
    setIsSimulating(true);
    const activeShp = shipments.find((s) => s.status === 'IN_TRANSIT') || shipments[0];
    if (activeShp && activeShp.truckId) {
      const nextLat = activeShp.origin.latitude + (activeShp.destination.latitude - activeShp.origin.latitude) * 0.98;
      const nextLng = activeShp.origin.longitude + (activeShp.destination.longitude - activeShp.origin.longitude) * 0.98;

      await fetch('/api/v1/tracking/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: orgId,
          truckId: activeShp.truckId,
          driverId: activeShp.driverId,
          shipmentId: activeShp.id,
          latitude: nextLat,
          longitude: nextLng,
          speed: 68,
          heading: 140,
        }),
      });
      loadData();
    }
    setTimeout(() => setIsSimulating(false), 800);
  };

  const delayedCount = shipments.filter((s) => s.status === 'DELAYED').length;
  const inTransitCount = shipments.filter((s) => s.status === 'IN_TRANSIT').length;
  const borderCount = shipments.filter((s) => s.status === 'BORDER_PROCESSING').length;

  return (
    <div className="space-y-6 bg-white text-slate-900 min-h-screen">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-500">Total Active</div>
            <div className="text-xl font-bold font-mono text-slate-900">{shipments.length}</div>
          </div>
          <div className="p-2 bg-sky-50 text-sky-600 rounded-lg border border-sky-100">
            <Truck className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-500">In Transit</div>
            <div className="text-xl font-bold font-mono text-sky-600">{inTransitCount}</div>
          </div>
          <div className="p-2 bg-sky-50 text-sky-600 rounded-lg border border-sky-100">
            <MapPin className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-500">At Border</div>
            <div className="text-xl font-bold font-mono text-amber-600">{borderCount}</div>
          </div>
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg border border-amber-100">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-500">SLA Delayed</div>
            <div className="text-xl font-bold font-mono text-rose-600">{delayedCount}</div>
          </div>
          <div className="p-2 bg-rose-50 text-rose-600 rounded-lg border border-rose-100">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-xl flex items-center justify-between shadow-sm col-span-2 sm:col-span-1">
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-500">Open Exceptions</div>
            <div className="text-xl font-bold font-mono text-amber-600">{exceptions.length}</div>
          </div>
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg border border-amber-100">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Control Tower Map & Exceptions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Map Column */}
        <div className="lg:col-span-2 h-[320px] sm:h-[420px]">
          <ControlTowerMap vehicles={liveVehicles} onSelectShipment={(id) => {
            const found = shipments.find((s) => s.id === id);
            if (found) handleSelectShipment(found);
          }} />
        </div>

        {/* Real-time Exception & Operations Alert Sidebar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between h-[340px] sm:h-[420px] shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-xs text-slate-900">Control Tower Live Alerts</h3>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                {exceptions.length} Active
              </span>
            </div>

            <div className="mt-3 space-y-2 overflow-y-auto max-h-[290px] pr-1">
              {exceptions.map((exc) => (
                <div key={exc.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sky-600">{exc.shipmentNumber}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                      exc.severity === 'CRITICAL' || exc.severity === 'HIGH' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {exc.severity}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-900">{exc.type.replace(/_/g, ' ')}</div>
                  <div className="text-[11px] text-slate-500">{exc.rootCause}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Simulation Bar */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={handleSimulateTelemetryPing}
              disabled={isSimulating}
              className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-md shadow-sky-500/20 transition-all"
            >
              <Zap className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>Simulate Driver GPS Ping &amp; Geofence Entry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Shipments Section */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Active Operations Roster</h2>
            <span className="text-xs text-slate-500 font-mono">({shipments.length} records)</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center bg-slate-100 border border-slate-200 p-1 rounded-xl text-xs font-semibold">
              {['ALL', 'IN_TRANSIT', 'BORDER_PROCESSING', 'DELAYED', 'DELIVERED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                    filterStatus === st
                      ? 'bg-sky-600 text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1 shadow-md shadow-sky-500/20 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>New Booking</span>
            </button>
          </div>
        </div>

        <ShipmentTable
          shipments={shipments}
          onSelectShipment={handleSelectShipment}
          onTransition={handleTransitionStatus}
        />
      </div>

      {/* Slide-over Detail Drawer */}
      <ShipmentDetailDrawer
        shipment={selectedShipment}
        onClose={() => setSelectedShipment(null)}
        onTransitionStatus={handleTransitionStatus}
        timeline={timeline}
      />

      {/* Booking Modal */}
      <CreateShipmentModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreateShipment={handleCreateShipment}
        customers={[
          { id: 'cust-1', name: 'Global Mining Corp' },
          { id: 'cust-2', name: 'Trans-Continental Retail' },
          { id: 'cust-3', name: 'Apex Agro Exporters' },
        ]}
      />
    </div>
  );
}
