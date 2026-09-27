'use client';

import React, { useState } from 'react';
import { Shipment, ShipmentTimelineEvent, ShipmentStatus } from '@/types';
import { VALID_SHIPMENT_TRANSITIONS } from '@/lib/constants';
import { X, ArrowRight, Truck, User, Calendar, MapPin, CheckCircle, Clock, AlertTriangle, FileText, Send } from 'lucide-react';

interface ShipmentDetailDrawerProps {
  shipment: Shipment | null;
  onClose: () => void;
  onTransitionStatus: (shipmentId: string, status: ShipmentStatus, remarks: string) => void;
  timeline: ShipmentTimelineEvent[];
}

export const ShipmentDetailDrawer: React.FC<ShipmentDetailDrawerProps> = ({
  shipment,
  onClose,
  onTransitionStatus,
  timeline,
}) => {
  const [remarks, setRemarks] = useState('');
  const [selectedNextStatus, setSelectedNextStatus] = useState<ShipmentStatus | ''>('');

  if (!shipment) return null;

  const allowedTransitions = VALID_SHIPMENT_TRANSITIONS[shipment.status] || [];

  const handleApplyTransition = () => {
    if (!selectedNextStatus) return;
    onTransitionStatus(shipment.id, selectedNextStatus as ShipmentStatus, remarks || `Updated status to ${selectedNextStatus}`);
    setSelectedNextStatus('');
    setRemarks('');
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-mono font-bold text-sky-400">{shipment.shipmentNumber}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-semibold border border-sky-500/20">
              {shipment.status.replace(/_/g, ' ')}
            </span>
          </div>
          <div className="text-xs text-slate-400 font-medium">{shipment.customerName}</div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Scroll */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* State Machine Transition Controls */}
        {allowedTransitions.length > 0 && (
          <div className="p-4 bg-slate-850 rounded-xl border border-sky-500/30 space-y-3">
            <div className="text-xs font-bold text-sky-400 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Execute Validated State Transition</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allowedTransitions.map((nextSt) => (
                <button
                  key={nextSt}
                  onClick={() => setSelectedNextStatus(nextSt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    selectedNextStatus === nextSt
                      ? 'bg-sky-600 text-white border-sky-400 shadow-lg shadow-sky-500/30'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-sky-500'
                  }`}
                >
                  → {nextSt.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
            {selectedNextStatus && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Mandatory transition audit notes / driver remarks..."
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200"
                />
                <button
                  onClick={handleApplyTransition}
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs flex items-center justify-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Confirm Transition to {selectedNextStatus.replace(/_/g, ' ')}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Route Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Origin Point</div>
            <div className="font-bold text-slate-200 text-xs mt-1">{shipment.origin.name}</div>
            <div className="text-[10px] text-slate-400 font-mono">Lat: {shipment.origin.latitude}, Lng: {shipment.origin.longitude}</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Destination Point</div>
            <div className="font-bold text-slate-200 text-xs mt-1">{shipment.destination.name}</div>
            <div className="text-[10px] text-slate-400 font-mono">Lat: {shipment.destination.latitude}, Lng: {shipment.destination.longitude}</div>
          </div>
        </div>

        {/* Cargo & Specs */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
          <div className="text-xs font-semibold text-slate-300 border-b border-slate-800 pb-1">Cargo & Container Details</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div><span className="text-slate-500">Cargo Type:</span> <span className="text-slate-200 font-medium">{shipment.cargoType}</span></div>
            <div><span className="text-slate-500">Weight:</span> <span className="text-slate-200 font-mono">{shipment.weightKg.toLocaleString()} kg</span></div>
            <div><span className="text-slate-500">Volume:</span> <span className="text-slate-200 font-mono">{shipment.volumeCbm} cbm</span></div>
            <div><span className="text-slate-500">Container:</span> <span className="text-sky-400 font-mono font-semibold">{shipment.containerNumber}</span></div>
            <div><span className="text-slate-500">Seal #:</span> <span className="text-slate-200 font-mono">{shipment.sealNumber}</span></div>
            <div><span className="text-slate-500">Mode:</span> <span className="text-slate-200 font-medium">{shipment.transportMode}</span></div>
          </div>
        </div>

        {/* Dispatch Assignment */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-slate-800 rounded-lg text-sky-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">{shipment.truckRegistration || 'No Truck Assigned'}</div>
              <div className="text-xs text-slate-400">{shipment.driverName ? `Driver: ${shipment.driverName} (${shipment.driverPhone})` : 'Driver Unassigned'}</div>
            </div>
          </div>
        </div>

        {/* Immutable Audit Timeline */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-300 flex items-center justify-between border-b border-slate-800 pb-1">
            <span>Immutable Audit Timeline Events</span>
            <span className="text-[10px] text-slate-500">{timeline.length} records</span>
          </div>

          <div className="space-y-3 pl-2 border-l-2 border-slate-800">
            {timeline.map((evt) => (
              <div key={evt.id} className="relative pl-4 space-y-1">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-sky-500 ring-4 ring-slate-900" />
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{evt.eventType.replace(/_/g, ' ')}</span>
                  <span className="text-[10px] font-mono text-slate-500">{new Date(evt.timestamp).toLocaleString()}</span>
                </div>
                <div className="text-xs text-slate-400">{evt.remarks}</div>
                <div className="text-[10px] text-slate-500">Source: <span className="text-slate-400">{evt.source}</span> by <span className="text-slate-300">{evt.userName || 'System'}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
