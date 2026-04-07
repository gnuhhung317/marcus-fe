import Link from 'next/link';
import { listMarketplaceBots } from '../../../lib/contracts/client';

export default async function TerminalMarketplacePage() {
  const marketplaceBots = await listMarketplaceBots();

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.16em] text-muted">Marketplace</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Strategy Marketplace</h1>
        <p className="mt-2 text-sm text-muted">Compare verified strategy profiles and deploy only what matches your risk budget.</p>
      </header>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {marketplaceBots.map((bot) => (
          <article key={bot.botId} className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-start justify-between">
              <h2 className="text-2xl font-semibold text-white">{bot.name}</h2>
              <span className="rounded-lg border border-[rgba(148,163,184,0.25)] px-2 py-1 text-[11px] text-muted">{bot.botId}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {bot.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-[rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.72)] px-2 py-1 text-[11px] text-muted">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-xs">
              <div>
                <p className="text-muted">30D Return</p>
                <p className="mt-1 text-lg font-semibold text-positive">+{bot.pnl30d.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-muted">Win Rate</p>
                <p className="mt-1 text-lg font-semibold text-white">{bot.winRate.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-muted">Drawdown</p>
                <p className="mt-1 text-lg font-semibold text-negative">-{bot.drawdown.toFixed(1)}%</p>
              </div>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <Link
                href={`/terminal/marketplace/${encodeURIComponent(bot.botId)}`}
                className="rounded-xl border border-[rgba(148,163,184,0.26)] px-4 py-2 text-center text-sm text-white transition-colors hover:bg-[rgba(148,163,184,0.12)]"
              >
                View Detail
              </Link>
              <Link href={`/terminal/marketplace/${encodeURIComponent(bot.botId)}`} className="rounded-xl cta-primary px-4 py-2 text-center text-sm font-semibold">
                Deploy Strategy
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
