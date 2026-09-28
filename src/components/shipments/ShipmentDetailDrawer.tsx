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
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[55] bg-slate-950/60 backdrop-blur-xs" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl z-[60] flex flex-col">
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

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Origin Point</span>
              <div className="text-xs font-bold text-slate-200">{shipment.origin.name}</div>
              <div className="text-[10px] text-slate-500 font-mono">
                Lat: {shipment.origin.latitude}, Lng: {shipment.origin.longitude}
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Destination Point</span>
              <div className="text-xs font-bold text-slate-200">{shipment.destination.name}</div>
              <div className="text-[10px] text-slate-500 font-mono">
                Lat: {shipment.destination.latitude}, Lng: {shipment.destination.longitude}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Cargo Type</span>
              <span className="text-slate-200 font-semibold">{shipment.cargoType}</span>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Weight</span>
              <span className="text-slate-200 font-mono font-semibold">
                {shipment.weightKg ? `${shipment.weightKg.toLocaleString()} kg` : 'N/A'}
              </span>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Volume</span>
              <span className="text-slate-200 font-mono font-semibold">
                {shipment.volumeCbm ? `${shipment.volumeCbm} cbm` : 'N/A'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Container #</span>
              <span className="text-sky-400 font-mono font-semibold">{shipment.containerNumber || 'N/A'}</span>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Seal #</span>
              <span className="text-amber-400 font-mono font-semibold">{shipment.sealNumber || 'N/A'}</span>
            </div>
          </div>

          {/* Assigned Driver & Truck */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Assigned Transport Unit</span>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-sky-400" />
                <span className="font-semibold text-slate-200">{shipment.truckRegistration || 'Truck Pending'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-slate-200">{shipment.driverName || 'Driver Unassigned'}</span>
              </div>
            </div>
            {shipment.driverPhone && (
              <div className="text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-850">
                Driver Contact: {shipment.driverPhone}
              </div>
            )}
          </div>

          {/* Immutable Audit Timeline */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Immutable Audit Timeline Events</span>
              <span className="text-[10px] text-slate-500 font-mono">{timeline.length} records</span>
            </div>

            <div className="relative pl-4 space-y-4 border-l border-slate-800">
              {timeline.map((event) => (
                <div key={event.id} className="relative space-y-1">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-sky-500 border-2 border-slate-900" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{event.eventType.replace(/_/g, ' ')}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {event.remarks && <div className="text-xs text-slate-400">{event.remarks}</div>}
                  <div className="text-[10px] text-slate-500 font-mono">
                    Source: <span className="text-slate-400">{event.source}</span>
                    {event.userName && ` by ${event.userName}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
