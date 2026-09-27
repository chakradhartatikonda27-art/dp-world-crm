'use client';

import React, { useState } from 'react';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { CommandPalette } from '@/components/common/CommandPalette';
import { AIAssistantModal } from '@/components/ai/AIAssistantModal';
import { UserRole } from '@/types';
import { ThemeProvider } from '@/context/ThemeContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [currentOrgId, setCurrentOrgId] = useState('org-dpw-rwanda');
  const [currentRole, setCurrentRole] = useState<UserRole>('ORG_ADMIN');
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <html lang="en">
      <head>
        <title>LogisticsOS - Multi-Tenant ERP &amp; Control Tower</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased font-sans min-h-screen">
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar
              currentOrgId={currentOrgId}
              onOrgChange={setCurrentOrgId}
              currentRole={currentRole}
              onRoleChange={setCurrentRole}
              onOpenAI={() => setIsAIOpen(true)}
              onOpenCommandPalette={() => setIsCommandOpen(true)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            <div className="flex-1 flex overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto p-4 md:p-6">
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
        </ThemeProvider>
      </body>
    </html>
  );
}
