import { ErrorStateCard } from '@/components/shared/api-state';
import { BotAnalyticsSection } from '@/components/terminal/bot-detail/bot-analytics-section';
import { MarketplaceBotDetailHero } from '@/components/terminal/marketplace/marketplace-bot-detail-hero';
import { MarketplaceBotRuntimeSnapshot } from '@/components/terminal/marketplace/marketplace-bot-runtime-snapshot';
import { MarketplaceBotSidebar } from '@/components/terminal/marketplace/marketplace-bot-sidebar';
import { getMarketplaceBotDetail } from '@/lib/contracts/client';

export default async function TerminalMarketplaceBotDetailPage({ params }: { params: { botId: string } }) {
  try {
    const bot = await getMarketplaceBotDetail(params.botId);
    const primaryBlock = bot.analytics?.metricBlocks.find((block) => block.title === 'Out-of-sample')
      ?? bot.analytics?.metricBlocks[0]
      ?? null;
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
            <MarketplaceBotRuntimeSnapshot isActive={isBotActive} primaryBlock={primaryBlock} status={bot.status} />

            <section className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted">Analytics</p>
                <h2 className="mt-2 text-2xl font-semibold text-main">Live / Dry Run Performance</h2>
              </div>
              <BotAnalyticsSection analytics={bot.analytics} />
            </section>
          </div>

          <MarketplaceBotSidebar botId={bot.botId} botStatus={bot.status} signals={bot.signals ?? []} />
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
