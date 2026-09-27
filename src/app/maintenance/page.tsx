'use client';

import React from 'react';
import { Wrench, Calendar, Clock, CheckCircle2 } from 'lucide-react';

export default function MaintenancePage() {
  const workOrders = [
    { id: 'WO-8801', truck: 'KA01AB4455', service: 'Preventive Maintenance 50K km', vendor: 'FleetCare Workshop', status: 'SCHEDULED', date: '2026-10-02', cost: '$450' },
    { id: 'WO-8802', truck: 'RAB551B', service: 'Brake Pad & Drum Replacement', vendor: 'Kigali Heavy Repair', status: 'IN_PROGRESS', date: 'Today', cost: '$820' },
    { id: 'WO-8803', truck: 'TS08GH7712', service: 'Tyre Rotation & Alignment', vendor: 'Dar Tyre Hub', status: 'COMPLETED', date: '2026-09-24', cost: '$310' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-sky-400" />
            <span>Fleet Maintenance & Work Orders</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Scheduled PMs • Breakdowns • Spare Part Inventories • Maintenance Logs</p>
        </div>
        <button className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold">
          + Schedule Maintenance
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[10px] font-semibold">
              <th className="p-3">Work Order #</th>
              <th className="p-3">Truck</th>
              <th className="p-3">Service Description</th>
              <th className="p-3">Vendor / Workshop</th>
              <th className="p-3">Date</th>
              <th className="p-3">Cost</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
            {workOrders.map((w) => (
              <tr key={w.id} className="hover:bg-slate-800/40">
                <td className="p-3 font-bold text-sky-400">{w.id}</td>
                <td className="p-3 font-sans font-medium text-slate-200">{w.truck}</td>
                <td className="p-3 font-sans text-slate-300">{w.service}</td>
                <td className="p-3 font-sans text-slate-400">{w.vendor}</td>
                <td className="p-3">{w.date}</td>
                <td className="p-3 text-emerald-400 font-bold">{w.cost}</td>
                <td className="p-3 font-sans">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    w.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                    w.status === 'IN_PROGRESS' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                    'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {w.status}
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
