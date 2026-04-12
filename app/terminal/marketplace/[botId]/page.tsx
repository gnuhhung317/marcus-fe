import Link from 'next/link';
import { SubscribeBotPanel } from '../../../../components/terminal/marketplace/subscribe-bot-panel';
import { getMarketplaceBotDetail } from '../../../../lib/contracts/client';

function formatPercent(value: number, alwaysSign = false) {
  const sign = alwaysSign && value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export default async function TerminalMarketplaceBotDetailPage({ params }: { params: { botId: string } }) {
  const bot = await getMarketplaceBotDetail(params.botId);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Bot Profile</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">{bot.name}</h1>
          <p className="mt-2 text-sm text-muted">{bot.description}</p>
        </div>
        <Link
          href="/terminal/marketplace"
          className="rounded-xl border border-[rgba(148,163,184,0.26)] px-4 py-2 text-sm text-white transition-colors hover:bg-[rgba(148,163,184,0.12)]"
        >
          Back to Marketplace
        </Link>
      </header>

      <section className="grid gap-5 lg:grid-cols-[1.45fr_1fr]">
        <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
          <h2 className="text-xl font-semibold text-white">Bot Metadata</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.72)] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-muted">Status</p>
              <p className="mt-2 text-sm font-medium text-white">{bot.status}</p>
            </div>
            <div className="rounded-xl border border-[rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.72)] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-muted">Trading Pair</p>
              <p className="mt-2 text-sm font-medium text-white">{bot.tradingPair}</p>
            </div>
            <div className="rounded-xl border border-[rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.72)] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-muted">Exchange</p>
              <p className="mt-2 text-sm font-medium text-white">{bot.exchange}</p>
            </div>
            <div className="rounded-xl border border-[rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.72)] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-muted">Bot ID</p>
              <p className="mt-2 break-all text-sm font-medium text-white">{bot.botId}</p>
            </div>
          </div>

          {bot.performance ? (
            <div className="mt-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Performance Snapshot</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.72)] p-4">
                  <p className="text-xs text-muted">Annual Return</p>
                  <p className="mt-2 text-lg font-semibold text-positive">{formatPercent(bot.performance.annualReturn, true)}</p>
                </div>
                <div className="rounded-xl border border-[rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.72)] p-4">
                  <p className="text-xs text-muted">Max Drawdown</p>
                  <p className="mt-2 text-lg font-semibold text-negative">-{bot.performance.maxDrawdown.toFixed(2)}%</p>
                </div>
                <div className="rounded-xl border border-[rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.72)] p-4">
                  <p className="text-xs text-muted">Sharpe</p>
                  <p className="mt-2 text-lg font-semibold text-white">{bot.performance.sharpe.toFixed(2)}</p>
                </div>
                <div className="rounded-xl border border-[rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.72)] p-4">
                  <p className="text-xs text-muted">Win Rate</p>
                  <p className="mt-2 text-lg font-semibold text-white">{formatPercent(bot.performance.winRate)}</p>
                </div>
              </div>
            </div>
          ) : null}
        </article>

        <div className="space-y-5">
          <SubscribeBotPanel botId={bot.botId} botStatus={bot.status} />

          <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
            <h2 className="text-xl font-semibold text-white">Next Steps</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li>1. Subscribe to obtain your runtime wsToken.</li>
              <li>2. Save token and bot secret in your local executor.</li>
              <li>3. Start signal stream and monitor first fills before scaling size.</li>
            </ul>
          </article>
        </div>
      </section>
    </div>
  );
}
