'use client';

import React, { useState, useEffect } from 'react';
import { Fuel, Plus, X, RefreshCw, Edit3, Trash2 } from 'lucide-react';
import { FuelRecord } from '@/types';

export default function FuelPage() {
  const [records, setRecords] = useState<FuelRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFillModal, setShowFillModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FuelRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state for add
  const [truck, setTruck] = useState('RAB 123 A');
  const [driver, setDriver] = useState('John Mwangi');
  const [station, setStation] = useState('Shell Dar Port');
  const [litres, setLitres] = useState('200');
  const [totalCost, setTotalCost] = useState('210.00');
  const [distanceKm, setDistanceKm] = useState('750');

  // Form state for edit
  const [editTruck, setEditTruck] = useState('');
  const [editStation, setEditStation] = useState('');
  const [editLitres, setEditLitres] = useState('');
  const [editCost, setEditCost] = useState('');

  const orgId = 'org-apex-001';

  const fetchFuel = () => {
    setLoading(true);
    fetch(`/api/v1/fuel?organizationId=${orgId}`)
      .then((res) => res.json())
      .then((data) => {
        setRecords(data.fuelRecords || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchFuel();
  }, []);

  const handleRecordFuel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!truck.trim() || !station.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/fuel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: orgId,
          truck: truck.trim(),
          driver: driver.trim(),
          station: station.trim(),
          litres: Number(litres),
          totalCost: Number(totalCost),
          distanceKm: Number(distanceKm),
        }),
      });
      if (res.ok) {
        setShowFillModal(false);
        fetchFuel();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditFuelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/fuel', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingRecord.id,
          truck: editTruck.trim(),
          station: editStation.trim(),
          litres: Number(editLitres),
          totalCost: Number(editCost),
        }),
      });
      if (res.ok) {
        setEditingRecord(null);
        fetchFuel();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFuelRecord = async (id: string) => {
    if (!confirm('Are you sure you want to delete this fuel record?')) return;
    try {
      const res = await fetch(`/api/v1/fuel?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchFuel();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (r: FuelRecord) => {
    setEditingRecord(r);
    setEditTruck(r.truck);
    setEditStation(r.station);
    setEditLitres(r.litres.toString());
    setEditCost(r.totalCost.toString());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Fuel className="w-5 h-5 text-amber-500 shrink-0" />
            <span>Fuel Management &amp; Variance Audit</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            IoT Fuel sensors • Digital Card reconciliation • Theft/Leakage detection • Efficiency benchmarks.
          </p>
        </div>

        <button
          onClick={() => setShowFillModal(true)}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-md transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record Fuel Fill</span>
        </button>
      </div>

      {/* Fuel Records Table */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-sky-500" />
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto min-w-full">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-semibold">
                  <th className="p-3">Record ID</th>
                  <th className="p-3">Truck / Driver</th>
                  <th className="p-3">Station</th>
                  <th className="p-3">Litres</th>
                  <th className="p-3">Total Cost</th>
                  <th className="p-3">Km/L Efficiency</th>
                  <th className="p-3">Variance</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3 font-bold text-sky-600 dark:text-sky-400">{r.id}</td>
                    <td className="p-3 font-sans font-medium text-slate-900 dark:text-slate-200">
                      {r.truck} {r.driver ? <span className="text-slate-500 dark:text-slate-400">({r.driver})</span> : null}
                    </td>
                    <td className="p-3 font-sans text-slate-500 dark:text-slate-400">{r.station}</td>
                    <td className="p-3">{r.litres} L</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">${r.totalCost.toFixed(2)}</td>
                    <td className="p-3">{r.kmPerLitre} km/L</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.variancePercent > 0
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {r.variancePercent > 0 ? `+${r.variancePercent}%` : `${r.variancePercent}%`}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => openEditModal(r)}
                          className="p-1 text-slate-400 hover:text-sky-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Edit Fuel Record"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteFuelRecord(r.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Delete Fuel Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Fuel Modal */}
      {showFillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center space-x-2">
                <Fuel className="w-4 h-4 text-amber-500" />
                <span>Record Fuel Fill Log</span>
              </h3>
              <button onClick={() => setShowFillModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordFuel} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Truck Reg *</label>
                  <input
                    type="text"
                    required
                    value={truck}
                    onChange={(e) => setTruck(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Driver Name</label>
                  <input
                    type="text"
                    value={driver}
                    onChange={(e) => setDriver(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Station Location *</label>
                <input
                  type="text"
                  required
                  value={station}
                  onChange={(e) => setStation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Litres</label>
                  <input
                    type="number"
                    value={litres}
                    onChange={(e) => setLitres(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={totalCost}
                    onChange={(e) => setTotalCost(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Dist (km)</label>
                  <input
                    type="number"
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowFillModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Record Fill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Fuel Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-amber-500" />
                <span>Edit Fuel Record ({editingRecord.id})</span>
              </h3>
              <button onClick={() => setEditingRecord(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditFuelSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Truck Registration</label>
                <input
                  type="text"
                  required
                  value={editTruck}
                  onChange={(e) => setEditTruck(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Fuel Station</label>
                <input
                  type="text"
                  required
                  value={editStation}
                  onChange={(e) => setEditStation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Litres</label>
                  <input
                    type="number"
                    value={editLitres}
                    onChange={(e) => setEditLitres(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Total Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editCost}
                    onChange={(e) => setEditCost(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
