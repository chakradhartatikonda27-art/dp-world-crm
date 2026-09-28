'use client';

import React, { useState, useEffect } from 'react';
import { Truck, Plus, X, RefreshCw, Star, ShieldCheck, Phone, Mail } from 'lucide-react';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [serviceType, setServiceType] = useState('3PL Subcontractor Trucking');
  const [fleetSize, setFleetSize] = useState('15');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const fetchVendors = () => {
    setLoading(true);
    fetch('/api/v1/vendors')
      .then((res) => res.json())
      .then((data) => {
        setVendors(data.vendors || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleRegisterVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          serviceType,
          fleetSize: Number(fleetSize),
          phone: phone.trim() || '+250 788 111 222',
          email: email.trim() || 'vendor@logistics.com',
        }),
      });
      if (res.ok) {
        setShowRegisterModal(false);
        setName('');
        fetchVendors();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Truck className="w-5 h-5 text-sky-500 shrink-0" />
            <span>Vendors &amp; Subcontracted Transporters</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            3PL Partner fleets, customs clearance agencies, fuel networks, and outsourced workshop vendors.
          </p>
        </div>

        <button
          onClick={() => setShowRegisterModal(true)}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-md transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register Subcontractor</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-sky-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">{vendor.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">Vendor ID: {vendor.id}</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  {vendor.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="col-span-2">
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">Service Type</span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">{vendor.serviceType}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">Fleet Capacity</span>
                  <span className="text-slate-800 dark:text-slate-200 font-mono font-bold">{vendor.fleetSize} Vehicles</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">Performance Rating</span>
                  <span className="text-amber-500 font-bold font-mono flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{vendor.rating} / 5.0</span>
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">Phone</span>
                  <span className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">{vendor.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Register Vendor Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center space-x-2">
                <Truck className="w-4 h-4 text-sky-500" />
                <span>Register 3PL Subcontractor / Vendor</span>
              </h3>
              <button onClick={() => setShowRegisterModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterVendor} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Company / Vendor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. East Africa Freight Co-op"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Service Type</label>
                <input
                  type="text"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Fleet Capacity (Trucks)</label>
                  <input
                    type="number"
                    value={fleetSize}
                    onChange={(e) => setFleetSize(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Registering...' : 'Register Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
