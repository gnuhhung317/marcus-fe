import { ArrowRight, BarChart3, FileSearch, ShieldCheck } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default async function ResearchPage() {
  const t = await getTranslations('Research');

  const roadmap = [
    {
      icon: FileSearch,
      title: t('roadmap.methodology.title'),
      description: t('roadmap.methodology.description'),
    },
    {
      icon: BarChart3,
      title: t('roadmap.briefings.title'),
      description: t('roadmap.briefings.description'),
    },
    {
      icon: ShieldCheck,
      title: t('roadmap.library.title'),
      description: t('roadmap.library.description'),
    },
  ];

  return (
    <div className="shell-grid relative overflow-hidden pb-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--warning)/0.12),transparent_34%),radial-gradient(circle_at_80%_10%,hsl(var(--primary)/0.1),transparent_32%)]" />

      <section className="relative z-10 mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8 lg:pt-28">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_360px] lg:items-start">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">{t('eyebrow')}</p>
            <Badge variant="warning" className="mt-5">
              {t('badge')}
            </Badge>
            <h1 className="mt-6 font-display text-5xl leading-[1.04] text-main md:text-6xl">{t('title')}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{t('description')}</p>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-muted">{t('availabilityNote')}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild className="rounded-xl px-6 py-3 text-sm font-bold uppercase tracking-[0.14em]">
                <Link href="/login?next=/terminal">
                  {t('primaryCta')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl px-6 py-3 text-sm font-bold uppercase tracking-[0.14em]">
                <Link href="/register">{t('secondaryCta')}</Link>
              </Button>
            </div>
          </div>

          <Card variant="glass-strong" className="p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-warning">{t('status.label')}</p>
            <h2 className="mt-3 font-display text-3xl text-main">{t('status.title')}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{t('status.description')}</p>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-border/70 bg-surface/70 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{t('status.reportsLabel')}</p>
                <p className="mt-2 text-sm font-semibold text-main">{t('status.reportsValue')}</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-surface/70 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{t('status.libraryLabel')}</p>
                <p className="mt-2 text-sm font-semibold text-main">{t('status.libraryValue')}</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-surface/70 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{t('status.publishingLabel')}</p>
                <p className="mt-2 text-sm font-semibold text-main">{t('status.publishingValue')}</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">{t('roadmap.eyebrow')}</p>
          <h2 className="mt-4 font-display text-3xl text-main sm:text-4xl">{t('roadmap.title')}</h2>
          <p className="mt-4 text-lg leading-8 text-muted">{t('roadmap.description')}</p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {roadmap.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.title} variant="glass" className="noise p-6">
                <div className="inline-flex rounded-2xl border border-border/70 bg-surface/80 p-3 text-main">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-2xl text-main">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{item.description}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card variant="glass" className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">{t('footnote.label')}</p>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">{t('footnote.description')}</p>
          </div>
          <Button asChild variant="outline" className="rounded-xl px-5 py-3 text-sm font-bold uppercase tracking-[0.14em]">
            <Link href="/register">{t('footnote.cta')}</Link>
          </Button>
        </Card>
      </section>
    </div>
  );
}
