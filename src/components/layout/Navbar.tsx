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
  Globe,
  Menu,
  Sun,
  Moon,
} from 'lucide-react';
import { UserRole } from '@/types';
import { DPWorldLogo } from '@/components/common/DPWorldLogo';
import { useLanguage } from '@/context/LanguageContext';
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
  onToggleMobileMenu,
}) => {
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

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
    <header className="h-16 px-2.5 sm:px-4 flex items-center justify-between sticky top-0 z-[100000] border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm w-full max-w-full transition-colors duration-200">
      {/* Left: Mobile Menu Toggle & DP World Logo */}
      <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="p-1.5 sm:p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 lg:hidden"
            title="Toggle Navigation Menu"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}

        <DPWorldLogo theme={theme === 'dark' ? 'dark' : 'light'} className="h-5 sm:h-7 md:h-8" />

        <div className="h-5 w-px hidden sm:block bg-slate-200 dark:bg-slate-800" />

        {/* Tenant Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowOrgDropdown(!showOrgDropdown);
              setShowRoleDropdown(false);
              setShowLangDropdown(false);
            }}
            className="flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all"
          >
            <Building2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
            <span className="truncate max-w-[85px] sm:max-w-[120px] md:max-w-[160px] font-semibold">{currentOrg.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {showOrgDropdown && (
            <div className="absolute left-0 mt-2 w-56 rounded-2xl shadow-2xl py-1 z-[100001] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800 text-slate-500">
                {t('switchTenant')}
              </div>
              {orgs.map((org) => (
                <button
                  key={org.id}
                  onClick={() => {
                    onOrgChange(org.id);
                    setShowOrgDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800 ${
                    org.id === currentOrgId ? 'text-sky-600 dark:text-sky-400 font-bold bg-sky-50 dark:bg-sky-950/40' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{org.name}</span>
                  {org.id === currentOrgId && <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center: Search & Command Palette */}
      <div className="flex-1 max-w-xl mx-4 hidden lg:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-9 pr-24 py-1.5 rounded-xl text-xs transition-all bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:bg-slate-900 dark:focus:bg-slate-900 focus:border-sky-600"
          />
          <button
            onClick={onOpenCommandPalette}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold px-2 py-0.5 rounded-lg border bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 flex items-center space-x-1"
          >
            <Command className="w-3 h-3" />
            <span>K</span>
          </button>
        </div>
      </div>

      {/* Right: Theme Switcher, Language Switcher, AI Ops & Role Switcher */}
      <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
        {/* Dark / White Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all flex items-center space-x-1.5"
          title={theme === 'dark' ? 'Switch to White Theme' : 'Switch to Dark Theme'}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] font-bold hidden sm:inline text-amber-300">White Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600" />
              <span className="text-[11px] font-bold hidden sm:inline text-indigo-900">Dark Mode</span>
            </>
          )}
        </button>

        {/* Language Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowLangDropdown(!showLangDropdown);
              setShowOrgDropdown(false);
              setShowRoleDropdown(false);
            }}
            className="flex items-center space-x-1 px-2 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-sky-500" />
            <span className="font-bold text-[11px] sm:text-xs">{language === 'rw' ? '🇷🇼' : '🇬🇧'}</span>
            <ChevronDown className="w-3 h-3 text-slate-500 hidden sm:inline" />
          </button>

          {showLangDropdown && (
            <div className="absolute right-0 mt-2 w-44 rounded-2xl shadow-2xl py-1 z-[100001] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
              <div className="px-3 py-1.5 text-[10px] uppercase font-semibold text-slate-500 border-b border-slate-100 dark:border-slate-800">
                Select Language
              </div>
              <button
                onClick={() => {
                  setLanguage('en');
                  setShowLangDropdown(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800 ${
                  language === 'en' ? 'text-sky-600 dark:text-sky-400 font-bold bg-sky-50 dark:bg-sky-950/40' : ''
                }`}
              >
                <span>🇬🇧 English</span>
                {language === 'en' && <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />}
              </button>
              <button
                onClick={() => {
                  setLanguage('rw');
                  setShowLangDropdown(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800 ${
                  language === 'rw' ? 'text-sky-600 dark:text-sky-400 font-bold bg-sky-50 dark:bg-sky-950/40' : ''
                }`}
              >
                <span>🇷🇼 Kinyarwanda</span>
                {language === 'rw' && <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />}
              </button>
            </div>
          )}
        </div>

        {/* AI Ops Floating Assistant Launch Button */}
        <button
          onClick={onOpenAI}
          className="px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-500/20 flex items-center space-x-1.5 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI Ops</span>
        </button>

        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleDropdown(!showRoleDropdown);
              setShowOrgDropdown(false);
              setShowLangDropdown(false);
            }}
            className="flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="truncate max-w-[70px] sm:max-w-[110px] font-bold text-[11px] sm:text-xs">
              {currentRole.replace(/_/g, ' ')}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl py-1 z-[100001] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800 text-slate-500">
                {t('selectUserRole')}
              </div>
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    onRoleChange(r);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800 ${
                    r === currentRole ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{r.replace(/_/g, ' ')}</span>
                  {r === currentRole && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
