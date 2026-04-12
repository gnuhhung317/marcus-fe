import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { getHomePageData } from '../lib/contracts/client';

function formatCompactUsd(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export default async function RootPage() {
  // Check if user is authenticated
  const cookieStore = cookies();
  const accessToken = cookieStore.get('marcus_access_token')?.value;
  const role = cookieStore.get('marcus_role')?.value;

  // If authenticated and role is not GUEST, redirect to marketplace
  if (accessToken && role && role !== 'GUEST') {
    redirect('/terminal/marketplace');
  }

  // Otherwise, show marketing home
  const { marketOverview, principles } = await getHomePageData();

  return (
    <div className="space-y-16">
      <section className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-[rgba(132,162,191,0.28)] bg-[rgba(16,24,40,0.8)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-positive">
            Live market feed · {marketOverview.activeStrategies} active strategies
          </p>
          <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[1.04] text-white md:text-7xl">
            Trade With Clarity Under Real Market Noise
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted">
            Build decisions from risk-first metrics, ranked strategy performance, and transparent execution context.
            Marcus gives traders a disciplined workspace instead of a noisy dashboard.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login?next=/terminal" className="rounded-xl px-6 py-3 text-sm font-semibold cta-primary">
              Start Trading
            </Link>
            <Link
              href="/research"
              className="rounded-xl border border-[rgba(132,162,191,0.3)] bg-[rgba(16,24,40,0.6)] px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:border-[rgba(148,163,184,0.52)]"
            >
              View Docs
            </Link>
          </div>
        </div>

        <article className="glass relative overflow-hidden rounded-2xl p-6 noise">
          <h2 className="font-display text-2xl text-white">Live Market Snapshot</h2>
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted">
            24h top volume {formatCompactUsd(marketOverview.topVolume24h)}
          </p>
          <div className="mt-6 space-y-4">
            {marketOverview.liveTickers.map((ticker) => (
              <div key={ticker.symbol} className="flex items-center justify-between rounded-xl border border-[rgba(132,162,191,0.14)] bg-[rgba(6,10,18,0.55)] p-3">
                <div>
                  <p className="text-sm font-semibold text-white">{ticker.symbol}</p>
                  <p className="text-xs text-muted">{ticker.asset}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg text-white">{ticker.price}</p>
                  <p className={`text-xs font-semibold ${ticker.change >= 0 ? 'text-positive' : 'text-negative'}`}>
                    {ticker.change >= 0 ? '+' : ''}
                    {ticker.change.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section>
        <h2 className="font-display text-4xl text-white">Core Principles</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {principles.map((principle) => (
            <article key={principle.title} className="glass rounded-2xl p-6 transition-colors duration-200 hover:border-[rgba(148,163,184,0.4)]">
              <p className="font-display text-2xl text-white">{principle.title}</p>
              <p className="mt-3 text-sm leading-6 text-muted">{principle.description}</p>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-positive">{principle.badge}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
