'use client';

import React from 'react';
import { Package, Clock, CheckSquare, ShieldCheck } from 'lucide-react';

export default function LoadingPage() {
  const docks = [
    { id: 'DOCK-01', name: 'Kigali DC Dock 1', shipment: 'SHP-2026-10012', truck: 'RAB123A', status: 'LOADING', progress: '65%', operator: 'Eric N.' },
    { id: 'DOCK-02', name: 'Kigali DC Dock 2', shipment: 'SHP-2026-10018', truck: 'AP39TX9211', status: 'INSPECTION', progress: '90%', operator: 'Jean K.' },
    { id: 'DOCK-03', name: 'Dar Inland Dock 4', shipment: 'SHP-2026-10022', truck: 'KA01AB4455', status: 'UNLOADING', progress: '30%', operator: 'Amani M.' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Package className="w-5 h-5 text-sky-400" />
            <span>Cargo Loading & Dock Operations</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Dock Scheduling • Weight Bridge Verification • Seal Verification • Tally Sheets</p>
        </div>
        <button className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold">
          + Assign Loading Dock
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {docks.map((d) => (
          <div key={d.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-sky-400">{d.id}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
                {d.status}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-100">{d.name}</h3>
            <div className="space-y-1 text-xs text-slate-400">
              <div>Shipment: <strong className="text-slate-200 font-mono">{d.shipment}</strong></div>
              <div>Truck: <strong className="text-slate-200 font-mono">{d.truck}</strong></div>
              <div>Dock Operator: <span className="text-slate-300">{d.operator}</span></div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Progress</span>
                <span className="font-mono font-bold text-sky-400">{d.progress}</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: d.progress }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
