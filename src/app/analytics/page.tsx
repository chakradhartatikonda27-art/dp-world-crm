'use client';

import React from 'react';
import { BarChart3, TrendingUp, Clock, AlertTriangle, CheckCircle, Truck, DollarSign } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function AnalyticsPage() {
  const routePerformanceData = [
    { route: 'Kigali → Mombasa', avgHours: 42, onTimePercent: 92 },
    { route: 'Nairobi → Dar es Salaam', avgHours: 36, onTimePercent: 88 },
    { route: 'Kampala → Mombasa', avgHours: 48, onTimePercent: 84 },
    { route: 'Kigali → Gisenyi', avgHours: 12, onTimePercent: 96 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-sky-400" />
          <span>Productivity & Route SLA Analytics</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Operational metrics, border waiting time bottlenecks, fleet utilization, and on-time delivery percentages.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">On-Time Delivery Rate</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">94.2%</div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>+2.4% vs last month</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Average Transit Time</div>
          <div className="text-2xl font-bold font-mono text-sky-400 mt-1">38.5 hrs</div>
          <div className="text-[10px] text-slate-400 mt-1">Across 100 active shipments</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Avg Border Delay</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">4.2 hrs</div>
          <div className="text-[10px] text-amber-400 mt-1">Primary Bottleneck: Malaba Border</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Fleet Utilization</div>
          <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">87.5%</div>
          <div className="text-[10px] text-slate-400 mt-1">44 of 50 trucks active</div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Route Transit Duration & On-Time Performance</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={routePerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="route" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="avgHours" fill="#0284c7" name="Avg Transit Hours" radius={[4, 4, 0, 0]} />
              <Bar dataKey="onTimePercent" fill="#10b981" name="On-Time %" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
