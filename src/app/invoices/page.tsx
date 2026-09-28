'use client';

import React, { useState, useEffect } from 'react';
import {
  Receipt,
  DollarSign,
  Download,
  CheckCircle2,
  Clock,
  Plus,
  X,
  RefreshCw,
  Eye,
  Share2,
  Printer,
  Building2,
  PhoneCall,
  Mail,
} from 'lucide-react';
import { Invoice } from '@/types';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState('Global Mining Corp');
  const [shipmentNumber, setShipmentNumber] = useState('SHP-2026-10012');
  const [subtotalAmount, setSubtotalAmount] = useState('2800');
  const [taxAmount, setTaxAmount] = useState('504');
  const [dueDate, setDueDate] = useState('2026-10-15');

  const orgId = 'org-apex-001';

  const fetchInvoices = () => {
    setLoading(true);
    fetch(`/api/v1/invoices?organizationId=${orgId}`)
      .then((res) => res.json())
      .then((data) => {
        setInvoices(data.invoices || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !shipmentNumber.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: orgId,
          customerName: customerName.trim(),
          shipmentNumber: shipmentNumber.trim(),
          subtotalAmount: Number(subtotalAmount),
          taxAmount: Number(taxAmount),
          dueDate,
          status: 'UNPAID',
        }),
      });
      if (res.ok) {
        setShowCreateModal(false);
        fetchInvoices();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePaymentStatus = async (invoiceId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'PAID' ? 'UNPAID' : 'PAID';
    try {
      const res = await fetch('/api/v1/invoices', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId, status: nextStatus }),
      });
      if (res.ok) {
        fetchInvoices();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalUnpaid = invoices.filter((i) => i.status === 'UNPAID').reduce((acc, inv) => acc + inv.totalAmount, 0);

  // WhatsApp share link generator
  const getWhatsAppShareUrl = (inv: Invoice) => {
    const text = encodeURIComponent(
      `*DP WORLD RWANDA FREIGHT INVOICE*\n` +
        `Invoice #: ${inv.invoiceNumber}\n` +
        `Customer: ${inv.customerName}\n` +
        `Shipment #: ${inv.shipmentNumber}\n` +
        `Total Amount Due: $${inv.totalAmount.toLocaleString()}\n` +
        `Due Date: ${inv.dueDate}\n` +
        `Status: ${inv.status}\n\n` +
        `Thank you for choosing DP World Logistics!`
    );
    return `https://wa.me/?text=${text}`;
  };

  // Download / Print Bill handler
  const handlePrintDownloadBill = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>Finance &amp; Automated Freight Invoicing</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Auto-generated customer invoices, PDF bill exports, WhatsApp sharing, line-item breakdowns &amp; payment tracking.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-md transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Invoice</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Total Invoice Revenue</div>
            <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
              ${totalRevenue.toLocaleString()}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Outstanding Unpaid Balance</div>
            <div className="text-2xl font-bold font-mono text-amber-600 mt-1">
              ${totalUnpaid.toLocaleString()}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto min-w-full">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase text-[10px] font-semibold">
                  <th className="p-3">Invoice #</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Shipment #</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 dark:text-slate-300 font-mono">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 dark:bg-slate-950/60 transition">
                    <td className="p-3 font-bold text-sky-600">{inv.invoiceNumber}</td>
                    <td className="p-3 font-sans font-medium text-slate-900 dark:text-slate-100">{inv.customerName}</td>
                    <td className="p-3 text-slate-500">{inv.shipmentNumber}</td>
                    <td className="p-3 text-emerald-600 font-bold">${inv.totalAmount.toLocaleString()}</td>
                    <td className="p-3 font-sans">
                      <button
                        onClick={() => handleTogglePaymentStatus(inv.id, inv.status)}
                        title="Click to toggle payment state"
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${
                          inv.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-500/30'
                            : 'bg-amber-50 text-amber-600 border-amber-500/30'
                        }`}
                      >
                        {inv.status}
                      </button>
                    </td>
                    <td className="p-3 text-slate-500">{inv.dueDate}</td>
                    <td className="p-3 text-right font-sans flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => setViewingInvoice(inv)}
                        title="View & Print Invoice Bill"
                        className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-800"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={getWhatsAppShareUrl(inv)}
                        target="_blank"
                        rel="noreferrer"
                        title="Send Invoice to WhatsApp"
                        className="p-1.5 bg-emerald-50 hover:bg-emerald-500/20 text-emerald-600 rounded-lg border border-emerald-500/30 flex items-center space-x-1 text-[10px] font-bold"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center space-x-2">
                <Receipt className="w-4 h-4 text-emerald-500" />
                <span>Create Customer Freight Invoice</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-500 hover:text-slate-600 dark:text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Shipment Number *</label>
                <input
                  type="text"
                  required
                  value={shipmentNumber}
                  onChange={(e) => setShipmentNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Subtotal Amount ($)</label>
                  <input
                    type="number"
                    value={subtotalAmount}
                    onChange={(e) => {
                      setSubtotalAmount(e.target.value);
                      setTaxAmount((Number(e.target.value) * 0.18).toFixed(2));
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Tax Amount (18% VAT)</label>
                  <input
                    type="number"
                    value={taxAmount}
                    onChange={(e) => setTaxAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
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
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Freight Bill Printable Modal */}
      {viewingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center font-bold text-white text-xs">
                    DP
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-slate-100 text-base">DP WORLD RWANDA</h2>
                    <p className="text-[10px] text-slate-500">Logistics &amp; Container Depot Systems</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-sm font-bold text-sky-600">{viewingInvoice.invoiceNumber}</span>
                <div className="text-[10px] text-slate-500">Date: {viewingInvoice.createdAt.split('T')[0]}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-semibold block">Billed To</span>
                <div className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">{viewingInvoice.customerName}</div>
                <div className="text-slate-500">Shipment Ref: {viewingInvoice.shipmentNumber}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-500 font-semibold block">Payment Terms</span>
                <div className="font-mono text-slate-700 dark:text-slate-300 mt-0.5">Due: {viewingInvoice.dueDate}</div>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                    viewingInvoice.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}
                >
                  STATUS: {viewingInvoice.status}
                </span>
              </div>
            </div>

            {/* Line items */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-500">
                  <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {viewingInvoice.lineItems && viewingInvoice.lineItems.length > 0 ? (
                    viewingInvoice.lineItems.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-sans text-slate-800 dark:text-slate-200">{item.description}</td>
                        <td className="p-3 text-center">{item.quantity}</td>
                        <td className="p-3 text-right">${item.unitPrice.toLocaleString()}</td>
                        <td className="p-3 text-right font-bold">${item.total.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-3 font-sans text-slate-800 dark:text-slate-200">Freight &amp; Cargo Handling Services</td>
                      <td className="p-3 text-center">1</td>
                      <td className="p-3 text-right">${viewingInvoice.subtotalAmount.toLocaleString()}</td>
                      <td className="p-3 text-right font-bold">${viewingInvoice.subtotalAmount.toLocaleString()}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Total breakdown */}
            <div className="flex justify-end text-xs space-y-1">
              <div className="w-48 space-y-1 font-mono">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span>${viewingInvoice.subtotalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>VAT (18%):</span>
                  <span>${viewingInvoice.taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 dark:text-slate-100 text-sm pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Total Amount:</span>
                  <span className="text-emerald-600">${viewingInvoice.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <a
                href={getWhatsAppShareUrl(viewingInvoice)}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-md"
              >
                <Share2 className="w-4 h-4" />
                <span>Send to WhatsApp</span>
              </a>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrintDownloadBill}
                  className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Download Bill</span>
                </button>

                <button
                  onClick={() => setViewingInvoice(null)}
                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
