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
  Gauge
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
      consoleTitle: 'Driver Job Console',
      driverName: 'John (Truck RAB 123A)',
      activeTrip: 'Current Active Trip',
      origin: 'Start: Dar es Salaam Port',
      destination: 'End: Kigali, Rwanda',
      payload: 'Cargo: Refrigerated Goods',
      step1: '1. Depart Port',
      step2: '2. Border Clearance',
      step3: '3. Destination Hub',
      borderBtn: '🛂 AT BORDER',
      arrivedBtn: '🏁 I HAVE ARRIVED',
      checkpointBtn: '🚩 CHECKPOINT PING',
      refuelBtn: '⛽ LOG REFUEL & RECEIPT',
      photoBtn: '📷 TAKE CARGO PHOTO',
      signBtn: '✍️ SIGN SCREEN',
      submitPodBtn: '✅ COMPLETE & SUBMIT',
      sosBtn: '🆘 EMERGENCY HELP',
      audioPrompt: 'John, your truck RAB 123A is near Rusumo Border. Tap yellow button at border, or green button when you reach Kigali destination.',
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
      step1: '1. Ondoka Bandarini',
      step2: '2. Ukaguzi Mpakanai',
      step3: '3. Kituo cha Kigali',
      borderBtn: '🛂 NIPO MPAKANAI',
      arrivedBtn: '🏁 NIMEFIKA KIGALI',
      checkpointBtn: '🚩 UKAGUZI',
      refuelBtn: '⛽ WEKA MAFUTA NA RISITI',
      photoBtn: '📷 PIGA PICHA MZUGO',
      signBtn: '✍️ WEKA SAHINI',
      submitPodBtn: '✅ MALIZA NA TUMA',
      sosBtn: '🆘 MSAADA WA DHARURA',
      audioPrompt: 'John, gari yako RAB 123A ipo Rusumo. Bonyeza kitufe cha manjano mpakanai, au cha kijani ukifika Kigali.',
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
      step1: '1. Guhaguruka Bandari',
      step2: '2. Kugera ku Mupaka',
      step3: '3. Kugera Kigali',
      borderBtn: '🛂 NGEZE KU MUPAKA',
      arrivedBtn: '🏁 NAGEZE KIGALI',
      checkpointBtn: '🚩 ISUZUMA',
      refuelBtn: '⛽ GUFATIRA MAFUTA NA RISITI',
      photoBtn: '📷 FATA IFOTO Y\'IBIZIGO',
      signBtn: '✍️ SHYIRAHO SINIYA',
      submitPodBtn: '✅ OHEREZA POD',
      sosBtn: '🆘 TABARA / MSAADA',
      audioPrompt: 'John, ikamyo yawe RAB 123A igeze Rusumo. Kanda ku kifungo cy\'umuhondo ku mupaka, cyangwa icy\'icyatsi wageze Kigali.',
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
      step1: '1. Départ Port',
      step2: '2. Contrôle Frontière',
      step3: '3. Centre Kigali',
      borderBtn: '🛂 Á LA FRONTIÈRE',
      arrivedBtn: '🏁 JE SUIS ARRIVÉ',
      checkpointBtn: '🚩 POINT DE CONTRÔLE',
      refuelBtn: '⛽ RECHARGE CARBURANT & REÇU',
      photoBtn: '📷 PRENDRE PHOTO',
      signBtn: '✍️ SIGNER L\'ÉCRAN',
      submitPodBtn: '✅ VALIDER & ENVOYER',
      sosBtn: '🆘 SOS URGENCE',
      audioPrompt: 'John, votre camion RAB 123A est près de la frontière Rusumo. Appuyez sur le bouton jaune à la frontière ou vert à destination.',
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
      alert('Please write recipient name / Andika izina ry\'uwakiriye');
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
    <div className="max-w-md mx-auto bg-white border-2 border-sky-500/40 rounded-3xl overflow-hidden shadow-2xl space-y-0 my-3">
      {/* Driver Language & Easy Mode Header */}
      <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-2xl bg-sky-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-sky-500/30">
            🚛
          </div>
          <div>
            <div className="font-bold text-slate-900 text-xs">{text.consoleTitle}</div>
            <div className="text-[11px] text-sky-400 font-extrabold">{text.driverName}</div>
          </div>
        </div>

        {/* Easy Language Switcher */}
        <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200">
          {(['EN', 'SW', 'RW', 'FR'] as DriverLang[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setDriverLang(lang)}
              className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                driverLang === lang
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Voice Guidance / Audio Prompt Banner */}
      <div className="bg-sky-950/60 border-b border-sky-500/30 p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-semibold text-sky-200">
          <Volume2 className={`w-4 h-4 text-sky-400 shrink-0 ${isSpeaking ? 'animate-bounce text-emerald-400' : ''}`} />
          <span className="text-[11px] leading-tight line-clamp-1">{text.audioPrompt}</span>
        </div>
        <button
          onClick={handlePlayVoiceGuidance}
          className="px-2.5 py-1 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-[10px] font-bold shrink-0 shadow-md flex items-center space-x-1"
        >
          <span>🔊 {isSpeaking ? 'Speaking...' : 'Listen'}</span>
        </button>
      </div>

      {activeShipment ? (
        <div className="p-4 space-y-4 text-xs">
          {/* Visual Step Tracker */}
          <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
              <span className="text-emerald-400">1. Dar Port ✓</span>
              <span className="text-amber-400 animate-pulse">2. Border 📍</span>
              <span className="text-slate-500">3. Kigali 🏁</span>
            </div>
            <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden flex">
              <div className="w-1/3 bg-emerald-500" />
              <div className="w-1/3 bg-amber-500 animate-pulse" />
              <div className="w-1/3 bg-slate-700" />
            </div>
          </div>

          {/* Active Cargo Card */}
          <div className="p-3.5 bg-white rounded-2xl border border-sky-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-extrabold text-sky-400 text-base">{activeShipment.shipmentNumber}</span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] border border-emerald-500/30">
                {activeShipment.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="text-slate-800 font-bold text-xs">{activeShipment.customerName}</div>

            {/* Visual Route Cards */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl space-y-0.5">
                <span className="text-[9px] uppercase font-bold text-emerald-400 block">START LOCATION</span>
                <div className="font-bold text-slate-900 truncate">{activeShipment.origin.name}</div>
              </div>
              <div className="p-2.5 bg-sky-950/40 border border-sky-500/30 rounded-xl space-y-0.5">
                <span className="text-[9px] uppercase font-bold text-sky-400 block">DESTINATION</span>
                <div className="font-bold text-slate-900 truncate">{activeShipment.destination.name}</div>
              </div>
            </div>
          </div>

          {/* ULTRA-EASY EXTRA LARGE TOUCH BUTTONS */}
          <div className="space-y-2.5">
            <div className="text-[11px] uppercase font-extrabold tracking-wider text-slate-500 text-center">
              👇 TAP BIG BUTTON TO UPDATE STATUS
            </div>

            {/* Big Yellow Border Button */}
            <button
              onClick={() => handleDriverStatusUpdate('BORDER_ARRIVED', 'Driver tapped Border Arrived button.')}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2 border-2 border-amber-300 transition-transform active:scale-95"
            >
              <span className="text-xl">🛂</span>
              <span className="tracking-wide uppercase">{text.borderBtn}</span>
            </button>

            {/* Big Green Destination Arrived Button */}
            <button
              onClick={() => handleDriverStatusUpdate('AT_DESTINATION', 'Driver tapped Arrived Destination button.')}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center space-x-2 border-2 border-emerald-400 transition-transform active:scale-95"
            >
              <span className="text-xl">🏁</span>
              <span className="tracking-wide uppercase">{text.arrivedBtn}</span>
            </button>

            {/* Fuel Refuel & Receipt Button */}
            <button
              onClick={() => setShowRefuelModal(true)}
              className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-black text-xs rounded-2xl shadow-lg shadow-sky-600/30 flex items-center justify-center space-x-2 border-2 border-sky-400 transition-transform active:scale-95"
            >
              <Fuel className="w-4 h-4" />
              <span className="tracking-wide uppercase">{text.refuelBtn}</span>
            </button>

            <button
              onClick={() => handleDriverStatusUpdate('CHECKPOINT', 'Driver passed border checkpoint inspection.')}
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl text-center border border-slate-200 flex items-center justify-center space-x-1.5"
            >
              <span>🚩</span>
              <span>{text.checkpointBtn}</span>
            </button>
          </div>

          {/* Proof of Delivery (POD) */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
            <div className="font-extrabold text-slate-800 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>DELIVERY PROOF &amp; SIGNATURE</span>
            </div>

            {!isPODSubmitted ? (
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold mb-1">RECIPIENT NAME / UWA KIRIYE</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Claire Mutoni"
                    className="w-full px-3.5 py-3 bg-white border-2 border-slate-200 focus:border-sky-500 rounded-xl text-xs text-slate-900 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoUploaded(true);
                      alert('📸 Cargo Photo Captured Successfully!');
                    }}
                    className={`py-3 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-1.5 border-2 transition ${
                      photoUploaded
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-sky-500'
                    }`}
                  >
                    <Camera className="w-4 h-4 text-sky-400" />
                    <span>{photoUploaded ? text.photoDone : text.photoBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => alert('✍️ Screen Signature Saved!')}
                    className="py-3 bg-white text-slate-800 border-2 border-slate-200 hover:border-emerald-500 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-1.5"
                  >
                    <Edit3 className="w-4 h-4 text-emerald-400" />
                    <span>{text.signBtn}</span>
                  </button>
                </div>

                <button
                  onClick={handleSubmitPOD}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl flex items-center justify-center space-x-2 shadow-xl shadow-emerald-500/30 border-2 border-emerald-400 active:scale-95 transition-transform"
                >
                  <Send className="w-4 h-4" />
                  <span>{text.submitPodBtn}</span>
                </button>
              </div>
            ) : (
              <div className="p-3 bg-emerald-500/20 border-2 border-emerald-500/40 rounded-xl text-emerald-300 font-black text-xs text-center space-y-1">
                <div>✓ JOB COMPLETE &amp; POD SUBMITTED!</div>
                <div className="text-[10px] text-emerald-400 font-mono">Invoice Released Automatically</div>
              </div>
            )}
          </div>

          {/* SOS Emergency Button */}
          <div className="pt-2 border-t border-slate-200">
            <button
              onClick={() => setShowSOSModal(true)}
              className="w-full py-3 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border-2 border-rose-500/40 rounded-2xl font-black text-xs flex items-center justify-center space-x-2 shadow-lg"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>{text.sosBtn}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-500 text-xs">Loading active driver job...</div>
      )}

      {/* Refuel & Receipt Photo Modal */}
      {showRefuelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm p-4">
          <div className="bg-white border-2 border-sky-500 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center space-x-2 text-sky-400 font-bold text-xs">
                <Fuel className="w-4 h-4" />
                <span>LOG REFUEL &amp; RECEIPT PHOTO</span>
              </div>
              <button onClick={() => setShowRefuelModal(false)} className="text-slate-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDriverRefuelSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1 text-[10px]">1. FUEL STATION LOCATION</label>
                <input
                  type="text"
                  required
                  value={refuelStation}
                  onChange={(e) => setRefuelStation(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 text-[10px]">2. LITRES BOUGHT</label>
                  <input
                    type="number"
                    required
                    value={refuelLitres}
                    onChange={(e) => {
                      setRefuelLitres(e.target.value);
                      setRefuelCost((Number(e.target.value) * 1.15).toFixed(2));
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sky-400 font-black text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1 text-[10px]">TOTAL COST ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={refuelCost}
                    onChange={(e) => setRefuelCost(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 text-[10px]">3. CURRENT ODOMETER KM</label>
                <input
                  type="number"
                  required
                  value={refuelOdometer}
                  onChange={(e) => setRefuelOdometer(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono font-bold"
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
                  className={`py-2.5 rounded-xl text-[11px] font-bold border flex items-center justify-center space-x-1 ${
                    receiptPhotoTaken
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                      : 'bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span>{receiptPhotoTaken ? '✓ Receipt Attached' : '📷 Receipt Photo'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert('📸 Dashboard Odometer Photo captured!')}
                  className="py-2.5 rounded-xl text-[11px] font-bold bg-slate-50 text-slate-800 border border-slate-200 flex items-center justify-center space-x-1"
                >
                  <Gauge className="w-3.5 h-3.5 text-sky-400" />
                  <span>📷 Odometer Photo</span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-200 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRefuelModal(false)}
                  className="flex-1 py-2.5 bg-slate-50 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRefuel}
                  className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-extrabold shadow-lg shadow-sky-600/30"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm p-4">
          <div className="bg-white border-2 border-rose-500 rounded-3xl w-full max-w-sm p-6 space-y-4 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-xl">
              🆘
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">EMERGENCY DISPATCHER HELP</h3>
            <p className="text-xs text-slate-500">
              Need immediate assistance with breakdown, border delay, or accident?
            </p>
            <div className="p-3 bg-white rounded-2xl border border-slate-200 text-xs font-mono text-sky-400 font-bold">
              Dispatch Hotline: +250 788 100 002
            </div>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setShowSOSModal(false)}
                className="flex-1 py-2.5 bg-slate-50 text-slate-700 rounded-xl font-bold text-xs"
              >
                Close
              </button>
              <a
                href="tel:+250788100002"
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-1"
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
