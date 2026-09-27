'use client';

import React from 'react';
import { Truck, ShieldCheck, Star, Users, Phone } from 'lucide-react';

export default function VendorsPage() {
  const vendors = [
    { id: 'VEND-01', name: 'Zion Transporters East Africa', fleetSize: 42, rating: 4.9, activeLoads: 6, compliance: 'VERIFIED', contact: 'Musa B. (+255 754 111 222)' },
    { id: 'VEND-02', name: 'Kigali Logistics Express', fleetSize: 18, rating: 4.7, activeLoads: 3, compliance: 'VERIFIED', contact: 'Patrick K. (+250 788 333 444)' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Truck className="w-5 h-5 text-sky-400" />
            <span>Vendors & Subcontracted Transporters</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">3PL Network • Carrier Onboarding • SLA Performance • Auto-Tendering</p>
        </div>
        <button className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold">
          + Add Carrier Partner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vendors.map((v) => (
          <div key={v.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-sky-400">{v.id}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {v.compliance}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-100">{v.name}</h3>
            <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-lg text-xs font-mono">
              <div><span className="text-slate-500 text-[10px] block">FLEET SIZE</span>{v.fleetSize} Trucks</div>
              <div><span className="text-slate-500 text-[10px] block">RATING</span>{v.rating} ★</div>
              <div><span className="text-slate-500 text-[10px] block">ACTIVE LOADS</span>{v.activeLoads} Assigned</div>
            </div>
            <div className="text-xs text-slate-400">
              Contact: <span className="text-slate-300 font-mono">{v.contact}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
