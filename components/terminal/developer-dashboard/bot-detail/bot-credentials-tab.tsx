'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CopyButton } from '../copy-button';
import { getBotSnippets, SNIPPET_LANGUAGES, SnippetLanguage } from '@/lib/configs/bot-snippets.config';

interface BotCredentialsTabProps {
  botId: string;
  apiKey: string;
  exchange: string;
  pair: string;
}

export function BotCredentialsTab({ botId, apiKey, exchange, pair }: BotCredentialsTabProps) {
  const t = useTranslations('DeveloperDashboard.botDetail.credentials');
  const [selectedLanguage, setSelectedLanguage] = useState<SnippetLanguage>('curl');
  
  const snippets = useMemo(() => getBotSnippets({
    botId,
    apiKey,
    exchangeSlug: exchange.toLowerCase(),
    pair,
    timestamp: new Date().toISOString()
  }), [botId, apiKey, exchange, pair]);

  const snippetText = snippets[selectedLanguage];

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted font-sans">{t('title')}</h2>
        </div>
        <div className="flex flex-wrap gap-1.5 font-mono">
          {SNIPPET_LANGUAGES.map((lang) => (
            <Button
              key={lang.value}
              type="button"
              variant={selectedLanguage === lang.value ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setSelectedLanguage(lang.value)}
              className="h-8 rounded-lg px-2.5 text-[9px] font-bold uppercase tracking-wider"
            >
              {lang.label}
            </Button>
          ))}
        </div>
      </div>

      <Card className="relative overflow-hidden border-border/40 bg-surface-strong">
        <div className="absolute right-3 top-3">
          <CopyButton value={snippetText} className="h-8 w-8 text-muted hover:text-main" />
        </div>
        <pre className="max-h-[440px] overflow-auto p-5 pr-14 font-mono text-[11px] leading-relaxed text-main">
          <code className="whitespace-pre">{snippetText}</code>
        </pre>
      </Card>
    </section>
  );
}
