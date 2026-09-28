'use client';

import React, { useState, useEffect } from 'react';
import {
  Fuel,
  Plus,
  X,
  RefreshCw,
  Edit3,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Search,
  MapPin,
  Camera,
  FileText,
  BarChart2,
  TrendingDown,
  ShieldAlert,
  ArrowUpRight,
  Eye,
  Zap,
  Gauge
} from 'lucide-react';
import { FuelRecord } from '@/types';

export default function FuelPage() {
  const [records, setRecords] = useState<FuelRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFillModal, setShowFillModal] = useState(false);
  const [selectedAuditRecord, setSelectedAuditRecord] = useState<FuelRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<FuelRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Form state for add refuel record
  const [shipmentNumber, setShipmentNumber] = useState('RWA-2026-000125');
  const [truck, setTruck] = useState('RAB 123A');
  const [driver, setDriver] = useState('John');
  const [station, setStation] = useState('Shell Dar Port Terminal');
  const [openingFuelLitres, setOpeningFuelLitres] = useState('300');
  const [litres, setLitres] = useState('180');
  const [pricePerLitre, setPricePerLitre] = useState('1.15');
  const [totalCost, setTotalCost] = useState('207.00');
  const [openingOdometerKm, setOpeningOdometerKm] = useState('48200');
  const [currentOdometerKm, setCurrentOdometerKm] = useState('49485');
  const [gpsDistanceKm, setGpsDistanceKm] = useState('1270');
  const [expectedKmPerLitre, setExpectedKmPerLitre] = useState('3.1');
  const [locationMismatch, setLocationMismatch] = useState(false);
  const [receiptOcrLitres, setReceiptOcrLitres] = useState('182.5');

  // Form state for edit
  const [editTruck, setEditTruck] = useState('');
  const [editStation, setEditStation] = useState('');
  const [editLitres, setEditLitres] = useState('');
  const [editCost, setEditCost] = useState('');
  const [editStatus, setEditStatus] = useState<FuelRecord['status']>('OK');
  const [editRootCause, setEditRootCause] = useState('');

  const orgId = 'org-dpw-rwanda';

  const fetchFuel = () => {
    setLoading(true);
    fetch(`/api/v1/fuel?organizationId=${orgId}`)
      .then((res) => res.json())
      .then((data) => {
        setRecords(data.fuelRecords || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchFuel();
  }, []);

  const handleRecordFuel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!truck.trim() || !station.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/fuel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: orgId,
          shipmentNumber: shipmentNumber.trim(),
          truck: truck.trim(),
          driver: driver.trim(),
          station: station.trim(),
          openingFuelLitres: Number(openingFuelLitres),
          litres: Number(litres),
          pricePerLitre: Number(pricePerLitre),
          totalCost: Number(totalCost),
          openingOdometerKm: Number(openingOdometerKm),
          currentOdometerKm: Number(currentOdometerKm),
          gpsDistanceKm: Number(gpsDistanceKm),
          expectedKmPerLitre: Number(expectedKmPerLitre),
          locationMismatch,
          receiptOcrLitres: receiptOcrLitres ? Number(receiptOcrLitres) : undefined,
        }),
      });
      if (res.ok) {
        setShowFillModal(false);
        fetchFuel();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditFuelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/fuel', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingRecord.id,
          truck: editTruck.trim(),
          station: editStation.trim(),
          litres: Number(editLitres),
          totalCost: Number(editCost),
          status: editStatus,
          rootCauseInvestigation: editRootCause,
        }),
      });
      if (res.ok) {
        setEditingRecord(null);
        fetchFuel();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFuelRecord = async (id: string) => {
    if (!confirm('Are you sure you want to delete this fuel record?')) return;
    try {
      const res = await fetch(`/api/v1/fuel?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchFuel();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (r: FuelRecord) => {
    setEditingRecord(r);
    setEditTruck(r.truck);
    setEditStation(r.station);
    setEditLitres(r.litres.toString());
    setEditCost(r.totalCost.toString());
    setEditStatus(r.status);
    setEditRootCause(r.rootCauseInvestigation || '');
  };

  // KPIs
  const totalLitresPurchased = records.reduce((sum, r) => sum + r.litres, 0);
  const totalFuelCost = records.reduce((sum, r) => sum + r.totalCost, 0);
  const totalExpectedConsumed = records.reduce((sum, r) => sum + (r.expectedFuelConsumed || 0), 0);
  const totalFuelVarianceLitres = records.reduce((sum, r) => sum + (r.fuelVarianceLitres || 0), 0);
  const totalFuelVarianceCost = records.reduce((sum, r) => sum + (r.fuelVarianceCost || 0), 0);
  const anomalyCount = records.filter((r) => r.status !== 'OK').length;

  // Filtered records
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.truck.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.station.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.shipmentNumber && r.shipmentNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ANOMALIES' && r.status !== 'OK') ||
      r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12 bg-white text-slate-900 min-h-screen">
      {/* Executive Control Tower Header (Clean Pure White Card) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider">
              Software-Only Reconciliation Tower
            </span>
            <span className="text-xs text-slate-500">• Step-by-Step Fuel Control</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center space-x-2 mt-2">
            <Fuel className="w-6 h-6 text-amber-600 shrink-0" />
            <span>Fuel Control &amp; Reconciliation Engine</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Software-only reconciliation pairing Driver Phone GPS location, Odometer photos, Fuel Receipt OCR, and ERP expected consumption math to detect theft, unauthorized refuels, and mileage loss.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={fetchFuel}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition border border-slate-200"
            title="Refresh Fuel Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowFillModal(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-md shadow-amber-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Log Refuel / Opening Balance</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Dashboard Grid (Clean Pure White Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Refuel Purchased */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-600">Total Refueled Fuel</span>
            <Fuel className="w-4 h-4 text-sky-600" />
          </div>
          <div className="flex items-baseline space-x-2 pt-1">
            <span className="text-2xl font-black text-slate-900">
              {totalLitresPurchased.toLocaleString()} L
            </span>
            <span className="text-xs font-bold text-slate-500">
              (${totalFuelCost.toFixed(2)})
            </span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center space-x-1 pt-1.5 border-t border-slate-100 mt-2">
            <span>Avg Price:</span>
            <span className="font-semibold text-slate-800">$1.15 / Litre</span>
          </div>
        </div>

        {/* Expected Fuel Consumed */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-600">Expected Consumption</span>
            <Gauge className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline space-x-2 pt-1">
            <span className="text-2xl font-black text-emerald-700">
              {totalExpectedConsumed.toFixed(1)} L
            </span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center space-x-1 pt-1.5 border-t border-slate-100 mt-2">
            <span>Formula:</span>
            <span className="font-semibold text-slate-800">GPS Dist / Benchmark Mileage</span>
          </div>
        </div>

        {/* Net Fuel Variance */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-600">Net Fuel Variance</span>
            <TrendingDown className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline space-x-2 pt-1">
            <span
              className={`text-2xl font-black ${
                totalFuelVarianceLitres > 0 ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {totalFuelVarianceLitres > 0 ? `+${totalFuelVarianceLitres.toFixed(1)} L` : `${totalFuelVarianceLitres.toFixed(1)} L`}
            </span>
            <span className="text-xs font-bold text-rose-600">
              (${totalFuelVarianceCost.toFixed(2)})
            </span>
          </div>
          <div className="text-[11px] text-rose-700 font-medium pt-1.5 border-t border-slate-100 mt-2">
            {totalFuelVarianceLitres > 0 ? 'Exceeding benchmark tolerance' : 'Within normal operational limits'}
          </div>
        </div>

        {/* Verification Mismatches */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-600">Verification Mismatches</span>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline space-x-2 pt-1">
            <span className="text-2xl font-black text-amber-700">
              {anomalyCount} Flagged
            </span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center space-x-1 pt-1.5 border-t border-slate-100 mt-2">
            <span>Location • OCR • Odometer Mismatch</span>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar (White Card) */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search truck, driver, shipment, or station..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
              statusFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            All Logs ({records.length})
          </button>
          <button
            onClick={() => setStatusFilter('ANOMALIES')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center space-x-1.5 ${
              statusFilter === 'ANOMALIES'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Flagged Anomalies ({anomalyCount})</span>
          </button>
          <button
            onClick={() => setStatusFilter('OK')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center space-x-1.5 ${
              statusFilter === 'OK'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified OK</span>
          </button>
        </div>
      </div>

      {/* Fuel Records Table (White Background Table) */}
      {loading ? (
        <div className="flex justify-center items-center py-16 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
          <Fuel className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-semibold text-sm">No fuel records match your search or filter.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto min-w-full">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
                  <th className="p-4">Record &amp; Shipment</th>
                  <th className="p-4">Truck / Driver</th>
                  <th className="p-4">Station &amp; Location</th>
                  <th className="p-4">Opening / Added Fuel</th>
                  <th className="p-4">GPS Dist vs Odo</th>
                  <th className="p-4">Expected vs Actual</th>
                  <th className="p-4">Variance (L &amp; $)</th>
                  <th className="p-4">Audit Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-sans">
                {filteredRecords.map((r) => {
                  const isAnomaly = r.status !== 'OK';
                  return (
                    <tr
                      key={r.id}
                      className={`hover:bg-slate-50 transition cursor-pointer ${
                        isAnomaly ? 'bg-rose-50/40' : 'bg-white'
                      }`}
                      onClick={() => setSelectedAuditRecord(r)}
                    >
                      {/* Record & Shipment */}
                      <td className="p-4">
                        <div className="font-bold font-mono text-slate-900 flex items-center space-x-1.5">
                          <Fuel className="w-3.5 h-3.5 text-amber-600" />
                          <span>{r.id}</span>
                        </div>
                        {r.shipmentNumber && (
                          <div className="text-[11px] text-sky-700 font-mono font-bold mt-0.5">
                            {r.shipmentNumber}
                          </div>
                        )}
                      </td>

                      {/* Truck / Driver */}
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{r.truck}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{r.driver}</div>
                      </td>

                      {/* Station & Location */}
                      <td className="p-4 max-w-[180px] truncate">
                        <div className="font-medium text-slate-800 flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{r.station}</span>
                        </div>
                        {r.locationMismatch && (
                          <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            GPS Station Mismatch
                          </span>
                        )}
                      </td>

                      {/* Opening / Added Fuel */}
                      <td className="p-4 font-mono">
                        <div>
                          <span className="text-slate-500 text-[10px]">Open:</span>{' '}
                          <span className="font-semibold text-slate-800">{r.openingFuelLitres || 300} L</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px]">Refuel:</span>{' '}
                          <span className="font-bold text-sky-700">+{r.litres} L</span>{' '}
                          <span className="text-slate-400 text-[10px]">(${r.totalCost.toFixed(2)})</span>
                        </div>
                      </td>

                      {/* GPS Dist vs Odo */}
                      <td className="p-4 font-mono">
                        <div>
                          <span className="text-slate-500 text-[10px]">GPS:</span>{' '}
                          <span className="font-bold text-slate-900">
                            {r.gpsDistanceKm || 750} km
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px]">Odo:</span>{' '}
                          <span className="font-medium text-slate-600">
                            {r.odometerDistanceKm || r.gpsDistanceKm || 750} km
                          </span>
                        </div>
                      </td>

                      {/* Expected vs Actual */}
                      <td className="p-4 font-mono">
                        <div>
                          <span className="text-slate-500 text-[10px]">Exp:</span>{' '}
                          <span className="font-bold text-emerald-700">
                            {r.expectedFuelConsumed || (r.litres ? (r.litres * 0.9).toFixed(1) : '0')} L
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px]">Bench:</span>{' '}
                          <span className="text-slate-600">
                            {r.expectedKmPerLitre || 3.1} km/L
                          </span>
                        </div>
                      </td>

                      {/* Variance */}
                      <td className="p-4 font-mono">
                        <div
                          className={`font-bold text-sm ${
                            (r.fuelVarianceLitres || 0) > 0 ? 'text-rose-600' : 'text-emerald-700'
                          }`}
                        >
                          {(r.fuelVarianceLitres || 0) > 0
                            ? `+${r.fuelVarianceLitres} L`
                            : `${r.fuelVarianceLitres || 0} L`}
                        </div>
                        <div className="text-[10px] text-slate-500 font-bold">
                          ${r.fuelVarianceCost?.toFixed(2) || '0.00'}
                        </div>
                      </td>

                      {/* Audit Status */}
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-extrabold flex items-center space-x-1.5 w-max ${
                            r.status === 'OK'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : r.status === 'LOCATION_MISMATCH'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : r.status === 'RECEIPT_MISMATCH'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {r.status === 'OK' ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>VERIFIED OK</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                              <span>{r.status.replace('_', ' ')}</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => setSelectedAuditRecord(r)}
                            className="p-1.5 text-slate-500 hover:text-amber-600 rounded-lg hover:bg-slate-100 transition"
                            title="Open Detailed Audit View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(r)}
                            className="p-1.5 text-slate-500 hover:text-sky-600 rounded-lg hover:bg-slate-100 transition"
                            title="Edit Record"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteFuelRecord(r.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detailed Reconciliation Audit View Modal (Pure White Modal) */}
      {selectedAuditRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl p-6 space-y-6 shadow-2xl my-8 text-slate-900">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 font-mono">
                    {selectedAuditRecord.id}
                  </span>
                  <span className="text-xs font-mono text-sky-700 font-bold">
                    {selectedAuditRecord.shipmentNumber}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  Fuel Control Reconciliation &amp; Audit Trail
                </h2>
                <p className="text-xs text-slate-500">
                  Truck {selectedAuditRecord.truck} • Driver {selectedAuditRecord.driver}
                </p>
              </div>

              <button
                onClick={() => setSelectedAuditRecord(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Verification Status Banner */}
            <div
              className={`p-4 rounded-2xl border flex items-start space-x-3 ${
                selectedAuditRecord.status === 'OK'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {selectedAuditRecord.status === 'OK' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  Audit Verdict: {selectedAuditRecord.status.replace('_', ' ')}
                </h4>
                <p className="text-xs">
                  {selectedAuditRecord.rootCauseInvestigation ||
                    'Automated multi-point software reconciliation completed.'}
                </p>
              </div>
            </div>

            {/* Reconciliation Math Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              {/* Box 1: Fuel Tank Math */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-sans font-bold text-slate-900 flex items-center space-x-1.5 text-xs">
                  <Fuel className="w-4 h-4 text-amber-600" />
                  <span>1. Fuel Tank Balance</span>
                </div>
                <div className="space-y-1 pt-1 text-slate-700">
                  <div className="flex justify-between">
                    <span>Opening Fuel:</span>
                    <span className="font-bold">{selectedAuditRecord.openingFuelLitres || 300} L</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Refuel Added:</span>
                    <span className="font-bold text-sky-700">+{selectedAuditRecord.litres} L</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-1 font-bold text-slate-900">
                    <span>Total Available:</span>
                    <span>{(selectedAuditRecord.openingFuelLitres || 300) + selectedAuditRecord.litres} L</span>
                  </div>
                </div>
              </div>

              {/* Box 2: GPS Telemetry vs Benchmark */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-sans font-bold text-slate-900 flex items-center space-x-1.5 text-xs">
                  <Gauge className="w-4 h-4 text-emerald-600" />
                  <span>2. Satellite Telemetry</span>
                </div>
                <div className="space-y-1 pt-1 text-slate-700">
                  <div className="flex justify-between">
                    <span>GPS Distance:</span>
                    <span className="font-bold text-slate-900">
                      {selectedAuditRecord.gpsDistanceKm || 750} km
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Odometer Dist:</span>
                    <span>{selectedAuditRecord.odometerDistanceKm || selectedAuditRecord.gpsDistanceKm || 750} km</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-1">
                    <span>Model Efficiency:</span>
                    <span className="font-bold text-emerald-700">
                      {selectedAuditRecord.expectedKmPerLitre || 3.1} km/L
                    </span>
                  </div>
                </div>
              </div>

              {/* Box 3: Expected vs Variance */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-sans font-bold text-slate-900 flex items-center space-x-1.5 text-xs">
                  <TrendingDown className="w-4 h-4 text-rose-600" />
                  <span>3. Expected &amp; Variance</span>
                </div>
                <div className="space-y-1 pt-1 text-slate-700">
                  <div className="flex justify-between">
                    <span>Exp. Consumed:</span>
                    <span className="font-bold text-emerald-700">
                      {selectedAuditRecord.expectedFuelConsumed || 0} L
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fuel Variance:</span>
                    <span
                      className={`font-bold ${
                        (selectedAuditRecord.fuelVarianceLitres || 0) > 0 ? 'text-rose-600' : 'text-emerald-700'
                      }`}
                    >
                      {selectedAuditRecord.fuelVarianceLitres || 0} L
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-1 font-bold">
                    <span>Financial Loss:</span>
                    <span className="text-rose-700">
                      ${selectedAuditRecord.fuelVarianceCost?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Image & Proof Verification Section */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Photo &amp; OCR Evidence Verification
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Fuel Receipt OCR Photo */}
                <div className="border border-slate-200 rounded-2xl p-3 space-y-2 bg-slate-50">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                    <span className="flex items-center space-x-1.5">
                      <Camera className="w-3.5 h-3.5 text-amber-600" />
                      <span>Fuel Station Receipt Photo &amp; OCR</span>
                    </span>
                    {selectedAuditRecord.receiptMismatch ? (
                      <span className="text-[10px] text-rose-600 font-bold">OCR MISMATCH</span>
                    ) : (
                      <span className="text-[10px] text-emerald-600 font-bold">OCR MATCH</span>
                    )}
                  </div>
                  <div className="aspect-video bg-slate-200 rounded-xl overflow-hidden relative group border border-slate-300">
                    {/* eslint-disable-next-html-element-suppress */}
                    <img
                      src={selectedAuditRecord.receiptPhotoUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500'}
                      alt="Fuel Receipt"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-semibold">
                      View Original Receipt Image
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-600 font-mono space-y-0.5">
                    <div>Station: <span className="text-slate-900 font-sans">{selectedAuditRecord.station}</span></div>
                    <div>Receipt OCR Litres: <span className="font-bold text-amber-700">{selectedAuditRecord.receiptOcrLitres || selectedAuditRecord.litres} L</span></div>
                  </div>
                </div>

                {/* Dashboard Odometer Photo */}
                <div className="border border-slate-200 rounded-2xl p-3 space-y-2 bg-slate-50">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                    <span className="flex items-center space-x-1.5">
                      <Gauge className="w-3.5 h-3.5 text-sky-600" />
                      <span>Truck Dashboard Odometer Photo</span>
                    </span>
                    {selectedAuditRecord.odometerMismatch ? (
                      <span className="text-[10px] text-rose-600 font-bold">ODO MISMATCH</span>
                    ) : (
                      <span className="text-[10px] text-emerald-600 font-bold">ODO MATCH</span>
                    )}
                  </div>
                  <div className="aspect-video bg-slate-200 rounded-xl overflow-hidden relative group border border-slate-300">
                    {/* eslint-disable-next-html-element-suppress */}
                    <img
                      src={selectedAuditRecord.odometerPhotoUrl || 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=500'}
                      alt="Truck Odometer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-semibold">
                      View Odometer Photo
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-600 font-mono space-y-0.5">
                    <div>Opening Odometer: <span className="text-slate-900">{selectedAuditRecord.openingOdometerKm || 48200} km</span></div>
                    <div>Trip Odometer Dist: <span className="font-bold text-sky-700">{selectedAuditRecord.odometerDistanceKm || selectedAuditRecord.gpsDistanceKm || 750} km</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  const recordToEdit = selectedAuditRecord;
                  setSelectedAuditRecord(null);
                  openEditModal(recordToEdit);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 border border-slate-200"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Audit Status / Root Cause</span>
              </button>

              <button
                onClick={() => setSelectedAuditRecord(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Fuel Fill Modal (Pure White Modal) */}
      {showFillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl p-6 space-y-5 shadow-2xl my-8 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Fuel className="w-4 h-4 text-amber-600" />
                <span>Log Refuel / Opening Fuel Balance</span>
              </h3>
              <button onClick={() => setShowFillModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordFuel} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Shipment # *</label>
                  <input
                    type="text"
                    required
                    value={shipmentNumber}
                    onChange={(e) => setShipmentNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Truck Reg *</label>
                  <input
                    type="text"
                    required
                    value={truck}
                    onChange={(e) => setTruck(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Driver Name *</label>
                  <input
                    type="text"
                    required
                    value={driver}
                    onChange={(e) => setDriver(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Fuel Station Location *</label>
                  <input
                    type="text"
                    required
                    value={station}
                    onChange={(e) => setStation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Opening Fuel (L)</label>
                  <input
                    type="number"
                    value={openingFuelLitres}
                    onChange={(e) => setOpeningFuelLitres(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Refueled (L) *</label>
                  <input
                    type="number"
                    required
                    value={litres}
                    onChange={(e) => {
                      const l = e.target.value;
                      setLitres(l);
                      setTotalCost((Number(l) * Number(pricePerLitre)).toFixed(2));
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-sky-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Total Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={totalCost}
                    onChange={(e) => setTotalCost(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Start Odometer (km)</label>
                  <input
                    type="number"
                    value={openingOdometerKm}
                    onChange={(e) => setOpeningOdometerKm(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Current Odometer (km)</label>
                  <input
                    type="number"
                    value={currentOdometerKm}
                    onChange={(e) => setCurrentOdometerKm(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">GPS Distance (km)</label>
                  <input
                    type="number"
                    value={gpsDistanceKm}
                    onChange={(e) => setGpsDistanceKm(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Software Reconciliation Preview:</span>
                  <span className="text-[11px] font-mono text-emerald-700 font-bold">
                    Expected: {+(Number(gpsDistanceKm) / Number(expectedKmPerLitre)).toFixed(1)} L
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span>Simulate GPS Station Mismatch</span>
                  <input
                    type="checkbox"
                    checked={locationMismatch}
                    onChange={(e) => setLocationMismatch(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowFillModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Calculating & Saving...' : 'Run Audit & Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Fuel Modal (Pure White Modal) */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-amber-600" />
                <span>Edit Audit Record ({editingRecord.id})</span>
              </h3>
              <button onClick={() => setEditingRecord(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditFuelSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Truck Registration</label>
                <input
                  type="text"
                  required
                  value={editTruck}
                  onChange={(e) => setEditTruck(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Fuel Station</label>
                <input
                  type="text"
                  required
                  value={editStation}
                  onChange={(e) => setEditStation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Litres</label>
                  <input
                    type="number"
                    value={editLitres}
                    onChange={(e) => setEditLitres(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Total Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editCost}
                    onChange={(e) => setEditCost(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Audit Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as FuelRecord['status'])}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                >
                  <option value="OK">OK - Verified</option>
                  <option value="LOCATION_MISMATCH">LOCATION_MISMATCH</option>
                  <option value="RECEIPT_MISMATCH">RECEIPT_MISMATCH</option>
                  <option value="HIGH_VARIANCE">HIGH_VARIANCE</option>
                  <option value="REVIEW_REQUIRED">REVIEW_REQUIRED</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Root Cause Investigation</label>
                <textarea
                  rows={3}
                  value={editRootCause}
                  onChange={(e) => setEditRootCause(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Audit Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
