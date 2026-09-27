'use client';

import React, { useEffect, useState } from 'react';
import { ControlTowerMap } from '@/components/map/ControlTowerMap';
import { RefreshCw, MapPin, Truck, AlertTriangle, Play, Pause } from 'lucide-react';

export default function LiveTrackingPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [isLive, setIsLive] = useState(true);

  const fetchTrackingData = () => {
    fetch('/api/v1/tracking/live?organizationId=org-dpw-rwanda')
      .then((res) => res.json())
      .then((data) => {
        setVehicles(data.vehicles || []);
        setLastUpdate(new Date().toLocaleTimeString());
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchTrackingData();
    const interval = setInterval(() => {
      if (isLive) fetchTrackingData();
    }, 5000);
    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-sky-400" />
            <span>Live GPS Tracking & Geofencing</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time IoT telemetry stream • Active moving fleet across East African Corridors
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-xs font-mono text-slate-400">
            Last ping: <span className="text-slate-200">{lastUpdate || 'Updating...'}</span>
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border transition-all ${
              isLive
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
          >
            {isLive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isLive ? 'Live Streaming' : 'Paused'}</span>
          </button>
          <button
            onClick={fetchTrackingData}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs border border-slate-700"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map & Vehicle Stream Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Map Container */}
        <div className="lg:col-span-2 h-full">
          <ControlTowerMap vehicles={vehicles} />
        </div>

        {/* Live Active Telemetry Stream */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <Truck className="w-4 h-4 text-sky-400" />
              <span>Active Vehicles ({vehicles.length})</span>
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded">
              GPS Frequency 5s
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pt-3 pr-1">
            {vehicles.map((v) => (
              <div
                key={v.shipmentId}
                className="bg-slate-950/60 border border-slate-800/80 hover:border-sky-500/40 p-3 rounded-lg text-xs space-y-2 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-200">{v.truckRegistration}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-mono">
                    {v.status}
                  </span>
                </div>

                <div className="text-slate-400 text-[11px] truncate">
                  Shipment: <span className="text-sky-400 font-mono">{v.shipmentNumber}</span> • {v.customerName}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900/80 p-2 rounded border border-slate-800/50">
                  <div>
                    <span className="text-slate-500 block text-[10px]">SPEED</span>
                    <span className="font-mono font-bold text-emerald-400">{v.speedKmh} km/h</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">REMAINING</span>
                    <span className="font-mono font-bold text-amber-400">{v.distanceRemainingKm} km</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 flex items-center justify-between">
                  <span>Driver: {v.driverName}</span>
                  <span>{v.origin.name} → {v.destination.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
