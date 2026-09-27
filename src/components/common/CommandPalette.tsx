'use client';

import React, { useEffect, useState } from 'react';
import { Search, Boxes, MapPin, Truck, Smartphone, AlertTriangle, Receipt, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAI: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onOpenAI }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { label: 'Go to Operations Control Tower', icon: MapPin, action: () => { router.push('/'); onClose(); } },
    { label: 'View All Active Shipments', icon: Boxes, action: () => { router.push('/shipments'); onClose(); } },
    { label: 'Open Driver Mobile App View', icon: Smartphone, action: () => { router.push('/driver'); onClose(); } },
    { label: 'Inspect Fleet Inventory', icon: Truck, action: () => { router.push('/fleet'); onClose(); } },
    { label: 'View Operational Exceptions', icon: AlertTriangle, action: () => { router.push('/exceptions'); onClose(); } },
    { label: 'Open Finance & Invoicing', icon: Receipt, action: () => { router.push('/invoices'); onClose(); } },
    { label: 'Ask AI Assistant', icon: Sparkles, action: () => { onOpenAI(); onClose(); } },
  ];

  const filtered = actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-10 sm:pt-20 p-2 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center space-x-2">
          <Search className="w-4 h-4 text-sky-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search destination page..."
            className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
          />
          <button onClick={onClose} className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
            ESC
          </button>
        </div>

        <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
          {filtered.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={item.action}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 text-left transition-colors"
              >
                <Icon className="w-4 h-4 text-sky-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
