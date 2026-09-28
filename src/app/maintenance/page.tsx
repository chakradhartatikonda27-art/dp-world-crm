'use client';

import React, { useState, useEffect } from 'react';
import { Wrench, Plus, X, RefreshCw, Edit3, Trash2 } from 'lucide-react';
import { MaintenanceOrder } from '@/types';

export default function MaintenancePage() {
  const [workOrders, setWorkOrders] = useState<MaintenanceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<MaintenanceOrder | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state for schedule
  const [truckReg, setTruckReg] = useState('KA01AB4455');
  const [serviceType, setServiceType] = useState('Brake Pad Replacement & Engine Oil');
  const [serviceCenter, setServiceCenter] = useState('Kigali Volvo Service Depot');
  const [scheduledDate, setScheduledDate] = useState('2026-10-02');
  const [estimatedCost, setEstimatedCost] = useState('450');
  const [notes, setNotes] = useState('Routine preventive maintenance.');

  // Form state for edit
  const [editServiceType, setEditServiceType] = useState('');
  const [editServiceCenter, setEditServiceCenter] = useState('');
  const [editScheduledDate, setEditScheduledDate] = useState('');
  const [editCost, setEditCost] = useState('');
  const [editStatus, setEditStatus] = useState<MaintenanceOrder['status']>('SCHEDULED');

  const orgId = 'org-apex-001';

  const fetchMaintenance = () => {
    setLoading(true);
    fetch(`/api/v1/maintenance?organizationId=${orgId}`)
      .then((res) => res.json())
      .then((data) => {
        setWorkOrders(data.maintenanceOrders || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const handleScheduleMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!truckReg.trim() || !serviceType.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: orgId,
          truckReg: truckReg.trim(),
          serviceType: serviceType.trim(),
          serviceCenter: serviceCenter.trim(),
          scheduledDate,
          estimatedCost: Number(estimatedCost),
          notes,
          status: 'SCHEDULED',
        }),
      });
      if (res.ok) {
        setShowScheduleModal(false);
        fetchMaintenance();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/maintenance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingOrder.id,
          serviceType: editServiceType.trim(),
          serviceCenter: editServiceCenter.trim(),
          scheduledDate: editScheduledDate,
          estimatedCost: Number(editCost),
          status: editStatus,
        }),
      });
      if (res.ok) {
        setEditingOrder(null);
        fetchMaintenance();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this work order?')) return;
    try {
      const res = await fetch(`/api/v1/maintenance?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchMaintenance();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (o: MaintenanceOrder) => {
    setEditingOrder(o);
    setEditServiceType(o.serviceType);
    setEditServiceCenter(o.serviceCenter);
    setEditScheduledDate(o.scheduledDate);
    setEditCost(o.estimatedCost.toString());
    setEditStatus(o.status);
  };

  const handleUpdateStatus = async (orderId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'SCHEDULED' ? 'IN_SERVICE' : currentStatus === 'IN_SERVICE' ? 'COMPLETED' : 'SCHEDULED';
    try {
      const res = await fetch('/api/v1/maintenance', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: nextStatus }),
      });
      if (res.ok) {
        fetchMaintenance();
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
            <Wrench className="w-5 h-5 text-sky-500 shrink-0" />
            <span>Fleet Maintenance &amp; Work Orders</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Scheduled PMs • Breakdowns • Workshop Repairs • Spare Parts Tracking.
          </p>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-md transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Maintenance</span>
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-sky-500" />
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto min-w-full">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold">
                  <th className="p-3">Work Order #</th>
                  <th className="p-3">Truck Reg</th>
                  <th className="p-3">Service Description</th>
                  <th className="p-3">Workshop / Service Center</th>
                  <th className="p-3">Scheduled Date</th>
                  <th className="p-3">Est. Cost</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                {workOrders.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-3 font-bold text-sky-600">{w.id}</td>
                    <td className="p-3 font-sans font-medium text-slate-900">{w.truckReg}</td>
                    <td className="p-3 font-sans text-slate-800">{w.serviceType}</td>
                    <td className="p-3 font-sans text-slate-500">{w.serviceCenter}</td>
                    <td className="p-3">{w.scheduledDate}</td>
                    <td className="p-3 text-emerald-600 font-bold">${w.estimatedCost}</td>
                    <td className="p-3 font-sans">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          w.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-500/30'
                            : w.status === 'IN_SERVICE'
                            ? 'bg-amber-50 text-amber-600 border-amber-500/30'
                            : 'bg-slate-500/10 text-slate-600 border-slate-500/30'
                        }`}
                      >
                        {w.status}
                      </span>
                    </td>
                    <td className="p-3 text-right font-sans">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => handleUpdateStatus(w.id, w.status)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[10px] font-semibold border border-slate-200"
                        >
                          {w.status === 'SCHEDULED' ? 'Start' : w.status === 'IN_SERVICE' ? 'Complete' : 'Reset'}
                        </button>
                        <button
                          onClick={() => openEditModal(w)}
                          className="p-1 text-slate-500 hover:text-sky-500 rounded-lg hover:bg-slate-100 transition"
                          title="Edit Work Order"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(w.id)}
                          className="p-1 text-slate-500 hover:text-rose-500 rounded-lg hover:bg-slate-100 transition"
                          title="Delete Work Order"
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

      {/* Schedule Maintenance Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Wrench className="w-4 h-4 text-sky-500" />
                <span>Schedule Work Order</span>
              </h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-slate-500 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleMaintenance} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Truck Reg *</label>
                <input
                  type="text"
                  required
                  value={truckReg}
                  onChange={(e) => setTruckReg(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Service Type *</label>
                <input
                  type="text"
                  required
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Workshop / Service Center</label>
                <input
                  type="text"
                  value={serviceCenter}
                  onChange={(e) => setServiceCenter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Est. Cost ($)</label>
                  <input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Schedule Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Maintenance Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-sky-500" />
                <span>Edit Work Order ({editingOrder.id})</span>
              </h3>
              <button onClick={() => setEditingOrder(null)} className="text-slate-500 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditOrderSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Service Description</label>
                <input
                  type="text"
                  required
                  value={editServiceType}
                  onChange={(e) => setEditServiceType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Service Center</label>
                <input
                  type="text"
                  required
                  value={editServiceCenter}
                  onChange={(e) => setEditServiceCenter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    value={editScheduledDate}
                    onChange={(e) => setEditScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Est. Cost ($)</label>
                  <input
                    type="number"
                    value={editCost}
                    onChange={(e) => setEditCost(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="SCHEDULED">SCHEDULED</option>
                    <option value="IN_SERVICE">IN_SERVICE</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
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
