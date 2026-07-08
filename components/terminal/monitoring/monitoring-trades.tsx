'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyStateCard, ErrorStateCard, LoadingStateCard } from '@/components/shared/api-state';
import { useMonitoringOverviewQuery, useRefreshMonitoringData } from '@/lib/hooks/use-monitoring-data';
import { cn } from '@/lib/utils';
import { History, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MonitoringTradesProps {
  className?: string;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
}

function formatTimeOnly(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toTimeString().split(' ')[0];
}

function formatDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString();
}

export function MonitoringTrades({ className }: MonitoringTradesProps) {
  const t = useTranslations('Monitoring.trades');
  const { data: dashboard, error } = useMonitoringOverviewQuery();
  const { refresh } = useRefreshMonitoringData();

  if (error) {
    return (
      <ErrorStateCard
        title={t('title')}
        message={error instanceof Error ? error.message : t('empty.message')}
        onAction={refresh}
        actionLabel="Retry"
      />
    );
  }

  if (!dashboard) {
    return <LoadingStateCard title={t('title')} message={t('empty.message')} />;
  }

  return (
    <Card variant="glass-strong" className={cn('flex h-full flex-col p-5', className)}>
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted">
            <History className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-main">{t('title')}</h2>
          </div>
        </div>
        <Badge variant="outline" className="text-[11px]">
          {t('fills', { count: dashboard.botTrades.length })}
        </Badge>
      </div>

      <div className="mt-4 flex-1 overflow-hidden rounded-lg border border-border bg-surface">
        {dashboard.botTrades.length === 0 ? (
          <div className="p-8">
            <EmptyStateCard
              title={t('empty.title')}
              message={t('empty.message')}
            />
          </div>
        ) : (
          <div className="h-[520px] overflow-y-auto custom-scrollbar">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="sticky top-0 z-10 border-b border-border bg-surface-strong text-[10px] uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-3 py-2.5">{t('table.instrument')}</th>
                  <th className="px-3 py-2.5">{t('table.side')}</th>
                  <th className="px-3 py-2.5 text-right">{t('table.size')}</th>
                  <th className="px-3 py-2.5 text-right">{t('table.price')}</th>
                  <th className="px-3 py-2.5 text-right">{t('table.pnl')}</th>
                  <th className="px-3 py-2.5 text-right">{t('table.time')}</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.botTrades.map((trade, i) => {
                  const isBuy = trade.side.toUpperCase() === 'BUY';
                  const isProfit = trade.pnl >= 0;

                  return (
                    <tr key={`${trade.timestamp}-${trade.pair}-${i}`} className="border-b border-border text-muted transition-colors hover:bg-surface">
                      <td className="px-3 py-3 font-semibold text-main">{trade.pair}</td>
                      <td className="px-3 py-3">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                            isBuy ? 'border border-positive/20 bg-positive/10 text-positive' : 'border border-negative/20 bg-negative/10 text-negative'
                          )}
                        >
                          {isBuy ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {trade.side.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-main/80">{trade.size?.toFixed(4) ?? '--'}</td>
                      <td className="px-3 py-3 text-right font-mono text-muted">{trade.exitPrice ? formatCurrency(trade.exitPrice) : trade.entryPrice ? formatCurrency(trade.entryPrice) : '--'}</td>
                      <td className={cn('px-3 py-3 text-right font-mono font-semibold', isProfit ? 'text-positive' : 'text-negative')}>
                        {trade.pnl !== 0 ? (
                          <span className="inline-flex items-center justify-end gap-0.5">
                            {isProfit ? '+' : ''}
                            {formatCurrency(trade.pnl)}
                          </span>
                        ) : (
                          <span className="text-muted/40">--</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-[10px] text-muted">
                        <div>{formatTimeOnly(trade.timestamp)}</div>
                        <div className="text-[9px] text-muted/60">{formatDate(trade.timestamp)}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
}
