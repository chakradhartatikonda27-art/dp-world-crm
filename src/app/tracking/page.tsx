'use client';

import React, { useEffect, useState } from 'react';
import { ControlTowerMap } from '@/components/map/ControlTowerMap';
import { RefreshCw, MapPin, Truck, AlertTriangle, Play, Pause, Zap, ShieldCheck, Radio, Battery, Compass } from 'lucide-react';

export default function LiveTrackingPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('14:22');
  const [isLive, setIsLive] = useState(true);

  const fetchTrackingData = () => {
    fetch('/api/v1/tracking/live?organizationId=org-dpw-rwanda')
      .then((res) => res.json())
      .then((data) => {
        setVehicles(data.vehicles || []);
        setLastUpdate(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-lg">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-sky-400" />
            <span>Live GPS Tracking &amp; Geofence Automation</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time IoT telemetry stream • Active moving fleet across East African Corridors (Mombasa $\rightarrow$ Dar $\rightarrow$ Kigali)
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-xs font-mono text-slate-500">
            Last update: <span className="text-slate-800 font-bold">{lastUpdate || '14:22'}</span>
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border transition-all ${
              isLive
                ? 'bg-emerald-50 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-50 text-amber-400 border-amber-500/30'
            }`}
          >
            {isLive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isLive ? 'Live Streaming' : 'Paused'}</span>
          </button>
          <button
            onClick={fetchTrackingData}
            className="p-1.5 bg-slate-50 hover:bg-slate-200 text-slate-700 rounded-lg text-xs border border-slate-200 transition"
            title="Refresh Pings"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map & Live Telemetry Stream Grid */}
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6 min-h-[700px] lg:h-[640px]">
        {/* Map Container */}
        <div className="h-[360px] sm:h-[460px] lg:h-full lg:col-span-2">
          <ControlTowerMap vehicles={vehicles} />
        </div>

        {/* Live Active Telemetry & Geofence Panel */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col h-[400px] lg:h-full overflow-hidden shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
            <h2 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
              <Truck className="w-4 h-4 text-sky-400" />
              <span>Live Vehicle Stream ({vehicles.length})</span>
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-400 border border-emerald-500/30 rounded font-bold">
              GPS Ping 5s
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pt-3 pr-1">
            {vehicles.map((v) => (
              <div
                key={v.shipmentId}
                className="bg-white/80 border border-slate-200 hover:border-sky-500/50 p-3.5 rounded-xl text-xs space-y-2.5 transition-all shadow-sm"
              >
                {/* Header info */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sky-400 text-sm font-mono flex items-center space-x-1.5">
                      <span>🚛 Truck 001 ({v.truckRegistration})</span>
                    </div>
                    <div className="text-[11px] text-amber-400 font-bold font-mono">
                      Location: {v.locationName || 'Rusumo Border'}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-50 text-emerald-400 border border-emerald-500/30">
                    {v.status}
                  </span>
                </div>

                {/* Core Shipment Metrics */}
                <div className="text-slate-700 text-[11px] bg-white p-2 rounded-lg border border-slate-200/80 space-y-1">
                  <div className="flex justify-between">
                    <span>Shipment ID:</span>
                    <strong className="text-sky-400 font-mono">{v.shipmentNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Driver:</span>
                    <strong className="text-slate-800">{v.driverName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Target ETA:</span>
                    <strong className="text-indigo-400 font-mono">{v.etaText || '14:30'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Update:</span>
                    <strong className="text-slate-500 font-mono">{v.lastUpdateText || '14:22'}</strong>
                  </div>
                </div>

                {/* Live Telemetry Grid */}
                <div className="grid grid-cols-2 gap-2 text-[10px] bg-white/90 p-2 rounded-lg border border-slate-200 font-mono">
                  <div>
                    <span className="text-slate-500 block text-[9px]">LATITUDE</span>
                    <span className="text-slate-800 font-bold">{v.latitude.toFixed(4)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">LONGITUDE</span>
                    <span className="text-slate-800 font-bold">{v.longitude.toFixed(4)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">SPEED</span>
                    <span className="text-emerald-400 font-bold">{v.speedKmh} km/h</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">DISTANCE REMAINING</span>
                    <span className="text-amber-400 font-bold">{v.distanceRemainingKm} km</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">DIRECTION</span>
                    <span className="text-slate-700">{v.directionText || '285° WNW'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">BATTERY &amp; SIGNAL</span>
                    <span className="text-sky-300">{v.batteryLevel || 94}% • 4G Cellular</span>
                  </div>
                </div>

                {/* System Geofence Automation Rules Triggered */}
                <div className="p-2 bg-sky-950/30 border border-sky-800/40 rounded-lg space-y-1">
                  <div className="text-[10px] uppercase font-bold text-sky-400 flex items-center space-x-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>System Geofencing Automation</span>
                  </div>
                  <div className="text-[10px] text-slate-700 space-y-0.5">
                    <div>• <strong>Port Entry:</strong> Auto status set to <span className="text-emerald-400 font-mono font-bold font-sans">"ARRIVED AT PORT"</span> $\rightarrow$ Client Notification sent.</div>
                    <div>• <strong>Destination Entry:</strong> Auto status set to <span className="text-emerald-400 font-mono font-bold font-sans">"ARRIVED"</span> $\rightarrow$ Warehouse notified $\rightarrow$ Unloading task created.</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
