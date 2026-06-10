'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { BotAnalyticsSection } from '@/components/terminal/bot-detail/bot-analytics-section';
import { updateBotStatus } from '@/lib/contracts/client';
import {
  BotIntegrationHealth,
  DeveloperBotDetail,
  DeveloperBotStatus,
  DeveloperSignalItem,
  DeveloperSubscriptionSummary,
} from '@/lib/contracts/types';
import { CopyButton } from './copy-button';
import { EditBotModal } from './edit-bot-modal';
import { DeleteBotModal } from './delete-bot-modal';
import { IntegrationHealthWidget } from './integration-health-widget';
import { SignalStreamTable } from './signal-stream-table';
import { SignalDetailDrawer } from './signal-detail-drawer';
import { LifecycleBadge } from '@/components/shared/lifecycle-badge';

type DetailTab = 'overview' | 'analytics' | 'credentials' | 'integration' | 'signals' | 'subscribers';
type SnippetLanguage = 'curl' | 'node' | 'python' | 'go';

const tabLabels: Record<DetailTab, string> = {
  overview: 'Overview',
  analytics: 'Analytics',
  credentials: 'API credentials',
  integration: 'Integration health',
  signals: 'Signals',
  subscribers: 'Subscribers',
};

const statusTone: Record<DeveloperBotStatus, string> = {
  ACTIVE: 'bg-positive-soft text-positive',
  PAUSED: 'bg-warning-soft text-warning',
  DOWN: 'bg-negative-soft text-negative',
  DELETED: 'bg-surface text-fg-muted',
};

function formatMetricPercent(val: number | null | undefined, alwaysSign = false) {
  if (val === undefined || val === null) return 'N/A';
  const value = val * 100;
  const prefix = alwaysSign && value >= 0 ? '+' : '';
  return `${prefix}${value.toFixed(2)}%`;
}

function formatDrawdownPercent(val: number | null | undefined) {
  if (val === undefined || val === null) return 'N/A';
  const value = Math.abs(val) * 100;
  return `-${value.toFixed(2)}%`;
}

function formatMetricNumber(val: number | null | undefined, decimals = 2) {
  if (val === undefined || val === null) return 'N/A';
  return val.toFixed(decimals);
}

function integrationTone(status?: string | null) {
  const normalized = String(status ?? '').toUpperCase();
  if (normalized === 'UP') return 'bg-positive-soft text-positive';
  if (normalized === 'DEGRADED') return 'bg-warning-soft text-warning';
  if (normalized === 'DOWN') return 'bg-negative-soft text-negative';
  return 'bg-surface text-fg-muted';
}

function statusLabel(status: DeveloperBotStatus) {
  return status === 'DELETED' ? 'Deleted' : status;
}

interface BotDetailCardProps {
  bot: DeveloperBotDetail;
  subscriptions: DeveloperSubscriptionSummary[];
  integrationHealth: BotIntegrationHealth | null;
  signals: DeveloperSignalItem[];
  isSwitching?: boolean;
  onStatusChange?: (botId: string, status: DeveloperBotStatus) => void;
}

export function BotDetailCard({ bot, subscriptions, integrationHealth, signals, isSwitching = false, onStatusChange }: BotDetailCardProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [selectedLanguage, setSelectedLanguage] = useState<SnippetLanguage>('curl');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState<DeveloperSignalItem | null>(null);
  const [localStatus, setLocalStatus] = useState<DeveloperBotStatus>(bot.status);

  useEffect(() => {
    setLocalStatus(bot.status);
    setStatusError(null);
  }, [bot.botId, bot.status]);

  const statusMutation = useMutation({
    mutationFn: async (nextStatus: DeveloperBotStatus) => updateBotStatus(bot.botId, nextStatus),
    onSuccess: (updated) => {
      const newStatus = updated.status ?? localStatus;
      setLocalStatus(newStatus);
      setIsStatusDropdownOpen(false);
      setStatusError(null);
      onStatusChange?.(bot.botId, newStatus);
    },
    onError: (error) => {
      setStatusError(error instanceof Error ? error.message : 'Unable to update bot status.');
    },
  });

  const subscriberCount = subscriptions.length;
  const connectedCount = subscriptions.filter((sub) => sub.status === 'CONNECTED').length;
  const activeCount = subscriptions.filter((sub) => sub.status === 'ACTIVE').length;
  const nextLifecycleStatus: DeveloperBotStatus | null =
    localStatus === 'ACTIVE' ? 'PAUSED' : localStatus === 'PAUSED' || localStatus === 'DOWN' ? 'ACTIVE' : null;
  const lifecycleLabel = nextLifecycleStatus === 'PAUSED' ? 'Stop bot' : nextLifecycleStatus === 'ACTIVE' ? 'Resume bot' : 'Status locked';
  const apiKey = bot.apiKey ?? 'Not available';
  const exchangeSlug = (bot.exchange ?? 'binance').toLowerCase();
  const pair = bot.tradingPair ?? 'BTC/USDT';
  const timestamp = new Date().toISOString();

  const snippets = useMemo(
    () => ({
      curl: `curl -X POST https://marcus-api.tromoi.xyz/api/v1/signals \\
  -H "X-Marcus-Api-Key: ${apiKey}" \\
  -H "X-Marcus-Bot-Secret: <YOUR_SECRET>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "signalId": "sig_${bot.botId}",
    "botId": "${bot.botId}",
    "exchangeSlug": "${exchangeSlug}",
    "symbol": "${pair}",
    "action": "OPEN_LONG",
    "price": 67321.12,
    "timestamp": "${timestamp}"
  }'`,
      node: `const axios = require('axios');

const payload = {
  signalId: "sig_${bot.botId}",
  botId: "${bot.botId}",
  exchangeSlug: "${exchangeSlug}",
  symbol: "${pair}",
  action: "OPEN_LONG",
  price: 67321.12,
  timestamp: "${timestamp}"
};

axios.post('https://marcus-api.tromoi.xyz/api/v1/signals', payload, {
  headers: {
    'X-Marcus-Api-Key': '${apiKey}',
    'X-Marcus-Bot-Secret': '<YOUR_SECRET>',
    'Content-Type': 'application/json'
  }
})
.then((res) => console.log('Signal sent:', res.status))
.catch((err) => console.error('Error:', err.message));`,
      python: `import requests
from datetime import datetime

payload = {
    "signalId": "sig_${bot.botId}",
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
    "https://marcus-api.tromoi.xyz/api/v1/signals",
    json=payload,
    headers=headers
)
print("Status code:", response.status_code)
print("Response:", response.text)`,
      go: `package main

import (
\t"bytes"
\t"encoding/json"
\t"fmt"
\t"net/http"
\t"time"
)

func main() {
\tpayload := map[string]interface{}{
\t\t"signalId":     fmt.Sprintf("sig_%d", time.Now().Unix()),
\t\t"botId":        "${bot.botId}",
\t\t"exchangeSlug": "${exchangeSlug}",
\t\t"symbol":       "${pair}",
\t\t"action":       "OPEN_LONG",
\t\t"price":        67321.12,
\t\t"timestamp":    time.Now().UTC().Format(time.RFC3339),
\t}

\tjsonValue, _ := json.Marshal(payload)
\treq, _ := http.NewRequest("POST", "https://marcus-api.tromoi.xyz/api/v1/signals", bytes.NewBuffer(jsonValue))

\treq.Header.Set("X-Marcus-Api-Key", "${apiKey}")
\treq.Header.Set("X-Marcus-Bot-Secret", "<YOUR_SECRET>")
\treq.Header.Set("Content-Type", "application/json")

\tclient := &http.Client{}
\tresp, err := client.Do(req)
\tif err != nil {
\t\tpanic(err)
\t}
\tdefer resp.Body.Close()

\tfmt.Println("Response Status:", resp.Status)
}`,
    }),
    [apiKey, bot.botId, exchangeSlug, pair, timestamp]
  );

  const snippetText = snippets[selectedLanguage];

  return (
    <article className="glass-strong flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--panel-border)] shadow-[var(--shadow-soft)]">
      {isSwitching ? <div className="h-1 w-full animate-pulse bg-[var(--primary-soft)]" /> : null}

      <div className="border-b border-[var(--panel-border)] p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1 space-y-4">
            <Link href="/terminal/developer-dashboard" className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-fg-muted transition-colors hover:text-fg">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to fleet
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center rounded-full border border-[var(--panel-border)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${statusTone[localStatus]}`}>
                {statusLabel(localStatus)}
              </span>
              {integrationHealth ? (
                <span className={`inline-flex items-center rounded-full border border-[var(--panel-border)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${integrationTone(integrationHealth.overallStatus)}`}>
                  {integrationHealth.overallStatus}
                </span>
              ) : null}
              <span className="rounded-full border border-[var(--panel-border)] bg-surface px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-muted">
                {bot.botId}
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">{bot.botName}</h1>
              {bot.description ? <p className="line-clamp-3 max-w-3xl text-sm leading-relaxed text-fg-muted">{bot.description}</p> : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-[var(--panel-border)] bg-surface px-4 py-4">
                <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">Venue</p>
                <p className="mt-2 text-sm font-semibold text-fg">{bot.exchange ?? 'N/A'}</p>
              </div>
              <div className="rounded-xl border border-[var(--panel-border)] bg-surface px-4 py-4">
                <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">Pair</p>
                <p className="mt-2 font-mono text-sm font-semibold text-fg">{bot.tradingPair ?? 'N/A'}</p>
              </div>
              <div className="rounded-xl border border-[var(--panel-border)] bg-surface px-4 py-4">
                <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">Developer</p>
                <p className="mt-2 truncate font-mono text-sm text-fg">{bot.developerId ? `${bot.developerId.slice(0, 8)}...` : 'N/A'}</p>
              </div>
              <div className="rounded-xl border border-[var(--panel-border)] bg-surface px-4 py-4">
                <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">Updated</p>
                <p className="mt-2 text-sm font-semibold text-fg">{bot.updatedAt ? new Date(bot.updatedAt).toLocaleString() : 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--panel-border)] bg-surface px-4 py-2 text-sm font-semibold text-fg transition-colors hover:bg-surface-strong"
            >
              Edit bot
            </button>
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--panel-border)] bg-negative-soft px-4 py-2 text-sm font-semibold text-negative transition-colors hover:brightness-105"
            >
              Delete bot
            </button>
          </div>
        </div>

        {statusError ? (
          <div className="mt-4 rounded-xl border border-[var(--panel-border)] bg-negative-soft px-4 py-3 text-sm text-negative">
            {statusError}
          </div>
        ) : null}

        {localStatus === 'PAUSED' ? (
          <div className="mt-4 rounded-xl border border-[var(--panel-border)] bg-warning-soft px-4 py-3 text-sm text-warning">
            This bot is stopped. Existing subscriptions remain active, but new trading signals are rejected until it is resumed.
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-2 border-b border-[var(--panel-border)] pb-0">
          {(Object.keys(tabLabels) as DetailTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] transition-colors ${
                activeTab === tab ? 'text-fg' : 'text-fg-muted hover:text-fg'
              }`}
            >
              {tabLabels[tab]}
              {activeTab === tab ? <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[var(--primary)]" /> : null}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6 sm:p-8">
        {activeTab === 'overview' ? (
          <div className="space-y-8">
            <section className="space-y-4">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-fg-muted">Summary</h2>
                  <p className="mt-1 text-sm text-fg-muted">Value-first snapshot of the current bot configuration.</p>
                </div>
                <LifecycleBadge status={localStatus} />
              </div>

              <div className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: 'Status', value: localStatus },
                  { label: 'Subscribers', value: String(subscriberCount) },
                  { label: 'Connected', value: String(connectedCount) },
                  { label: 'Active', value: String(activeCount) },
                ].map((item) => (
                  <div key={item.label} className="glass-strong h-full rounded-xl border border-[var(--panel-border)] p-4">
                    <div className="flex h-full flex-col justify-between">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">{item.label}</p>
                      <p className="mt-3 text-lg font-semibold text-fg">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {bot.performance ? (
              <section className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: 'Annual return', value: formatMetricPercent(bot.performance.annualReturn, true), tone: 'text-positive' },
                  { label: 'Max drawdown', value: formatDrawdownPercent(bot.performance.maxDrawdown), tone: 'text-negative' },
                  { label: 'Sharpe', value: formatMetricNumber(bot.performance.sharpe), tone: 'text-fg' },
                  { label: 'Win rate', value: formatMetricPercent(bot.performance.winRate), tone: 'text-fg' },
                ].map((item) => (
                  <div key={item.label} className="glass-strong h-full rounded-xl border border-[var(--panel-border)] p-4">
                    <div className="flex h-full flex-col justify-between">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">{item.label}</p>
                      <p className={`mt-3 text-lg font-semibold ${item.tone}`}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </section>
            ) : null}
          </div>
        ) : null}

        {activeTab === 'analytics' ? (
          <BotAnalyticsSection analytics={bot.analytics ?? null} />
        ) : null}

        {activeTab === 'credentials' ? (
          <section className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-fg">API credentials</h2>
                <p className="mt-1 text-sm text-fg-muted">Copy a runtime snippet without exposing the secret surface in the layout.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(snippets) as SnippetLanguage[]).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setSelectedLanguage(lang)}
                    className={`rounded-full border border-[var(--panel-border)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                      selectedLanguage === lang ? 'bg-positive-soft text-positive' : 'bg-surface text-fg-muted hover:bg-surface-strong'
                    }`}
                  >
                    {lang === 'curl' ? 'cURL' : lang === 'node' ? 'Node' : lang === 'python' ? 'Python' : 'Go'}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-[var(--panel-border)] bg-canvas-elevated">
              <div className="absolute right-3 top-3">
                <CopyButton value={snippetText} className="h-8 w-8" />
              </div>
              <pre className="max-h-[440px] overflow-auto p-5 pr-14 font-mono text-xs leading-relaxed text-fg-muted">
                <code className="whitespace-pre-wrap">{snippetText}</code>
              </pre>
            </div>
          </section>
        ) : null}

        {activeTab === 'integration' ? (
          <section className="space-y-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-fg">Integration health</h2>
                <p className="mt-1 text-sm text-fg-muted">Operational summary for the webhook and runtime bridge.</p>
              </div>
              {integrationHealth ? (
                <span className={`rounded-full border border-[var(--panel-border)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${integrationTone(integrationHealth.overallStatus)}`}>
                  {integrationHealth.overallStatus}
                </span>
              ) : null}
            </div>

            {integrationHealth ? (
              <IntegrationHealthWidget health={integrationHealth} />
            ) : (
              <div className="rounded-2xl border border-dashed border-[var(--panel-border)] bg-surface p-6 text-sm text-fg-muted">
                Integration health is not available for this bot yet.
              </div>
            )}
          </section>
        ) : null}

        {activeTab === 'signals' ? (
          <section className="space-y-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-fg">Signals</h2>
                <p className="mt-1 text-sm text-fg-muted">Recent signals received for this bot. Select a row for payload inspection.</p>
              </div>
              <span className="rounded-full border border-[var(--panel-border)] bg-surface px-3 py-1 text-xs font-semibold text-fg-muted">
                {signals.length}
              </span>
            </div>

            {isSwitching ? (
              <div className="space-y-3">
                <div className="h-10 animate-pulse rounded-xl bg-surface" />
                <div className="h-10 animate-pulse rounded-xl bg-surface" />
                <div className="h-10 animate-pulse rounded-xl bg-surface" />
              </div>
            ) : (
              <SignalStreamTable signals={signals} onSelect={setSelectedSignal} />
            )}
          </section>
        ) : null}

        {activeTab === 'subscribers' ? (
          <section className="space-y-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-fg">Subscribers</h2>
                <p className="mt-1 text-sm text-fg-muted">Active subscriptions and connection health.</p>
              </div>
              <span className="rounded-full border border-[var(--panel-border)] bg-surface px-3 py-1 text-xs font-semibold text-fg-muted">
                {subscriberCount}
              </span>
            </div>

            {isSwitching ? (
              <div className="space-y-3">
                <div className="h-20 animate-pulse rounded-xl bg-surface" />
                <div className="h-12 animate-pulse rounded-xl bg-surface" />
              </div>
            ) : subscriptions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--panel-border)] bg-surface p-6 text-sm text-fg-muted">
                No active subscriber sessions found.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { label: 'Subscribers', value: subscriberCount },
                    { label: 'Connected', value: connectedCount },
                    { label: 'Active', value: activeCount },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-[var(--panel-border)] bg-surface px-3 py-3">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">{item.label}</p>
                      <p className="mt-2 text-lg font-semibold text-fg">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="overflow-hidden rounded-2xl border border-[var(--panel-border)]">
                  <table className="min-w-full border-collapse text-left text-sm">
                    <thead className="bg-surface text-xs uppercase tracking-[0.14em] text-fg-muted">
                      <tr>
                        <th className="px-4 py-3">Subscriber</th>
                        <th className="px-4 py-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptions.map((sub, index) => (
                        <tr key={`${sub.botId}-${index}`} className="border-t border-[var(--panel-border)] text-fg-muted">
                          <td className="px-4 py-3">
                            <span className="font-mono text-sm text-fg-muted">Subscriber #{index + 1}</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--panel-border)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                                sub.status === 'ACTIVE' || sub.status === 'CONNECTED' ? 'bg-positive-soft text-positive' : 'bg-surface text-fg-muted'
                              }`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${sub.status === 'ACTIVE' || sub.status === 'CONNECTED' ? 'bg-positive' : 'bg-fg-muted'}`} />
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
          </section>
        ) : null}
      </div>

      <SignalDetailDrawer signal={selectedSignal} onClose={() => setSelectedSignal(null)} />

      <EditBotModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} bot={bot} />
      <DeleteBotModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        bot={bot}
        activeSubscribersCount={subscriptions.filter((s) => s.status === 'ACTIVE' || s.status === 'CONNECTED').length}
      />
    </article>
  );
}
