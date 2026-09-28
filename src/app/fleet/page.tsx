'use client';

import React, { useState, useEffect } from 'react';
import { Truck as TruckIcon, Wrench, ShieldCheck, Fuel, Plus, X, RefreshCw, Edit2, Trash2 } from 'lucide-react';
import { Truck } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function FleetPage() {
  const { currentRole } = useAuth();
  const canEditFleet = currentRole === 'FLEET_MANAGER' || currentRole === 'ORG_ADMIN' || currentRole === 'SUPER_ADMIN';

  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTruck, setEditingTruck] = useState<Truck | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [regNum, setRegNum] = useState('');
  const [vehicleType, setVehicleType] = useState<'CONTAINER_33FT' | 'FLATBED_40FT' | 'TANKER' | 'REFRIGERATED' | 'SMALL_VAN'>('CONTAINER_33FT');
  const [make, setMake] = useState('Volvo');
  const [model, setModel] = useState('FH16');
  const [year, setYear] = useState('2024');
  const [capacityTons, setCapacityTons] = useState('28');
  const [odometerKm, setOdometerKm] = useState('45000');

  const orgId = 'org-apex-001';

  const fetchTrucks = () => {
    setLoading(true);
    fetch(`/api/v1/trucks?organizationId=${orgId}`)
      .then((res) => res.json())
      .then((data) => {
        setTrucks(data.trucks || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchTrucks();
  }, []);

  const handleCreateTruck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNum.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/trucks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: orgId,
          registrationNumber: regNum.trim(),
          vehicleType,
          make,
          model,
          year: Number(year),
          capacityTons: Number(capacityTons),
          odometerKm: Number(odometerKm),
          status: 'AVAILABLE',
          fuelLevelPercent: 95,
        }),
      });
      if (res.ok) {
        setShowAddModal(false);
        setRegNum('');
        fetchTrucks();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEdit = (truck: Truck) => {
    setEditingTruck(truck);
    setRegNum(truck.registrationNumber);
    setVehicleType(truck.vehicleType);
    setMake(truck.make);
    setModel(truck.model);
    setYear(String(truck.year));
    setCapacityTons(String(truck.capacityTons));
    setOdometerKm(String(truck.odometerKm));
  };

  const handleUpdateTruck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTruck) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/trucks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingTruck.id,
          registrationNumber: regNum.trim(),
          vehicleType,
          make,
          model,
          year: Number(year),
          capacityTons: Number(capacityTons),
          odometerKm: Number(odometerKm),
        }),
      });
      if (res.ok) {
        setEditingTruck(null);
        fetchTrucks();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTruck = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle from the fleet?')) return;
    try {
      const res = await fetch(`/api/v1/trucks?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchTrucks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (truckId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'AVAILABLE' ? 'MAINTENANCE' : currentStatus === 'MAINTENANCE' ? 'AVAILABLE' : 'AVAILABLE';
    try {
      const res = await fetch('/api/v1/trucks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ truckId, status: nextStatus }),
      });
      if (res.ok) {
        fetchTrucks();
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
            <TruckIcon className="w-5 h-5 text-sky-500 shrink-0" />
            <span>Fleet &amp; Vehicle Roster</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time vehicle status, odometer tracking, capacity metrics, and service availability.
          </p>
        </div>

        {canEditFleet && (
          <button
            onClick={() => {
              setRegNum('');
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-md transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Vehicle</span>
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
          {trucks.map((truck) => (
            <div
              key={truck.id}
              className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {truck.registrationNumber}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {truck.make} {truck.model} ({truck.year})
                    </div>
                  </div>
                  <button
                    onClick={() => handleUpdateStatus(truck.id, truck.status)}
                    title="Click to toggle status"
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${
                      truck.status === 'AVAILABLE'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-500/30'
                        : truck.status === 'IN_TRANSIT'
                        ? 'bg-sky-50 text-sky-600 border-sky-500/30'
                        : 'bg-amber-50 text-amber-600 border-amber-500/30'
                    }`}
                  >
                    {truck.status}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Body Type</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{truck.vehicleType.replace(/_/g, ' ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Capacity</span>
                    <span className="text-slate-800 dark:text-slate-200 font-mono font-medium">{truck.capacityTons} Tons</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Odometer</span>
                    <span className="text-slate-800 dark:text-slate-200 font-mono">{truck.odometerKm.toLocaleString()} km</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Fuel Level</span>
                    <span className="text-emerald-600 font-mono font-bold">{truck.fuelLevelPercent || 85}%</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {canEditFleet && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => handleOpenEdit(truck)}
                    className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center space-x-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteTruck(truck.id)}
                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-500/20 text-rose-600 rounded-lg text-xs font-semibold flex items-center space-x-1 border border-rose-500/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Vehicle Modal */}
      {(showAddModal || editingTruck) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center space-x-2">
                <TruckIcon className="w-4 h-4 text-sky-500" />
                <span>{editingTruck ? 'Edit Vehicle Details' : 'Add New Fleet Vehicle'}</span>
              </h3>
              <button onClick={() => { setShowAddModal(false); setEditingTruck(null); }} className="text-slate-500 hover:text-slate-600 dark:text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingTruck ? handleUpdateTruck : handleCreateTruck} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Registration Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RAB 890 B"
                  value={regNum}
                  onChange={(e) => setRegNum(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Vehicle Type</label>
                  <select
                    value={vehicleType}
                    onChange={(e: any) => setVehicleType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="CONTAINER_33FT">Container 33FT</option>
                    <option value="FLATBED_40FT">Flatbed 40FT</option>
                    <option value="TANKER">Tanker</option>
                    <option value="REFRIGERATED">Refrigerated</option>
                    <option value="SMALL_VAN">Small Van</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Capacity (Tons)</label>
                  <input
                    type="number"
                    value={capacityTons}
                    onChange={(e) => setCapacityTons(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Make</label>
                  <input
                    type="text"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Model</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Year</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Odometer Reading (km)</label>
                <input
                  type="number"
                  value={odometerKm}
                  onChange={(e) => setOdometerKm(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingTruck(null); }}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingTruck ? 'Save Changes' : 'Register Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
