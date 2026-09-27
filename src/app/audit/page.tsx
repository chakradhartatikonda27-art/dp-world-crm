'use client';

import React from 'react';
import { Lock, ShieldCheck, Eye, Terminal } from 'lucide-react';

export default function AuditPage() {
  const logs = [
    { time: '14:32:10', user: 'Mohan Kumar', action: 'STATUS_CHANGE (LOADING -> LOADED)', target: 'SHP-2026-10012', ip: '10.2.4.18' },
    { time: '14:28:05', user: 'John Mwangi', action: 'DIGITAL_POD_SIGNATURE_CAPTURED', target: 'SHP-2026-10009', ip: 'Mobile PWA' },
    { time: '14:20:00', user: 'SYSTEM_AUTOMATION', action: 'ETA_RECALCULATED (+2h 45m)', target: 'SHP-2026-10020', ip: 'Worker Core' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Lock className="w-5 h-5 text-indigo-400" />
            <span>Audit Trail & Security Event Log</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Immutable Audit Log • SOC2 Security Audit • IP Fingerprinting</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[10px] font-semibold">
              <th className="p-3">Time</th>
              <th className="p-3">User</th>
              <th className="p-3">Action Description</th>
              <th className="p-3">Object Reference</th>
              <th className="p-3">IP / Device Origin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
            {logs.map((l, idx) => (
              <tr key={idx} className="hover:bg-slate-800/40">
                <td className="p-3 text-slate-400">{l.time}</td>
                <td className="p-3 font-sans font-medium text-slate-200">{l.user}</td>
                <td className="p-3 font-bold text-sky-400">{l.action}</td>
                <td className="p-3 text-slate-300">{l.target}</td>
                <td className="p-3 text-slate-500">{l.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
