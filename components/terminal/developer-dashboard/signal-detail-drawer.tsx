'use client';

import { useTranslations } from 'next-intl';
import { DeveloperSignalItem } from '@/lib/contracts/types';

interface SignalDetailDrawerProps {
  signal: DeveloperSignalItem | null;
  onClose: () => void;
}

function formatTimestamp(value?: string | null, fallback = '—') {
  if (!value) return fallback;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

export function SignalDetailDrawer({ signal, onClose }: SignalDetailDrawerProps) {
  const t = useTranslations('DeveloperDashboard.signalDetail');
  const tCommon = useTranslations('Common.labels');

  if (!signal) return null;

  const payload = signal.rawPayload ?? {
    signalId: signal.signalId,
    botId: signal.botId,
    exchangeSlug: signal.exchangeSlug,
    symbol: signal.symbol,
    action: signal.action,
    price: signal.price,
    status: signal.status,
    generatedTimestamp: signal.generatedTimestamp,
    leverage: signal.leverage,
    marketType: signal.marketType,
    reduceOnly: signal.reduceOnly,
    size: signal.size,
    tp: signal.tp,
    sl: signal.sl,
    metadata: signal.metadata,
  };

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label={t('closeAria')}
        className="absolute inset-0 bg-canvas opacity-70 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 h-full w-full max-w-xl border-l border-border bg-surface-strong shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">{t('title')}</p>
            <h3 className="text-lg font-semibold text-fg">{signal.signalId}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-fg transition-colors hover:bg-surface"
          >
            {t('close')}
          </button>
        </div>

        <div className="space-y-6 px-6 py-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface p-3 text-xs">
              <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">{t('action')}</p>
              <p className="mt-1 text-sm text-fg">{signal.action ?? tCommon('unknown')}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-3 text-xs">
              <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">{t('symbol')}</p>
              <p className="mt-1 text-sm text-fg">{signal.symbol ?? tCommon('unknown')}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-3 text-xs">
              <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">{t('status')}</p>
              <p className="mt-1 text-sm text-fg">{signal.status ?? tCommon('unknown')}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-3 text-xs">
              <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">{t('generated')}</p>
              <p className="mt-1 text-sm text-fg">{formatTimestamp(signal.generatedTimestamp, tCommon('unknown'))}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-surface p-3 text-xs">
              <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">{t('leverage')}</p>
              <p className="mt-1 text-sm text-fg">{signal.leverage ?? tCommon('unknown')}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-3 text-xs">
              <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">{t('marketType')}</p>
              <p className="mt-1 text-sm text-fg">{signal.marketType ?? tCommon('unknown')}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-3 text-xs">
              <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">{t('reduceOnly')}</p>
              <p className="mt-1 text-sm text-fg">
                {signal.reduceOnly === null || signal.reduceOnly === undefined ? tCommon('unknown') : signal.reduceOnly ? t('yes') : t('no')}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-surface p-3 text-xs">
              <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">{t('size')}</p>
              <p className="mt-1 text-sm text-fg">{signal.size ?? tCommon('unknown')}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-3 text-xs">
              <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">{t('tp')}</p>
              <p className="mt-1 text-sm text-fg">{signal.tp ?? tCommon('unknown')}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-3 text-xs">
              <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">{t('sl')}</p>
              <p className="mt-1 text-sm text-fg">{signal.sl ?? tCommon('unknown')}</p>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-fg-muted">{t('rawPayload')}</p>
            <pre className="mt-2 max-h-[260px] overflow-auto rounded-xl border border-border bg-canvas-elevated p-3 text-xs text-info">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>
        </div>
      </aside>
    </div>
  );
}
