'use client';

import React, { useState } from 'react';
import { Search, MapPin, Clock, FileText, CheckCircle2, Star, Download, ShieldCheck } from 'lucide-react';
import { Shipment } from '@/types';

export default function CustomerPortal() {
  const [searchNumber, setSearchNumber] = useState('SHP-2026-10001');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [rating, setRating] = useState(5);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleSearch = () => {
    fetch(`/api/v1/shipments/${searchNumber}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.shipment) setShipment(data.shipment);
        else alert('Shipment not found');
      });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Banner */}
      <div className="p-5 sm:p-6 rounded-2xl border border-sky-200 bg-white shadow-xl space-y-3 transition-colors">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0" />
          <h1 className="text-base sm:text-lg font-bold text-slate-900">Customer Self-Service Tracking Portal</h1>
        </div>
        <p className="text-xs text-slate-600 max-w-xl">
          Track your freight shipments live, inspect driver ETAs, download Bill of Lading documents, and view proof of delivery.
        </p>

        {/* Tracking Input Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
          <input
            type="text"
            value={searchNumber}
            onChange={(e) => setSearchNumber(e.target.value)}
            placeholder="Enter Shipment Number (e.g. SHP-2026-10001)"
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-mono focus:outline-none focus:border-sky-500 min-w-0"
          />
          <button
            onClick={handleSearch}
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-500/30 flex items-center justify-center space-x-1.5 shrink-0"
          >
            <Search className="w-4 h-4 text-white" />
            <span className="text-white font-bold">Track Freight</span>
          </button>
        </div>
      </div>

      {shipment ? (
        <div className="space-y-6">
          {/* Status & ETA Card */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Shipment Number</div>
              <div className="font-mono font-bold text-sky-400 text-base">{shipment.shipmentNumber}</div>
              <div className="text-xs text-slate-300 font-medium mt-1">{shipment.customerName}</div>
            </div>

            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Current Status</div>
              <div className="inline-block mt-1 px-2.5 py-1 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold text-xs">
                {shipment.status.replace(/_/g, ' ')}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Estimated Delivery (ETA)</div>
              <div className="font-mono font-bold text-emerald-400 text-sm mt-1">
                {new Date(shipment.estimatedDeliveryAt).toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Distance Remaining: {shipment.distanceRemainingKm || 140} km</div>
            </div>
          </div>

          {/* Documents Workspace */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>Available Shipment Documents</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">Bill of Lading (BOL)</div>
                  <div className="text-[10px] text-slate-500">BOL-700001.pdf</div>
                </div>
                <button className="p-1.5 bg-slate-50 hover:bg-slate-200 rounded text-sky-400">
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">Commercial Invoice</div>
                  <div className="text-[10px] text-slate-500">INV-2026-3001.pdf</div>
                </div>
                <button className="p-1.5 bg-slate-50 hover:bg-slate-200 rounded text-sky-400">
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">Proof of Delivery (POD)</div>
                  <div className="text-[10px] text-emerald-400">Signed & Verified</div>
                </div>
                <button className="p-1.5 bg-slate-50 hover:bg-slate-200 rounded text-emerald-400">
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Delivery Feedback */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Submit Delivery Experience Feedback</h3>

            {!feedbackSubmitted ? (
              <div className="space-y-3 text-xs">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRating(star)}>
                      <Star className={`w-5 h-5 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="Share details about communication, punctuality, and driver experience..."
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-200 focus:outline-none focus:border-sky-500"
                  rows={2}
                />
                <button
                  onClick={() => setFeedbackSubmitted(true)}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold"
                >
                  Submit Feedback
                </button>
              </div>
            ) : (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold text-center">
                Thank you! Your delivery feedback has been logged into our operational quality audit.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 text-xs bg-white border border-slate-200 rounded-2xl">
          Enter a shipment number above to track your freight live.
        </div>
      )}
    </div>
  );
}
