'use client';

import React, { useState, useEffect } from 'react';
import { Wrench, Plus, X, RefreshCw, CheckCircle2, Clock } from 'lucide-react';
import { MaintenanceOrder } from '@/types';

export default function MaintenancePage() {
  const [workOrders, setWorkOrders] = useState<MaintenanceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [truckReg, setTruckReg] = useState('KA01AB4455');
  const [serviceType, setServiceType] = useState('Brake Pad Replacement & Engine Oil');
  const [serviceCenter, setServiceCenter] = useState('Kigali Volvo Service Depot');
  const [scheduledDate, setScheduledDate] = useState('2026-10-02');
  const [estimatedCost, setEstimatedCost] = useState('450');
  const [notes, setNotes] = useState('Routine preventive maintenance.');

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-sky-500 shrink-0" />
            <span>Fleet Maintenance &amp; Work Orders</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto min-w-full">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-semibold">
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
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                {workOrders.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3 font-bold text-sky-600 dark:text-sky-400">{w.id}</td>
                    <td className="p-3 font-sans font-medium text-slate-900 dark:text-slate-200">{w.truckReg}</td>
                    <td className="p-3 font-sans text-slate-800 dark:text-slate-200">{w.serviceType}</td>
                    <td className="p-3 font-sans text-slate-500 dark:text-slate-400">{w.serviceCenter}</td>
                    <td className="p-3">{w.scheduledDate}</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">${w.estimatedCost}</td>
                    <td className="p-3 font-sans">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          w.status === 'COMPLETED'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                            : w.status === 'IN_SERVICE'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                            : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30'
                        }`}
                      >
                        {w.status}
                      </span>
                    </td>
                    <td className="p-3 text-right font-sans">
                      <button
                        onClick={() => handleUpdateStatus(w.id, w.status)}
                        className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded text-[10px] font-semibold border border-slate-200 dark:border-slate-700"
                      >
                        {w.status === 'SCHEDULED' ? 'Start Service' : w.status === 'IN_SERVICE' ? 'Complete Service' : 'Reset Status'}
                      </button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center space-x-2">
                <Wrench className="w-4 h-4 text-sky-500" />
                <span>Schedule Fleet Maintenance</span>
              </h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleMaintenance} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Truck Registration *</label>
                <input
                  type="text"
                  required
                  placeholder="KA01AB4455"
                  value={truckReg}
                  onChange={(e) => setTruckReg(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Service Description *</label>
                <input
                  type="text"
                  required
                  placeholder="Brake Pad Replacement & Engine Oil"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Workshop / Service Center</label>
                <input
                  type="text"
                  placeholder="Kigali Volvo Service Depot"
                  value={serviceCenter}
                  onChange={(e) => setServiceCenter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Estimated Cost ($)</label>
                  <input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Maintenance Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Scheduling...' : 'Schedule Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
