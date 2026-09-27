'use client';

import React, { useState, useEffect } from 'react';
import { UserSquare2, Star, CheckCircle, Smartphone, Award, Plus } from 'lucide-react';
import { Driver } from '@/types';

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const orgId = 'org-apex-001';

  useEffect(() => {
    fetch(`/api/v1/drivers?organizationId=${orgId}`)
      .then((res) => res.json())
      .then((data) => setDrivers(data.drivers || []));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center space-x-2">
            <UserSquare2 className="w-5 h-5 text-sky-400 shrink-0" />
            <span>Driver Performance &amp; Roster Directory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Operational safety records, license verification status, on-time delivery rates, and active trip assignments.
          </p>
        </div>

        <button className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-lg shadow-sky-500/20 shrink-0">
          <Plus className="w-4 h-4" />
          <span>Register Driver</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {drivers.map((driver) => (
          <div key={driver.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-100 text-sm">{driver.name}</div>
                <div className="text-[10px] text-slate-400 font-mono">License: {driver.licenseNumber}</div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                driver.status === 'AVAILABLE'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
              }`}>
                {driver.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
              <div>
                <span className="text-slate-500 block text-[10px]">On-Time Rate</span>
                <span className="text-emerald-400 font-bold font-mono">{driver.onTimeRatePercent}%</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Rating</span>
                <span className="text-amber-400 font-bold font-mono flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{driver.rating}</span>
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Total Trips</span>
                <span className="text-slate-200 font-mono">{driver.totalTripsCount}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Phone</span>
                <span className="text-slate-300 font-mono text-[10px]">{driver.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
