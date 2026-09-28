'use client';

import React, { useState } from 'react';
import {
  Building2,
  UserCheck,
  Search,
  Command,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Sun,
  Moon,
  Globe,
  Menu,
} from 'lucide-react';
import { UserRole } from '@/types';
import { DPWorldLogo } from '@/components/common/DPWorldLogo';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

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
  onToggleMobileMenu?: () => void;
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
  onToggleMobileMenu,
}) => {
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const contextTheme = useTheme();
  const { language, setLanguage, t } = useLanguage();

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
    <header className={`h-16 px-2.5 sm:px-4 flex items-center justify-between sticky top-0 z-40 border-b transition-colors w-full max-w-full overflow-hidden ${
      isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-slate-900 border-slate-800 text-white'
    }`}>
      {/* Left: Mobile Menu Toggle & DP World Logo */}
      <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className={`p-1.5 sm:p-2 rounded-lg border lg:hidden ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
            title="Toggle Navigation Menu"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}

        <DPWorldLogo theme={isLight ? 'light' : 'dark'} className="h-5 sm:h-7 md:h-8" />

        <div className={`h-5 w-px hidden sm:block ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />

        {/* Tenant Switcher (Hidden on small screens < sm to prevent header overflow) */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => {
              setShowOrgDropdown(!showOrgDropdown);
              setShowRoleDropdown(false);
              setShowLangDropdown(false);
            }}
            className={`flex items-center space-x-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span className="truncate max-w-[110px] md:max-w-[160px] font-semibold">{currentOrg.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showOrgDropdown && (
            <div className={`absolute left-0 mt-2 w-56 rounded-xl shadow-2xl py-1 z-50 border ${
              isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-850 border-slate-700 text-white'
            }`}>
              <div className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold border-b ${
                isLight ? 'text-slate-500 border-slate-100' : 'text-slate-400 border-slate-800'
              }`}>
                {t('switchTenant')}
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

      {/* Center: Search & Command Palette (Hidden on mobile/tablet < lg) */}
      <div className="flex-1 max-w-xl mx-4 hidden lg:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('searchPlaceholder')}
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

      {/* Right: Language Switcher, Theme Toggle, AI Ops & Role Switcher */}
      <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
        {/* Language Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowLangDropdown(!showLangDropdown);
              setShowOrgDropdown(false);
              setShowRoleDropdown(false);
            }}
            className={`flex items-center space-x-0.5 sm:space-x-1 px-1.5 sm:px-2 py-1.5 rounded-lg border text-xs font-semibold ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-sky-500" />
            <span className="font-bold text-[10px] sm:text-[11px]">{language === 'rw' ? '🇷🇼' : '🇬🇧'}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:inline" />
          </button>

          {showLangDropdown && (
            <div className={`absolute right-0 mt-2 w-40 rounded-xl shadow-2xl py-1 z-50 border ${
              isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-850 border-slate-700 text-white'
            }`}>
              <div className="px-3 py-1 text-[10px] uppercase font-semibold text-slate-400 border-b border-slate-100 dark:border-slate-800">
                Select Language
              </div>
              <button
                onClick={() => {
                  setLanguage('en');
                  setShowLangDropdown(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between ${
                  language === 'en' ? 'text-sky-600 font-bold bg-sky-50 dark:bg-sky-950/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>🇬🇧 English</span>
                {language === 'en' && <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />}
              </button>
              <button
                onClick={() => {
                  setLanguage('rw');
                  setShowLangDropdown(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between ${
                  language === 'rw' ? 'text-sky-600 font-bold bg-sky-50 dark:bg-sky-950/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>🇷🇼 Kinyarwanda</span>
                {language === 'rw' && <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />}
              </button>
            </div>
          )}
        </div>

        {/* White / Dark Mode Toggle */}
        {handleToggleTheme && (
          <button
            onClick={handleToggleTheme}
            title={isLight ? 'Switch to Dark Theme' : 'Switch to White Background Theme'}
            className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-1 transition-all ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
            }`}
          >
            {isLight ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        )}

        {/* AI Operations Assistant Button */}
        <button
          onClick={onOpenAI}
          className="flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-500/20 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden md:inline">{t('aiOps')}</span>
        </button>

        {/* Role Selector (Hidden on mobile < md) */}
        <div className="relative hidden md:block">
          <button
            onClick={() => {
              setShowRoleDropdown(!showRoleDropdown);
              setShowOrgDropdown(false);
              setShowLangDropdown(false);
            }}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/60'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden lg:inline font-bold">{currentRole.replace(/_/g, ' ')}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showRoleDropdown && (
            <div className={`absolute right-0 mt-2 w-52 rounded-xl shadow-2xl py-1 z-50 border ${
              isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-850 border-slate-700 text-white'
            }`}>
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold text-slate-400 border-b border-slate-100 dark:border-slate-800">
                Switch Role Context
              </div>
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    onRoleChange(r);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs ${
                    isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800'
                  } ${r === currentRole ? 'text-sky-600 font-semibold bg-sky-50' : ''}`}
                >
                  {r.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
