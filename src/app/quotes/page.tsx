'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, Plus, X, RefreshCw, CheckCircle2, ArrowRight, Edit, Trash2 } from 'lucide-react';

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingQuote, setEditingQuote] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [customerName, setCustomerName] = useState('Kigali Industrial Hub');
  const [origin, setOrigin] = useState('Dar es Salaam Port, Tanzania');
  const [destination, setDestination] = useState('Kigali Dry Port, Rwanda');
  const [cargoType, setCargoType] = useState('Industrial Steel Coils');
  const [weightTons, setWeightTons] = useState('24');
  const [ratePerTon, setRatePerTon] = useState('110');
  const [expiryDate, setExpiryDate] = useState('2026-10-25');

  // Edit form state
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editOrigin, setEditOrigin] = useState('');
  const [editDestination, setEditDestination] = useState('');
  const [editCargoType, setEditCargoType] = useState('');
  const [editWeightTons, setEditWeightTons] = useState('0');
  const [editRatePerTon, setEditRatePerTon] = useState('0');
  const [editStatus, setEditStatus] = useState('APPROVED');

  const fetchQuotes = () => {
    setLoading(true);
    fetch('/api/v1/quotes')
      .then((res) => res.json())
      .then((data) => {
        setQuotes(data.quotes || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleCreateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !origin.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          origin: origin.trim(),
          destination: destination.trim(),
          cargoType: cargoType.trim(),
          weightTons: Number(weightTons),
          ratePerTon: Number(ratePerTon),
          expiryDate,
        }),
      });
      if (res.ok) {
        setShowCreateModal(false);
        fetchQuotes();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuote) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/quotes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingQuote.id,
          customerName: editCustomerName.trim(),
          origin: editOrigin.trim(),
          destination: editDestination.trim(),
          cargoType: editCargoType.trim(),
          weightTons: Number(editWeightTons),
          ratePerTon: Number(editRatePerTon),
          status: editStatus,
        }),
      });
      if (res.ok) {
        setEditingQuote(null);
        fetchQuotes();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuote = async (id: string) => {
    if (!confirm(`Are you sure you want to delete quote ${id}?`)) return;
    try {
      const res = await fetch(`/api/v1/quotes?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchQuotes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (q: any) => {
    setEditingQuote(q);
    setEditCustomerName(q.customerName || '');
    setEditOrigin(q.origin || '');
    setEditDestination(q.destination || '');
    setEditCargoType(q.cargoType || '');
    setEditWeightTons(String(q.weightTons || 0));
    setEditRatePerTon(String(q.ratePerTon || 0));
    setEditStatus(q.status || 'APPROVED');
  };

  const calculatedTotal = Number(weightTons) * Number(ratePerTon);
  const editCalculatedTotal = Number(editWeightTons) * Number(editRatePerTon);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-sky-500 shrink-0" />
            <span>Quotes &amp; Rate Engine Management</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dynamic freight pricing engine, corridor rate calculation, client quote generation, and expiry tracking.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-md transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Rate Quote</span>
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
                  <th className="p-3">Quote #</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Corridor (Origin → Dest)</th>
                  <th className="p-3">Cargo Type</th>
                  <th className="p-3">Weight</th>
                  <th className="p-3">Rate / Ton</th>
                  <th className="p-3">Total Quote Price</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                {quotes.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3 font-bold text-sky-600 dark:text-sky-400">{q.id}</td>
                    <td className="p-3 font-sans font-medium text-slate-900 dark:text-slate-200">{q.customerName}</td>
                    <td className="p-3 font-sans text-slate-500 dark:text-slate-400">
                      {q.origin} → {q.destination}
                    </td>
                    <td className="p-3 font-sans text-slate-700 dark:text-slate-300">{q.cargoType}</td>
                    <td className="p-3">{q.weightTons} Tons</td>
                    <td className="p-3">${q.ratePerTon} / ton</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">${q.totalPrice.toLocaleString()}</td>
                    <td className="p-3 font-sans">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        {q.status}
                      </span>
                    </td>
                    <td className="p-3 text-right font-sans">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => openEditModal(q)}
                          className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                          title="Edit Quote"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuote(q.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                          title="Delete Quote"
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

      {/* Create Quote Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center space-x-2">
                <Calculator className="w-4 h-4 text-sky-500" />
                <span>Calculate &amp; Create Rate Quote</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuote} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Origin *</label>
                  <input
                    type="text"
                    required
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Destination *</label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Cargo Type</label>
                <input
                  type="text"
                  value={cargoType}
                  onChange={(e) => setCargoType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Weight (Tons)</label>
                  <input
                    type="number"
                    value={weightTons}
                    onChange={(e) => setWeightTons(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Rate ($ / Ton)</label>
                  <input
                    type="number"
                    value={ratePerTon}
                    onChange={(e) => setRatePerTon(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-sky-50 dark:bg-slate-800/80 rounded-xl border border-sky-200 dark:border-slate-700 flex items-center justify-between font-mono text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-sans">Calculated Total Quote Price:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">${calculatedTotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Generating...' : 'Generate Rate Quote'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Quote Modal */}
      {editingQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center space-x-2">
                <Edit className="w-4 h-4 text-sky-500" />
                <span>Edit Rate Quote ({editingQuote.id})</span>
              </h3>
              <button onClick={() => setEditingQuote(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateQuote} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={editCustomerName}
                  onChange={(e) => setEditCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Origin *</label>
                  <input
                    type="text"
                    required
                    value={editOrigin}
                    onChange={(e) => setEditOrigin(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Destination *</label>
                  <input
                    type="text"
                    required
                    value={editDestination}
                    onChange={(e) => setEditDestination(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Cargo Type</label>
                <input
                  type="text"
                  value={editCargoType}
                  onChange={(e) => setEditCargoType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Weight (Tons)</label>
                  <input
                    type="number"
                    value={editWeightTons}
                    onChange={(e) => setEditWeightTons(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Rate ($ / Ton)</label>
                  <input
                    type="number"
                    value={editRatePerTon}
                    onChange={(e) => setEditRatePerTon(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="APPROVED">APPROVED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="EXPIRED">EXPIRED</option>
                </select>
              </div>

              <div className="p-3 bg-sky-50 dark:bg-slate-800/80 rounded-xl border border-sky-200 dark:border-slate-700 flex items-center justify-between font-mono text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-sans">Recalculated Total:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">${editCalculatedTotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingQuote(null)}
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
