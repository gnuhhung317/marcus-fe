 'use client';

import { useTranslations } from 'next-intl';
import { LifecycleBadge } from '@/components/shared/lifecycle-badge';
import { DeveloperBotDetail, DeveloperBotStatus } from '@/lib/contracts/types';
import { RiskBar } from '@/components/shared/risk-bar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface BotOverviewTabProps {
  bot: DeveloperBotDetail;
  localStatus: DeveloperBotStatus;
  subscriberCount: number;
  connectedCount: number;
  activeCount: number;
}

function formatMetricPercent(val: number | null | undefined, alwaysSign = false, naLabel = 'N/A') {
  if (val === undefined || val === null) return naLabel;
  const value = val * 100;
  const prefix = alwaysSign && value >= 0 ? '+' : '';
  return `${prefix}${value.toFixed(2)}%`;
}

function formatDrawdownPercent(val: number | null | undefined, naLabel = 'N/A') {
  if (val === undefined || val === null) return naLabel;
  const value = Math.abs(val) * 100;
  return `-${value.toFixed(2)}%`;
}

function formatMetricNumber(val: number | null | undefined, decimals = 2, naLabel = 'N/A') {
  if (val === undefined || val === null) return naLabel;
  return val.toFixed(decimals);
}

export function BotOverviewTab({ bot, localStatus, subscriberCount, connectedCount, activeCount }: BotOverviewTabProps) {
  const t = useTranslations('DeveloperDashboard.botDetail.overview');
  const tHeader = useTranslations('DeveloperDashboard.botDetail.header');
  const tStatus = useTranslations('Common.botStatus');
  const maxDrawdownValue = bot.performance?.maxDrawdown ? Math.abs(bot.performance.maxDrawdown) : 0;
  const riskScore = maxDrawdownValue > 0.25 ? 'HIGH' : maxDrawdownValue > 0.12 ? 'MEDIUM' : 'LOW';
  const riskNumeric = riskScore === 'HIGH' ? 8 : riskScore === 'MEDIUM' ? 5 : 2;

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">{t('summary')}</h2>
          <LifecycleBadge status={localStatus} />
        </div>

        <Card className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border/40 bg-surface/40 border-none font-mono">
          {[
            { label: t('status'), value: tStatus(localStatus as 'ACTIVE' | 'PAUSED' | 'DOWN' | 'DELETED') },
            { label: t('subscribers'), value: String(subscriberCount) },
            { label: t('connected'), value: String(connectedCount) },
            { label: t('active'), value: String(activeCount) },
          ].map((item) => (
            <div key={item.label} className="p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">{item.label}</p>
              <p className="mt-2 text-xl font-bold tracking-tight text-main">{item.value}</p>
            </div>
          ))}
        </Card>
      </section>

      {bot.performance && (
        <section className="space-y-3">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">{t('performance')}</h2>
          <Card className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border/40 bg-surface/40 border-none font-mono">
            {[ 
              { label: t('annualReturn'), value: formatMetricPercent(bot.performance.annualReturn, true, tHeader('na')), tone: 'text-positive' },
              { label: t('maxDrawdown'), value: formatDrawdownPercent(bot.performance.maxDrawdown, tHeader('na')), tone: 'text-negative' },
              { label: t('sharpeRatio'), value: formatMetricNumber(bot.performance.sharpe, 2, tHeader('na')), tone: 'text-main' },
              { label: t('winRate'), value: formatMetricPercent(bot.performance.winRate, false, tHeader('na')), tone: 'text-main' },
            ].map((item) => (
              <div key={item.label} className="p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">{item.label}</p>
                <p className={`mt-2 text-xl font-bold ${item.tone} tracking-tight`}>{item.value}</p>
              </div>
            ))}
          </Card>
        </section>
      )}

      {/* Risk Profile Section */}
      <section className="space-y-3">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted font-mono">{t('riskProfile')}</h2>
        <Card className="p-6 bg-surface/40 border-none">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-medium text-muted/80">{t('riskExposure')}</span>
            <Badge
              variant={riskScore === 'HIGH' ? 'error' : riskScore === 'MEDIUM' ? 'warning' : 'success'}
              className="rounded-lg px-3 py-1 text-[10px] font-bold font-mono"
            >
              {t('riskBadge', { score: riskScore, value: riskNumeric })}
            </Badge>
          </div>
          <RiskBar value={riskNumeric} max={10} />
        </Card>
      </section>
    </div>
  );
}
