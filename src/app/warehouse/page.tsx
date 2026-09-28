'use client';

import React, { useState, useEffect } from 'react';
import { Boxes, Plus, X, RefreshCw, ArrowDownRight, ArrowUpRight, Edit3, Trash2 } from 'lucide-react';
import { WarehouseItem } from '@/types';

export default function WarehousePage() {
  const [inventory, setInventory] = useState<WarehouseItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showInboundModal, setShowInboundModal] = useState(false);
  const [showOutboundModal, setShowOutboundModal] = useState(false);
  const [editingItem, setEditingItem] = useState<WarehouseItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states for inbound
  const [skuCode, setSkuCode] = useState('SKU-8471-004');
  const [description, setDescription] = useState('Heavy Duty Electrical Transformers');
  const [binLocation, setBinLocation] = useState('WH-A-Zone-05');
  const [quantity, setQuantity] = useState('50');
  const [unitType, setUnitType] = useState('Units');
  const [weightKg, setWeightKg] = useState('18500');

  // Outbound state
  const [dispatchSku, setDispatchSku] = useState('');
  const [dispatchQty, setDispatchQty] = useState('10');

  // Form states for edit
  const [editSkuCode, setEditSkuCode] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editBinLocation, setEditBinLocation] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [editUnitType, setEditUnitType] = useState('');
  const [editWeightKg, setEditWeightKg] = useState('');
  const [editStatus, setEditStatus] = useState<WarehouseItem['status']>('IN_STOCK');

  const orgId = 'org-apex-001';

  const fetchInventory = () => {
    setLoading(true);
    fetch(`/api/v1/warehouse?organizationId=${orgId}`)
      .then((res) => res.json())
      .then((data) => {
        setInventory(data.inventory || []);
        if (data.inventory && data.inventory.length > 0 && !dispatchSku) {
          setDispatchSku(data.inventory[0].skuCode);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleInboundReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/warehouse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: orgId,
          skuCode: skuCode.trim() || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
          description: description.trim(),
          binLocation: binLocation.trim(),
          quantity: Number(quantity),
          unitType,
          weightKg: Number(weightKg),
          status: 'IN_STOCK',
        }),
      });
      if (res.ok) {
        setShowInboundModal(false);
        fetchInventory();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOutboundDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchSku) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/warehouse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: orgId,
          action: 'OUTBOUND_DISPATCH',
          skuCode: dispatchSku,
          quantity: Number(dispatchQty),
        }),
      });
      if (res.ok) {
        setShowOutboundModal(false);
        fetchInventory();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/warehouse', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingItem.id,
          skuCode: editSkuCode.trim(),
          description: editDescription.trim(),
          binLocation: editBinLocation.trim(),
          quantity: Number(editQuantity),
          unitType: editUnitType.trim(),
          weightKg: Number(editWeightKg),
          status: editStatus,
        }),
      });
      if (res.ok) {
        setEditingItem(null);
        fetchInventory();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStock = async (id: string) => {
    if (!confirm('Are you sure you want to remove this inventory item?')) return;
    try {
      const res = await fetch(`/api/v1/warehouse?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchInventory();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (i: WarehouseItem) => {
    setEditingItem(i);
    setEditSkuCode(i.skuCode);
    setEditDescription(i.description);
    setEditBinLocation(i.binLocation);
    setEditQuantity(i.quantity.toString());
    setEditUnitType(i.unitType);
    setEditWeightKg(i.weightKg.toString());
    setEditStatus(i.status);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Boxes className="w-5 h-5 text-sky-500 shrink-0" />
            <span>Warehouse &amp; Inventory Control</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Bin Location Management • Pick &amp; Pack • Cross-Docking • Inbound Receipt &amp; Outbound Dispatch.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setShowInboundModal(true)}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <ArrowDownRight className="w-4 h-4 text-emerald-500" />
            <span>Inbound Receipt</span>
          </button>
          <button
            onClick={() => setShowOutboundModal(true)}
            className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-md transition"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Outbound Dispatch</span>
          </button>
        </div>
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
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase text-[10px] font-semibold">
                  <th className="p-3">SKU Code</th>
                  <th className="p-3">Item Description</th>
                  <th className="p-3">Bin Location</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Total Weight</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 dark:text-slate-300 font-mono">
                {inventory.map((i) => (
                  <tr key={i.id || i.skuCode} className="hover:bg-slate-50 dark:bg-slate-950/60 transition">
                    <td className="p-3 font-bold text-sky-600">{i.skuCode}</td>
                    <td className="p-3 font-sans font-medium text-slate-900 dark:text-slate-100">{i.description}</td>
                    <td className="p-3 font-sans text-slate-500">{i.binLocation}</td>
                    <td className="p-3 font-bold">
                      {i.quantity} <span className="text-[10px] text-slate-500 font-normal">{i.unitType}</span>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{i.weightKg.toLocaleString()} kg</td>
                    <td className="p-3 font-sans">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          i.status === 'READY_FOR_DISPATCH'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-500/30'
                            : i.status === 'IN_STOCK'
                            ? 'bg-sky-50 text-sky-600 border-sky-500/30'
                            : 'bg-amber-50 text-amber-600 border-amber-500/30'
                        }`}
                      >
                        {i.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => openEditModal(i)}
                          className="p-1 text-slate-500 hover:text-sky-500 rounded-lg hover:bg-slate-100 dark:bg-slate-800 transition"
                          title="Edit Inventory Item"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteStock(i.id)}
                          className="p-1 text-slate-500 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:bg-slate-800 transition"
                          title="Delete Stock Item"
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

      {/* Inbound Receipt Modal */}
      {showInboundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center space-x-2">
                <ArrowDownRight className="w-4 h-4 text-emerald-500" />
                <span>Inbound Stock Receipt</span>
              </h3>
              <button onClick={() => setShowInboundModal(false)} className="text-slate-500 hover:text-slate-600 dark:text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInboundReceipt} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={skuCode}
                    onChange={(e) => setSkuCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Bin Location</label>
                  <input
                    type="text"
                    value={binLocation}
                    onChange={(e) => setBinLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Item Description *</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Unit Type</label>
                  <input
                    type="text"
                    value={unitType}
                    onChange={(e) => setUnitType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowInboundModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Receiving...' : 'Receive Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Outbound Dispatch Modal */}
      {showOutboundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center space-x-2">
                <ArrowUpRight className="w-4 h-4 text-sky-500" />
                <span>Outbound Stock Dispatch</span>
              </h3>
              <button onClick={() => setShowOutboundModal(false)} className="text-slate-500 hover:text-slate-600 dark:text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOutboundDispatch} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Select Inventory SKU *</label>
                <select
                  value={dispatchSku}
                  onChange={(e) => setDispatchSku(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {inventory.map((i) => (
                    <option key={i.skuCode} value={i.skuCode}>
                      {i.skuCode} - {i.description} (Available: {i.quantity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Dispatch Quantity *</label>
                <input
                  type="number"
                  required
                  value={dispatchQty}
                  onChange={(e) => setDispatchQty(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowOutboundModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Dispatching...' : 'Confirm Dispatch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Stock Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-sky-500" />
                <span>Edit Stock Item ({editingItem.skuCode})</span>
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-500 hover:text-slate-600 dark:text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditStockSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={editSkuCode}
                    onChange={(e) => setEditSkuCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Bin Location</label>
                  <input
                    type="text"
                    required
                    value={editBinLocation}
                    onChange={(e) => setEditBinLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Item Description</label>
                <input
                  type="text"
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Unit Type</label>
                  <input
                    type="text"
                    value={editUnitType}
                    onChange={(e) => setEditUnitType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={editWeightKg}
                    onChange={(e) => setEditWeightKg(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="IN_STOCK">IN_STOCK</option>
                  <option value="READY_FOR_DISPATCH">READY_FOR_DISPATCH</option>
                  <option value="PUTAWAY_PENDING">PUTAWAY_PENDING</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
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
