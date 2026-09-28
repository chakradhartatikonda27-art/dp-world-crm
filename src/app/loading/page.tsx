'use client';

import React, { useState, useEffect } from 'react';
import { Package, Plus, X, RefreshCw, Edit3, Trash2 } from 'lucide-react';
import { LoadingDock } from '@/types';

export default function LoadingPage() {
  const [docks, setDocks] = useState<LoadingDock[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingDock, setEditingDock] = useState<LoadingDock | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state for assign
  const [name, setName] = useState('Kigali DC Dock 3');
  const [shipment, setShipment] = useState('SHP-2026-10025');
  const [truck, setTruck] = useState('RAB123A');
  const [operator, setOperator] = useState('Jean K.');

  // Form state for edit
  const [editName, setEditName] = useState('');
  const [editShipment, setEditShipment] = useState('');
  const [editTruck, setEditTruck] = useState('');
  const [editOperator, setEditOperator] = useState('');
  const [editStatus, setEditStatus] = useState<LoadingDock['status']>('LOADING');
  const [editProgress, setEditProgress] = useState('50');

  const orgId = 'org-apex-001';

  const fetchDocks = () => {
    setLoading(true);
    fetch(`/api/v1/loading?organizationId=${orgId}`)
      .then((res) => res.json())
      .then((data) => {
        setDocks(data.loadingDocks || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchDocks();
  }, []);

  const handleAssignDock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !shipment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/loading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: orgId,
          name: name.trim(),
          shipment: shipment.trim(),
          truck: truck.trim(),
          operator: operator.trim(),
          status: 'LOADING',
          progress: 25,
        }),
      });
      if (res.ok) {
        setShowAssignModal(false);
        fetchDocks();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditDockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDock) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/loading', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingDock.id,
          name: editName.trim(),
          shipment: editShipment.trim(),
          truck: editTruck.trim(),
          operator: editOperator.trim(),
          status: editStatus,
          progress: Number(editProgress),
        }),
      });
      if (res.ok) {
        setEditingDock(null);
        fetchDocks();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDock = async (id: string) => {
    if (!confirm('Are you sure you want to release and delete this dock assignment?')) return;
    try {
      const res = await fetch(`/api/v1/loading?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchDocks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (d: LoadingDock) => {
    setEditingDock(d);
    setEditName(d.name);
    setEditShipment(d.shipment);
    setEditTruck(d.truck);
    setEditOperator(d.operator);
    setEditStatus(d.status);
    setEditProgress(d.progress.toString());
  };

  const handleAdvanceProgress = async (dockId: string, currentProgress: number) => {
    const nextProgress = Math.min(100, currentProgress + 25);
    const nextStatus = nextProgress === 100 ? 'INSPECTION' : 'LOADING';
    try {
      const res = await fetch('/api/v1/loading', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dockId, progress: nextProgress, status: nextStatus }),
      });
      if (res.ok) {
        fetchDocks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Package className="w-5 h-5 text-sky-500 shrink-0" />
            <span>Cargo Loading &amp; Dock Operations</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dock Scheduling • Weight Bridge Verification • Seal Verification • Tally Sheets &amp; Container Loading.
          </p>
        </div>

        <button
          onClick={() => setShowAssignModal(true)}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-md transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Assign Loading Dock</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-sky-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {docks.map((d) => (
            <div
              key={d.id}
              className="bg-white border border-slate-200 p-4 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-sky-600">{d.id}</span>
                <div className="flex items-center space-x-1.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      d.status === 'LOADING'
                        ? 'bg-sky-500/10 text-sky-600 border-sky-500/30'
                        : d.status === 'INSPECTION'
                        ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                    }`}
                  >
                    {d.status}
                  </span>
                  <button
                    onClick={() => openEditModal(d)}
                    className="p-1 text-slate-400 hover:text-sky-500 rounded-lg hover:bg-slate-100 transition"
                    title="Edit Loading Dock"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteDock(d.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 transition"
                    title="Release/Delete Dock"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900">{d.name}</h3>

              <div className="space-y-1 text-xs text-slate-500 border-t border-slate-100 pt-2">
                <div>
                  Shipment: <strong className="text-slate-800 font-mono">{d.shipment}</strong>
                </div>
                <div>
                  Truck: <strong className="text-slate-800 font-mono">{d.truck}</strong>
                </div>
                <div>
                  Dock Operator: <span className="text-slate-700 font-medium">{d.operator}</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Progress</span>
                  <span className="font-mono font-bold text-sky-600">{d.progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full transition-all duration-300"
                    style={{ width: `${d.progress}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleAdvanceProgress(d.id, d.progress)}
                  className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold border border-slate-200 transition"
                >
                  {d.progress >= 100 ? 'Mark Complete' : '+ 25% Loading Progress'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assign Dock Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Package className="w-4 h-4 text-sky-500" />
                <span>Assign Loading Dock</span>
              </h3>
              <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignDock} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Dock Location Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Kigali DC Dock 3"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Shipment ID *</label>
                <input
                  type="text"
                  required
                  placeholder="SHP-2026-10025"
                  value={shipment}
                  onChange={(e) => setShipment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Truck Reg</label>
                  <input
                    type="text"
                    placeholder="RAB123A"
                    value={truck}
                    onChange={(e) => setTruck(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Dock Operator</label>
                  <input
                    type="text"
                    placeholder="Jean K."
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Assigning...' : 'Assign Dock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Dock Modal */}
      {editingDock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-sky-500" />
                <span>Edit Dock Assignment ({editingDock.id})</span>
              </h3>
              <button onClick={() => setEditingDock(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditDockSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Dock Location Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Shipment ID</label>
                <input
                  type="text"
                  required
                  value={editShipment}
                  onChange={(e) => setEditShipment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Truck Reg</label>
                  <input
                    type="text"
                    value={editTruck}
                    onChange={(e) => setEditTruck(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Dock Operator</label>
                  <input
                    type="text"
                    value={editOperator}
                    onChange={(e) => setEditOperator(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="LOADING">LOADING</option>
                    <option value="UNLOADING">UNLOADING</option>
                    <option value="INSPECTION">INSPECTION</option>
                    <option value="AVAILABLE">AVAILABLE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Progress (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editProgress}
                    onChange={(e) => setEditProgress(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingDock(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium"
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
