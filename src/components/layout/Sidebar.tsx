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
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const sections = [
    {
      title: 'Operations Core',
      items: [
        { href: '/', label: 'Control Tower', icon: LayoutDashboard, badge: 'Live' },
        { href: '/shipments', label: 'Shipments', icon: Boxes },
        { href: '/tracking', label: 'Live GPS Map', icon: MapPin },
        { href: '/driver', label: 'Driver PWA App', icon: Smartphone, highlight: true },
        { href: '/customer', label: 'Customer Portal', icon: Users2 },
      ],
    },
    {
      title: 'Transport & Fleet',
      items: [
        { href: '/fleet', label: 'Fleet & Trucks', icon: Truck },
        { href: '/drivers', label: 'Driver Roster', icon: UserSquare2 },
        { href: '/routes', label: 'Routes & Checkpoints', icon: Route },
        { href: '/fuel', label: 'Fuel Audit', icon: Fuel },
        { href: '/maintenance', label: 'Maintenance', icon: Wrench },
      ],
    },
    {
      title: 'Cargo Operations',
      items: [
        { href: '/loading', label: 'Cargo Loading', icon: Package },
        { href: '/warehouse', label: 'Warehouse & Inventory', icon: Boxes },
        { href: '/documents', label: 'Documents & Customs', icon: FileText },
        { href: '/pod', label: 'Proof of Delivery', icon: CheckCircle2 },
      ],
    },
    {
      title: 'Commercial',
      items: [
        { href: '/clients', label: 'Client CRM', icon: Building2 },
        { href: '/quotes', label: 'Quotes & Rates', icon: Tag },
        { href: '/invoices', label: 'Finance & Invoices', icon: Receipt },
        { href: '/vendors', label: 'Vendors & Carriers', icon: Truck },
      ],
    },
    {
      title: 'Automation & AI',
      items: [
        { href: '/automation', label: 'Automation Rules', icon: Zap },
        { href: '/ai', label: 'AI Assistant & OCR', icon: Bot, highlight: true },
        { href: '/exceptions', label: 'Exceptions', icon: AlertTriangle, color: 'text-amber-400' },
        { href: '/analytics', label: 'Analytics & BI', icon: BarChart3 },
        { href: '/productivity', label: 'Productivity & Profit', icon: TrendingUp },
      ],
    },
    {
      title: 'Administration',
      items: [
        { href: '/users', label: 'Users & RBAC', icon: Shield },
        { href: '/audit', label: 'Audit Log', icon: Lock },
        { href: '/settings', label: 'System Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className={`w-60 border-r flex flex-col justify-between hidden lg:flex shrink-0 h-screen overflow-y-auto transition-colors ${
      isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-200'
    }`}>
      <div className="py-4 px-3 space-y-4">
        {sections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className={`px-3 text-[10px] uppercase tracking-wider font-semibold ${
              isLight ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
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
                    <span>{item.label}</span>
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

      <div className={`p-3 border-t ${isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950/40'}`}>
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
    </aside>
  );
};
