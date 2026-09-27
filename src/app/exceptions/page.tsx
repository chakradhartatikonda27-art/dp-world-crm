'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, Clock, UserCheck } from 'lucide-react';
import { ExceptionItem } from '@/types';

export default function ExceptionsPage() {
  const [exceptions, setExceptions] = useState<ExceptionItem[]>([]);
  const orgId = 'org-apex-001';

  const loadExceptions = () => {
    fetch(`/api/v1/exceptions?organizationId=${orgId}`)
      .then((res) => res.json())
      .then((data) => setExceptions(data.exceptions || []));
  };

  useEffect(() => {
    loadExceptions();
  }, []);

  const handleResolve = async (id: string) => {
    const res = await fetch('/api/v1/exceptions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exceptionId: id, status: 'RESOLVED', resolution: 'Resolved by Operations Lead.' }),
    });
    const data = await res.json();
    if (data.success) loadExceptions();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <span>Operational Exception Management Workbench</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor and resolve stationary truck alerts, border customs delays, ETA breaches, and missing documents.
        </p>
      </div>

      <div className="space-y-3">
        {exceptions.map((exc) => (
          <div key={exc.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-sky-400 text-sm">{exc.shipmentNumber}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  exc.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  {exc.severity} SEVERITY
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold text-[10px]">
                  {exc.status}
                </span>
              </div>
              <div className="font-bold text-slate-200 text-xs">{exc.type.replace(/_/g, ' ')}</div>
              <div className="text-xs text-slate-400">{exc.rootCause}</div>
            </div>

            {exc.status !== 'RESOLVED' && (
              <button
                onClick={() => handleResolve(exc.id)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 shrink-0"
              >
                Mark Resolved
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
