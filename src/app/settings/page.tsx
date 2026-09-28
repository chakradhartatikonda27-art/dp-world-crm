'use client';

import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Key, Save, RefreshCw, CheckCircle2, Shield, Globe, Bell } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({
    orgName: 'DP World Rwanda Logistics Hub',
    currency: 'USD',
    timezone: 'Africa/Kigali',
    autoInvoiceOnPOD: true,
    gpsPollingIntervalSec: 15,
    apiKey: 'dpw_live_sk_9940182749102948',
    webhookUrl: 'https://api.dpworld.rw/v1/telemetry-webhook',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/v1/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      const res = await fetch('/api/v1/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateApiKey = async () => {
    try {
      const res = await fetch('/api/v1/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'GENERATE_API_KEY' }),
      });
      const data = await res.json();
      if (data.settings) setSettings(data.settings);
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
            <SettingsIcon className="w-5 h-5 text-sky-500 shrink-0" />
            <span>System Settings &amp; API Integration Hub</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Organization preferences, API secret key management, webhooks, and IoT telemetry polling rates.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-md transition disabled:opacity-50 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Organization settings and API configuration saved successfully!</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-sky-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Org Profile */}
          <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <Globe className="w-4 h-4 text-sky-500" />
              <span>Organization &amp; Regional Profile</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Organization Name</label>
                <input
                  type="text"
                  value={settings.orgName}
                  onChange={(e) => setSettings({ ...settings, orgName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Default Currency</label>
                  <input
                    type="text"
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Timezone</label>
                  <input
                    type="text"
                    value={settings.timezone}
                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* API Keys & Webhooks */}
          <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <Key className="w-4 h-4 text-sky-500" />
              <span>API Integration &amp; Telemetry Webhook</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-medium">Production API Secret Key</label>
                  <button
                    type="button"
                    onClick={handleGenerateApiKey}
                    className="text-sky-600 font-semibold hover:underline text-[10px]"
                  >
                    Regenerate Key
                  </button>
                </div>
                <input
                  type="text"
                  readOnly
                  value={settings.apiKey}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl font-mono text-[11px] text-sky-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Webhook Endpoint URL</label>
                <input
                  type="text"
                  value={settings.webhookUrl}
                  onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
