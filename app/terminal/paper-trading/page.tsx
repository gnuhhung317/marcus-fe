import { getPaperTradingPageData } from '../../../lib/contracts/client';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
}

export default async function TerminalPaperTradingPage() {
  const { session, signals } = await getPaperTradingPageData();

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Paper Session</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Paper Trading Environment</h1>
          <p className="mt-2 text-sm text-muted">
            Session {session.sessionId} · Status {session.status}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-xl border border-[rgba(148,163,184,0.32)] px-4 py-2 text-sm text-white">Pause Session</button>
          <button className="rounded-xl cta-primary px-4 py-2 text-sm font-semibold">Execute Order</button>
        </div>
      </header>

      <section className="grid gap-5 lg:grid-cols-[340px_1fr]">
        <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
          <h2 className="text-xl font-semibold text-white">Session Metrics</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-[rgba(6,10,18,0.6)] px-3 py-2">
              <span className="text-muted">Virtual Balance</span>
              <span className="font-semibold text-white">{formatCurrency(session.virtualBalance)}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[rgba(6,10,18,0.6)] px-3 py-2">
              <span className="text-muted">Open PnL</span>
              <span className={`font-semibold ${session.openPnl >= 0 ? 'text-positive' : 'text-negative'}`}>
                {session.openPnl >= 0 ? '+' : ''}
                {formatCurrency(session.openPnl)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[rgba(6,10,18,0.6)] px-3 py-2">
              <span className="text-muted">Buying Power</span>
              <span className="font-semibold text-white">{formatCurrency(session.buyingPower)}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[rgba(6,10,18,0.6)] px-3 py-2">
              <span className="text-muted">Latest Signal Count</span>
              <span className="font-semibold text-white">{signals.length}</span>
            </div>
          </div>
        </article>

        <article className="glass-strong rounded-2xl p-5 shadow-[var(--shadow-soft)]">
          <h2 className="text-xl font-semibold text-white">Signal Terminal</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-[rgba(148,163,184,0.22)]">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-[rgba(148,163,184,0.08)] text-xs uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Pair</th>
                  <th className="px-4 py-3">Side</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {signals.map((signal) => (
                  <tr key={signal.signalId} className="border-t border-[rgba(148,163,184,0.18)] transition-colors hover:bg-[rgba(148,163,184,0.08)]">
                    <td className="px-4 py-3.5 text-muted">
                      {Number.isNaN(Date.parse(signal.generatedAt))
                        ? signal.generatedAt
                        : new Date(signal.generatedAt).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-3.5 text-white">{signal.assetPair}</td>
                    <td className="px-4 py-3.5 text-white">{signal.side}</td>
                    <td className="px-4 py-3.5 text-muted">{signal.status}</td>
                    <td className="px-4 py-3.5 text-right text-white">{(signal.confidence * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <label className="text-sm text-muted">
              Asset
              <input className="mt-2 w-full rounded-xl border border-[rgba(132,162,191,0.2)] bg-[rgba(6,10,18,0.6)] px-3 py-2 text-white" defaultValue="BTC/USDT" />
            </label>
            <label className="text-sm text-muted">
              Quantity
              <input className="mt-2 w-full rounded-xl border border-[rgba(132,162,191,0.2)] bg-[rgba(6,10,18,0.6)] px-3 py-2 text-white" defaultValue="0.50" />
            </label>
          </div>
        </article>
      </section>
    </div>
  );
}
