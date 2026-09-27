'use client';

import React, { useState } from 'react';
import { X, Plus, Package, MapPin, Truck } from 'lucide-react';

interface CreateShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateShipment: (data: any) => void;
  customers: { id: string; name: string }[];
}

export const CreateShipmentModal: React.FC<CreateShipmentModalProps> = ({
  isOpen,
  onClose,
  onCreateShipment,
  customers,
}) => {
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [cargoType, setCargoType] = useState('Industrial Equipment');
  const [weightKg, setWeightKg] = useState(18000);
  const [containerNumber, setContainerNumber] = useState('MSCU-9988771');
  const [originName, setOriginName] = useState('Kigali Port / Depot');
  const [destName, setDestName] = useState('Mombasa Ocean Terminal');
  const [priority, setPriority] = useState('STANDARD');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find(c => c.id === customerId);
    onCreateShipment({
      customerId,
      customerName: customer?.name || 'Global Mining Corp',
      cargoType,
      weightKg: Number(weightKg),
      containerNumber,
      origin: { name: originName, latitude: -1.9441, longitude: 30.0619 },
      destination: { name: destName, latitude: -4.0435, longitude: 39.6682 },
      priority,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-slate-100 text-sm">Create New Shipment Booking</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Select Customer</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-sky-500"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Origin Hub</label>
              <input
                type="text"
                value={originName}
                onChange={(e) => setOriginName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Destination Hub</label>
              <input
                type="text"
                value={destName}
                onChange={(e) => setDestName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Cargo Description</label>
              <input
                type="text"
                value={cargoType}
                onChange={(e) => setCargoType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Container #</label>
              <input
                type="text"
                value={containerNumber}
                onChange={(e) => setContainerNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Weight (kg)</label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-semibold"
              >
                <option value="STANDARD">STANDARD</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex justify-end space-x-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-500 shadow-lg shadow-sky-500/20"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
