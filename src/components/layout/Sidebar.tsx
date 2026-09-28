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
  Building,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen = false, onCloseMobile }) => {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { canAccessRoute, currentRole } = useAuth();

  const allSections = [
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
        { href: '/exceptions', labelKey: 'exceptions', icon: AlertTriangle, color: 'text-amber-500' },
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

  // Filter items in each section based on role permissions
  const sections = allSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => canAccessRoute(item.href)),
    }))
    .filter((section) => section.items.length > 0);

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between py-4 px-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Mobile Drawer Header */}
      <div className="flex items-center justify-between lg:hidden mb-2 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <Building className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span className="font-bold text-xs tracking-wider uppercase text-slate-800 dark:text-slate-200">
            DP World Rwanda
          </span>
        </div>
        <button
          onClick={onCloseMobile}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4 overflow-y-auto flex-1 pr-1">
        {/* Active Role Indicator Badge in Sidebar */}
        <div className="px-3 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/50 flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Role View</span>
          <span className="text-[10px] font-extrabold font-mono text-sky-700 dark:text-sky-400">{currentRole.replace(/_/g, ' ')}</span>
        </div>

        {sections.map((section) => (
          <div key={section.titleKey} className="space-y-1">
            <div className="px-3 text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
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
                      ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800 font-semibold shadow-xs'
                      : item.highlight
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800/50'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800 hover:text-slate-900 dark:text-slate-100 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${(item as any).color || ''}`} />
                    <span>{t(item.labelKey)}</span>
                  </div>
                  {(item as any).badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {(item as any).badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="w-60 flex-shrink-0 hidden lg:block border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-200 h-[calc(100vh-4rem)] sticky top-16">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[9500] lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Panel */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl transition-transform bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
