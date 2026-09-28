'use client';

import React, { useState, useEffect } from 'react';
import { Truck as TruckIcon, Wrench, ShieldCheck, Fuel, AlertCircle, Plus } from 'lucide-react';
import { Truck } from '@/types';

export default function FleetPage() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const orgId = 'org-apex-001';

  useEffect(() => {
    fetch(`/api/v1/trucks?organizationId=${orgId}`)
      .then((res) => res.json())
      .then((data) => setTrucks(data.trucks || []));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center space-x-2">
            <TruckIcon className="w-5 h-5 text-sky-400 shrink-0" />
            <span>Fleet &amp; Vehicle Maintenance Roster</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time vehicle status, odometer tracking, maintenance schedules, and fuel utilization metrics.
          </p>
        </div>

        <button className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-lg shadow-sky-500/20 shrink-0">
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {trucks.map((truck) => (
          <div key={truck.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono font-bold text-slate-100 text-sm">{truck.registrationNumber}</div>
                <div className="text-[10px] text-slate-400">{truck.make} {truck.model} ({truck.year})</div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                truck.status === 'AVAILABLE'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : truck.status === 'IN_TRANSIT'
                  ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                {truck.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
              <div>
                <span className="text-slate-500 block text-[10px]">Body Type</span>
                <span className="text-slate-200 font-semibold">{truck.vehicleType.replace(/_/g, ' ')}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Capacity</span>
                <span className="text-slate-200 font-semibold font-mono">{truck.capacityTons} Tons</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Odometer</span>
                <span className="text-slate-200 font-mono">{truck.odometerKm.toLocaleString()} km</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Fuel Level</span>
                <span className="text-emerald-400 font-mono font-bold">{truck.fuelLevelPercent || 85}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
