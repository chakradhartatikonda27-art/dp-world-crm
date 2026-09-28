'use client';

import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Truck,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Edit3,
  Navigation,
  Send,
  Radio,
  Volume2,
  PhoneCall,
  Globe,
  ShieldAlert,
  Sparkles,
  Fuel,
  X,
  Gauge,
  Flag,
  Award,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Shipment, ShipmentStatus } from '@/types';

type DriverLang = 'EN' | 'SW' | 'RW' | 'FR';

export default function DriverMobileApp() {
  const [activeShipment, setActiveShipment] = useState<Shipment | null>(null);
  const [recipientName, setRecipientName] = useState('');
  const [isPODSubmitted, setIsPODSubmitted] = useState(false);
  const [isSharingGPS, setIsSharingGPS] = useState(true);
  const [driverLang, setDriverLang] = useState<DriverLang>('EN');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(false);

  // Refuel modal state for driver
  const [showRefuelModal, setShowRefuelModal] = useState(false);
  const [refuelStation, setRefuelStation] = useState('Shell Dar Port Terminal');
  const [refuelLitres, setRefuelLitres] = useState('180');
  const [refuelCost, setRefuelCost] = useState('207.00');
  const [refuelOdometer, setRefuelOdometer] = useState('49485');
  const [receiptPhotoTaken, setReceiptPhotoTaken] = useState(false);
  const [submittingRefuel, setSubmittingRefuel] = useState(false);

  const orgId = 'org-dpw-rwanda';

  const translations = {
    EN: {
      consoleTitle: 'Driver Mobile Console',
      driverName: 'John (Truck RAB 123A)',
      activeTrip: 'Active Shipment Route',
      origin: 'Start: Dar es Salaam Port',
      destination: 'End: Kigali, Rwanda',
      payload: 'Cargo: Refrigerated Goods',
      step1: '1. Dar Port',
      step2: '2. Border Clearance',
      step3: '3. Kigali Hub',
      borderBtn: 'AT BORDER CHECKPOINT',
      arrivedBtn: 'ARRIVED AT DESTINATION',
      checkpointBtn: 'SEND CHECKPOINT PING',
      refuelBtn: 'LOG REFUEL & RECEIPT',
      photoBtn: 'TAKE CARGO PHOTO',
      signBtn: 'SIGN SCREEN',
      submitPodBtn: 'COMPLETE & SUBMIT POD',
      sosBtn: 'EMERGENCY DISPATCH HELP',
      audioPrompt: 'John, your truck RAB 123A is near Rusumo Border. Tap At Border button or Arrived when at Kigali destination.',
      photoDone: '✓ Photo Attached',
      refuelDone: '✓ Refuel Logged to ERP',
    },
    SW: {
      consoleTitle: 'Kituo cha Dereva',
      driverName: 'John (Gari RAB 123A)',
      activeTrip: 'Safari Inayoendelea',
      origin: 'Mwanzo: Bandari ya Dar es Salaam',
      destination: 'Mwisho: Kigali, Rwanda',
      payload: 'Mzigo: Bidhaa za Baridi',
      step1: '1. Bandari Dar',
      step2: '2. Ukaguzi Mpakanai',
      step3: '3. Kituo cha Kigali',
      borderBtn: 'NIPO MPAKANAI',
      arrivedBtn: 'NIMEFIKA KIGALI',
      checkpointBtn: 'TUMA UKAGUZI',
      refuelBtn: 'WEKA MAFUTA NA RISITI',
      photoBtn: 'PIGA PICHA MZUGO',
      signBtn: 'WEKA SAHINI',
      submitPodBtn: 'MALIZA NA TUMA POD',
      sosBtn: 'MSAADA WA DHARURA',
      audioPrompt: 'John, gari yako RAB 123A ipo Rusumo. Bonyeza Nipo Mpakanai, au Nimefika ukifika Kigali.',
      photoDone: '✓ Picha Imepigwa',
      refuelDone: '✓ Mafuta Yamehifadhiwa',
    },
    RW: {
      consoleTitle: 'Porogaramu y\'Umushoferi',
      driverName: 'John (Ikamyo RAB 123A)',
      activeTrip: 'Urugendo Ruri Kuba',
      origin: 'Ahahagurukwa: Dar es Salaam',
      destination: 'Aho Cherekejwe: Kigali, Rwanda',
      payload: 'Mzigo: Ibicuruzwa bikonje',
      step1: '1. Bandari Dar',
      step2: '2. Ku Mupaka',
      step3: '3. Kugera Kigali',
      borderBtn: 'NGEZE KU MUPAKA',
      arrivedBtn: 'NAGEZE KIGALI',
      checkpointBtn: 'OHEREZA ISUZUMA',
      refuelBtn: 'GUFATIRA MAFUTA NA RISITI',
      photoBtn: 'FATA IFOTO Y\'IBIZIGO',
      signBtn: 'SHYIRAHO SINIYA',
      submitPodBtn: 'OHEREZA POD',
      sosBtn: 'TABARA / MSAADA',
      audioPrompt: 'John, ikamyo yawe RAB 123A igeze Rusumo. Kanda Ngeze ku Mupaka, cyangwa Nageze Kigali.',
      photoDone: '✓ Ifoto Yafashwe',
      refuelDone: '✓ Mafuta Yiyandikishije',
    },
    FR: {
      consoleTitle: 'Console Conducteur',
      driverName: 'John (Camion RAB 123A)',
      activeTrip: 'Trajet Actif',
      origin: 'Départ: Port de Dar es Salaam',
      destination: 'Arrivée: Kigali, Rwanda',
      payload: 'Cargaison: Produits Réfrigérés',
      step1: '1. Port Dar',
      step2: '2. Contrôle Frontière',
      step3: '3. Centre Kigali',
      borderBtn: 'Á LA FRONTIÈRE',
      arrivedBtn: 'JE SUIS ARRIVÉ',
      checkpointBtn: 'ENVOYER CHECKPOINT',
      refuelBtn: 'RECHARGE CARBURANT & REÇU',
      photoBtn: 'PRENDRE PHOTO',
      signBtn: 'SIGNER L\'ÉCRAN',
      submitPodBtn: 'VALIDER & ENVOYER POD',
      sosBtn: 'SOS URGENCE DISPATCH',
      audioPrompt: 'John, votre camion RAB 123A est près de la frontière Rusumo. Appuyez sur À la frontière ou Arrivé.',
      photoDone: '✓ Photo Capturée',
      refuelDone: '✓ Carburant Enregistré',
    },
  };

  const text = translations[driverLang];

  const loadActiveTrip = () => {
    fetch(`/api/v1/shipments?organizationId=${orgId}&status=IN_TRANSIT`)
      .then((res) => res.json())
      .then((data) => {
        if (data.shipments && data.shipments.length > 0) {
          setActiveShipment(data.shipments[0]);
        }
      });
  };

  useEffect(() => {
    loadActiveTrip();
  }, []);

  const handleDriverStatusUpdate = async (nextStatus: ShipmentStatus, remarkStr: string) => {
    if (!activeShipment) return;
    const res = await fetch(`/api/v1/shipments/${activeShipment.id}/transition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetStatus: nextStatus, remarks: remarkStr, userName: 'Driver John' }),
    });
    const data = await res.json();
    if (data.success) {
      setActiveShipment(data.shipment);
    } else {
      alert(`Driver Transition Failed: ${data.error}`);
    }
  };

  const handlePlayVoiceGuidance = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.audioPrompt);
      utterance.rate = 0.9;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert(text.audioPrompt);
    }
  };

  const handleSubmitPOD = () => {
    if (!recipientName.trim()) {
      alert('Please enter recipient name / Andika izina ry\'uwakiriye');
      return;
    }
    setIsPODSubmitted(true);
    handleDriverStatusUpdate('DELIVERED', `POD signed by recipient ${recipientName}. Proof of delivery uploaded.`);
  };

  const handleDriverRefuelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingRefuel(true);
    try {
      const res = await fetch('/api/v1/fuel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: orgId,
          shipmentNumber: activeShipment?.shipmentNumber || 'RWA-2026-000125',
          truck: 'RAB 123A',
          driver: 'John',
          station: refuelStation,
          litres: Number(refuelLitres),
          totalCost: Number(refuelCost),
          currentOdometerKm: Number(refuelOdometer),
          openingOdometerKm: 48200,
          openingFuelLitres: 300,
          gpsDistanceKm: 1270,
          receiptPhotoUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500',
          odometerPhotoUrl: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=500',
        }),
      });
      if (res.ok) {
        setShowRefuelModal(false);
        alert('⛽ Refuel & Receipt successfully sent to Fuel Control Tower!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingRefuel(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl space-y-0 my-4">
      {/* Driver Language & Profile Header */}
      <div className="bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white font-bold shadow-sm shrink-0">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-xs">{text.consoleTitle}</div>
            <div className="text-[11px] text-sky-400 font-semibold flex items-center space-x-1 mt-0.5">
              <span>{text.driverName}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse ml-1" />
            </div>
          </div>
        </div>

        {/* Language Switcher Tabs */}
        <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
          {(['EN', 'SW', 'RW', 'FR'] as DriverLang[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setDriverLang(lang)}
              className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                driverLang === lang
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Voice Guidance Banner */}
      <div className="bg-sky-50 border-b border-sky-200 p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-semibold text-sky-900">
          <Volume2 className={`w-4 h-4 text-sky-600 shrink-0 ${isSpeaking ? 'animate-bounce text-emerald-600' : ''}`} />
          <span className="text-[11px] leading-tight line-clamp-1">{text.audioPrompt}</span>
        </div>
        <button
          onClick={handlePlayVoiceGuidance}
          className="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-bold shrink-0 shadow-xs flex items-center space-x-1 transition"
        >
          <span>{isSpeaking ? 'Speaking...' : 'Listen'}</span>
        </button>
      </div>

      {activeShipment ? (
        <div className="p-4 space-y-4 text-xs">
          {/* Visual Step Tracker */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-emerald-700 flex items-center space-x-1">
                <Check className="w-3.5 h-3.5" />
                <span>{text.step1}</span>
              </span>
              <span className="text-amber-700 flex items-center space-x-1 font-extrabold animate-pulse">
                <MapPin className="w-3.5 h-3.5" />
                <span>{text.step2}</span>
              </span>
              <span className="text-slate-500">{text.step3}</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
              <div className="w-1/3 bg-emerald-500" />
              <div className="w-1/3 bg-amber-500 animate-pulse" />
              <div className="w-1/3 bg-slate-300" />
            </div>
          </div>

          {/* Active Cargo Info Card */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block">SHIPMENT NO.</span>
                <span className="font-mono font-extrabold text-sky-700 text-base">{activeShipment.shipmentNumber}</span>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                {activeShipment.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="text-slate-900 font-bold text-xs flex items-center space-x-1.5 border-t border-slate-100 pt-2">
              <span className="text-slate-500 font-normal">Customer:</span>
              <span>{activeShipment.customerName}</span>
            </div>

            {/* Clean Route Cards */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-0.5">
                <span className="text-[9px] uppercase font-bold text-slate-500 block">START LOCATION</span>
                <div className="font-bold text-slate-900 truncate">{activeShipment.origin.name}</div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-0.5">
                <span className="text-[9px] uppercase font-bold text-slate-500 block">DESTINATION</span>
                <div className="font-bold text-slate-900 truncate">{activeShipment.destination.name}</div>
              </div>
            </div>
          </div>

          {/* ULTRA-EASY TOUCH ACTION BUTTONS */}
          <div className="space-y-2.5">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 text-center">
              TAP BUTTON TO UPDATE DRIVER STATUS
            </div>

            {/* Big Yellow Border Button */}
            <button
              onClick={() => handleDriverStatusUpdate('BORDER_ARRIVED', 'Driver tapped Border Arrived button.')}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-sm flex items-center justify-center space-x-2 border border-amber-600 transition-all active:scale-[0.98]"
            >
              <Navigation className="w-4 h-4 text-slate-950" />
              <span className="tracking-wide uppercase">{text.borderBtn}</span>
            </button>

            {/* Big Green Destination Arrived Button */}
            <button
              onClick={() => handleDriverStatusUpdate('AT_DESTINATION', 'Driver tapped Arrived Destination button.')}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center justify-center space-x-2 border border-emerald-700 transition-all active:scale-[0.98]"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span className="tracking-wide uppercase">{text.arrivedBtn}</span>
            </button>

            {/* Fuel Refuel & Receipt Button */}
            <button
              onClick={() => setShowRefuelModal(true)}
              className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center space-x-2 border border-sky-700 transition-all active:scale-[0.98]"
            >
              <Fuel className="w-4 h-4 text-white" />
              <span className="tracking-wide uppercase">{text.refuelBtn}</span>
            </button>

            <button
              onClick={() => handleDriverStatusUpdate('CHECKPOINT', 'Driver passed border checkpoint inspection.')}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl text-center border border-slate-200 flex items-center justify-center space-x-1.5 transition"
            >
              <Flag className="w-3.5 h-3.5 text-slate-600" />
              <span>{text.checkpointBtn}</span>
            </button>
          </div>

          {/* Proof of Delivery (POD) Card */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 shadow-xs">
            <div className="font-bold text-slate-900 text-xs flex items-center space-x-2 border-b border-slate-100 pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>DELIVERY PROOF &amp; SIGNATURE</span>
            </div>

            {!isPODSubmitted ? (
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[10px] text-slate-600 font-bold mb-1">RECIPIENT NAME / UWA KIRIYE</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Claire Mutoni"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-lg text-xs text-slate-900 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoUploaded(true);
                      alert('📸 Cargo Photo Captured Successfully!');
                    }}
                    className={`py-2.5 rounded-lg font-bold text-xs flex items-center justify-center space-x-1.5 border transition ${
                      photoUploaded
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Camera className="w-4 h-4 text-sky-600" />
                    <span>{photoUploaded ? text.photoDone : text.photoBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => alert('✍️ Screen Signature Saved!')}
                    className="py-2.5 bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 rounded-lg font-bold text-xs flex items-center justify-center space-x-1.5 transition"
                  >
                    <Edit3 className="w-4 h-4 text-emerald-600" />
                    <span>{text.signBtn}</span>
                  </button>
                </div>

                <button
                  onClick={handleSubmitPOD}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-xs border border-emerald-700 active:scale-[0.98] transition"
                >
                  <Send className="w-4 h-4" />
                  <span>{text.submitPodBtn}</span>
                </button>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-bold text-xs text-center space-y-0.5">
                <div>✓ JOB COMPLETE &amp; POD SUBMITTED!</div>
                <div className="text-[10px] text-emerald-600 font-mono">Invoice Released Automatically</div>
              </div>
            )}
          </div>

          {/* SOS Emergency Button */}
          <div className="pt-2 border-t border-slate-200">
            <button
              onClick={() => setShowSOSModal(true)}
              className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>{text.sosBtn}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-500 text-xs">Loading active driver job...</div>
      )}

      {/* Refuel & Receipt Photo Modal */}
      {showRefuelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center space-x-2 text-sky-700 font-bold text-xs">
                <Fuel className="w-4 h-4 text-sky-600" />
                <span>LOG REFUEL &amp; RECEIPT PHOTO</span>
              </div>
              <button onClick={() => setShowRefuelModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDriverRefuelSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1 text-[10px]">1. FUEL STATION LOCATION</label>
                <input
                  type="text"
                  required
                  value={refuelStation}
                  onChange={(e) => setRefuelStation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-1 text-[10px]">2. LITRES BOUGHT</label>
                  <input
                    type="number"
                    required
                    value={refuelLitres}
                    onChange={(e) => {
                      setRefuelLitres(e.target.value);
                      setRefuelCost((Number(e.target.value) * 1.15).toFixed(2));
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sky-700 font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1 text-[10px]">TOTAL COST ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={refuelCost}
                    onChange={(e) => setRefuelCost(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1 text-[10px]">3. CURRENT ODOMETER KM</label>
                <input
                  type="number"
                  required
                  value={refuelOdometer}
                  onChange={(e) => setRefuelOdometer(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono font-bold"
                />
              </div>

              {/* Photo Snap Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setReceiptPhotoTaken(true);
                    alert('📸 Fuel Receipt Photo captured!');
                  }}
                  className={`py-2 rounded-lg text-[11px] font-bold border flex items-center justify-center space-x-1 ${
                    receiptPhotoTaken
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5 text-amber-600" />
                  <span>{receiptPhotoTaken ? '✓ Receipt Attached' : 'Receipt Photo'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert('📸 Dashboard Odometer Photo captured!')}
                  className="py-2 rounded-lg text-[11px] font-bold bg-slate-50 text-slate-700 border border-slate-200 flex items-center justify-center space-x-1"
                >
                  <Gauge className="w-3.5 h-3.5 text-sky-600" />
                  <span>Odometer Photo</span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-200 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRefuelModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRefuel}
                  className="flex-1 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold shadow-xs transition"
                >
                  {submittingRefuel ? 'Sending...' : 'SEND REFUEL LOG'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SOS Emergency Call Modal */}
      {showSOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm p-6 space-y-4 text-center shadow-xl">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-xl border border-rose-200">
              <ShieldAlert className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">EMERGENCY DISPATCHER HELP</h3>
            <p className="text-xs text-slate-500">
              Need immediate assistance with breakdown, border delay, or accident?
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-sky-700 font-bold">
              Dispatch Hotline: +250 788 100 002
            </div>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setShowSOSModal(false)}
                className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold text-xs"
              >
                Close
              </button>
              <a
                href="tel:+250788100002"
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs flex items-center justify-center space-x-1 transition"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Dispatch</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
