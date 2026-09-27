'use client';

import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Award } from 'lucide-react';

export default function ProductivityPage() {
  const drivers = [
    { name: 'John Mwangi', trips: 28, onTime: '97%', revenue: '$42,800', margin: '34.2%', rating: 'A+' },
    { name: 'Ravi Kumar', trips: 25, onTime: '94%', revenue: '$38,200', margin: '31.8%', rating: 'A' },
    { name: 'Joseph Otieno', trips: 22, onTime: '91%', revenue: '$31,500', margin: '28.4%', rating: 'B+' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span>Productivity & Margin Performance</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Asset Utilization • Driver Pay Scorecards • Empty Leg Backhaul Optimization</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[10px] font-semibold">
              <th className="p-3">Driver Name</th>
              <th className="p-3">Trips Completed</th>
              <th className="p-3">On-Time %</th>
              <th className="p-3">Monthly Revenue</th>
              <th className="p-3">Gross Margin</th>
              <th className="p-3">Performance Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
            {drivers.map((d) => (
              <tr key={d.name} className="hover:bg-slate-800/40">
                <td className="p-3 font-sans font-bold text-slate-200">{d.name}</td>
                <td className="p-3">{d.trips}</td>
                <td className="p-3 text-emerald-400 font-bold">{d.onTime}</td>
                <td className="p-3 font-bold text-slate-200">{d.revenue}</td>
                <td className="p-3 text-sky-400 font-bold">{d.margin}</td>
                <td className="p-3 font-sans">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {d.rating}
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
