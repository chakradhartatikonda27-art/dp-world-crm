'use client';

import React from 'react';
import { Tag, DollarSign, Calendar, ArrowRight } from 'lucide-react';

export default function QuotesPage() {
  const quotes = [
    { id: 'QT-2026-041', client: 'DP World Rwanda', route: 'Dar es Salaam → Kigali', cargo: '2x 40ft High Cube Container', amount: '$3,850.00', status: 'SENT', validUntil: '2026-10-15' },
    { id: 'QT-2026-042', client: 'Square Freight', route: 'Mombasa → Kampala', cargo: '28T Heavy Equipment', amount: '$4,200.00', status: 'ACCEPTED', validUntil: '2026-10-10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Tag className="w-5 h-5 text-sky-400" />
            <span>Quotes & Rate Engine Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Automated Tariffs • Fuel Surcharge Matrix • Accessorial Calculation • Instant Booking Conversion</p>
        </div>
        <button className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold">
          + Generate New Quote
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[10px] font-semibold">
              <th className="p-3">Quote #</th>
              <th className="p-3">Client</th>
              <th className="p-3">Corridor / Route</th>
              <th className="p-3">Cargo Spec</th>
              <th className="p-3">Quoted Amount</th>
              <th className="p-3">Valid Until</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
            {quotes.map((q) => (
              <tr key={q.id} className="hover:bg-slate-800/40">
                <td className="p-3 font-bold text-sky-400">{q.id}</td>
                <td className="p-3 font-sans font-medium text-slate-200">{q.client}</td>
                <td className="p-3 font-sans text-slate-300">{q.route}</td>
                <td className="p-3 font-sans text-slate-400">{q.cargo}</td>
                <td className="p-3 text-emerald-400 font-bold">{q.amount}</td>
                <td className="p-3 text-slate-400">{q.validUntil}</td>
                <td className="p-3 font-sans">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    q.status === 'ACCEPTED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                  }`}>
                    {q.status}
                  </span>
                </td>
                <td className="p-3 font-sans">
                  <button className="px-2 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-[10px] font-semibold">
                    Convert to Booking
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
