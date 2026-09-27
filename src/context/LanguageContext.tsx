'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'rw';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation & Layout
    controlTower: 'Control Tower',
    shipments: 'Shipments',
    liveGpsMap: 'Live GPS Map',
    driverApp: 'Driver PWA App',
    customerPortal: 'Customer Portal',
    fleet: 'Fleet & Trucks',
    drivers: 'Driver Roster',
    routes: 'Routes & Checkpoints',
    fuel: 'Fuel Audit',
    maintenance: 'Maintenance',
    loading: 'Cargo Loading',
    warehouse: 'Warehouse & Inventory',
    documents: 'Documents & Customs',
    pod: 'Proof of Delivery',
    clients: 'Client CRM',
    quotes: 'Quotes & Rates',
    invoices: 'Finance & Invoices',
    vendors: 'Vendors & Carriers',
    automation: 'Automation Rules',
    aiAssistant: 'AI Assistant & OCR',
    exceptions: 'Exceptions',
    analytics: 'Analytics & BI',
    productivity: 'Productivity & Profit',
    users: 'Users & RBAC',
    audit: 'Audit Log',
    settings: 'System Settings',

    // Section Headers
    operationsCore: 'Operations Core',
    transportFleet: 'Transport & Fleet',
    cargoOperations: 'Cargo Operations',
    commercial: 'Commercial',
    automationAi: 'Automation & AI',
    administration: 'Administration',

    // Actions & Buttons
    switchTenant: 'Switch Tenant Environment',
    whiteTheme: 'White Theme',
    darkTheme: 'Dark Theme',
    aiOps: 'AI Ops',
    searchPlaceholder: 'Search shipment number, container, truck registration, driver...',
    registerDriver: 'Register Driver',
    createShipment: 'Create Shipment',
    assignDock: 'Assign Loading Dock',
    recordFuel: 'Record Fuel Fill',
    addCheckpoint: 'Add Checkpoint',
    viewWaypoints: 'View Waypoints',
    filterByStatus: 'Filter by Status',

    // Statuses
    available: 'AVAILABLE',
    onTrip: 'ON_TRIP',
    inTransit: 'IN_TRANSIT',
    delivered: 'DELIVERED',
    exception: 'EXCEPTION',
    open: 'OPEN',
    caution: 'CAUTION',
  },
  rw: {
    // Navigation & Layout
    controlTower: "Umunara w'Ubugenzuzi",
    shipments: 'Imizigo n\'Ibyoherezwa',
    liveGpsMap: 'Ikarita ya GPS mu gihe nyacyo',
    driverApp: 'Porogaramu y\'Abashoferi (PWA)',
    customerPortal: 'Urubuga rw\'Abakiriya',
    fleet: 'Amakamyo n\'Ibinyabiziga',
    drivers: 'Urutonde rw\'Abashoferi',
    routes: 'Inzira n\'Ibyapa by\'Ubugenzuzi',
    fuel: 'Ubugenzuzi bw\'Icombustible',
    maintenance: 'Gusana no Kwitaho Amakamyo',
    loading: 'Gupakirira Imizigo',
    warehouse: 'Ububiko n\'Ibikoresho',
    documents: 'Inyandiko z\'Urusange n\'Ibyemezo',
    pod: 'Icyemezo cyo Guhereza (e-POD)',
    clients: 'Abakiriya n\'Isoko (CRM)',
    quotes: 'Ibiciro no Kwaka Izina',
    invoices: 'Imari n\'Fagitire',
    vendors: 'Abatuzi n\'Abatwara Imizigo',
    automation: 'Amategeko y\'Ikoranabuhanga',
    aiAssistant: 'Umufasha mu Ikoranabuhanga (AI)',
    exceptions: 'Ibibazo bitunguranye',
    analytics: 'Inyandiko n\'Ubushakashatsi',
    productivity: 'Umusaruro n\'Inyungu',
    users: 'Abakoresha n\'Ububasha',
    audit: 'Inyandiko z\'Ubugenzuzi',
    settings: 'Ibyerekeye Sisitemu',

    // Section Headers
    operationsCore: 'Ibikorwa nyamukuru',
    transportFleet: 'Transport n\'Amakamyo',
    cargoOperations: 'Ibikorwa by\'Imizigo',
    commercial: 'Ubucuruzi n\'Imari',
    automationAi: 'Ikoranabuhanga & AI',
    administration: 'Ubuyobozi w\'Sisitemu',

    // Actions & Buttons
    switchTenant: 'Guhindura Umukiriya',
    whiteTheme: 'Mande Yerurutse',
    darkTheme: 'Mande Yumukara',
    aiOps: 'AI Umufasha',
    searchPlaceholder: 'Shakisha numero y\'imizigo, ikonteyineri, ikamyo, umushoferi...',
    registerDriver: 'Andika Umushoferi',
    createShipment: 'Kurema Umuzigo',
    assignDock: 'Guha Ikamyo Umwanya',
    recordFuel: 'Andika Essence / Combustible',
    addCheckpoint: 'Ongeraho Icyapa',
    viewWaypoints: 'Reba Inzira',
    filterByStatus: 'Gushungura ku Miterere',

    // Statuses
    available: 'ABONEKA',
    onTrip: 'ARI MU RUHENDO',
    inTransit: 'ARI MU NZIRA',
    delivered: 'BYAHEREJWE',
    exception: 'ICYITONDERWA',
    open: 'BIRAFUNGURE',
    caution: 'KWITONDA',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('logios_lang') as Language;
      if (saved === 'en' || saved === 'rw') {
        setLanguageState(saved);
      }
    } catch (e) {}
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('logios_lang', lang);
    } catch (e) {}
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
