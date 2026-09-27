'use client';

import React from 'react';
import { Settings, Sliders, CheckCircle2, AlertTriangle, Link2 } from 'lucide-react';

export default function SettingsPage() {
  const integrations = [
    { name: 'OpenStreetMap / Carto Spatial', type: 'GIS Mapping', status: 'CONNECTED' },
    { name: 'IoT Telemetry Stream (Teltonika/CalAmp)', type: 'GPS Hardware', status: 'CONNECTED' },
    { name: 'WhatsApp Business API', type: 'Messaging Engine', status: 'CONNECTED' },
    { name: 'Twilio SMS & Email Gateway', type: 'Notifications', status: 'CONNECTED' },
    { name: 'SAP / Oracle ERP Bridge', type: 'Accounting Sync', status: 'READY' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Settings className="w-5 h-5 text-sky-400" />
            <span>System Settings & API Integration Hub</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Tenant Branding • Timezone (Africa/Kigali) • Currency (USD) • Webhooks</p>
        </div>
        <button className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold">
          Save Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
          <h2 className="text-sm font-bold text-slate-200">Organization Defaults</h2>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Organization Tenant</span>
              <span className="text-slate-100 font-bold">DP World Rwanda</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Operating Timezone</span>
              <span className="text-slate-100 font-bold">Africa/Kigali (UTC+2)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Base Currency</span>
              <span className="text-slate-100 font-bold">USD ($)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">GPS Ping Interval</span>
              <span className="text-emerald-400 font-bold">30 Seconds</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
          <h2 className="text-sm font-bold text-slate-200">API & Hardware Integrations</h2>
          <div className="space-y-2">
            {integrations.map((i) => (
              <div key={i.name} className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                <div>
                  <div className="font-bold text-slate-200">{i.name}</div>
                  <div className="text-[10px] text-slate-400">{i.type}</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {i.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
