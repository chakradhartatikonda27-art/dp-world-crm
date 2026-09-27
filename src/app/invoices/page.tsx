'use client';

import React, { useState, useEffect } from 'react';
import { Receipt, DollarSign, Download, CheckCircle2, Clock } from 'lucide-react';
import { Invoice } from '@/types';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const orgId = 'org-apex-001';

  useEffect(() => {
    fetch(`/api/v1/invoices?organizationId=${orgId}`)
      .then((res) => res.json())
      .then((data) => setInvoices(data.invoices || []));
  }, []);

  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalUnpaid = invoices.filter(i => i.status === 'UNPAID').reduce((acc, inv) => acc + inv.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <Receipt className="w-5 h-5 text-emerald-400" />
          <span>Finance & Automated Freight Invoicing</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Auto-generated customer invoices upon proof of delivery completion, payments tracking, and line item breakdowns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Invoice Revenue</div>
            <div className="text-xl font-bold font-mono text-emerald-400">${totalRevenue.toLocaleString()}</div>
          </div>
          <DollarSign className="w-6 h-6 text-emerald-400" />
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Outstanding Balance</div>
            <div className="text-xl font-bold font-mono text-amber-400">${totalUnpaid.toLocaleString()}</div>
          </div>
          <Clock className="w-6 h-6 text-amber-400" />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase">
              <th className="py-3 px-4">Invoice #</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Shipment #</th>
              <th className="py-3 px-4">Total Amount</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-850">
                <td className="py-3 px-4 font-mono font-bold text-sky-400">{inv.invoiceNumber}</td>
                <td className="py-3 px-4 font-medium text-slate-200">{inv.customerName}</td>
                <td className="py-3 px-4 font-mono text-slate-300">{inv.shipmentNumber}</td>
                <td className="py-3 px-4 font-mono font-bold text-slate-100">${inv.totalAmount.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    inv.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {inv.status}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-slate-400">{inv.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
