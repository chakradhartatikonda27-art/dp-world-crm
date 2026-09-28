'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Truck, MapPin, CheckCircle2, AlertTriangle, Camera, Edit3, Navigation, Send, Radio } from 'lucide-react';
import { Shipment, ShipmentStatus } from '@/types';

export default function DriverMobileApp() {
  const [activeShipment, setActiveShipment] = useState<Shipment | null>(null);
  const [recipientName, setRecipientName] = useState('');
  const [notes, setNotes] = useState('');
  const [isPODSubmitted, setIsPODSubmitted] = useState(false);
  const [isSharingGPS, setIsSharingGPS] = useState(true);

  const orgId = 'org-apex-001';

  const loadActiveTrip = () => {
    fetch(`/api/v1/shipments?organizationId=${orgId}&status=IN_TRANSIT`)
      .then((res) => res.json())
      .then((data) => {
        if (data.shipments && data.shipments.length > 0) {
          setActiveShipment(data.shipments[0]);
        }
      });
  };

  useEffect(() => {
    loadActiveTrip();
  }, []);

  const handleDriverStatusUpdate = async (nextStatus: ShipmentStatus, remarkStr: string) => {
    if (!activeShipment) return;
    const res = await fetch(`/api/v1/shipments/${activeShipment.id}/transition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetStatus: nextStatus, remarks: remarkStr, userName: 'Driver John Kabuya' }),
    });
    const data = await res.json();
    if (data.success) {
      setActiveShipment(data.shipment);
    } else {
      alert(`Driver Transition Failed: ${data.error}`);
    }
  };

  const handleSubmitPOD = () => {
    if (!recipientName) return alert('Please enter recipient name');
    setIsPODSubmitted(true);
    handleDriverStatusUpdate('DELIVERED', `POD signed by recipient ${recipientName}. Proof of delivery uploaded.`);
  };

  return (
    <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-0 my-4">
      {/* Mobile Header Bar */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-100 text-xs">Driver Job Console</div>
            <div className="text-[10px] text-slate-400 font-semibold">John (Truck RAB 123A)</div>
          </div>
        </div>

        <button
          onClick={() => setIsSharingGPS(!isSharingGPS)}
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center space-x-1 border ${
            isSharingGPS ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}
        >
          <Radio className="w-3 h-3 animate-pulse" />
          <span>{isSharingGPS ? 'GPS LIVE' : 'GPS OFF'}</span>
        </button>
      </div>

      {activeShipment ? (
        <div className="p-4 space-y-4 text-xs">
          {/* Active Job Card */}
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-sky-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-sky-400 text-sm">{activeShipment.shipmentNumber}</span>
              <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-semibold text-[10px]">
                {activeShipment.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="text-slate-300 font-semibold">{activeShipment.customerName}</div>

            {/* Route */}
            <div className="p-2.5 bg-slate-900 rounded-xl space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-bold truncate">{activeShipment.origin.name}</span>
              </div>
              <div className="pl-2 border-l border-slate-700 ml-1.5 py-0.5 text-[10px] text-slate-500 font-mono">
                Payload: {activeShipment.cargoType} ({activeShipment.weightKg.toLocaleString()} kg)
              </div>
              <div className="flex items-center space-x-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="font-bold truncate">{activeShipment.destination.name}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Touch Buttons */}
          <div className="space-y-2">
            <div className="text-[10px] uppercase font-bold text-slate-400">Driver Action Controls</div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleDriverStatusUpdate('CHECKPOINT', 'Driver passed border checkpoint inspection.')}
                className="py-3 px-3 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl font-bold text-center border border-slate-700"
              >
                🚩 Checkpoint
              </button>
              <button
                onClick={() => handleDriverStatusUpdate('BORDER_ARRIVED', 'Truck arrived at border customs clearing hub.')}
                className="py-3 px-3 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 rounded-xl font-bold text-center border border-amber-500/30"
              >
                🛂 Arrived Border
              </button>
            </div>

            <button
              onClick={() => handleDriverStatusUpdate('AT_DESTINATION', 'Truck arrived at customer destination warehouse.')}
              className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-sky-500/20 flex items-center justify-center space-x-2"
            >
              <Navigation className="w-4 h-4" />
              <span>Arrived at Destination</span>
            </button>
          </div>

          {/* Proof of Delivery (POD) Capture */}
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <div className="font-bold text-slate-200 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Capture Proof of Delivery (POD)</span>
            </div>

            {!isPODSubmitted ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Recipient Name (e.g. David Miller)"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200"
                />

                <div className="grid grid-cols-2 gap-2">
                  <button className="py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 font-semibold flex items-center justify-center space-x-1">
                    <Camera className="w-3.5 h-3.5 text-sky-400" />
                    <span>Upload Cargo Photo</span>
                  </button>
                  <button className="py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 font-semibold flex items-center justify-center space-x-1">
                    <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sign Screen</span>
                  </button>
                </div>

                <button
                  onClick={handleSubmitPOD}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center space-x-1 shadow-lg shadow-emerald-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit POD & Complete Job</span>
                </button>
              </div>
            ) : (
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-bold text-center">
                ✓ Proof of Delivery Uploaded Successfully!
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-400 text-xs">Loading active driver job...</div>
      )}
    </div>
  );
}
