'use client';

import React from 'react';
import { Route, MapPin, CheckCircle, ShieldAlert, ArrowRight } from 'lucide-react';

export default function RoutesPage() {
  const corridors = [
    { id: 'CORR-01', name: 'Dar Port → Kigali DC', dist: '1,450 km', checkpoints: 6, status: 'OPEN', avgHours: 42, delays: 'Rusumo Border Queue' },
    { id: 'CORR-02', name: 'Mombasa Port → Kampala → Kigali', dist: '1,720 km', checkpoints: 8, status: 'OPEN', avgHours: 54, delays: 'Normal Flow' },
    { id: 'CORR-03', name: 'Kigali → Bujumbura', dist: '290 km', checkpoints: 3, status: 'CAUTION', avgHours: 12, delays: 'Road Maintenance' },
    { id: 'CORR-04', name: 'Kigali → Goma Border', dist: '160 km', checkpoints: 2, status: 'OPEN', avgHours: 5, delays: 'Normal Flow' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Route className="w-5 h-5 text-sky-400" />
            <span>Routes & Checkpoints Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Corridor optimization • Border crossing SLAs • Geofenced Rest Stops</p>
        </div>
        <button className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold">
          + Add Checkpoint
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {corridors.map((c) => (
          <div key={c.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-sky-400">{c.id}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                c.status === 'OPEN' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>{c.status}</span>
            </div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <span>{c.name}</span>
            </h3>
            <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-lg text-xs font-mono">
              <div><span className="text-slate-500 text-[10px] block">DISTANCE</span>{c.dist}</div>
              <div><span className="text-slate-500 text-[10px] block">CHECKPOINTS</span>{c.checkpoints} Points</div>
              <div><span className="text-slate-500 text-[10px] block">AVG TIME</span>{c.avgHours} Hrs</div>
            </div>
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Live condition: <strong className="text-slate-200">{c.delays}</strong></span>
              <button className="text-sky-400 hover:underline flex items-center space-x-1">
                <span>View Waypoints</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
