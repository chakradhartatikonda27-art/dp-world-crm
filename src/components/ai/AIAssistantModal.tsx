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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col h-[650px]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-gradient-to-tr from-sky-600 to-indigo-600 text-white">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">LogisticsOS AI Operations Control</h3>
              <div className="text-[10px] text-sky-400 font-mono">Real-time Telemetry & Decision Engine</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Daily Operations Briefing Section */}
        {briefing && (
          <div className="p-4 bg-slate-850/90 border-b border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Daily Operations Briefing ({briefing.date})</span>
              <span className="text-sky-400 text-[10px]">Auto-Generated</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px]">Active</div>
                <div className="font-bold text-sky-400 font-mono text-sm">{briefing.totalActiveShipments}</div>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px]">Delayed</div>
                <div className="font-bold text-rose-400 font-mono text-sm">{briefing.delayedCount}</div>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px]">Exceptions</div>
                <div className="font-bold text-amber-400 font-mono text-sm">{briefing.unresolvedExceptionsCount}</div>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px]">Unpaid Rev</div>
                <div className="font-bold text-emerald-400 font-mono text-xs">${(briefing.outstandingInvoicesAmount / 1000).toFixed(1)}k</div>
              </div>
            </div>
          </div>
        )}

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/40">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-xs space-y-1 ${
                  msg.role === 'user'
                    ? 'bg-sky-600 text-white rounded-br-none'
                    : 'bg-slate-850 border border-slate-700 text-slate-200 rounded-bl-none shadow-md'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-850 p-3 rounded-2xl text-xs text-sky-400 font-mono animate-pulse">
                AI Engine analyzing operations database...
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center space-x-2 overflow-x-auto text-[11px]">
          <button
            onClick={() => setInputPrompt('Show delayed shipments')}
            className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 hover:text-white border border-slate-700 whitespace-nowrap"
          >
            🔍 Show delayed shipments
          </button>
          <button
            onClick={() => setInputPrompt('Which trucks are available?')}
            className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 hover:text-white border border-slate-700 whitespace-nowrap"
          >
            🚛 Available trucks
          </button>
          <button
            onClick={() => setInputPrompt('Show unpaid invoices')}
            className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 hover:text-white border border-slate-700 whitespace-nowrap"
          >
            💳 Outstanding revenue
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI Assistant about delayed trucks, revenue, SLA risks, or border bottlenecks..."
            className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
          <button
            onClick={handleSend}
            className="p-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
