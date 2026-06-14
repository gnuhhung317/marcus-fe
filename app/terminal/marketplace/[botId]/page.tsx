import Link from 'next/link';
import { ArrowLeft, Coins, Building2, Cpu, Activity, Clock, Layers } from 'lucide-react';
import { ErrorStateCard } from '@/components/shared/api-state';
import { BotAnalyticsSection } from '@/components/terminal/bot-detail/bot-analytics-section';
import { SubscribeBotPanel } from '@/components/terminal/marketplace/subscribe-bot-panel';
import { getMarketplaceBotDetail } from '@/lib/contracts/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusDot } from '@/components/shared/status-dot';

function formatMetric(value: string | undefined | null) {
  return value && value.length ? value : 'N/A';
}

function getTrendColor(valStr: string | null | undefined) {
  if (!valStr || valStr === 'N/A' || valStr === '0.00%') return 'text-main';
  return valStr.startsWith('-') ? 'text-negative' : 'text-positive';
}

export default async function TerminalMarketplaceBotDetailPage({ params }: { params: { botId: string } }) {
  try {
    const bot = await getMarketplaceBotDetail(params.botId);
    const signals = bot.signals ?? [];
    const primaryBlock = bot.analytics?.metricBlocks.find((block) => block.title === 'Out-of-sample')
      ?? bot.analytics?.metricBlocks[0]
      ?? null;

    const isBotActive = (bot.status ?? 'ACTIVE') === 'ACTIVE';

    return (
      <div className="space-y-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Bot Profile</p>
            <h1 className="mt-2 text-4xl font-semibold text-main">{bot.name}</h1>
            <p className="mt-2 max-w-3xl text-sm text-muted">{bot.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline">Overview</Badge>
              <Badge variant="outline">Analytics</Badge>
              <Badge variant="outline">Deployment</Badge>
              <Badge variant="outline">Signals</Badge>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href="/terminal/marketplace">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Marketplace
            </Link>
          </Button>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1.5fr_0.9fr]">
          <div className="space-y-5">
            <Card className="p-6 bg-surface border-border shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted">Overview</p>
                  <h2 className="mt-2 text-2xl font-semibold text-main">Runtime Bot</h2>
                </div>
                <Badge variant={isBotActive ? 'success' : 'warning'}>
                  <StatusDot status={isBotActive ? 'active' : 'warning'} className="mr-1.5" size="sm" />
                  {bot.status}
                </Badge>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-surface-strong/40 p-4 flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Coins className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-main font-mono uppercase tracking-wider">
                      {bot.exchange || 'N/A'} • {bot.tradingPair || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-surface-strong/40 p-4 flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Cpu className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-sm font-semibold text-main truncate" title={bot.botId}>{bot.botId}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-surface-strong/40 p-4 flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-main">Runtime Routing</p>
                  </div>
                </div>
              </div>

              {primaryBlock ? (
                <div className="mt-6 border-t border-border pt-6">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Snapshot</h3>
                    <Badge variant="outline" className="border-primary/20 bg-primary-soft text-primary">
                      {primaryBlock.title === 'Out-of-sample' ? 'Live / Dry Run' : primaryBlock.title}
                    </Badge>
                    {primaryBlock.warning ? (
                      <Badge variant="warning">
                        {primaryBlock.warning}
                      </Badge>
                    ) : null}
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl border border-border bg-surface-strong/20 p-4">
                      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">Annual Return</p>
                      <p className={`mt-2 text-2xl font-bold font-mono ${getTrendColor(primaryBlock.annualReturn)}`}>
                        {formatMetric(primaryBlock.annualReturn)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-surface-strong/20 p-4">
                      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">Max Drawdown</p>
                      <p className="mt-2 text-2xl font-bold font-mono text-negative">
                        {formatMetric(primaryBlock.maxDrawdown)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-surface-strong/20 p-4">
                      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">Sharpe</p>
                      <p className="mt-2 text-2xl font-bold font-mono text-main">
                        {formatMetric(primaryBlock.sharpe)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-surface-strong/20 p-4">
                      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">Win Rate</p>
                      <p className="mt-2 text-2xl font-bold font-mono text-main">
                        {formatMetric(primaryBlock.winRate)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </Card>

            <div>
              <div className="mb-3">
                <p className="text-xs uppercase tracking-[0.16em] text-muted">Analytics</p>
                <h2 className="mt-2 text-2xl font-semibold text-main">Live / Dry Run Performance</h2>
              </div>
              <BotAnalyticsSection analytics={bot.analytics} />
            </div>
          </div>

          <div className="space-y-5">
            <section className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted">Deployment</p>
                <h2 className="mt-2 text-2xl font-semibold text-main">Subscription Routing</h2>
              </div>
              <SubscribeBotPanel botId={bot.botId} botStatus={bot.status} />
            </section>

            <Card className="p-6 bg-surface border-border shadow-soft">
              <h2 className="text-lg font-semibold text-main flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Runtime Setup Guide
              </h2>
              <div className="mt-4 space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary font-mono">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-main">Inspect Metadata</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary font-mono">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-main">Obtain Access</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary font-mono">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-main">Route Executor Signals</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-surface border-border shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted">Signals</p>
                  <h2 className="mt-2 text-xl font-semibold text-main flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Recent Signals
                  </h2>
                </div>
                <Badge variant="outline" className="font-mono">
                  {signals.length}
                </Badge>
              </div>
              {signals.length ? (
                <div className="mt-6 relative pl-4 border-l border-border space-y-6">
                  {signals.slice(0, 12).map((signal) => {
                    const isBuy = (signal.action ?? '').toUpperCase() === 'BUY';
                    const isSell = (signal.action ?? '').toUpperCase() === 'SELL';
                    const actionColor = isBuy ? 'text-positive bg-positive-soft' : isSell ? 'text-negative bg-negative-soft' : 'text-muted bg-surface';
                    const statusNormalized = (signal.status ?? 'UNKNOWN').toUpperCase();
                    const dotStatus = statusNormalized === 'COMPLETED' || statusNormalized === 'FILLED' ? 'live' : statusNormalized === 'PENDING' ? 'warning' : 'offline';

                    return (
                      <div key={signal.signalId} className="relative">
                        <div className="absolute -left-[21px] top-1.5 flex items-center justify-center bg-canvas rounded-full p-0.5">
                          <StatusDot status={dotStatus} size="sm" pulse={dotStatus === 'warning'} />
                        </div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-semibold text-main">
                                {signal.symbol ?? 'BTC/USDT'}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${actionColor}`}>
                                {signal.action ?? 'SIGNAL'}
                              </span>
                            </div>
                            <p className="text-xs text-muted flex items-center gap-1 font-mono">
                              <Clock className="h-3 w-3" />
                              {signal.generatedTimestamp ?? 'Timestamp pending'}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant={statusNormalized === 'FILLED' || statusNormalized === 'COMPLETED' ? 'success' : 'default'} className="text-[10px]">
                              {signal.status ?? 'PENDING'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-border bg-surface/50 p-5 text-sm text-center text-muted">
                  Recent marketplace signals are not available for this bot yet.
                </div>
              )}
            </Card>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    return (
      <ErrorStateCard
        title="Bot profile unavailable"
        message={error instanceof Error ? error.message : 'Unable to load bot details right now.'}
        actionLabel="Back to Marketplace"
        actionHref="/terminal/marketplace"
      />
    );
  }
}
