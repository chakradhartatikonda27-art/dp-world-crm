'use client';

import React, { useState } from 'react';
import { TrendingUp, DollarSign, Percent, Award, Clock, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function ProductivityPage() {
  const [period, setPeriod] = useState<'THIS_MONTH' | 'LAST_QUARTER' | 'YTD'>('THIS_MONTH');

  const stats = {
    THIS_MONTH: { revenue: 142500, cost: 98200, margin: 31.1, onTime: 96.4, completedTrips: 184 },
    LAST_QUARTER: { revenue: 410000, cost: 285000, margin: 30.4, onTime: 95.1, completedTrips: 540 },
    YTD: { revenue: 1250000, cost: 860000, margin: 31.2, onTime: 96.0, completedTrips: 1620 },
  }[period];

  const netProfit = stats.revenue - stats.cost;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>Productivity &amp; Margin Performance</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Financial yield analysis, net profit margins, fleet utilization, and operational SLA achievements.
          </p>
        </div>

        {/* Period filter */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
          {(['THIS_MONTH', 'LAST_QUARTER', 'YTD'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                period === p
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {p.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Gross Revenue</div>
          <div className="text-xl font-bold font-mono text-slate-900">
            ${stats.revenue.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-500 font-semibold flex items-center space-x-0.5">
            <ArrowUpRight className="w-3 h-3" />
            <span>+8.4% vs prev period</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Operating Costs</div>
          <div className="text-xl font-bold font-mono text-amber-600">
            ${stats.cost.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 font-medium">Fuel, Maintenance &amp; Subcontractors</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Net Profit Margin</div>
          <div className="text-xl font-bold font-mono text-emerald-600">
            ${netProfit.toLocaleString()} ({stats.margin}%)
          </div>
          <div className="text-[10px] text-emerald-500 font-semibold">Target: &gt; 25.0%</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">On-Time SLA Rate</div>
          <div className="text-xl font-bold font-mono text-sky-600">
            {stats.onTime}%
          </div>
          <div className="text-[10px] text-slate-400 font-mono">{stats.completedTrips} trips completed</div>
        </div>
      </div>

      {/* Margin Breakdown Card */}
      <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-sm">
        <h3 className="font-bold text-slate-900 text-sm">Corridor Yield &amp; Cost Contribution</h3>
        <div className="space-y-3 text-xs">
          <div>
            <div className="flex justify-between mb-1 text-slate-700 font-medium">
              <span>Dar es Salaam → Kigali Corridor</span>
              <span className="font-mono text-emerald-600 font-bold">$68,400 (34.2% Margin)</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '68%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1 text-slate-700 font-medium">
              <span>Mombasa → Kampala → Kigali Corridor</span>
              <span className="font-mono text-emerald-600 font-bold">$49,100 (29.8% Margin)</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-sky-500 rounded-full" style={{ width: '52%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1 text-slate-700 font-medium">
              <span>Local Rwanda Warehouse &amp; Inland Distribution</span>
              <span className="font-mono text-emerald-600 font-bold">$25,000 (28.5% Margin)</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: '35%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
