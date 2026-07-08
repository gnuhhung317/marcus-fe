'use client';

import React, { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ErrorStateCard, LoadingStateCard } from '@/components/shared/api-state';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { ExecutionLogLine, SignalLogLine } from '@/lib/contracts/types';
import { useMonitoringOpsQuery, useRefreshMonitoringData } from '@/lib/hooks/use-monitoring-data';
import { cn } from '@/lib/utils';
import { Info, Search, SlidersHorizontal, Terminal } from 'lucide-react';

type ExecutionLevelFilter = 'ALL' | 'INFO' | 'WARN' | 'ERROR';

function parseTimestamp(value?: string | null) {
  if (!value) return Number.NEGATIVE_INFINITY;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? Number.NEGATIVE_INFINITY : parsed.getTime();
}

function formatDateTime(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
}

function getLevelBadge(
  level: string,
  labels: { error: string; warn: string; info: string; debug: string }
) {
  switch (level.toUpperCase()) {
    case 'ERROR':
      return <Badge variant="error">{labels.error}</Badge>;
    case 'WARN':
      return <Badge variant="warning">{labels.warn}</Badge>;
    case 'INFO':
      return <Badge variant="success">{labels.info}</Badge>;
    default:
      return <Badge variant="outline">{labels.debug}</Badge>;
  }
}

function getLevelTextClass(level: string) {
  switch (level.toUpperCase()) {
    case 'ERROR':
      return 'text-negative font-semibold';
    case 'WARN':
      return 'text-warning font-semibold';
    case 'INFO':
      return 'text-positive';
    case 'DEBUG':
      return 'text-muted/60';
    default:
      return 'text-main';
  }
}

function getActionBadge(action: string, labels: { buy: string; sell: string }) {
  if (action.toUpperCase() === 'BUY') {
    return (
      <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide border border-positive/20 bg-positive/10 text-positive">
        {labels.buy}
      </span>
    );
  }

  if (action.toUpperCase() === 'SELL') {
    return (
      <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide border border-negative/20 bg-negative/10 text-negative">
        {labels.sell}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide border border-border bg-surface text-muted">
      {action}
    </span>
  );
}

function getStatusBadge(status: string, labels: { executed: string; pending: string; rejected: string }) {
  if (status.toUpperCase() === 'EXECUTED') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-positive">
        <span className="h-1.5 w-1.5 rounded-full bg-positive" />
        {labels.executed}
      </span>
    );
  }

  if (status.toUpperCase() === 'PENDING') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-warning">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-warning" />
        {labels.pending}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-negative">
      <span className="h-1.5 w-1.5 rounded-full bg-negative" />
      {labels.rejected}
    </span>
  );
}

function sortByLatestExecution(logs: ExecutionLogLine[]) {
  return [...logs].sort((a, b) => parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp));
}

function sortByLatestSignal(signals: SignalLogLine[]) {
  return [...signals].sort(
    (a, b) => parseTimestamp(b.generatedTimestamp) - parseTimestamp(a.generatedTimestamp)
  );
}

export function MonitoringLogs() {
  const t = useTranslations('Monitoring.logs');
  const { data: ops, error } = useMonitoringOpsQuery();
  const { refresh } = useRefreshMonitoringData();
  const levelLabels = {
    error: t('levels.error'),
    warn: t('levels.warn'),
    info: t('levels.info'),
    debug: t('levels.debug'),
  };
  const actionLabels = {
    buy: t('actions.buy'),
    sell: t('actions.sell'),
  };
  const statusLabels = {
    executed: t('status.executed'),
    pending: t('status.pending'),
    rejected: t('status.rejected'),
  };
  const [logSearch, setLogSearch] = useState('');
  const [signalSearch, setSignalSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<ExecutionLevelFilter>('ALL');

  const executionLogs = useMemo(
    () => sortByLatestExecution(ops?.executionLogs ?? []),
    [ops?.executionLogs]
  );
  const recentSignals = useMemo(() => sortByLatestSignal(ops?.signalStream ?? []), [ops?.signalStream]);

  const filteredLogs = useMemo(
    () =>
      executionLogs.filter((log) => {
        const search = logSearch.trim().toLowerCase();
        const matchSearch =
          !search ||
          log.message.toLowerCase().includes(search) ||
          log.source.toLowerCase().includes(search);

        const matchLevel = selectedLevel === 'ALL' || log.level.toUpperCase() === selectedLevel;
        return matchSearch && matchLevel;
      }),
    [executionLogs, logSearch, selectedLevel]
  );

  const filteredSignals = useMemo(
    () =>
      recentSignals.filter((sig) => {
        const search = signalSearch.trim().toLowerCase();
        if (!search) return true;

        return [sig.symbol, sig.action, sig.status].some((field) =>
          field.toLowerCase().includes(search)
        );
      }),
    [recentSignals, signalSearch]
  );

  if (error) {
    return (
      <ErrorStateCard
        title={t('executionLogs')}
        message={error instanceof Error ? error.message : t('noLogs')}
        onAction={refresh}
        actionLabel="Retry"
      />
    );
  }

  if (!ops) {
    return <LoadingStateCard title={t('executionLogs')} message={t('loading')} />;
  }

  return (
    <section className="space-y-6">
      <Card
        variant="glass-strong"
        className="overflow-hidden p-5 shadow-[var(--shadow-soft)]"
        data-testid="monitoring-execution-log-card"
      >
        <div className="flex flex-col gap-4 border-b border-border pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted">
              <Terminal className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-main">{t('executionLogs')}</h2>
            </div>
          </div>

          <Badge variant="outline" className="text-[11px]">
            {t('events', { count: filteredLogs.length })}
          </Badge>
        </div>

        <div className="mt-4 flex flex-wrap gap-2.5">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted/60" />
            <Input
              placeholder={t('logSearch')}
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              className="h-8 border-border bg-surface pl-8 text-xs placeholder:text-muted/50"
            />
          </div>

          <div className="flex gap-1 rounded-md border border-border bg-surface p-0.5">
            {(['ALL', 'INFO', 'WARN', 'ERROR'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                className={cn(
                  'rounded px-2 py-1 text-[10px] font-semibold tracking-wider transition-colors',
                  selectedLevel === lvl ? 'bg-surface-strong text-main' : 'text-muted hover:text-main'
                )}
              >
                {lvl === 'ALL' ? t('levels.all') : levelLabels[lvl.toLowerCase() as 'error' | 'warn' | 'info' | 'debug']}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 h-[460px] overflow-auto rounded-lg border border-border bg-surface shadow-inner">
          {filteredLogs.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 py-12 text-center">
              <Info className="h-6 w-6 text-muted/40" />
              <p className="mt-2 text-xs text-muted">{t('noLogs')}</p>
            </div>
          ) : (
            <table className="min-w-full border-collapse text-left font-mono text-[11px] leading-relaxed">
              <thead className="sticky top-0 z-10 border-b border-border bg-surface-strong text-[10px] uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-3 py-2">{t('table.time')}</th>
                  <th className="px-3 py-2">{t('table.level')}</th>
                  <th className="px-3 py-2">{t('table.source')}</th>
                  <th className="px-3 py-2">{t('table.message')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={`${log.timestamp}-${log.source}-${log.message}`} className="border-b border-border/50 align-top transition-colors hover:bg-surface-strong">
                    <td className="whitespace-nowrap px-3 py-2 text-muted/60">{formatDateTime(log.timestamp)}</td>
                    <td className="px-3 py-2">{getLevelBadge(log.level, levelLabels)}</td>
                    <td className="whitespace-nowrap px-3 py-2 font-semibold text-main/80">{log.source}</td>
                    <td className={cn('px-3 py-2 select-text whitespace-pre-wrap break-words', getLevelTextClass(log.level))}>
                      {log.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      <Card
        variant="glass-strong"
        className="overflow-hidden p-5 shadow-[var(--shadow-soft)]"
        data-testid="monitoring-recent-signals-card"
      >
        <div className="flex flex-col gap-4 border-b border-border pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-main">{t('signalStream')}</h2>
            </div>
          </div>

          <Badge variant="outline" className="text-[11px]">
            {filteredSignals.length}
          </Badge>
        </div>

        <div className="mt-4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted/60" />
            <Input
              placeholder={t('signalSearch')}
              value={signalSearch}
              onChange={(e) => setSignalSearch(e.target.value)}
              className="h-8 border-border bg-surface pl-8 text-xs placeholder:text-muted/50"
            />
          </div>
        </div>

        <div className="mt-4 h-[320px] overflow-auto rounded-lg border border-border bg-surface shadow-inner">
          {filteredSignals.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 py-12 text-center">
              <Info className="h-6 w-6 text-muted/40" />
              <p className="mt-2 text-xs text-muted">{t('noSignals')}</p>
            </div>
          ) : (
            <table className="min-w-full border-collapse text-left font-mono text-[11px] leading-relaxed">
              <thead className="sticky top-0 z-10 border-b border-border bg-surface-strong text-[10px] uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-3 py-2">{t('table.time')}</th>
                  <th className="px-3 py-2">{t('table.symbol')}</th>
                  <th className="px-3 py-2">{t('table.action')}</th>
                  <th className="px-3 py-2">{t('table.status')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredSignals.map((signal) => (
                  <tr key={signal.signalId} className="border-b border-border/50 transition-colors hover:bg-surface-strong">
                    <td className="whitespace-nowrap px-3 py-2 text-muted/60">{formatDateTime(signal.generatedTimestamp)}</td>
                    <td className="px-3 py-2 font-semibold text-main">{signal.symbol}</td>
                    <td className="px-3 py-2">{getActionBadge(signal.action, actionLabels)}</td>
                    <td className="px-3 py-2">{getStatusBadge(signal.status, statusLabels)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </section>
  );
}
