import Link from 'next/link';
import { ErrorStateCard } from '@/components/shared/api-state';
import { BotAnalyticsSection } from '@/components/terminal/bot-detail/bot-analytics-section';
import { SubscribeBotPanel } from '@/components/terminal/marketplace/subscribe-bot-panel';
import { getMarketplaceBotDetail } from '@/lib/contracts/client';

function formatPercent(value: number, alwaysSign = false) {
  const sign = alwaysSign && value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export default async function TerminalMarketplaceBotDetailPage({ params }: { params: { botId: string } }) {
  try {
    const bot = await getMarketplaceBotDetail(params.botId);
    const signals = bot.signals ?? [];

    return (
      <div className="space-y-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Bot Profile</p>
            <h1 className="mt-2 text-4xl font-semibold text-white">{bot.name}</h1>
            <p className="mt-2 max-w-3xl text-sm text-muted">{bot.description}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.14em] text-muted">
              <span className="glass rounded-full px-3 py-1">Overview</span>
              <span className="glass rounded-full px-3 py-1">Analytics</span>
              <span className="glass rounded-full px-3 py-1">Deployment</span>
              <span className="glass rounded-full px-3 py-1">Signals</span>
            </div>
          </div>
          <Link
            href="/terminal/marketplace"
            className="rounded-xl border border-border px-4 py-2 text-sm text-white transition-colors hover:bg-border/12"
          >
            Back to Marketplace
          </Link>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1.5fr_0.9fr]">
          <div className="space-y-5">
            <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted">Overview</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Runtime Bot</h2>
                </div>
                <span className="rounded-full border border-positive/20 bg-positive-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-positive">
                  {bot.status}
                </span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="glass rounded-xl p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted">Trading Pair</p>
                  <p className="mt-2 text-sm font-medium text-white">{bot.tradingPair || 'N/A'}</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted">Exchange</p>
                  <p className="mt-2 text-sm font-medium text-white">{bot.exchange || 'N/A'}</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted">Bot ID</p>
                  <p className="mt-2 break-all text-sm font-medium text-white">{bot.botId}</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted">Routing</p>
                  <p className="mt-2 text-sm font-medium text-white">Subscribe to receive runtime token</p>
                </div>
              </div>

              {bot.performance ? (
                <div className="mt-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Snapshot</h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="glass rounded-xl p-4">
                      <p className="text-xs text-muted">Annual Return</p>
                      <p className="mt-2 text-lg font-semibold text-positive">{formatPercent(bot.performance.annualReturn, true)}</p>
                    </div>
                    <div className="glass rounded-xl p-4">
                      <p className="text-xs text-muted">Max Drawdown</p>
                      <p className="mt-2 text-lg font-semibold text-negative">-{bot.performance.maxDrawdown.toFixed(2)}%</p>
                    </div>
                    <div className="glass rounded-xl p-4">
                      <p className="text-xs text-muted">Sharpe</p>
                      <p className="mt-2 text-lg font-semibold text-white">{bot.performance.sharpe.toFixed(2)}</p>
                    </div>
                    <div className="glass rounded-xl p-4">
                      <p className="text-xs text-muted">Win Rate</p>
                      <p className="mt-2 text-lg font-semibold text-white">{formatPercent(bot.performance.winRate)}</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </article>

            <div>
              <div className="mb-3">
                <p className="text-xs uppercase tracking-[0.16em] text-muted">Analytics</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">OOS / Live Performance</h2>
              </div>
              <BotAnalyticsSection analytics={bot.analytics} />
            </div>
          </div>

          <div className="space-y-5">
            <section className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted">Deployment</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Subscription Routing</h2>
              </div>
              <SubscribeBotPanel botId={bot.botId} botStatus={bot.status} />
            </section>

            <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
              <h2 className="text-xl font-semibold text-white">Runtime Model</h2>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>1. Open this bot profile to inspect metadata and analytics.</li>
                <li>2. Subscribe to obtain your runtime wsToken.</li>
                <li>3. Route local executor signals through this botId and monitor fills.</li>
              </ul>
            </article>

            <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted">Signals</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Recent Signals</h2>
                </div>
                <span className="rounded-lg border border-border px-2 py-1 text-[11px] text-muted">
                  {signals.length}
                </span>
              </div>
              {signals.length ? (
                <div className="mt-4 space-y-2">
                  {signals.slice(0, 12).map((signal) => (
                    <div key={signal.signalId} className="glass rounded-xl p-3 text-xs">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-white">{signal.symbol ?? signal.botId}</span>
                        <span className="text-muted">{signal.status ?? 'UNKNOWN'}</span>
                      </div>
                      <p className="mt-1 text-muted">
                        {signal.action ?? 'Signal'} / {signal.generatedTimestamp ?? 'Timestamp pending'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-border bg-surface/50 p-5 text-sm text-muted">
                  Recent marketplace signals are not available for this bot yet.
                </div>
              )}
            </article>
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
