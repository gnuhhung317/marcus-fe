 'use client';

import { useTranslations } from 'next-intl';
import { DeveloperBotDetail } from '@/lib/contracts/types';
import { CopyButton } from './copy-button';

interface CredentialPanelProps {
  bot: DeveloperBotDetail;
}

export function CredentialPanel({ bot }: CredentialPanelProps) {
  const t = useTranslations('DeveloperDashboard.credentialPanel');
  const apiKey = bot.apiKey ?? t('notAvailable');
  const snippet = `POST /api/v1/signals
X-Marcus-Api-Key: ${apiKey}
X-Marcus-Bot-Secret: <rawSecret-from-provisioning>
Content-Type: application/json

{
  "signalId": "sig_20260518_001",
  "botId": "${bot.botId}",
  "exchangeSlug": "${(bot.exchange ?? 'binance').toLowerCase()}",
  "symbol": "${bot.tradingPair ?? 'BTC/USDT'}",
  "action": "OPEN_LONG",
  "price": 67321.12,
  "timestamp": "2026-05-18T09:10:00Z"
}`;

  return (
    <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-main">{t('title')}</h2>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">{t('subtitle')}</p>
      </div>

      <div className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between gap-2 overflow-hidden rounded-xl border border-border/40 bg-surface/30 px-3 py-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted">{t('botId')}</p>
            <p className="mt-0.5 truncate font-mono text-xs text-main" title={bot.botId}>{bot.botId}</p>
          </div>
          <CopyButton value={bot.botId} className="flex-shrink-0" />
        </div>
        <div className="flex items-center justify-between gap-2 overflow-hidden rounded-xl border border-border/40 bg-surface/30 px-3 py-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted">{t('apiKey')}</p>
            <p className="mt-0.5 truncate font-mono text-xs text-main" title={apiKey}>{apiKey}</p>
          </div>
          {bot.apiKey && <CopyButton value={bot.apiKey} className="flex-shrink-0" />}
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t('examplePayload')}</p>
          <CopyButton value={snippet} className="text-muted hover:text-main" />
        </div>
        <pre className="overflow-auto rounded-xl border border-[var(--semantic-info-soft)] bg-surface p-4 font-mono text-xs leading-relaxed text-info">
          <code>{snippet}</code>
        </pre>
      </div>
    </article>
  );
}
