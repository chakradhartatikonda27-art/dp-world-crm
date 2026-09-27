'use client';

import React from 'react';
import { Fuel, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

export default function FuelPage() {
  const records = [
    { id: 'FUEL-9901', truck: 'RAB123A', driver: 'John Mwangi', station: 'Shell Dar Port', litres: 220, cost: '$224.40', kmPerLitre: 3.8, variance: '-1.2%' },
    { id: 'FUEL-9902', truck: 'AP39TX9211', driver: 'Ravi Kumar', station: 'Total Rusumo', litres: 180, cost: '$189.00', kmPerLitre: 3.5, variance: '+4.8%' },
    { id: 'FUEL-9903', truck: 'KA01AB4455', driver: 'Joseph Otieno', station: 'Engen Kigali DC', litres: 250, cost: '$255.00', kmPerLitre: 3.9, variance: '0.0%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Fuel className="w-5 h-5 text-amber-400 shrink-0" />
            <span>Fuel Management &amp; Variance Audit</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">IoT Fuel sensors • Digital Card reconciliation • Theft/Leakage detection</p>
        </div>
        <button className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shrink-0">
          + Record Fuel Fill
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden overflow-x-auto min-w-full">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[10px] font-semibold">
              <th className="p-3">Record ID</th>
              <th className="p-3">Truck / Driver</th>
              <th className="p-3">Station</th>
              <th className="p-3">Litres</th>
              <th className="p-3">Total Cost</th>
              <th className="p-3">Km/L Efficiency</th>
              <th className="p-3">Variance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
            {records.map((r) => (
              <tr key={r.id} className="hover:bg-slate-800/40">
                <td className="p-3 font-bold text-sky-400">{r.id}</td>
                <td className="p-3 font-sans font-medium text-slate-200">{r.truck} ({r.driver})</td>
                <td className="p-3 font-sans text-slate-400">{r.station}</td>
                <td className="p-3">{r.litres} L</td>
                <td className="p-3 text-emerald-400 font-bold">{r.cost}</td>
                <td className="p-3">{r.kmPerLitre} km/L</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    r.variance.startsWith('+') ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {r.variance}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
