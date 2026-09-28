'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, Plus, X, RefreshCw, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { WorkflowRule } from '@/types';

export default function AutomationPage() {
  const [rules, setRules] = useState<WorkflowRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('Speed Violation Alert (>80 km/h)');
  const [eventType, setEventType] = useState('GPS_PING');
  const [field, setField] = useState('speed_kmh');
  const [operator, setOperator] = useState<'EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS'>('GREATER_THAN');
  const [value, setValue] = useState('80');
  const [actionType, setActionType] = useState<'CREATE_EXCEPTION' | 'UPDATE_STATUS' | 'SEND_NOTIFICATION'>('CREATE_EXCEPTION');

  const orgId = 'org-apex-001';

  const fetchRules = () => {
    setLoading(true);
    fetch(`/api/v1/automation?organizationId=${orgId}`)
      .then((res) => res.json())
      .then((data) => {
        setRules(data.rules || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: orgId,
          name: name.trim(),
          eventType,
          conditionJson: { field, operator, value: isNaN(Number(value)) ? value : Number(value) },
          actionType,
          actionPayload: { severity: 'HIGH' },
        }),
      });
      if (res.ok) {
        setShowCreateModal(false);
        fetchRules();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleRuleActive = async (ruleId: string, currentActive: boolean) => {
    try {
      const res = await fetch('/api/v1/automation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruleId, active: !currentActive }),
      });
      if (res.ok) {
        fetchRules();
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
            <Cpu className="w-5 h-5 text-sky-500 shrink-0" />
            <span>Workflow &amp; Event Automation Engine</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Event triggers, automatic exception creation, status transition rules, and automated notifications.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-md transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Automation Rule</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-sky-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">{rule.id}</span>
                <button
                  onClick={() => handleToggleRuleActive(rule.id, rule.active)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition ${
                    rule.active
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {rule.active ? 'ACTIVE' : 'INACTIVE'}
                </button>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{rule.name}</span>
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">Event Trigger</span>
                  <span className="text-slate-800 dark:text-slate-200 font-mono font-medium">{rule.eventType}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">Execution Count</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{rule.triggerCount || 0} Triggers</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">Condition</span>
                  <span className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                    IF {rule.conditionJson?.field} {rule.conditionJson?.operator} {String(rule.conditionJson?.value)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Rule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-sky-500" />
                <span>Create Workflow Automation Rule</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Rule Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stationary Delay Alert (>90m)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Trigger Event</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="GPS_PING">GPS Ping Event</option>
                  <option value="POD_COMPLETED">POD Uploaded</option>
                  <option value="BORDER_ARRIVAL">Border Arrival</option>
                  <option value="FUEL_FILL">Fuel Fill</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Field</label>
                  <input
                    type="text"
                    value={field}
                    onChange={(e) => setField(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Operator</label>
                  <select
                    value={operator}
                    onChange={(e: any) => setOperator(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                  >
                    <option value="GREATER_THAN">GREATER_THAN</option>
                    <option value="LESS_THAN">LESS_THAN</option>
                    <option value="EQUALS">EQUALS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Value</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Action Type</label>
                <select
                  value={actionType}
                  onChange={(e: any) => setActionType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="CREATE_EXCEPTION">Create Operational Exception</option>
                  <option value="UPDATE_STATUS">Update Shipment Status</option>
                  <option value="SEND_NOTIFICATION">Send Alert Notification</option>
                </select>
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
                  {submitting ? 'Creating...' : 'Create Rule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
