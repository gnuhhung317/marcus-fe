import { getTranslations } from 'next-intl/server';
import { ErrorStateCard } from '@/components/shared/api-state';
import { BotAnalyticsSection } from '@/components/terminal/bot-detail/bot-analytics-section';
import { MarketplaceBotDetailHero } from '@/components/terminal/marketplace/marketplace-bot-detail-hero';
import { MarketplaceBotRuntimeSnapshot } from '@/components/terminal/marketplace/marketplace-bot-runtime-snapshot';
import { MarketplaceBotSidebar } from '@/components/terminal/marketplace/marketplace-bot-sidebar';
import { getMarketplaceBotDetail } from '@/lib/contracts/client';
import { BotDetail, BotPerformanceQuerySource, BotPerformanceSource, BotMetricBlock } from '@/lib/contracts/types';

interface MarketplaceBotDetailSearchParams {
  source?: string | string[];
}

function toSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parsePerformanceSource(value: string | string[] | undefined): BotPerformanceQuerySource {
  const normalized = toSingleValue(value)?.trim().toUpperCase();
  if (normalized === 'DRY_RUN' || normalized === 'HISTORICAL') {
    return normalized;
  }

  return 'AUTO';
}

function getSummaryBlock(
  analytics: BotDetail['analytics'],
  performanceSource?: BotPerformanceSource | null,
): BotMetricBlock | null {
  if (!analytics) {
    return null;
  }

  if (performanceSource === 'DRY_RUN') {
    return analytics.metricBlocks.find((block) => block.title === 'Out-of-sample') ?? null;
  }

  if (performanceSource === 'HISTORICAL') {
    return analytics.metricBlocks.find((block) => block.title === 'Historical') ?? null;
  }

  return null;
}

function getSummarySourceLabel(
  performanceSource: BotPerformanceSource | null | undefined,
  t: Awaited<ReturnType<typeof getTranslations>>,
) {
  switch (performanceSource) {
    case 'DRY_RUN':
      return t('summarySource.dryRun');
    case 'HISTORICAL':
      return t('summarySource.historical');
    case 'SIGNAL_BASED':
      return t('summarySource.signalBasedFallback');
    default:
      return null;
  }
}

export default async function TerminalMarketplaceBotDetailPage({
  params,
  searchParams,
}: {
  params: { botId: string };
  searchParams?: MarketplaceBotDetailSearchParams;
}) {
  const t = await getTranslations('TerminalMarketplace.detail');
  try {
    const requestedSource = parsePerformanceSource(searchParams?.source);
    const bot = await getMarketplaceBotDetail(params.botId, requestedSource);
    const summaryBlock = getSummaryBlock(bot.analytics, bot.performanceSource);
    const summarySourceLabel = getSummarySourceLabel(bot.performanceSource, t);
    const isBotActive = (bot.status ?? 'ACTIVE') === 'ACTIVE';

    return (
      <div className="space-y-8">
        <MarketplaceBotDetailHero
          botId={bot.botId}
          description={bot.description}
          exchange={bot.exchange}
          isActive={isBotActive}
          name={bot.name}
          status={bot.status}
          tradingPair={bot.tradingPair}
        />

        <section className="grid gap-5 lg:grid-cols-[1.5fr_0.9fr]">
          <div className="space-y-5">
            <MarketplaceBotRuntimeSnapshot
              isActive={isBotActive}
              performance={bot.performance}
              performanceSource={bot.performanceSource}
              summaryBlock={summaryBlock}
              status={bot.status}
            />

            <section className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted">{t('analytics')}</p>
                <h2 className="mt-2 text-2xl font-semibold text-main">{t('title')}</h2>
              </div>
              <BotAnalyticsSection analytics={bot.analytics} summarySourceLabel={summarySourceLabel} />
            </section>
          </div>

          <MarketplaceBotSidebar
            botId={bot.botId}
            botStatus={bot.status}
            initialSubscription={bot.viewerSubscription ?? null}
            signals={bot.signals ?? []}
          />
        </section>
      </div>
    );
  } catch (error) {
    return (
      <ErrorStateCard
        title={t('error.title')}
        message={error instanceof Error ? error.message : t('error.message')}
        actionLabel={t('back')}
        actionHref="/terminal/marketplace"
      />
    );
  }
}
