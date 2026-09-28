'use client';

import React from 'react';
import { CheckCircle2, ShieldCheck, FileCheck, Smartphone } from 'lucide-react';

export default function PodPage() {
  const pods = [
    { id: 'POD-7701', shipment: 'SHP-2026-10009', recipient: 'Kigali Distribution Center', timestamp: '2026-09-27 14:28:10', driver: 'John Mwangi', gpsMatch: 'MATCHED (0m)', invoiceTrigger: 'RELEASED' },
    { id: 'POD-7702', shipment: 'SHP-2026-10014', recipient: 'EastLink Logistics Warehouse', timestamp: '2026-09-26 11:15:42', driver: 'Ravi Kumar', gpsMatch: 'MATCHED (12m)', invoiceTrigger: 'RELEASED' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Proof of Delivery (POD) Verification</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Digital Signatures • Photo Evidence • Geofence Audit • Automatic Invoice Release</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-white/60 text-slate-400 uppercase text-[10px] font-semibold">
              <th className="p-3">POD ID</th>
              <th className="p-3">Shipment</th>
              <th className="p-3">Recipient Signee</th>
              <th className="p-3">Timestamp</th>
              <th className="p-3">Driver</th>
              <th className="p-3">Geofence Match</th>
              <th className="p-3">Invoice Trigger</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
            {pods.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/40">
                <td className="p-3 font-bold text-sky-400">{p.id}</td>
                <td className="p-3 font-mono text-slate-300">{p.shipment}</td>
                <td className="p-3 font-sans font-medium text-slate-200">{p.recipient}</td>
                <td className="p-3 text-slate-400">{p.timestamp}</td>
                <td className="p-3 font-sans text-slate-300">{p.driver}</td>
                <td className="p-3 text-emerald-400 font-bold">{p.gpsMatch}</td>
                <td className="p-3 font-sans">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {p.invoiceTrigger}
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
