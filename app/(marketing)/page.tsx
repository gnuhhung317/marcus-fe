import Link from 'next/link';
import { getHomePageData } from '@/lib/contracts/client';

function formatCompactUsd(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export default async function HomePage() {
  const { marketOverview, marketingStats } = await getHomePageData();

  return (
    <div className="shell-grid relative w-full overflow-hidden pb-32">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--primary-soft)] blur-[100px]"></div>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8 lg:pt-32">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary-soft)] bg-[var(--primary-soft)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-positive">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-positive opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-positive"></span>
              </span>
              Engine Online · {marketOverview.activeStrategies} Active Strategies
            </div>
            <h1 className="mt-8 font-display text-5xl leading-[1.08] text-white md:text-7xl">
              Algorithmic Edge <br />
              <span className="text-muted">In Real-Time.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted sm:text-xl">
              Design, backtest, and deploy high-frequency strategies to the cloud. 
              Marcus provides institutional-grade telemetry and ultra-low latency execution 
              for retail and prop traders.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/login?next=/terminal" className="cta-primary rounded-xl px-8 py-3.5 text-sm font-bold uppercase tracking-wide transition-transform hover:scale-105">
                Launch Terminal
              </Link>
              <Link
                href="/research"
                className="rounded-xl border border-[var(--line)] bg-[var(--panel)] px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white backdrop-blur transition-colors hover:bg-[var(--panel-strong)]"
              >
                Read Documentation
              </Link>
            </div>
          </div>

          {/* Cockpit Console Simulator */}
          <div className="glass noise relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg-0)]/80 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-[var(--line)] bg-[var(--bg-1)] px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-negative"></div>
              <div className="h-3 w-3 rounded-full bg-warning"></div>
              <div className="h-3 w-3 rounded-full bg-positive"></div>
              <span className="ml-2 font-mono text-[10px] uppercase text-muted">marcus-engine-v4.sys</span>
            </div>
            <div className="p-6 font-mono text-sm leading-relaxed text-muted">
              <p className="text-positive">$ pip install marcus-sdk</p>
              <p className="mt-2">Collecting marcus-sdk...</p>
              <p>Successfully installed marcus-sdk-4.2.0</p>
              <p className="mt-4 text-positive">$ marcus deploy strategy.py --env prod</p>
              <p className="mt-2 text-white/70">[<span className="text-positive">OK</span>] Validating schema parameters...</p>
              <p className="text-white/70">[<span className="text-positive">OK</span>] Connecting to execution cloud...</p>
              <p className="text-white/70">[<span className="text-positive">OK</span>] Provisioning isolation container...</p>
              <div className="mt-6 border-l-2 border-positive pl-4">
                <p className="text-white">Strategy Deployed Successfully</p>
                <p className="mt-1 text-xs text-muted">Routing ID: mrx_8f72a911</p>
                <p className="text-xs text-muted">Latency: 1.2ms (Direct-To-Venue)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Telemetry / Marketing Stats Strip */}
      {marketingStats && (
        <section className="relative z-10 mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass noise grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--line)] sm:grid-cols-4">
            <div className="bg-[var(--bg-0)]/60 p-6 text-center sm:p-8">
              <p className="font-display text-4xl font-bold text-white sm:text-5xl">{marketingStats.verifiedDevelopers}+</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted">Verified Devs</p>
            </div>
            <div className="bg-[var(--bg-0)]/60 p-6 text-center sm:p-8">
              <p className="font-display text-4xl font-bold text-white sm:text-5xl">{marketingStats.activeCloudExecutors}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted">Cloud Executors</p>
            </div>
            <div className="bg-[var(--bg-0)]/60 p-6 text-center sm:p-8">
              <p className="font-display text-4xl font-bold text-white sm:text-5xl">{marketingStats.systemUptime}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted">Core Uptime</p>
            </div>
            <div className="bg-[var(--bg-0)]/60 p-6 text-center sm:p-8">
              <p className="font-display text-4xl font-bold text-white sm:text-5xl">{marketingStats.supportedExchanges}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted">Supported Exchanges</p>
            </div>
          </div>
        </section>
      )}

      {/* 3-Step Lifecycle Flow */}
      <section className="relative z-10 mx-auto mt-32 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl text-white sm:text-5xl">Built For The Quant Lifecycle</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            From algorithmic ideation to high-frequency cloud execution.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {/* Step 1 */}
          <div className="glass noise relative rounded-2xl p-8 transition-transform hover:-translate-y-1">
            <div className="absolute -left-3 -top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-positive font-display text-lg font-bold text-[var(--bg-0)]">
              1
            </div>
            <div className="mb-6 inline-block rounded-lg bg-[var(--panel)] p-3">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-display text-2xl text-white">Learn & Backtest</h3>
            <p className="mt-4 text-muted leading-relaxed">
              Access the Academy to learn institutional quant strategies. Run historical backtests on years of tick data directly in the browser within seconds.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass noise relative rounded-2xl p-8 transition-transform hover:-translate-y-1">
            <div className="absolute -left-3 -top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-positive font-display text-lg font-bold text-[var(--bg-0)]">
              2
            </div>
            <div className="mb-6 inline-block rounded-lg bg-[var(--panel)] p-3">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="font-display text-2xl text-white">Build & Simulate</h3>
            <p className="mt-4 text-muted leading-relaxed">
              Use our Python SDK or the visual editor to construct your logic. Forward-test in a live paper-trading environment without risking real capital.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass noise relative rounded-2xl p-8 transition-transform hover:-translate-y-1">
            <div className="absolute -left-3 -top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-positive font-display text-lg font-bold text-[var(--bg-0)]">
              3
            </div>
            <div className="mb-6 inline-block rounded-lg bg-[var(--panel)] p-3">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="font-display text-2xl text-white">Deploy & Scale</h3>
            <p className="mt-4 text-muted leading-relaxed">
              Connect your API keys securely. Spin up 24/7 dedicated cloud executors that run alongside exchanges for minimum latency routing.
            </p>
          </div>
        </div>
      </section>

      {/* Community Hub Footer Segment */}
      <section className="relative z-10 mx-auto mt-32 max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <div className="glass rounded-3xl p-10 sm:p-16">
          <h2 className="font-display text-3xl text-white">Join The Hub</h2>
          <p className="mx-auto mt-4 max-w-lg text-muted">
            Trade alongside a growing community of quantitative developers, share strategies, and get priority support from the Marcus engineering team.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a href="#" className="inline-flex items-center gap-2 rounded-xl bg-info px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
              </svg>
              Discord Server
            </a>
            <a href="#" className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--panel)] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[var(--panel-strong)]">
              Developer Forums
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
