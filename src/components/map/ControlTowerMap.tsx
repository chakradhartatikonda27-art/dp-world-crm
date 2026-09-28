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
  distanceRemainingKm: number;
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
      <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800">
        <div className="text-xs text-slate-400 font-mono animate-pulse">Initializing Control Tower Spatial Map...</div>
      </div>
    );
  }

  // Dynamic import of Leaflet components for SSR safety
  const { MapContainer, TileLayer, Marker, Popup, Polyline } = require('react-leaflet');
  const L = require('leaflet');

  const customIcon = L.divIcon({
    className: 'custom-truck-marker',
    html: `<div style="background-color: #0284c7; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px #0284c7;"></div>`,
    iconSize: [14, 14],
  });

  const centerLat = vehicles.length > 0 ? vehicles[0].latitude : -1.9441;
  const centerLng = vehicles.length > 0 ? vehicles[0].longitude : 30.0619;

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative z-0 isolate">
      <MapContainer center={[centerLat, centerLng]} zoom={5} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {vehicles.map((v) => (
          <React.Fragment key={v.shipmentId}>
            <Marker position={[v.latitude, v.longitude]} icon={customIcon}>
              <Popup>
                <div className="p-1 space-y-1 text-xs">
                  <div className="font-bold text-sky-400 flex items-center justify-between">
                    <span>{v.shipmentNumber}</span>
                    <span className="text-[10px] px-1 bg-sky-500/20 rounded text-sky-300">{v.status}</span>
                  </div>
                  <div className="text-slate-300 font-medium">{v.customerName}</div>
                  <div className="text-slate-400 text-[11px]">Truck: {v.truckRegistration} | Driver: {v.driverName}</div>
                  <div className="text-slate-400 text-[11px]">Speed: <span className="text-emerald-400 font-mono font-bold">{v.speedKmh} km/h</span></div>
                  <div className="text-slate-400 text-[11px]">Remaining: <span className="text-amber-400 font-mono font-bold">{v.distanceRemainingKm} km</span></div>
                  {onSelectShipment && (
                    <button
                      onClick={() => onSelectShipment(v.shipmentId)}
                      className="w-full mt-2 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-[11px] font-semibold"
                    >
                      Inspect Shipment
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
              pathOptions={{ color: v.status === 'DELAYED' ? '#f43f5e' : '#0284c7', weight: 2, dashArray: '4, 4', opacity: 0.6 }}
            />
          </React.Fragment>
        ))}
      </MapContainer>

      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 z-20 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span>Live GPS Vehicles ({vehicles.length})</span>
      </div>
    </div>
  );
};
