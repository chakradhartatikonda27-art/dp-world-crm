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
      // Simulate moving closer to destination
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
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">Total Active</div>
            <div className="text-xl font-bold font-mono text-slate-100">{shipments.length}</div>
          </div>
          <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg">
            <Truck className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">In Transit</div>
            <div className="text-xl font-bold font-mono text-sky-400">{inTransitCount}</div>
          </div>
          <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg">
            <MapPin className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">At Border</div>
            <div className="text-xl font-bold font-mono text-amber-400">{borderCount}</div>
          </div>
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">SLA Delayed</div>
            <div className="text-xl font-bold font-mono text-rose-400">{delayedCount}</div>
          </div>
          <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">Open Exceptions</div>
            <div className="text-xl font-bold font-mono text-amber-400">{exceptions.length}</div>
          </div>
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
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
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between h-[340px] sm:h-[420px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-xs text-slate-200">Control Tower Live Alerts</h3>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {exceptions.length} Active
              </span>
            </div>

            <div className="mt-3 space-y-2 overflow-y-auto max-h-[290px] pr-1">
              {exceptions.map((exc) => (
                <div key={exc.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sky-400">{exc.shipmentNumber}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                      exc.severity === 'CRITICAL' || exc.severity === 'HIGH' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {exc.severity}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-200">{exc.type.replace(/_/g, ' ')}</div>
                  <div className="text-[11px] text-slate-400">{exc.rootCause}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Simulation Bar */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={handleSimulateTelemetryPing}
              disabled={isSimulating}
              className="w-full py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-md shadow-sky-500/20 transition-all"
            >
              <Zap className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>Simulate Driver GPS Ping & Geofence Entry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Shipments Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Active Operations Roster</h2>
            <span className="text-xs text-slate-500">({shipments.length} records)</span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {/* Status Filter Tabs */}
            <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-lg text-xs font-semibold overflow-x-auto">
              {['ALL', 'IN_TRANSIT', 'BORDER_PROCESSING', 'DELAYED', 'DELIVERED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    filterStatus === st
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 shadow-md shadow-sky-500/20 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
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
