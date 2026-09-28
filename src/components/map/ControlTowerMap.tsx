'use client';

import React, { useEffect, useState } from 'react';

interface VehicleLocation {
  shipmentId: string;
  shipmentNumber: string;
  customerName: string;
  status: string;
  priority: string;
  truckRegistration: string;
  driverName: string;
  origin: { name: string; latitude: number; longitude: number };
  destination: { name: string; latitude: number; longitude: number };
  latitude: number;
  longitude: number;
  speedKmh: number;
  heading?: number;
  directionText?: string;
  distanceRemainingKm: number;
  etaText?: string;
  lastUpdateText?: string;
  batteryLevel?: number;
  networkStatus?: string;
  locationName?: string;
  geofenceStatus?: string;
}

interface ControlTowerMapProps {
  vehicles: VehicleLocation[];
  onSelectShipment?: (shipmentId: string) => void;
}

export const ControlTowerMap: React.FC<ControlTowerMapProps> = ({ vehicles, onSelectShipment }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full bg-white rounded-xl flex items-center justify-center border border-slate-200">
        <div className="text-xs text-slate-500 font-mono animate-pulse">Initializing Control Tower Spatial Map...</div>
      </div>
    );
  }

  // Dynamic import of Leaflet components for SSR safety
  const { MapContainer, TileLayer, Marker, Popup, Polyline } = require('react-leaflet');
  const L = require('leaflet');

  const customIcon = L.divIcon({
    className: 'custom-truck-marker',
    html: `<div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background: rgba(14, 165, 233, 0.4); animation: radar-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="position: relative; background-color: #0284c7; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 14px #0284c7; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; z-index: 2;">🚛</div>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const centerLat = vehicles.length > 0 ? vehicles[0].latitude : -2.3845;
  const centerLng = vehicles.length > 0 ? vehicles[0].longitude : 30.7850;

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-slate-200 shadow-sm relative z-0 isolate bg-white">
      <MapContainer center={[centerLat, centerLng]} zoom={7} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {vehicles.map((v) => (
          <React.Fragment key={v.shipmentId}>
            <Marker position={[v.latitude, v.longitude]} icon={customIcon}>
              <Popup>
                <div className="p-1 space-y-1.5 text-xs font-sans min-w-[220px]">
                  <div className="font-bold text-sky-600 flex items-center justify-between border-b border-slate-200 pb-1">
                    <span>🚛 Truck 001 ({v.truckRegistration})</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold rounded border border-emerald-200">
                      {v.status}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-lg text-[11px] space-y-0.5 border border-slate-200 text-slate-800">
                    <div><strong>Shipment ID:</strong> <span className="font-mono text-sky-600 font-bold">{v.shipmentNumber}</span></div>
                    <div><strong>Location:</strong> <span className="text-amber-600 font-bold">{v.locationName || 'Rusumo Border'}</span></div>
                    <div><strong>Driver:</strong> {v.driverName}</div>
                    <div><strong>Speed:</strong> <span className="font-mono text-emerald-600 font-bold">{v.speedKmh} km/h</span></div>
                    <div><strong>Distance:</strong> <span className="font-mono text-amber-600 font-bold">{v.distanceRemainingKm} km</span></div>
                    <div><strong>ETA:</strong> <span className="font-mono font-bold text-indigo-600">{v.etaText || '14:30'}</span></div>
                    <div><strong>Last update:</strong> <span className="font-mono text-slate-500">{v.lastUpdateText || '14:22'}</span></div>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-slate-500 pt-1">
                    <div>Lat: {v.latitude.toFixed(4)}</div>
                    <div>Lng: {v.longitude.toFixed(4)}</div>
                    <div>Battery: {v.batteryLevel || 94}%</div>
                    <div>Signal: 4G Online</div>
                  </div>

                  {onSelectShipment && (
                    <button
                      onClick={() => onSelectShipment(v.shipmentId)}
                      className="w-full mt-2 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-[11px] font-semibold transition"
                    >
                      Inspect Live Telemetry
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>

            {/* Route Polyline connecting origin to vehicle to destination */}
            <Polyline
              positions={[
                [v.origin.latitude, v.origin.longitude],
                [v.latitude, v.longitude],
                [v.destination.latitude, v.destination.longitude],
              ]}
              pathOptions={{ color: v.status === 'DELAYED' ? '#f43f5e' : '#0284c7', weight: 3, dashArray: '6, 6', opacity: 0.8 }}
            />
          </React.Fragment>
        ))}
      </MapContainer>

      {/* Map Overlay Badge */}
      <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur-md border border-slate-200 p-2.5 rounded-xl shadow-md text-slate-900 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-bold text-emerald-700">Rusumo Border Live Feed</span>
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5">Lat: -2.3845 • Lng: 30.7850 • 4G Cellular</div>
      </div>
    </div>
  );
};
