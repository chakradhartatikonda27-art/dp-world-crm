'use client';

import React, { useState, useEffect } from 'react';
import { History, Download, RefreshCw, Eye, Search, ShieldCheck, X } from 'lucide-react';
import { AuditLog } from '@/types';

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingLog, setViewingLog] = useState<AuditLog | null>(null);

  const fetchLogs = () => {
    setLoading(true);
    fetch('/api/v1/audit')
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.auditLogs || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleExportCSV = () => {
    const headers = 'ID,User,Action,Entity,EntityID,IPAddress,Timestamp\n';
    const rows = logs
      .map((l) => `${l.id},"${l.userName}",${l.action},${l.entity},${l.entityId},${l.ipAddress},${l.timestamp}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredLogs = logs.filter(
    (l) =>
      l.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.entity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <History className="w-5 h-5 text-sky-500 shrink-0" />
            <span>Audit Trail &amp; Security Event Log</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable security event logging, user mutation history, IP tracking, and compliance record audit.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-sm transition shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Log</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
        <input
          type="text"
          placeholder="Search by action, user name, or entity..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
        />
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
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Action Performed</th>
                  <th className="p-3">Entity Type</th>
                  <th className="p-3">Entity ID</th>
                  <th className="p-3">IP Address</th>
                  <th className="p-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 dark:text-slate-300 font-mono">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:bg-slate-950/60 transition">
                    <td className="p-3 text-slate-500 font-sans">{log.timestamp.replace('T', ' ').slice(0, 19)}</td>
                    <td className="p-3 font-sans font-medium text-slate-900 dark:text-slate-100">{log.userName}</td>
                    <td className="p-3 text-sky-600 font-bold">{log.action}</td>
                    <td className="p-3 font-sans text-slate-700 dark:text-slate-300">{log.entity}</td>
                    <td className="p-3 font-bold">{log.entityId}</td>
                    <td className="p-3 text-slate-500">{log.ipAddress}</td>
                    <td className="p-3 text-right font-sans">
                      <button
                        onClick={() => setViewingLog(log)}
                        className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-800"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect Audit Log Modal */}
      {viewingLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center space-x-2">
                <History className="w-4 h-4 text-sky-500" />
                <span>Audit Payload Details</span>
              </h3>
              <button onClick={() => setViewingLog(null)} className="text-slate-500 hover:text-slate-600 dark:text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>Action: <strong className="text-sky-600 font-mono">{viewingLog.action}</strong></div>
              <div>User: <span className="font-semibold">{viewingLog.userName}</span> ({viewingLog.ipAddress})</div>
              <div>Target Entity: <span className="font-mono">{viewingLog.entity}</span> ({viewingLog.entityId})</div>
              <pre className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-[11px] text-slate-700 dark:text-slate-300 overflow-x-auto mt-2">
                {JSON.stringify(viewingLog, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingLog(null)}
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
