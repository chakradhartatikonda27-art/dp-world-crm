'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Truck,
  MapPin,
  Smartphone,
  Users2,
  FileText,
  AlertTriangle,
  Zap,
  BarChart3,
  Receipt,
  UserSquare2,
  Boxes,
  Route,
  Fuel,
  Wrench,
  Package,
  Building2,
  Tag,
  Bot,
  TrendingUp,
  Shield,
  Lock,
  Settings,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen = false, onCloseMobile }) => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isLight = theme === 'light';

  const sections = [
    {
      titleKey: 'operationsCore',
      items: [
        { href: '/', labelKey: 'controlTower', icon: LayoutDashboard, badge: 'Live' },
        { href: '/shipments', labelKey: 'shipments', icon: Boxes },
        { href: '/tracking', labelKey: 'liveGpsMap', icon: MapPin },
        { href: '/driver', labelKey: 'driverApp', icon: Smartphone, highlight: true },
        { href: '/customer', labelKey: 'customerPortal', icon: Users2 },
      ],
    },
    {
      titleKey: 'transportFleet',
      items: [
        { href: '/fleet', labelKey: 'fleet', icon: Truck },
        { href: '/drivers', labelKey: 'drivers', icon: UserSquare2 },
        { href: '/routes', labelKey: 'routes', icon: Route },
        { href: '/fuel', labelKey: 'fuel', icon: Fuel },
        { href: '/maintenance', labelKey: 'maintenance', icon: Wrench },
      ],
    },
    {
      titleKey: 'cargoOperations',
      items: [
        { href: '/loading', labelKey: 'loading', icon: Package },
        { href: '/warehouse', labelKey: 'warehouse', icon: Boxes },
        { href: '/documents', labelKey: 'documents', icon: FileText },
        { href: '/pod', labelKey: 'pod', icon: CheckCircle2 },
      ],
    },
    {
      titleKey: 'commercial',
      items: [
        { href: '/clients', labelKey: 'clients', icon: Building2 },
        { href: '/quotes', labelKey: 'quotes', icon: Tag },
        { href: '/invoices', labelKey: 'invoices', icon: Receipt },
        { href: '/vendors', labelKey: 'vendors', icon: Truck },
      ],
    },
    {
      titleKey: 'automationAi',
      items: [
        { href: '/automation', labelKey: 'automation', icon: Zap },
        { href: '/ai', labelKey: 'aiAssistant', icon: Bot, highlight: true },
        { href: '/exceptions', labelKey: 'exceptions', icon: AlertTriangle, color: 'text-amber-400' },
        { href: '/analytics', labelKey: 'analytics', icon: BarChart3 },
        { href: '/productivity', labelKey: 'productivity', icon: TrendingUp },
      ],
    },
    {
      titleKey: 'administration',
      items: [
        { href: '/users', labelKey: 'users', icon: Shield },
        { href: '/audit', labelKey: 'audit', icon: Lock },
        { href: '/settings', labelKey: 'settings', icon: Settings },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between py-4 px-3">
      {/* Mobile Drawer Header */}
      <div className="flex items-center justify-between lg:hidden mb-2 pb-2 border-b border-slate-200 dark:border-slate-800">
        <span className="font-bold text-xs tracking-wider uppercase text-slate-500">
          Navigation Menu
        </span>
        <button
          onClick={onCloseMobile}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4 overflow-y-auto flex-1 pr-1">
        {sections.map((section) => (
          <div key={section.titleKey} className="space-y-1">
            <div className={`px-3 text-[10px] uppercase tracking-wider font-semibold ${
              isLight ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {t(section.titleKey)}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onCloseMobile?.()}
                  className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? isLight
                        ? 'bg-sky-50 text-sky-700 border border-sky-200 font-semibold'
                        : 'bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold'
                      : item.highlight
                      ? isLight
                        ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                        : 'bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/20'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-500' : (item as any).color || (isLight ? 'text-slate-500' : 'text-slate-400')}`} />
                    <span>{t(item.labelKey)}</span>
                  </div>
                  {(item as any).badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-500 border border-rose-500/30 animate-pulse">
                      {(item as any).badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      <div className={`mt-4 p-3 border-t ${isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950/40'}`}>
        <div className={`p-2.5 rounded-xl border text-xs ${isLight ? 'bg-white border-slate-200' : 'bg-slate-850 border-slate-800'}`}>
          <div className={`font-semibold flex items-center justify-between ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
            <span>System Telemetry</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className={`mt-1 text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            GPS Ingestion: <span className="text-emerald-600 font-mono font-semibold">1,420 pings/m</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Permanent Sidebar */}
      <aside className={`w-60 border-r hidden lg:flex shrink-0 h-screen overflow-y-auto transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-200'
      }`}>
        {sidebarContent}
      </aside>

      {/* Mobile / Tablet Overlay Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={onCloseMobile}
          />

          {/* Sliding Drawer Container */}
          <div className={`relative w-72 max-w-[85vw] h-full shadow-2xl transition-all ${
            isLight ? 'bg-white text-slate-800' : 'bg-slate-900 text-slate-200'
          }`}>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
