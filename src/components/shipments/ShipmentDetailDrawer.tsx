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
      {/* Backdrop (Starts below Navbar top-16) */}
      <div className="fixed top-16 inset-x-0 bottom-0 z-[8999] bg-white/40 backdrop-blur-xs" onClick={onClose} />

      {/* Drawer Panel (Starts below Navbar top-16) */}
      <div className="fixed top-16 bottom-0 right-0 w-full max-w-2xl bg-white border-l border-slate-200 shadow-2xl z-[9000] flex flex-col h-[calc(100vh-4rem)] text-slate-900">
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-mono font-bold text-sky-600">{shipment.shipmentNumber}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-semibold border border-sky-200">
                {shipment.status.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="text-xs text-slate-500 font-medium">{shipment.customerName}</div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Scroll */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* State Machine Transition Controls */}
          {allowedTransitions.length > 0 && (
            <div className="p-4 bg-slate-50 rounded-xl border border-sky-200 space-y-3">
              <div className="text-xs font-bold text-sky-700 flex items-center space-x-1.5">
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
                        ? 'bg-sky-600 text-white border-sky-400 shadow-md'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-sky-500'
                    }`}
                  >
                    → {nextSt.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
              {selectedNextStatus && (
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <input
                    type="text"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Mandatory transition audit notes / driver remarks..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
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

          {/* Key Overview Cards */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Origin</span>
              <div className="font-bold text-slate-900 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">{shipment.origin.name}</span>
              </div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Destination</span>
              <div className="font-bold text-slate-900 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                <span className="truncate">{shipment.destination.name}</span>
              </div>
            </div>
          </div>

          {/* Assigned Fleet & Driver */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="font-bold text-slate-900 flex items-center space-x-1.5">
              <Truck className="w-4 h-4 text-sky-500" />
              <span>Assigned Vehicle &amp; Driver</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
              <div>
                <span className="text-slate-500 block text-[10px]">Truck Reg:</span>
                <span className="font-bold text-slate-900">{shipment.truckRegistration || 'Unassigned'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Driver:</span>
                <span className="font-bold text-slate-900">{shipment.driverName || 'Unassigned'}</span>
              </div>
            </div>
          </div>

          {/* Timeline History */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-sky-500" />
              <span>Audit Timeline Trail</span>
            </h4>
            <div className="space-y-2 border-l-2 border-slate-200 pl-4 ml-1">
              {timeline.map((evt) => (
                <div key={evt.id} className="relative space-y-0.5 text-xs">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-sky-500 ring-4 ring-white" />
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-900">{evt.eventType.replace(/_/g, ' ')}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-[11px] text-slate-600">{evt.remarks}</div>
                  <div className="text-[10px] text-slate-500 font-mono">Source: {evt.source} • By: {evt.userName || 'System'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
