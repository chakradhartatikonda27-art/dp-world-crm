'use client';

import React from 'react';
import { Users2, Building2, Phone, Mail, ExternalLink } from 'lucide-react';

export default function ClientsPage() {
  const clients = [
    { id: 'CLI-001', name: 'Global Mining Corp', contact: 'Marc V. (Ops Manager)', email: 'ops@globalmining.com', phone: '+250 788 123 456', activeShipments: 12, rateTier: 'PREMIUM_A' },
    { id: 'CLI-002', name: 'Trans-Continental Retail', contact: 'Sarah K. (Logistics Lead)', email: 'logistics@transcont.com', phone: '+254 712 987 654', activeShipments: 8, rateTier: 'STANDARD_B' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-sky-400" />
            <span>Client Portal & CRM Account Registry</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Multi-Tenant Client Accounts • Portal Credentials • Custom Rate Cards</p>
        </div>
        <button className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold">
          + Add New Client Account
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clients.map((c) => (
          <div key={c.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-sky-400">{c.id}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                {c.rateTier}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-100">{c.name}</h3>
            <div className="space-y-1 text-xs text-slate-400">
              <div>Primary Contact: <strong className="text-slate-200">{c.contact}</strong></div>
              <div>Email: <span className="text-slate-300 font-mono">{c.email}</span></div>
              <div>Phone: <span className="text-slate-300 font-mono">{c.phone}</span></div>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Active Shipments: <strong className="text-emerald-400 font-mono">{c.activeShipments}</strong></span>
              <button className="text-sky-400 hover:underline flex items-center space-x-1">
                <span>Open Portal View</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
