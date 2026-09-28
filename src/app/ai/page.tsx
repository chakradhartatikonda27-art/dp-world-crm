'use client';

import React, { useState } from 'react';
import { Bot, Sparkles, FileSearch, Send, CheckCircle2 } from 'lucide-react';

export default function AiPage() {
  const [query, setQuery] = useState('');
  const [chat, setChat] = useState([
    { role: 'ai', text: 'Hello! I am your LogiOS AI Operations Assistant. I analyze telemetry, predict ETA bottlenecks, extract document OCR data, and summarize corridor performance.' },
    { role: 'user', text: 'Why is shipment SHP-2026-10020 delayed?' },
    { role: 'ai', text: 'Shipment SHP-2026-10020 is delayed by +2h 45m due to customs documentation clearance queues at the Rusumo border crossing. Recommended action: Auto-dispatch missing C17 customs declaration to driver via WhatsApp.' },
  ]);

  const handleSend = () => {
    if (!query.trim()) return;
    const newChat = [...chat, { role: 'user', text: query }];
    setChat(newChat);
    setQuery('');
    setTimeout(() => {
      setChat([
        ...newChat,
        { role: 'ai', text: 'Analyzed live telemetry & audit logs: ' + query + ' — All primary parameters within optimal operational thresholds.' },
      ]);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Bot className="w-5 h-5 text-indigo-600" />
            <span>LogiOS AI Assistant & Document OCR Engine</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Generative AI Briefings • Document Vision OCR • Intelligent Delay Prediction</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[560px]">
        {/* Chat Interface */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-sm">
          <div className="space-y-3 overflow-y-auto pr-2 flex-1">
            {chat.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg text-xs max-w-[85%] ${
                  msg.role === 'ai'
                    ? 'bg-indigo-50 border border-indigo-100 text-slate-900 dark:text-slate-100 self-start shadow-xs'
                    : 'bg-sky-600 text-white self-end ml-auto shadow-xs'
                }`}
              >
                <div className="font-bold mb-1 flex items-center space-x-1.5 text-[10px] uppercase opacity-90">
                  {msg.role === 'ai' ? <Sparkles className="w-3 h-3 text-indigo-600" /> : null}
                  <span className={msg.role === 'ai' ? 'text-indigo-900' : 'text-sky-100'}>{msg.role === 'ai' ? 'LogiOS AI Engine' : 'You'}</span>
                </div>
                <div className="leading-relaxed">{msg.text}</div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask AI about shipments, delays, cost leakage, or OCR documents..."
              className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white dark:bg-slate-900 transition"
            />
            <button
              onClick={handleSend}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 transition shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </div>
        </div>

        {/* OCR Tool Side Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <FileSearch className="w-4 h-4 text-sky-600" />
            <span>Document Vision OCR Scanner</span>
          </h2>
          <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-center space-y-2">
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Drag & drop Bill of Lading, Invoice, or Customs Declaration</div>
            <button className="px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:bg-slate-800 text-sky-700 border border-sky-300 rounded text-xs font-semibold shadow-xs transition">
              Select Sample Document
            </button>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs space-y-2 font-mono">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">OCR Extraction Output (97% Conf.)</div>
            <div className="text-slate-600 dark:text-slate-400">Shipper: <strong className="text-slate-900 dark:text-slate-100 font-semibold">MSC Shipping Line</strong></div>
            <div className="text-slate-600 dark:text-slate-400">Consignee: <strong className="text-slate-900 dark:text-slate-100 font-semibold">DP World Rwanda</strong></div>
            <div className="text-slate-600 dark:text-slate-400">Container #: <strong className="text-sky-700 font-bold">MSCU1234567</strong></div>
            <div className="text-slate-600 dark:text-slate-400">Weight: <strong className="text-emerald-700 font-bold">24,500 kg</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}
