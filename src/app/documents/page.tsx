'use client';

import React from 'react';
import { FileText, CheckCircle, AlertTriangle, Download, Eye, Upload } from 'lucide-react';

export default function DocumentsPage() {
  const docs = [
    { id: 'DOC-1092', shipment: 'SHP-2026-10010', type: 'Bill of Lading (BOL)', issuer: 'MSC Shipping', status: 'VERIFIED', size: '2.4 MB' },
    { id: 'DOC-1093', shipment: 'SHP-2026-10012', type: 'Customs Declaration (C17)', issuer: 'Rwanda Revenue Authority', status: 'PENDING_APPROVAL', size: '1.1 MB' },
    { id: 'DOC-1094', shipment: 'SHP-2026-10015', type: 'Certificate of Origin', issuer: 'Chamber of Commerce', status: 'VERIFIED', size: '890 KB' },
    { id: 'DOC-1095', shipment: 'SHP-2026-10020', type: 'Commercial Invoice & Packing List', issuer: 'Global Mining Corp', status: 'MISSING_EXCEPTIONS', size: '—' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-sky-400" />
            <span>Documents & Customs Vault</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">AI Document OCR • Customs Compliance Verification • Electronic Document Vault</p>
        </div>
        <button className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5">
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Document</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[10px] font-semibold">
              <th className="p-3">Doc ID</th>
              <th className="p-3">Shipment</th>
              <th className="p-3">Document Type</th>
              <th className="p-3">Issuing Authority / Client</th>
              <th className="p-3">File Size</th>
              <th className="p-3">Compliance Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
            {docs.map((d) => (
              <tr key={d.id} className="hover:bg-slate-800/40">
                <td className="p-3 font-bold text-sky-400">{d.id}</td>
                <td className="p-3 font-mono text-slate-300">{d.shipment}</td>
                <td className="p-3 font-sans font-medium text-slate-200">{d.type}</td>
                <td className="p-3 font-sans text-slate-400">{d.issuer}</td>
                <td className="p-3">{d.size}</td>
                <td className="p-3 font-sans">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    d.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                    d.status === 'PENDING_APPROVAL' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                    'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}>
                    {d.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="p-3 font-sans">
                  <button className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-sky-400">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
