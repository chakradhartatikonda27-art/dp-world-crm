'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Plus, X, RefreshCw, CheckCircle2, ShieldCheck, Download, Eye, FileCode } from 'lucide-react';
import { DocumentItem } from '@/types';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<DocumentItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState<'BILL_OF_LADING' | 'COMMERCIAL_INVOICE' | 'PACKING_LIST' | 'CUSTOMS' | 'POD' | 'OTHER'>('BILL_OF_LADING');
  const [shipmentId, setShipmentId] = useState('shp-1');

  const orgId = 'org-apex-001';

  const fetchDocuments = () => {
    setLoading(true);
    fetch(`/api/v1/documents?organizationId=${orgId}`)
      .then((res) => res.json())
      .then((data) => {
        setDocuments(data.documents || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: orgId,
          title: title.trim(),
          documentType,
          shipmentId,
          uploadedBy: 'Elena Rostova',
        }),
      });
      if (res.ok) {
        setShowUploadModal(false);
        setTitle('');
        fetchDocuments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleVerification = async (docId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'VERIFIED' ? 'REJECTED' : 'VERIFIED';
    try {
      const res = await fetch('/api/v1/documents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId, verificationStatus: nextStatus }),
      });
      if (res.ok) {
        fetchDocuments();
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
            <FileText className="w-5 h-5 text-sky-500 shrink-0" />
            <span>Documents &amp; Customs Vault</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Bill of Lading, Customs Declarations, Automated OCR verification, and POD digital vault.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-md transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-sky-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded bg-sky-500/10">
                    {doc.documentType.replace(/_/g, ' ')}
                  </span>
                  <button
                    onClick={() => handleToggleVerification(doc.id, doc.verificationStatus)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${
                      doc.verificationStatus === 'VERIFIED'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {doc.verificationStatus}
                  </button>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs line-clamp-2">{doc.title}</h3>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
                  <div>Uploaded by: <span className="text-slate-700 dark:text-slate-300 font-medium">{doc.uploadedBy}</span></div>
                  <div>Date: <span className="font-mono">{doc.uploadedAt.split('T')[0]}</span></div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => setViewingDoc(doc)}
                  className="text-sky-600 dark:text-sky-400 font-semibold hover:underline flex items-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect OCR Data</span>
                </button>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); alert(`Downloading document: ${doc.title}`); }}
                  className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center space-x-2">
                <FileText className="w-4 h-4 text-sky-500" />
                <span>Upload Document to Vault</span>
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadDocument} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Bill of Lading #BOL-2026-99"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Document Category</label>
                <select
                  value={documentType}
                  onChange={(e: any) => setDocumentType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="BILL_OF_LADING">Bill of Lading</option>
                  <option value="CUSTOMS">Customs Declaration</option>
                  <option value="COMMERCIAL_INVOICE">Commercial Invoice</option>
                  <option value="PACKING_LIST">Packing List</option>
                  <option value="POD">Proof of Delivery</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Select File (.PDF, .PNG, .JPG)</label>
                <input
                  type="file"
                  className="w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 dark:file:bg-slate-800 dark:file:text-slate-300"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Uploading...' : 'Upload File'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect OCR Data Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-sky-500" />
                <span>OCR Extracted Data</span>
              </h3>
              <button onClick={() => setViewingDoc(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="font-bold text-slate-900 dark:text-slate-100">{viewingDoc.title}</div>
              <pre className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-[11px] text-sky-600 dark:text-sky-400 overflow-x-auto">
                {JSON.stringify(viewingDoc.ocrData || { status: 'PARSED_SUCCESSFULLY' }, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingDoc(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold"
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
