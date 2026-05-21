import { DeveloperBotDetail } from '../../../lib/contracts/types';
import { CopyButton } from './copy-button';

interface CredentialPanelProps {
  bot: DeveloperBotDetail;
}

export function CredentialPanel({ bot }: CredentialPanelProps) {
  const apiKey = bot.apiKey ?? 'Not available';
  const snippet = `POST /api/v1/signals\nX-Marcus-Api-Key: ${apiKey}\nX-Marcus-Bot-Secret: <rawSecret-from-provisioning>\nContent-Type: application/json\n\n{\n  "signalId": "sig_20260518_001",\n  "botId": "${bot.botId}",\n  "exchangeSlug": "${(bot.exchange ?? 'binance').toLowerCase()}",\n  "symbol": "${bot.tradingPair ?? 'BTC/USDT'}",\n  "action": "OPEN_LONG",\n  "price": 67321.12,\n  "timestamp": "2026-05-18T09:10:00Z"\n}`;

  return (
    <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Credentials & Quick Start</h2>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">REST API Access</p>
      </div>
      <p className="mt-2 text-sm text-muted">API key is available. Raw secret is only shown at provisioning time.</p>

      <div className="mt-4 space-y-3 text-sm">
        <div className="rounded-xl border border-[rgba(148,163,184,0.2)] bg-[rgba(6,10,18,0.55)] px-3 py-2 flex items-center justify-between gap-2 overflow-hidden">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted">Bot ID</p>
            <p className="text-white font-mono text-xs truncate mt-0.5" title={bot.botId}>{bot.botId}</p>
          </div>
          <CopyButton value={bot.botId} className="flex-shrink-0" />
        </div>
        <div className="rounded-xl border border-[rgba(148,163,184,0.2)] bg-[rgba(6,10,18,0.55)] px-3 py-2 flex items-center justify-between gap-2 overflow-hidden">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted">API Key</p>
            <p className="text-white font-mono text-xs truncate mt-0.5" title={apiKey}>{apiKey}</p>
          </div>
          {bot.apiKey && <CopyButton value={bot.apiKey} className="flex-shrink-0" />}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-muted font-semibold uppercase tracking-wider">Example HTTP Payload</p>
          <CopyButton value={snippet} className="text-muted hover:text-white" />
        </div>
        <pre className="overflow-auto rounded-xl border border-[rgba(62,183,255,0.3)] bg-[rgba(6,10,18,0.75)] p-4 text-xs text-[#9ad7ff] font-mono leading-relaxed">
          <code>{snippet}</code>
        </pre>
      </div>
    </article>
  );
}
