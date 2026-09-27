'use client';

import React from 'react';
import { Boxes, QrCode, Layers, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function WarehousePage() {
  const inventory = [
    { sku: 'SKU-8471-001', name: 'Industrial Steel Coils', location: 'WH-A-Zone-04', qty: '120 Units', weight: '24,500 kg', status: 'READY_FOR_DISPATCH' },
    { sku: 'SKU-8471-002', name: 'Commercial Electronics Pallets', location: 'WH-B-Zone-02', qty: '450 Boxes', weight: '8,200 kg', status: 'IN_STOCK' },
    { sku: 'SKU-8471-003', name: 'Solar Panel Assemblies', location: 'WH-C-Zone-01', qty: '80 Crates', weight: '14,100 kg', status: 'PUTAWAY_PENDING' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Boxes className="w-5 h-5 text-sky-400" />
            <span>Warehouse & Inventory Control</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Bin Location Management • Pick & Pack • Cross-Docking • QR Scanning</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold">
            Inbound Receipt
          </button>
          <button className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold">
            Outbound Dispatch
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[10px] font-semibold">
              <th className="p-3">SKU Code</th>
              <th className="p-3">Item Description</th>
              <th className="p-3">Bin Location</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Weight</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
            {inventory.map((i) => (
              <tr key={i.sku} className="hover:bg-slate-800/40">
                <td className="p-3 font-bold text-sky-400">{i.sku}</td>
                <td className="p-3 font-sans font-medium text-slate-200">{i.name}</td>
                <td className="p-3 font-sans text-slate-400">{i.location}</td>
                <td className="p-3">{i.qty}</td>
                <td className="p-3 text-slate-300">{i.weight}</td>
                <td className="p-3 font-sans">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30">
                    {i.status.replace(/_/g, ' ')}
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
