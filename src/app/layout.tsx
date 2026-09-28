'use client';

import React, { useState } from 'react';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { CommandPalette } from '@/components/common/CommandPalette';
import { AIAssistantModal } from '@/components/ai/AIAssistantModal';
import { UserRole } from '@/types';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';

function MainAppShell({ children }: { children: React.ReactNode }) {
  const { currentRole, setCurrentRole, currentOrgId, setCurrentOrgId } = useAuth();
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden">
      <Navbar
        currentOrgId={currentOrgId}
        onOrgChange={setCurrentOrgId}
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenAI={() => setIsAIOpen(true)}
        onOpenCommandPalette={() => setIsCommandOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <div className="flex-1 flex overflow-hidden relative w-full max-w-full">
        <Sidebar
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 md:p-6 w-full max-w-full min-w-0">
          {children}
        </main>
      </div>

      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onOpenAI={() => setIsAIOpen(true)}
      />

      <AIAssistantModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        orgId={currentOrgId}
      />
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="w-full max-w-full overflow-x-hidden">
      <head>
        <title>LogisticsOS - Multi-Tenant ERP &amp; Control Tower</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="antialiased font-sans min-h-screen w-full max-w-full overflow-x-hidden">
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <MainAppShell>{children}</MainAppShell>
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
