'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Plus, X, RefreshCw, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';
import { ExceptionItem } from '@/types';

export default function ExceptionsPage() {
  const [exceptions, setExceptions] = useState<ExceptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'OPEN' | 'RESOLVED'>('ALL');

  // Modals
  const [showReportModal, setShowReportModal] = useState(false);
  const [resolvingException, setResolvingException] = useState<ExceptionItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [shipmentNumber, setShipmentNumber] = useState('SHP-2026-10012');
  const [type, setType] = useState<'STATIONARY_TOO_LONG' | 'DRIVER_OFFLINE' | 'ROUTE_DEVIATION' | 'ETA_BREACH' | 'BORDER_DELAY' | 'VEHICLE_BREAKDOWN'>('BORDER_DELAY');
  const [severity, setSeverity] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [rootCause, setRootCause] = useState('Heavy customs clearance backlog at border post.');

  // Resolve state
  const [resolutionText, setResolutionText] = useState('');

  const orgId = 'org-apex-001';

  const fetchExceptions = () => {
    setLoading(true);
    fetch(`/api/v1/exceptions?organizationId=${orgId}`)
      .then((res) => res.json())
      .then((data) => {
        setExceptions(data.exceptions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchExceptions();
  }, []);

  const handleReportException = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipmentNumber.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/exceptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: orgId,
          shipmentNumber: shipmentNumber.trim(),
          type,
          severity,
          rootCause,
          status: 'OPEN',
        }),
      });
      if (res.ok) {
        setShowReportModal(false);
        fetchExceptions();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolveException = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingException) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/v1/exceptions/${resolvingException.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'RESOLVED',
          resolution: resolutionText.trim() || 'Exception addressed by operations manager.',
        }),
      });
      if (res.ok) {
        setResolvingException(null);
        setResolutionText('');
        fetchExceptions();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredExceptions = exceptions.filter((e) => {
    if (activeFilter === 'OPEN') return e.status === 'OPEN' || e.status === 'IN_PROGRESS';
    if (activeFilter === 'RESOLVED') return e.status === 'RESOLVED' || e.status === 'CLOSED';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
            <span>Operational Exception Workbench</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time incident response, route deviation alerts, border delays, breakdowns &amp; root cause resolution.
          </p>
        </div>

        <button
          onClick={() => setShowReportModal(true)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-md transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Report New Exception</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {(['ALL', 'OPEN', 'RESOLVED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeFilter === tab
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-rose-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {filteredExceptions.map((exc) => (
            <div
              key={exc.id}
              className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400">{exc.id}</span>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      exc.severity === 'CRITICAL' || exc.severity === 'HIGH'
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {exc.severity}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      exc.status === 'OPEN'
                        ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                    }`}
                  >
                    {exc.status}
                  </span>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{exc.type.replace(/_/g, ' ')}</h3>
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                <div>
                  Shipment: <strong className="text-slate-800 dark:text-slate-200 font-mono">{exc.shipmentNumber}</strong>
                </div>
                <div>
                  Root Cause: <span className="text-slate-700 dark:text-slate-300">{exc.rootCause || 'Under investigation.'}</span>
                </div>
                {exc.resolution && (
                  <div className="text-emerald-600 dark:text-emerald-400">
                    Resolution: <strong>{exc.resolution}</strong>
                  </div>
                )}
              </div>

              {exc.status === 'OPEN' && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setResolvingException(exc);
                      setResolutionText(exc.resolution || '');
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md transition"
                  >
                    Resolve Incident
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Report Exception Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Report Operational Exception</span>
              </h3>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReportException} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Shipment Number *</label>
                <input
                  type="text"
                  required
                  placeholder="SHP-2026-10012"
                  value={shipmentNumber}
                  onChange={(e) => setShipmentNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Exception Type</label>
                  <select
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="BORDER_DELAY">Border Delay</option>
                    <option value="STATIONARY_TOO_LONG">Stationary Too Long</option>
                    <option value="VEHICLE_BREAKDOWN">Vehicle Breakdown</option>
                    <option value="ROUTE_DEVIATION">Route Deviation</option>
                    <option value="ETA_BREACH">ETA Breach</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Severity Level</label>
                  <select
                    value={severity}
                    onChange={(e: any) => setSeverity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Root Cause Description</label>
                <textarea
                  rows={3}
                  value={rootCause}
                  onChange={(e) => setRootCause(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Reporting...' : 'Report Incident'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolve Exception Modal */}
      {resolvingException && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Resolve Incident #{resolvingException.id}</span>
              </h3>
              <button onClick={() => setResolvingException(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResolveException} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Resolution Actions Taken *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Contacted border customs agent to fast-track approval."
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setResolvingException(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Resolving...' : 'Confirm Resolution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
