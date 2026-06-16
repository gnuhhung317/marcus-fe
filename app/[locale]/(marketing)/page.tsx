import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import { ArrowRight, BookOpenText, Code2, MessageSquareMore, Rocket } from 'lucide-react';
import { getHomePageData } from '@/lib/contracts/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function HomePage() {
  const t = useTranslations('Home');
  return <HomeContent t={t} />;
}

async function HomeContent({ t }: { t: any }) {
  const { marketOverview, marketingStats } = await getHomePageData();

  return (
    <div className="shell-grid relative w-full overflow-hidden pb-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.12),transparent_42%),radial-gradient(circle_at_80%_10%,hsl(var(--info)/0.08),transparent_36%)]" />

      <section className="relative z-10 mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8 lg:pt-32">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
          <div className="max-w-2xl">
            <Badge variant="success">
              {t('badge', { activeBots: marketOverview.activeBots })}
            </Badge>
            <h1 className="mt-8 font-display text-5xl leading-[1.08] text-main md:text-7xl">
              {t.rich('headline', {
                br: () => <br />,
                span: (chunks: ReactNode) => <span className="text-muted">{chunks}</span>
              })}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted sm:text-xl">
              {t('description')}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button asChild className="rounded-xl px-8 py-3.5 text-sm font-bold uppercase tracking-wide">
                <Link href="/login?next=/terminal">
                  {t('launchTerminal')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl px-8 py-3.5 text-sm font-bold uppercase tracking-wide">
                <Link href="/research">{t('readDocs')}</Link>
              </Button>
            </div>
          </div>

          <Card variant="glass-strong" className="noise overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border-line bg-canvas-elevated px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-negative" />
              <div className="h-3 w-3 rounded-full bg-warning" />
              <div className="h-3 w-3 rounded-full bg-positive" />
              <span className="ml-2 font-mono text-[10px] uppercase text-muted">marcus-engine-v4.sys</span>
            </div>
            <div className="p-6 font-mono text-sm leading-relaxed text-muted">
              <p className="text-positive">$ pip install marcus-sdk</p>
              <p className="mt-2">Collecting marcus-sdk...</p>
              <p>Successfully installed marcus-sdk-4.2.0</p>
              <p className="mt-4 text-positive">$ marcus deploy bot.py --env prod</p>
              <p className="mt-2 text-muted">
                [<span className="text-positive">OK</span>] Validating schema parameters...
              </p>
              <p className="text-muted">
                [<span className="text-positive">OK</span>] Connecting to execution cloud...
              </p>
              <p className="text-muted">
                [<span className="text-positive">OK</span>] Provisioning isolation container...
              </p>
              <div className="mt-6 border-l-2 border-positive pl-4">
                <p className="text-main">Bot Deployed Successfully</p>
                <p className="mt-1 text-xs text-muted">Routing ID: mrx_8f72a911</p>
                <p className="text-xs text-muted">Latency: 1.2ms (Direct-To-Venue)</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {marketingStats ? (
        <section className="relative z-10 mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card variant="glass" className="overflow-hidden">
            <div className="grid grid-cols-2 gap-px sm:grid-cols-4">
              <div className="bg-canvas/60 p-6 text-center sm:p-8">
                <p className="font-display text-4xl font-bold text-main sm:text-5xl">{marketingStats.verifiedDevelopers}+</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted">{t('stats.developers')}</p>
              </div>
              <div className="bg-canvas/60 p-6 text-center sm:p-8">
                <p className="font-display text-4xl font-bold text-main sm:text-5xl">{marketingStats.activeCloudExecutors}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted">{t('stats.executors')}</p>
              </div>
              <div className="bg-canvas/60 p-6 text-center sm:p-8">
                <p className="font-display text-4xl font-bold text-main sm:text-5xl">{marketingStats.systemUptime}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted">{t('stats.uptime')}</p>
              </div>
              <div className="bg-canvas/60 p-6 text-center sm:p-8">
                <p className="font-display text-4xl font-bold text-main sm:text-5xl">{marketingStats.supportedExchanges}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted">{t('stats.exchanges')}</p>
              </div>
            </div>
          </Card>
        </section>
      ) : null}

      <section className="relative z-10 mx-auto mt-32 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl text-main sm:text-5xl">{t('lifecycle.title')}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">{t('lifecycle.subtitle')}</p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          <Card variant="glass" className="noise relative p-8 transition-transform hover:-translate-y-1">
            <div className="absolute -left-3 -top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-positive text-background font-display text-lg font-bold">
              1
            </div>
            <div className="mb-6 inline-flex rounded-lg bg-surface p-3 text-main">
              <BookOpenText className="h-6 w-6" />
            </div>
            <h3 className="font-display text-2xl text-main">{t('lifecycle.step1.title')}</h3>
            <p className="mt-4 leading-relaxed text-muted">
              {t('lifecycle.step1.desc')}
            </p>
          </Card>

          <Card variant="glass" className="noise relative p-8 transition-transform hover:-translate-y-1">
            <div className="absolute -left-3 -top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-positive text-background font-display text-lg font-bold">
              2
            </div>
            <div className="mb-6 inline-flex rounded-lg bg-surface p-3 text-main">
              <Code2 className="h-6 w-6" />
            </div>
            <h3 className="font-display text-2xl text-main">{t('lifecycle.step2.title')}</h3>
            <p className="mt-4 leading-relaxed text-muted">
              {t('lifecycle.step2.desc')}
            </p>
          </Card>

          <Card variant="glass" className="noise relative p-8 transition-transform hover:-translate-y-1">
            <div className="absolute -left-3 -top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-positive text-background font-display text-lg font-bold">
              3
            </div>
            <div className="mb-6 inline-flex rounded-lg bg-surface p-3 text-main">
              <Rocket className="h-6 w-6" />
            </div>
            <h3 className="font-display text-2xl text-main">{t('lifecycle.step3.title')}</h3>
            <p className="mt-4 leading-relaxed text-muted">
              {t('lifecycle.step3.desc')}
            </p>
          </Card>
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-32 max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <Card variant="glass" className="p-10 sm:p-16">
          <h2 className="font-display text-3xl text-main">{t('hub.title')}</h2>
          <p className="mx-auto mt-4 max-w-lg text-muted">
            {t('hub.desc')}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild className="rounded-xl px-6 py-3 text-sm font-bold">
              <Link href="#">
                {t('hub.discord')}
                <MessageSquareMore className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl px-6 py-3 text-sm font-bold">
              <Link href="#">{t('hub.forums')}</Link>
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
