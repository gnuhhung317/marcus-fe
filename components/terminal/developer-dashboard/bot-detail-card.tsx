'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { updateBotStatus } from '@/lib/contracts/client';
import { BotIntegrationHealth, DeveloperBotDetail, DeveloperSignalItem, DeveloperSubscriptionSummary, DeveloperBotStatus } from '@/lib/contracts/types';
import { CopyButton } from './copy-button';
import { EditBotModal } from './edit-bot-modal';
import { DeleteBotModal } from './delete-bot-modal';
import { IntegrationHealthWidget } from './integration-health-widget';
import { SignalStreamTable } from './signal-stream-table';
import { SignalDetailDrawer } from './signal-detail-drawer';

const statusStyles: Record<string, string> = {
  ACTIVE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  PAUSED: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  ERROR: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  CREATED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

interface BotDetailCardProps {
  bot: DeveloperBotDetail;
  subscriptions: DeveloperSubscriptionSummary[];
  integrationHealth: BotIntegrationHealth | null;
  signals: DeveloperSignalItem[];
}

export function BotDetailCard({ bot, subscriptions, integrationHealth, signals }: BotDetailCardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'credentials' | 'integration' | 'signals' | 'subscribers'>('overview');
  const [selectedLanguage, setSelectedLanguage] = useState<'curl' | 'node' | 'python' | 'go'>('curl');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState<DeveloperSignalItem | null>(null);

  const router = useRouter();

  const statusMutation = useMutation({
    mutationFn: async (nextStatus: DeveloperBotStatus) => {
      return updateBotStatus(bot.botId, nextStatus);
    },
    onSuccess: () => {
      router.refresh();
      setIsStatusDropdownOpen(false);
    },
  });
  
  const statusClass = statusStyles[bot.status] ?? 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  const apiKey = bot.apiKey ?? 'Not available';
  const subscriberCount = subscriptions.length;
  const connectedCount = subscriptions.filter((sub) => sub.status === 'CONNECTED').length;
  const activeCount = subscriptions.filter((sub) => sub.status === 'ACTIVE').length;

  // API Signal Snippets
  const timestamp = new Date().toISOString();
  const exchangeSlug = (bot.exchange ?? 'binance').toLowerCase();
  const pair = bot.tradingPair ?? 'BTC/USDT';

  const snippets = {
    curl: `curl -X POST http://171.244.195.150:8081/api/v1/signals \\
  -H "X-Marcus-Api-Key: ${apiKey}" \\
  -H "X-Marcus-Bot-Secret: <YOUR_SECRET>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "signalId": "sig_${Date.now()}",
    "botId": "${bot.botId}",
    "exchangeSlug": "${exchangeSlug}",
    "symbol": "${pair}",
    "action": "OPEN_LONG",
    "price": 67321.12,
    "timestamp": "${timestamp}"
  }'`,
    node: `const axios = require('axios');

const payload = {
  signalId: "sig_${Date.now()}",
  botId: "${bot.botId}",
  exchangeSlug: "${exchangeSlug}",
  symbol: "${pair}",
  action: "OPEN_LONG",
  price: 67321.12,
  timestamp: "${timestamp}"
};

axios.post('http://171.244.195.150:8081/api/v1/signals', payload, {
  headers: {
    'X-Marcus-Api-Key': '${apiKey}',
    'X-Marcus-Bot-Secret': '<YOUR_SECRET>',
    'Content-Type': 'application/json'
  }
})
.then(res => console.log('Signal sent:', res.status))
.catch(err => console.error('Error:', err.message));`,
    python: `import requests
import time
from datetime import datetime

payload = {
    "signalId": f"sig_{int(time.time())}",
    "botId": "${bot.botId}",
    "exchangeSlug": "${exchangeSlug}",
    "symbol": "${pair}",
    "action": "OPEN_LONG",
    "price": 67321.12,
    "timestamp": datetime.utcnow().isoformat() + "Z"
}

headers = {
    "X-Marcus-Api-Key": "${apiKey}",
    "X-Marcus-Bot-Secret": "<YOUR_SECRET>",
    "Content-Type": "application/json"
}

response = requests.post(
    "http://171.244.195.150:8081/api/v1/signals", 
    json=payload, 
    headers=headers
)
print("Status code:", response.status_code)
print("Response:", response.text)`,
    go: `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

func main() {
	payload := map[string]interface{}{
		"signalId":     fmt.Sprintf("sig_%d", time.Now().Unix()),
		"botId":        "${bot.botId}",
		"exchangeSlug": "${exchangeSlug}",
		"symbol":       "${pair}",
		"action":       "OPEN_LONG",
		"price":        67321.12,
		"timestamp":    time.Now().UTC().Format(time.RFC3339),
	}

	jsonValue, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", "http://171.244.195.150:8081/api/v1/signals", bytes.NewBuffer(jsonValue))
	
	req.Header.Set("X-Marcus-Api-Key", "${apiKey}")
	req.Header.Set("X-Marcus-Bot-Secret", "<YOUR_SECRET>")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	fmt.Println("Response Status:", resp.Status)
}`
  };

  return (
    <article className="glass-strong rounded-2xl shadow-[var(--shadow-soft)] border border-[var(--panel-border)] overflow-hidden flex flex-col relative group">
      {/* Decorative colored glow in detail view */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-emerald-500/[0.02] rounded-full blur-3xl pointer-events-none" />
      
      {/* Bot Header Area */}
      <div className="p-6 sm:p-8 pb-5 border-b border-[var(--panel-border)] bg-[var(--panel)]">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Interactive Status Badge with Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider hover:bg-white/5 transition-all outline-none cursor-pointer ${statusClass}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${bot.status === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : bot.status === 'ERROR' ? 'bg-rose-400' : 'bg-slate-400'}`} />
                  {bot.status}
                  <svg className="w-3 h-3 opacity-60 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isStatusDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsStatusDropdownOpen(false)}
                    />
                    <div className="absolute left-0 mt-1.5 w-32 rounded-xl border border-white/10 bg-slate-950/95 p-1 shadow-2xl z-20 backdrop-blur-md">
                      {(['ACTIVE', 'PAUSED', 'CREATED'] as const).map((statusOption) => (
                        <button
                          key={statusOption}
                          disabled={statusMutation.isPending}
                          onClick={() => {
                            statusMutation.mutate(statusOption);
                          }}
                          className="w-full flex items-center gap-2 text-left px-3 py-2 text-[10px] font-bold uppercase rounded-lg hover:bg-white/5 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusOption === 'ACTIVE' ? 'bg-emerald-400' : statusOption === 'PAUSED' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                          {statusOption}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <span className="text-xs font-mono text-slate-500 bg-white/5 border border-white/5 rounded-md px-2 py-0.5">
                ID: {bot.botId}
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-white tracking-tight truncate">
              {bot.botName}
            </h2>
            {bot.description && (
              <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">
                {bot.description}
              </p>
            )}
          </div>

          {/* Action buttons (Edit & Delete) */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Bot
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/10 bg-rose-500/5 px-4 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 border-b border-white/5 pb-0">
          {(['overview', 'credentials', 'integration', 'signals', 'subscribers'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider relative transition-all duration-200 outline-none ${
                activeTab === tab 
                  ? 'text-white' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab === 'overview' && 'Overview'}
              {tab === 'credentials' && 'API Credentials'}
              {tab === 'integration' && 'Integration Health'}
              {tab === 'signals' && 'Signals'}
              {tab === 'subscribers' && 'Subscribers'}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full shadow-[0_0_8px_var(--primary-soft)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="p-6 sm:p-8 flex-1">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Configuration Details</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-white/5 bg-[var(--panel)] p-4 flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Trading Venue</span>
                  <span className="text-sm font-semibold text-white mt-1.5">{bot.exchange ?? 'N/A'}</span>
                </div>
                <div className="rounded-xl border border-white/5 bg-[var(--panel)] p-4 flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Execution Pair</span>
                  <span className="text-sm font-semibold text-white mt-1.5 font-mono">{bot.tradingPair ?? 'N/A'}</span>
                </div>
                <div className="rounded-xl border border-white/5 bg-[var(--panel)] p-4 flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Developer UUID</span>
                  <span className="text-sm font-mono text-slate-300 mt-1.5 truncate" title={bot.developerId ?? undefined}>
                    {bot.developerId ? `${bot.developerId.slice(0, 8)}...` : 'N/A'}
                  </span>
                </div>
                <div className="rounded-xl border border-white/5 bg-[var(--panel)] p-4 flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Created Date</span>
                  <span className="text-sm font-mono text-slate-300 mt-1.5">
                    {bot.createdAt ? new Date(bot.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-white/5 bg-[var(--panel)] p-4">
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Bot Status</p>
                <p className="mt-2 text-sm font-semibold text-white">{bot.status}</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-[var(--panel)] p-4">
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Subscribers</p>
                <p className="mt-2 text-sm font-semibold text-white">{subscriberCount}</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-[var(--panel)] p-4">
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Connected</p>
                <p className="mt-2 text-sm font-semibold text-emerald-300">{connectedCount}</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-[var(--panel)] p-4">
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Last Updated</p>
                <p className="mt-2 text-sm font-semibold text-slate-200">
                  {bot.updatedAt ? new Date(bot.updatedAt).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* API CREDENTIALS TAB */}
        {activeTab === 'credentials' && (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-xl border border-amber-500/15 bg-amber-500/[0.02] p-4 flex gap-3">
              <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Security & Signing Notice</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Authentication requires both your public <span className="text-white font-mono">API Key</span> and your raw <span className="text-white font-mono">Provisioning Secret</span> (which was displayed once upon creation). Store them in a secure environment.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-white/5 bg-[var(--panel)] p-4 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Bot ID</span>
                  <p className="text-xs font-mono text-white mt-1 select-all truncate" title={bot.botId}>{bot.botId}</p>
                </div>
                <CopyButton value={bot.botId} className="flex-shrink-0" />
              </div>

              <div className="rounded-xl border border-white/5 bg-[var(--panel)] p-4 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Public API Key</span>
                  <p className="text-xs font-mono text-white mt-1 select-all truncate" title={apiKey}>{apiKey}</p>
                </div>
                <CopyButton value={apiKey} className="flex-shrink-0" />
              </div>

              <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.01] p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Signing Secret</span>
                  <p className="text-xs text-slate-400 mt-1">Managed during provisioning. Verify signature headers in local scripts.</p>
                </div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase bg-slate-900 border border-white/5 px-2.5 py-1 rounded-md">
                  Encrypted
                </span>
              </div>
            </div>
          </div>
        )}

        {/* INTEGRATION GUIDE TAB */}
        {activeTab === 'integration' && (
          <div className="space-y-6 animate-fade-in">
            <IntegrationHealthWidget health={integrationHealth} />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Webhook Signal Gateway</h3>
                <p className="text-xs text-slate-500 mt-0.5">Stream execution payloads to our public API signal bridge.</p>
              </div>

              {/* Language Selection */}
              <div className="flex bg-slate-950 border border-white/5 p-1 rounded-lg">
                {(['curl', 'node', 'python', 'go'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all outline-none ${
                      selectedLanguage === lang
                        ? 'bg-emerald-500 text-black shadow-sm'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {lang === 'curl' ? 'cURL' : lang === 'node' ? 'Node' : lang === 'python' ? 'Python' : 'Go'}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Block Content */}
            <div className="relative group/code rounded-xl border border-white/5 bg-slate-950 overflow-hidden">
              <div className="absolute top-2 right-2 opacity-60 group-hover/code:opacity-100 transition-opacity">
                <CopyButton value={snippets[selectedLanguage]} className="bg-slate-900 border border-white/5" />
              </div>
              <pre className="overflow-auto p-4 sm:p-5 text-xs font-mono leading-relaxed text-slate-300 max-h-[380px] scrollbar-thin">
                <code>
                  {selectedLanguage === 'curl' && (
                    <>
                      <span className="text-emerald-400 font-bold">curl</span> -X POST http://171.244.195.150:8081/api/v1/signals \<br />
                      {"  "}-H <span className="text-blue-300">&quot;X-Marcus-Api-Key: {apiKey}&quot;</span> \<br />
                      {"  "}-H <span className="text-blue-300">&quot;X-Marcus-Bot-Secret: &lt;YOUR_SECRET&gt;&quot;</span> \<br />
                      {"  "}-H <span className="text-blue-300">&quot;Content-Type: application/json&quot;</span> \<br />
                      {"  "}-d <span className="text-yellow-200">&apos;{'{'}&apos;</span><br />
                      {"    "}<span className="text-blue-400">&quot;signalId&quot;</span>: <span className="text-emerald-300">&quot;sig_{Date.now()}&quot;</span>,<br />
                      {"    "}<span className="text-blue-400">&quot;botId&quot;</span>: <span className="text-emerald-300">&quot;{bot.botId}&quot;</span>,<br />
                      {"    "}<span className="text-blue-400">&quot;exchangeSlug&quot;</span>: <span className="text-emerald-300">&quot;{exchangeSlug}&quot;</span>,<br />
                      {"    "}<span className="text-blue-400">&quot;symbol&quot;</span>: <span className="text-emerald-300">&quot;{pair}&quot;</span>,<br />
                      {"    "}<span className="text-blue-400">&quot;action&quot;</span>: <span className="text-emerald-300">&quot;OPEN_LONG&quot;</span>,<br />
                      {"    "}<span className="text-blue-400">&quot;price&quot;</span>: <span className="text-amber-400">67321.12</span>,<br />
                      {"    "}<span className="text-blue-400">&quot;timestamp&quot;</span>: <span className="text-emerald-300">&quot;{timestamp}&quot;</span><br />
                      {"  "}<span className="text-yellow-200">{'}'}&apos;</span>
                    </>
                  )}
                  {selectedLanguage === 'node' && (
                    <>
                      <span className="text-slate-500">{"// Send webhook signal from Node.js environment"}</span><br />
                      <span className="text-cyan-400">const</span> axios = <span className="text-blue-300">require</span>(<span className="text-emerald-300">&apos;axios&apos;</span>);<br /><br />
                      <span className="text-cyan-400">const</span> payload = {'{'}<br />
                      {"  "}signalId: <span className="text-emerald-300">&quot;sig_{Date.now()}&quot;</span>,<br />
                      {"  "}botId: <span className="text-emerald-300">&quot;{bot.botId}&quot;</span>,<br />
                      {"  "}exchangeSlug: <span className="text-emerald-300">&quot;{exchangeSlug}&quot;</span>,<br />
                      {"  "}symbol: <span className="text-emerald-300">&quot;{pair}&quot;</span>,<br />
                      {"  "}action: <span className="text-emerald-300">&quot;OPEN_LONG&quot;</span>,<br />
                      {"  "}price: <span className="text-amber-400">67321.12</span>,<br />
                      {"  "}timestamp: <span className="text-emerald-300">&quot;{timestamp}&quot;</span><br />
                      {'}'};<br /><br />
                      axios.<span className="text-blue-300">post</span>(<span className="text-emerald-300">&apos;http://171.244.195.150:8081/api/v1/signals&apos;</span>, payload, {'{'}<br />
                      {"  "}headers: {'{'}<br />
                      {"    "}<span className="text-emerald-300">&apos;X-Marcus-Api-Key&apos;</span>: <span className="text-emerald-300">&apos;{apiKey}&apos;</span>,<br />
                      {"    "}<span className="text-emerald-300">&apos;X-Marcus-Bot-Secret&apos;</span>: <span className="text-emerald-300">&apos;&lt;YOUR_SECRET&gt;&apos;</span>,<br />
                      {"    "}<span className="text-emerald-300">&apos;Content-Type&apos;</span>: <span className="text-emerald-300">&apos;application/json&apos;</span><br />
                      {"  "}{'}'}<br />
                      {'}'})<br />
                      .<span className="text-blue-300">then</span>(res =&gt; console.log(<span className="text-emerald-300">&apos;Signal sent:&apos;</span>, res.status))<br />
                      .<span className="text-blue-300">catch</span>(err =&gt; console.error(<span className="text-emerald-300">&apos;Error:&apos;</span>, err.message));
                    </>
                  )}
                  {selectedLanguage === 'python' && (
                    <>
                      <span className="text-slate-500"># Send signal using Requests in Python</span><br />
                      <span className="text-cyan-400">import</span> requests<br />
                      <span className="text-cyan-400">import</span> time<br />
                      <span className="text-cyan-400">from</span> datetime <span className="text-cyan-400">import</span> datetime<br /><br />
                      payload = {'{'}<br />
                      {"    "}<span className="text-emerald-300">&quot;signalId&quot;</span>: <span className="text-blue-300">f&quot;sig_</span><span className="text-amber-400">{'{int(time.time())}'}</span><span className="text-blue-300">&quot;</span>,<br />
                      {"    "}<span className="text-emerald-300">&quot;botId&quot;</span>: <span className="text-emerald-300">&quot;{bot.botId}&quot;</span>,<br />
                      {"    "}<span className="text-emerald-300">&quot;exchangeSlug&quot;</span>: <span className="text-emerald-300">&quot;{exchangeSlug}&quot;</span>,<br />
                      {"    "}<span className="text-emerald-300">&quot;symbol&quot;</span>: <span className="text-emerald-300">&quot;{pair}&quot;</span>,<br />
                      {"    "}<span className="text-emerald-300">&quot;action&quot;</span>: <span className="text-emerald-300">&quot;OPEN_LONG&quot;</span>,<br />
                      {"    "}<span className="text-emerald-300">&quot;price&quot;</span>: <span className="text-amber-400">67321.12</span>,<br />
                      {"    "}<span className="text-emerald-300">&quot;timestamp&quot;</span>: datetime.utcnow().isoformat() + <span className="text-emerald-300">&quot;Z&quot;</span><br />
                      {'}'}<br /><br />
                      headers = {'{'}<br />
                      {"    "}<span className="text-emerald-300">&quot;X-Marcus-Api-Key&quot;</span>: <span className="text-emerald-300">&quot;{apiKey}&quot;</span>,<br />
                      {"    "}<span className="text-emerald-300">&quot;X-Marcus-Bot-Secret&quot;</span>: <span className="text-emerald-300">&quot;&lt;YOUR_SECRET&gt;&quot;</span>,<br />
                      {"    "}<span className="text-emerald-300">&quot;Content-Type&quot;</span>: <span className="text-emerald-300">&quot;application/json&quot;</span><br />
                      {'}'}<br /><br />
                      response = requests.post(<br />
                      {"    "}<span className="text-emerald-300">&quot;http://171.244.195.150:8081/api/v1/signals&quot;</span>, <br />
                      {"    "}json=payload, <br />
                      {"    "}headers=headers<br />
                      )<br />
                      print(<span className="text-emerald-300">&quot;Status code:&quot;</span>, response.status_code)<br />
                      print(<span className="text-emerald-300">&quot;Response:&quot;</span>, response.text)
                    </>
                  )}
                  {selectedLanguage === 'go' && (
                    <>
                      <span className="text-cyan-400">package</span> main<br /><br />
                      <span className="text-cyan-400">import</span> (<br />
                      {"	"}<span className="text-emerald-300">&quot;bytes&quot;</span><br />
                      {"	"}<span className="text-emerald-300">&quot;encoding/json&quot;</span><br />
                      {"	"}<span className="text-emerald-300">&quot;fmt&quot;</span><br />
                      {"	"}<span className="text-emerald-300">&quot;net/http&quot;</span><br />
                      {"	"}<span className="text-emerald-300">&quot;time&quot;</span><br />
                      )<br /><br />
                      <span className="text-cyan-400">func</span> main() {'{'}<br />
                      {"	"}payload := map[string]interface{}{'{'}<br />
                      {"		"}<span className="text-emerald-300">&quot;signalId&quot;</span>:     fmt.Sprintf(<span className="text-emerald-300">&quot;sig_%d&quot;</span>, time.Now().Unix()),<br />
                      {"		"}<span className="text-emerald-300">&quot;botId&quot;</span>:        <span className="text-emerald-300">&quot;{bot.botId}&quot;</span>,<br />
                      {"		"}<span className="text-emerald-300">&quot;exchangeSlug&quot;</span>: <span className="text-emerald-300">&quot;{exchangeSlug}&quot;</span>,<br />
                      {"		"}<span className="text-emerald-300">&quot;symbol&quot;</span>:       <span className="text-emerald-300">&quot;{pair}&quot;</span>,<br />
                      {"		"}<span className="text-emerald-300">&quot;action&quot;</span>:       <span className="text-emerald-300">&quot;OPEN_LONG&quot;</span>,<br />
                      {"		"}<span className="text-emerald-300">&quot;price&quot;</span>:        <span className="text-amber-400">67321.12</span>,<br />
                      {"		"}<span className="text-emerald-300">&quot;timestamp&quot;</span>:    time.Now().UTC().Format(time.RFC3339),<br />
                      {"	"}{'}'}<br /><br />
                      {"	"}jsonValue, _ := json.Marshal(payload)<br />
                      {"	"}req, _ := http.NewRequest(<span className="text-emerald-300">&quot;POST&quot;</span>, <span className="text-emerald-300">&quot;http://171.244.195.150:8081/api/v1/signals&quot;</span>, bytes.NewBuffer(jsonValue))<br /><br />
                      {"	"}req.Header.Set(<span className="text-emerald-300">&quot;X-Marcus-Api-Key&quot;</span>, <span className="text-emerald-300">&quot;{apiKey}&quot;</span>)<br />
                      {"	"}req.Header.Set(<span className="text-emerald-300">&quot;X-Marcus-Bot-Secret&quot;</span>, <span className="text-emerald-300">&quot;&lt;YOUR_SECRET&gt;&quot;</span>)<br />
                      {"	"}req.Header.Set(<span className="text-emerald-300">&quot;Content-Type&quot;</span>, <span className="text-emerald-300">&quot;application/json&quot;</span>)<br /><br />
                      {"	"}client := &amp;http.Client{}<br />
                      {"	"}resp, err := client.Do(req)<br />
                      {"	"}<span className="text-cyan-400">if</span> err != nil {'{'}<br />
                      {"		"}panic(err)<br />
                      {"	"}{'}'}<br />
                      {"	"}<span className="text-cyan-400">defer</span> resp.Body.Close()<br /><br />
                      {"	"}fmt.Println(<span className="text-emerald-300">&quot;Response Status:&quot;</span>, resp.Status)<br />
                      {'}'}
                    </>
                  )}
                </code>
              </pre>
            </div>
          </div>
        )}

        {/* SIGNALS TAB */}
        {activeTab === 'signals' && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Signal Stream</h3>
              <p className="text-xs text-slate-500 mt-1">Signals received for this bot. Click a row to inspect full payload.</p>
            </div>
            <SignalStreamTable signals={signals} onSelect={setSelectedSignal} />
          </div>
        )}

        {/* SUBSCRIBERS TAB */}
        {activeTab === 'subscribers' && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Subscriber Sessions</h3>
              <p className="text-xs text-slate-500 mt-1">Active subscriptions and connection health. No trader runtime tokens are exposed here.</p>
            </div>

            <div className="rounded-xl border border-white/5 bg-[var(--panel)] overflow-hidden">
              {subscriptions.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-slate-600 mb-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-slate-400">No active subscriber sessions found</p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-xs leading-relaxed">
                    Publish a signal from your code to activate listener sessions in real-time.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 p-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border border-white/5 bg-slate-950/40 p-3">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">Total Subscribers</p>
                      <p className="mt-1 text-lg font-semibold text-white">{subscriberCount}</p>
                    </div>
                    <div className="rounded-lg border border-white/5 bg-slate-950/40 p-3">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">Connected</p>
                      <p className="mt-1 text-lg font-semibold text-emerald-300">{connectedCount}</p>
                    </div>
                    <div className="rounded-lg border border-white/5 bg-slate-950/40 p-3">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">Active</p>
                      <p className="mt-1 text-lg font-semibold text-slate-200">{activeCount}</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-xs border-collapse">
                      <thead className="bg-[var(--panel-border)] border-b border-white/5 text-slate-400 font-semibold uppercase tracking-wider">
                        <tr>
                          <th className="px-4 py-3">Subscriber</th>
                          <th className="px-4 py-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {subscriptions.map((sub, index) => (
                          <tr key={`${sub.botId}-${index}`} className="hover:bg-white/[0.01] transition-colors">
                            <td className="px-4 py-3">
                              <span className="font-mono text-slate-300">Subscriber #{index + 1}</span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                                sub.status === 'ACTIVE' || sub.status === 'CONNECTED'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : 'bg-white/5 text-slate-400 border-white/5'
                              }`}>
                                <span className={`w-1.2 h-1.2 rounded-full ${sub.status === 'ACTIVE' || sub.status === 'CONNECTED' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
                                {sub.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <SignalDetailDrawer signal={selectedSignal} onClose={() => setSelectedSignal(null)} />
      {/* Modals */}
      <EditBotModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        bot={bot}
      />
      <DeleteBotModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        bot={bot}
        activeSubscribersCount={subscriptions.filter(s => s.status === 'ACTIVE' || s.status === 'CONNECTED').length}
      />
    </article>
  );
}
