'use client';

import React, { useState, useEffect } from 'react';
import { Route as RouteIcon, MapPin, ArrowRight, Plus, X, RefreshCw, ShieldAlert, CheckCircle } from 'lucide-react';
import { CorridorRoute, RouteCheckpoint } from '@/types';

export default function RoutesPage() {
  const [corridors, setCorridors] = useState<CorridorRoute[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Checkpoint modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCorridorId, setSelectedCorridorId] = useState('');
  const [cpName, setCpName] = useState('');
  const [slaHours, setSlaHours] = useState('2');
  const [geofenceRadius, setGeofenceRadius] = useState('1');
  const [submitting, setSubmitting] = useState(false);

  // View waypoints drawer state
  const [viewingCorridor, setViewingCorridor] = useState<CorridorRoute | null>(null);

  const orgId = 'org-apex-001';

  const fetchCorridors = () => {
    setLoading(true);
    fetch(`/api/v1/routes?organizationId=${orgId}`)
      .then((res) => res.json())
      .then((data) => {
        setCorridors(data.corridors || []);
        if (data.corridors && data.corridors.length > 0 && !selectedCorridorId) {
          setSelectedCorridorId(data.corridors[0].id);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCorridors();
  }, []);

  const handleAddCheckpoint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpName.trim() || !selectedCorridorId) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          corridorId: selectedCorridorId,
          name: cpName.trim(),
          slaHours: Number(slaHours),
          geofenceRadiusKm: Number(geofenceRadius),
          status: 'NORMAL',
        }),
      });
      if (res.ok) {
        setShowAddModal(false);
        setCpName('');
        fetchCorridors();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <RouteIcon className="w-5 h-5 text-sky-500 shrink-0" />
            <span>Routes &amp; Checkpoints Management</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Trade corridor optimization • Border crossing SLAs • Geofenced Rest Stops &amp; Customs Posts.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-md transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Checkpoint</span>
        </button>
      </div>

      {/* Corridor Cards Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-sky-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {corridors.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">{c.id}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    c.status === 'OPEN'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                  }`}
                >
                  {c.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <span>{c.name}</span>
              </h3>

              <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl text-xs font-mono border border-slate-100 dark:border-slate-800/80">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase block font-sans">DISTANCE</span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold">{c.dist}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase block font-sans">CHECKPOINTS</span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold">{c.checkpointsCount || c.checkpoints?.length || 0} Points</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase block font-sans">AVG TIME</span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold">{c.avgHours} Hrs</span>
                </div>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
                <span>
                  Live condition: <strong className="text-slate-800 dark:text-slate-200">{c.liveCondition}</strong>
                </span>
                <button
                  onClick={() => setViewingCorridor(c)}
                  className="text-sky-600 dark:text-sky-400 hover:underline font-semibold flex items-center space-x-1"
                >
                  <span>View Waypoints</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Checkpoint Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-sky-500" />
                <span>Add Route Checkpoint</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCheckpoint} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Target Corridor *</label>
                <select
                  value={selectedCorridorId}
                  onChange={(e) => setSelectedCorridorId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {corridors.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Checkpoint Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kayonza Customs Weighbridge"
                  value={cpName}
                  onChange={(e) => setCpName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">SLA Target (Hours)</label>
                  <input
                    type="number"
                    value={slaHours}
                    onChange={(e) => setSlaHours(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Geofence Radius (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={geofenceRadius}
                    onChange={(e) => setGeofenceRadius(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Add Checkpoint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Waypoints Drawer */}
      {viewingCorridor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-sky-500" />
                  <span>Waypoints for {viewingCorridor.name}</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{viewingCorridor.dist} • {viewingCorridor.avgHours} hrs SLA target</p>
              </div>
              <button onClick={() => setViewingCorridor(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {viewingCorridor.checkpoints && viewingCorridor.checkpoints.length > 0 ? (
                viewingCorridor.checkpoints.map((cp, idx) => (
                  <div
                    key={cp.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-mono font-bold text-[11px]">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100">{cp.name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          SLA: <span className="font-mono">{cp.slaHours} hrs</span> • Radius: <span className="font-mono">{cp.geofenceRadiusKm} km</span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        cp.status === 'NORMAL'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          : cp.status === 'QUEUE'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {cp.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">No check points configured for this corridor.</div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingCorridor(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
