'use client';

import React, { useState, useEffect } from 'react';
import { UserSquare2, Star, Plus, X, RefreshCw, Edit3, Trash2 } from 'lucide-react';
import { Driver } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function DriversPage() {
  const { currentRole } = useAuth();
  const canEditDrivers = ['FLEET_MANAGER', 'DISPATCHER', 'OPERATIONS_MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN'].includes(currentRole);

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state for register
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('2028-12-31');

  // Form state for edit
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLicense, setEditLicense] = useState('');
  const [editExpiry, setEditExpiry] = useState('');
  const [editStatus, setEditStatus] = useState<Driver['status']>('AVAILABLE');

  const orgId = 'org-apex-001';

  const fetchDrivers = () => {
    setLoading(true);
    fetch(`/api/v1/drivers?organizationId=${orgId}`)
      .then((res) => res.json())
      .then((data) => {
        setDrivers(data.drivers || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleRegisterDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !licenseNumber.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: orgId,
          name: name.trim(),
          phone: phone.trim() || '+254 700 000000',
          licenseNumber: licenseNumber.trim(),
          licenseExpiry,
          status: 'AVAILABLE',
        }),
      });
      if (res.ok) {
        setShowRegisterModal(false);
        setName('');
        setPhone('');
        setLicenseNumber('');
        fetchDrivers();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditDriverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDriver) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/drivers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingDriver.id,
          name: editName.trim(),
          phone: editPhone.trim(),
          licenseNumber: editLicense.trim(),
          licenseExpiry: editExpiry,
          status: editStatus,
        }),
      });
      if (res.ok) {
        setEditingDriver(null);
        fetchDrivers();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDriver = async (id: string) => {
    if (!confirm('Are you sure you want to delete this driver?')) return;
    try {
      const res = await fetch(`/api/v1/drivers?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchDrivers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (driver: Driver) => {
    setEditingDriver(driver);
    setEditName(driver.name);
    setEditPhone(driver.phone);
    setEditLicense(driver.licenseNumber);
    setEditExpiry(driver.licenseExpiry || '2028-12-31');
    setEditStatus(driver.status);
  };

  const handleUpdateStatus = async (driverId: string, currentStatus: string) => {
    const statuses: ('AVAILABLE' | 'ON_TRIP' | 'OFF_DUTY' | 'REST')[] = ['AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'REST'];
    const nextIndex = (statuses.indexOf(currentStatus as any) + 1) % statuses.length;
    const nextStatus = statuses[nextIndex];

    try {
      const res = await fetch('/api/v1/drivers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId, status: nextStatus }),
      });
      if (res.ok) {
        fetchDrivers();
      }
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
            <UserSquare2 className="w-5 h-5 text-sky-500 shrink-0" />
            <span>Driver Performance &amp; Roster Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Operational safety records, license verification status, on-time delivery rates, and active trip assignments.
          </p>
        </div>

        {canEditDrivers && (
          <button
            onClick={() => setShowRegisterModal(true)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-md transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Register Driver</span>
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-sky-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {drivers.map((driver) => (
            <div
              key={driver.id}
              className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{driver.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    License: {driver.licenseNumber}
                  </div>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => handleUpdateStatus(driver.id, driver.status)}
                    title="Click to toggle duty status"
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${
                      driver.status === 'AVAILABLE'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-500/30'
                        : driver.status === 'ON_TRIP'
                        ? 'bg-indigo-50 text-indigo-600 border-indigo-500/30'
                        : driver.status === 'REST'
                        ? 'bg-amber-50 text-amber-600 border-amber-500/30'
                        : 'bg-slate-500/10 text-slate-600 border-slate-500/30'
                    }`}
                  >
                    {driver.status}
                  </button>
                  {canEditDrivers && (
                    <>
                      <button
                        onClick={() => openEditModal(driver)}
                        className="p-1 text-slate-500 hover:text-sky-500 rounded-lg hover:bg-slate-100 transition"
                        title="Edit Driver"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDriver(driver.id)}
                        className="p-1 text-slate-500 hover:text-rose-500 rounded-lg hover:bg-slate-100 transition"
                        title="Delete Driver"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">On-Time Rate</span>
                  <span className="text-emerald-600 font-bold font-mono">{driver.onTimeRatePercent}%</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Rating</span>
                  <span className="text-amber-500 font-bold font-mono flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{driver.rating}</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Total Trips</span>
                  <span className="text-slate-800 font-mono">{driver.totalTripsCount}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Phone</span>
                  <span className="text-slate-700 font-mono text-[10px] truncate block">{driver.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Register Driver Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <UserSquare2 className="w-4 h-4 text-sky-500" />
                <span>Register New Driver</span>
              </h3>
              <button onClick={() => setShowRegisterModal(false)} className="text-slate-500 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterDriver} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jean Baptiste Hakizimana"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +250 788 123 456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">License Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="DL-RW-9901"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">License Expiry</label>
                  <input
                    type="date"
                    value={licenseExpiry}
                    onChange={(e) => setLicenseExpiry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Registering...' : 'Register Driver'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Driver Modal */}
      {editingDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-sky-500" />
                <span>Edit Driver Details</span>
              </h3>
              <button onClick={() => setEditingDriver(null)} className="text-slate-500 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditDriverSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">License Number</label>
                  <input
                    type="text"
                    required
                    value={editLicense}
                    onChange={(e) => setEditLicense(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="ON_TRIP">ON_TRIP</option>
                    <option value="OFF_DUTY">OFF_DUTY</option>
                    <option value="REST">REST</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingDriver(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium"
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
