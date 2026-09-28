'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Send, Bot, AlertTriangle, CheckCircle2, TrendingUp, ShieldAlert } from 'lucide-react';
import { AIOperationsBriefing } from '@/lib/ai-engine';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgId: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose, orgId }) => {
  const [briefing, setBriefing] = useState<AIOperationsBriefing | null>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: 'Hello! I am your LogisticsOS AI Operations Assistant. I monitor real-time GPS telemetry, shipment state transitions, border bottlenecks, and financial invoices. How can I help you today?',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch(`/api/v1/ai/briefing?organizationId=${orgId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.briefing) setBriefing(data.briefing);
        })
        .catch((err) => console.error(err));
    }
  }, [isOpen, orgId]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!inputPrompt.trim()) return;
    const userMsg = inputPrompt;
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/v1/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg, organizationId: orgId }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', text: data.reply || 'AI engine processed request.' }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Sorry, AI response processing failed.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100002] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh] max-h-[650px] transition-colors duration-200">
        {/* Header */}
        <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white shadow-xs">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">LogisticsOS AI Operations Control</h3>
              <div className="text-[10px] text-sky-600 dark:text-sky-400 font-mono font-semibold">Real-time Telemetry & Decision Engine</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Daily Operations Briefing Section */}
        {briefing && (
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Daily Operations Briefing ({briefing.date})</span>
              <span className="text-sky-600 dark:text-sky-400 font-mono text-[10px] font-bold">Auto-Generated</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">Active</div>
                <div className="font-bold text-sky-600 dark:text-sky-400 font-mono text-base">{briefing.totalActiveShipments}</div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">Delayed</div>
                <div className="font-bold text-rose-600 dark:text-rose-400 font-mono text-base">{briefing.delayedCount}</div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">Exceptions</div>
                <div className="font-bold text-amber-600 dark:text-amber-400 font-mono text-base">{briefing.unresolvedExceptionsCount}</div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                <div className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">Unpaid Rev</div>
                <div className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">${(briefing.outstandingInvoicesAmount / 1000).toFixed(1)}k</div>
              </div>
            </div>
          </div>
        )}

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white dark:bg-slate-900">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-1 ${
                  msg.role === 'user'
                    ? 'bg-sky-600 text-white rounded-br-none shadow-xs font-medium'
                    : 'bg-indigo-50 dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-bl-none shadow-xs font-normal'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-indigo-50 dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 p-3 rounded-2xl text-xs text-indigo-700 dark:text-sky-400 font-mono animate-pulse">
                AI Engine analyzing operations database...
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2 overflow-x-auto text-[11px]">
          <button
            onClick={() => setInputPrompt('Show delayed shipments')}
            className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200 dark:border-slate-800 whitespace-nowrap shadow-2xs font-medium transition"
          >
            🔍 Show delayed shipments
          </button>
          <button
            onClick={() => setInputPrompt('Which trucks are available?')}
            className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200 dark:border-slate-800 whitespace-nowrap shadow-2xs font-medium transition"
          >
            🚛 Available trucks
          </button>
          <button
            onClick={() => setInputPrompt('Show unpaid invoices')}
            className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200 dark:border-slate-800 whitespace-nowrap shadow-2xs font-medium transition"
          >
            💳 Outstanding revenue
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI Assistant about delayed trucks, revenue, SLA risks, or border bottlenecks..."
            className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white dark:focus:bg-slate-900 transition"
          />
          <button
            onClick={handleSend}
            className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold transition-all shadow-xs shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
