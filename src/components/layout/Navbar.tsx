'use client';

import React, { useState } from 'react';
import {
  Building2,
  UserCheck,
  Search,
  Command,
  Bell,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';
import { UserRole } from '@/types';
import { DPWorldLogo } from '@/components/common/DPWorldLogo';
import { useTheme } from '@/context/ThemeContext';

interface NavbarProps {
  currentOrgId: string;
  onOrgChange: (orgId: string) => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenAI: () => void;
  onOpenCommandPalette: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentOrgId,
  onOrgChange,
  currentRole,
  onRoleChange,
  onOpenAI,
  onOpenCommandPalette,
  searchQuery,
  onSearchChange,
  theme: propTheme,
  onToggleTheme,
}) => {
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const contextTheme = useTheme();

  const activeTheme = propTheme || contextTheme.theme || 'light';
  const handleToggleTheme = onToggleTheme || contextTheme.toggleTheme;
  const isLight = activeTheme === 'light';

  const orgs = [
    { id: 'org-dpw-rwanda', name: 'DP World Rwanda', slug: 'dpw-rwanda' },
    { id: 'org-apex-001', name: 'Apex Global Logistics', slug: 'apex' },
    { id: 'org-transafrica-002', name: 'TransAfrica Express', slug: 'transafrica' },
  ];

  const roles: UserRole[] = [
    'ORG_ADMIN',
    'OPERATIONS_MANAGER',
    'DISPATCHER',
    'FLEET_MANAGER',
    'DRIVER',
    'FINANCE_MANAGER',
    'CUSTOMER_ADMIN',
  ];

  const currentOrg = orgs.find((o) => o.id === currentOrgId) || orgs[0];

  return (
    <header className={`h-16 px-4 flex items-center justify-between sticky top-0 z-40 border-b transition-colors ${
      isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-slate-900 border-slate-800 text-white'
    }`}>
      {/* Left: Official DP World Logo & Tenant Switcher */}
      <div className="flex items-center space-x-4">
        <DPWorldLogo theme={isLight ? 'light' : 'dark'} className="h-8" />

        <div className={`h-6 w-px ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />

        {/* Tenant Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowOrgDropdown(!showOrgDropdown);
              setShowRoleDropdown(false);
            }}
            className={`flex items-center space-x-2 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-sky-600" />
            <span className="truncate max-w-[160px] font-semibold">{currentOrg.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showOrgDropdown && (
            <div className={`absolute left-0 mt-2 w-56 rounded-xl shadow-2xl py-1 z-50 border ${
              isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-850 border-slate-700 text-white'
            }`}>
              <div className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold border-b ${
                isLight ? 'text-slate-500 border-slate-100' : 'text-slate-400 border-slate-800'
              }`}>
                Switch Tenant Environment
              </div>
              {orgs.map((org) => (
                <button
                  key={org.id}
                  onClick={() => {
                    onOrgChange(org.id);
                    setShowOrgDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between ${
                    isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'
                  } ${
                    org.id === currentOrgId
                      ? 'text-sky-600 font-semibold bg-sky-50'
                      : isLight ? 'text-slate-700' : 'text-slate-300'
                  }`}
                >
                  <span>{org.name}</span>
                  {org.id === currentOrgId && <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center: Search & Command Palette */}
      <div className="flex-1 max-w-xl mx-6 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search shipment number, container, truck registration, driver..."
            className={`w-full pl-9 pr-24 py-1.5 rounded-lg text-xs transition-all ${
              isLight
                ? 'bg-slate-100 border border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-sky-600'
                : 'bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:border-sky-500'
            }`}
          />
          <button
            onClick={onOpenCommandPalette}
            className={`absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold px-2 py-0.5 rounded border flex items-center space-x-1 ${
              isLight ? 'bg-slate-200 border-slate-300 text-slate-600' : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Command className="w-3 h-3" />
            <span>K</span>
          </button>
        </div>
      </div>

      {/* Right: Theme Toggle, AI Ops, Role Switcher & Notifications */}
      <div className="flex items-center space-x-3">
        {/* White / Dark Mode Toggle */}
        {handleToggleTheme && (
          <button
            onClick={handleToggleTheme}
            title={isLight ? 'Switch to Dark Theme' : 'Switch to White Background Theme'}
            className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
            }`}
          >
            {isLight ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
            <span className="hidden sm:inline text-[11px] font-bold">
              {isLight ? 'White Theme' : 'Dark Theme'}
            </span>
          </button>
        )}

        {/* AI Operations Assistant Button */}
        <button
          onClick={onOpenAI}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-500/20 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>AI Ops</span>
        </button>

        {/* Role Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleDropdown(!showRoleDropdown);
              setShowOrgDropdown(false);
            }}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/60'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden sm:inline font-bold">{currentRole.replace(/_/g, ' ')}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showRoleDropdown && (
            <div className={`absolute right-0 mt-2 w-52 rounded-xl shadow-2xl py-1 z-50 border ${
              isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-850 border-slate-700 text-white'
            }`}>
              <div className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold border-b ${
                isLight ? 'text-slate-500 border-slate-100' : 'text-slate-400 border-slate-800'
              }`}>
                Switch RBAC Role Context
              </div>
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    onRoleChange(r);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between ${
                    isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'
                  } ${
                    r === currentRole
                      ? 'text-sky-600 font-semibold bg-sky-50'
                      : isLight ? 'text-slate-700' : 'text-slate-300'
                  }`}
                >
                  <span>{r.replace(/_/g, ' ')}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <button className={`relative p-2 rounded-lg transition-colors ${
          isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`}>
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
        </button>
      </div>
    </header>
  );
};
