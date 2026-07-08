import { ArrowRight, Code2, ExternalLink, KeyRound, Rocket, Server, ShieldCheck, Terminal, Waypoints } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const sdkCapabilities = ['models', 'strategy', 'backtest', 'upload', 'sync', 'telemetry'] as const;
const executorRequirements = ['wsUrl', 'wsToken', 'botId', 'exchange', 'amount', 'mode'] as const;
const boundaryNotes = ['sdkNoExchange', 'executorRuntime', 'deploymentConfig'] as const;

const sdkSignalSnippet = `from quant_signal_sdk import MarketType, OrderType, QuantSignalClient, SignalAction, SignalPayload

client = QuantSignalClient(
    base_url="https://your-marcus-api.example",
    api_key="your-bot-api-key",
    default_bot_id="bot_123",
    signer_secret="your-raw-secret",
)

signal = SignalPayload(
    action=SignalAction.OPEN_LONG,
    symbol="BTCUSDT",
    market_type=MarketType.SPOT,
    order_type=OrderType.MARKET,
    amount=0.01,
)

client.send_signal(signal)`;

const sdkBacktestSnippet = `pip install quant-signal-sdk

quant-sdk backtest --bot-file my_bot.py --data-csv candles.csv --initial-cash 1000

quant-sdk backtest --bot-file my_bot.py --data-csv candles.csv --initial-cash 1000 \\
  --upload-backtest \\
  --backend-url https://your-marcus-api.example \\
  --bot-id bot_123 \\
  --api-key <bot-api-key> \\
  --signer-secret <raw-secret>`;

const executorEnvSnippet = `SYSTEM_WS_URL=ws://your-marcus-host/ws/executor
SYSTEM_WS_TOKEN=<executor-ws-token>
BOT_ID=bot_123
EXECUTION_MODE=dry-run
EXCHANGE_ID=binance
EXCHANGE_API_KEY=<exchange-api-key>
EXCHANGE_API_SECRET=<exchange-api-secret>
DEFAULT_ORDER_AMOUNT=0.001
EXECUTOR_DB_PATH=executor_state.db`;

const executorRunSnippet = `cd local-executor-client
pip install -e .
local-executor`;

const executorDockerSnippet = `# From the DATN workspace root
docker compose -f docker-compose.bot-executor.yml up --build

# Images defined by the compose file:
# marcus-bot-executor-provisioner:latest
# marcus-bot-executor-bot:latest
# marcus-bot-executor-executor:latest`;

export default async function DeveloperDocsPage() {
  const t = await getTranslations('DeveloperDocs');

  return (
    <div className="shell-grid relative overflow-hidden pb-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.12),transparent_34%),radial-gradient(circle_at_84%_8%,hsl(var(--info)/0.1),transparent_30%)]" />

      <section className="relative z-10 mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="max-w-4xl">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">{t('eyebrow')}</p>
          <Badge variant="info" className="mt-5">
            {t('badge')}
          </Badge>
          <h1 className="mt-6 font-display text-5xl leading-[1.04] text-main md:text-6xl">{t('title')}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{t('description')}</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild className="rounded-xl px-6 py-3 text-sm font-bold uppercase tracking-[0.14em]">
              <a href="https://pypi.org/project/quant-signal-sdk/" target="_blank" rel="noreferrer">
                {t('hero.pypiCta')}
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" className="rounded-xl px-6 py-3 text-sm font-bold uppercase tracking-[0.14em]">
              <Link href="/login?next=/terminal/create-bot">
                {t('hero.credentialsCta')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-14 grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        <OverviewItem icon={Code2} title={t('overview.sdkTitle')} description={t('overview.sdkDescription')} />
        <OverviewItem icon={Server} title={t('overview.executorTitle')} description={t('overview.executorDescription')} />
        <OverviewItem icon={Waypoints} title={t('overview.flowTitle')} description={t('overview.flowDescription')} />
      </section>

      <section id="sdk" className="relative z-10 mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted">{t('sdk.eyebrow')}</p>
            <h2 className="mt-3 font-display text-4xl text-main">{t('sdk.title')}</h2>
            <p className="mt-4 text-sm leading-7 text-muted">{t('sdk.description')}</p>

            <div className="mt-6 grid gap-3">
              {sdkCapabilities.map((item) => (
                <div key={item} className="flex gap-3 rounded-xl border border-border/70 bg-surface/50 p-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-positive" />
                  <p className="text-sm leading-6 text-muted">{t(`sdk.capabilities.${item}`)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <CodeBlock label={t('sdk.signalLabel')}>{sdkSignalSnippet}</CodeBlock>
            <CodeBlock label={t('sdk.backtestLabel')}>{sdkBacktestSnippet}</CodeBlock>
          </div>
        </div>
      </section>

      <section id="executor" className="relative z-10 mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted">{t('executor.eyebrow')}</p>
            <h2 className="mt-3 font-display text-4xl text-main">{t('executor.title')}</h2>
            <p className="mt-4 text-sm leading-7 text-muted">{t('executor.description')}</p>

            <div className="mt-6 grid gap-3">
              {executorRequirements.map((item) => (
                <div key={item} className="flex gap-3 rounded-xl border border-border/70 bg-surface/50 p-3">
                  <KeyRound className="mt-0.5 h-4 w-4 flex-shrink-0 text-info" />
                  <p className="text-sm leading-6 text-muted">{t(`executor.requirements.${item}`)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <CodeBlock label={t('executor.envLabel')}>{executorEnvSnippet}</CodeBlock>
            <CodeBlock label={t('executor.localLabel')}>{executorRunSnippet}</CodeBlock>
            <CodeBlock label={t('executor.dockerLabel')}>{executorDockerSnippet}</CodeBlock>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card variant="glass-strong" className="p-6 sm:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.18em] text-muted">{t('boundaries.eyebrow')}</p>
              <h2 className="mt-3 font-display text-3xl text-main">{t('boundaries.title')}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">{t('boundaries.description')}</p>
            </div>
            <Rocket className="hidden h-10 w-10 text-primary md:block" />
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {boundaryNotes.map((item) => (
              <div key={item} className="rounded-xl border border-border/70 bg-canvas/50 p-4">
                <p className="text-sm leading-7 text-muted">{t(`boundaries.notes.${item}`)}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="relative z-10 mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card variant="glass" className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">{t('next.label')}</p>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">{t('next.description')}</p>
          </div>
          <Button asChild variant="outline" className="rounded-xl px-5 py-3 text-sm font-bold uppercase tracking-[0.14em]">
            <Link href="/login?next=/terminal/create-bot">{t('next.cta')}</Link>
          </Button>
        </Card>
      </section>
    </div>
  );
}

function OverviewItem({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Terminal;
  title: string;
  description: string;
}) {
  return (
    <Card variant="glass" className="noise p-6">
      <div className="inline-flex rounded-xl border border-border/70 bg-surface/80 p-3 text-main">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="mt-5 font-display text-2xl text-main">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
    </Card>
  );
}

function CodeBlock({ label, children }: { label: string; children: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-surface/70">
      <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
        <Terminal className="h-4 w-4 text-muted" />
      </div>
      <pre className="overflow-auto p-4 text-xs leading-6 text-main">
        <code>{children}</code>
      </pre>
    </div>
  );
}
