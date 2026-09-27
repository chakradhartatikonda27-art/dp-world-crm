'use client';

import React from 'react';
import { Zap, Play, Plus, CheckCircle, ShieldAlert } from 'lucide-react';

export default function AutomationPage() {
  const rules = [
    {
      id: 'wf-1',
      name: 'Stationary Truck Delay Alert (>90m)',
      trigger: 'GPS_STATIONARY_WARNING',
      condition: 'duration > 90 min',
      action: 'Create High-Severity Exception Ticket',
      triggersCount: 14,
      status: 'ACTIVE',
    },
    {
      id: 'wf-2',
      name: 'Auto-Invoice Generation on POD Upload',
      trigger: 'POD_COMPLETED',
      condition: 'status == DELIVERED',
      action: 'Generate Customer Freight Invoice & Dispatch Email',
      triggersCount: 42,
      status: 'ACTIVE',
    },
    {
      id: 'wf-3',
      name: 'Destination Geofence Auto Status Advance',
      trigger: 'GEOFENCE_ENTERED',
      condition: 'radius <= 2.0 km',
      action: 'Update Shipment Status to AT_DESTINATION',
      triggersCount: 89,
      status: 'ACTIVE',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>Workflow & Event Automation Engine</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure Event-Condition-Action rules for automated status transitions, exception ticketing, and notification triggers.
          </p>
        </div>

        <button className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-lg shadow-sky-500/20">
          <Plus className="w-4 h-4" />
          <span>New Workflow Rule</span>
        </button>
      </div>

      <div className="space-y-3">
        {rules.map((rule) => (
          <div key={rule.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="font-bold text-slate-100 text-sm">{rule.name}</div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                {rule.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block text-[10px]">EVENT TRIGGER</span>
                <span className="text-sky-400 font-mono font-semibold">{rule.trigger}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">EVALUATION CONDITION</span>
                <span className="text-amber-400 font-mono font-semibold">{rule.condition}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">AUTOMATED ACTION</span>
                <span className="text-emerald-400 font-semibold">{rule.action}</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
              <span>Total Automated Executions: <span className="text-slate-300 font-mono font-bold">{rule.triggersCount} times</span></span>
              <span>Last Execution: 12 minutes ago</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
