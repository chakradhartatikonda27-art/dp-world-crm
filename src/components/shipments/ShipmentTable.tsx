'use client';

import React from 'react';
import { Shipment, ShipmentStatus } from '@/types';
import { Eye, ArrowUpRight, Clock, AlertTriangle, CheckCircle2, Truck } from 'lucide-react';

interface ShipmentTableProps {
  shipments: Shipment[];
  onSelectShipment: (shipment: Shipment) => void;
  onTransition?: (shipmentId: string, status: ShipmentStatus, remarks?: string) => void;
}

export const ShipmentTable: React.FC<ShipmentTableProps> = ({ shipments, onSelectShipment, onTransition }) => {
  const getStatusBadge = (status: ShipmentStatus) => {
    switch (status) {
      case 'IN_TRANSIT':
        return 'bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-500/30';
      case 'DELAYED':
        return 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30';
      case 'BORDER_PROCESSING':
      case 'CHECKPOINT':
        return 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30';
      case 'DELIVERED':
      case 'PAID':
        return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30';
      case 'BOOKED':
      case 'TRUCK_ASSIGNED':
        return 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Shipment #</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Origin → Destination</th>
              <th className="py-3 px-4">Truck & Driver</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">ETA</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {shipments.map((s) => (
              <tr
                key={s.id}
                onClick={() => onSelectShipment(s)}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors group"
              >
                <td className="py-3 px-4 font-mono font-bold text-sky-600 dark:text-sky-400 group-hover:underline">
                  {s.shipmentNumber}
                  {s.priority === 'CRITICAL' && (
                    <span className="ml-2 text-[9px] px-1 py-0.2 rounded bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 font-sans font-bold border border-rose-200 dark:border-rose-500/30">
                      CRITICAL
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                  {s.customerName || 'Customer'}
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{s.containerNumber || 'Loose Cargo'}</div>
                </td>
                <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                  <div className="flex items-center space-x-1.5 font-medium">
                    <span className="truncate max-w-[110px]">{s.origin.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate max-w-[110px]">{s.destination.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                  {s.truckRegistration ? (
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{s.truckRegistration}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{s.driverName || 'Unassigned'}</div>
                    </div>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400 text-[11px] italic font-medium">Pending Assignment</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${getStatusBadge(s.status)}`}>
                    {s.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                  {s.estimatedDeliveryAt ? new Date(s.estimatedDeliveryAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onSelectShipment(s)}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-sky-600 hover:text-white text-slate-600 dark:text-slate-300 transition-colors"
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
  );
};
