import { useTranslations } from 'next-intl';
import { BotProvisioningCredentials, RegisterBotInput } from '@/lib/contracts/types';

interface DeploySnippetCardProps {
  formValues: RegisterBotInput;
  credentials: BotProvisioningCredentials | null;
}

export function DeploySnippetCard({ formValues, credentials }: DeploySnippetCardProps) {
  const t = useTranslations('DeveloperDashboard.deploySnippet');
  const botId = credentials?.botId ?? '<botId-from-response>';
  const apiKey = credentials?.apiKey ?? '<apiKey-from-response>';
  const rawSecret = credentials?.rawSecret ?? '<rawSecret-from-response>';

  const snippet = `POST /signals
X-Marcus-Api-Key: ${apiKey}
X-Marcus-Bot-Secret: ${rawSecret}
Content-Type: application/json

{
  "signalId": "sig_20260407_001",
  "botId": "${botId}",
  "exchangeSlug": "${formValues.exchange.toLowerCase()}",
  "symbol": "${formValues.tradingPair}",
  "action": "OPEN_LONG",
  "price": 67321.12,
  "timestamp": "2026-04-07T08:30:00Z"
}`;

  return (
    <article className="glass rounded-2xl p-6">
      <h2 className="font-display text-2xl text-main">{t('title')}</h2>

      <pre className="mt-4 overflow-auto rounded-xl border border-border bg-surface p-4 text-xs text-main">
        {snippet}
      </pre>
    </article>
  );
}
