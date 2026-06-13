import { useState, useMemo } from 'react';
import { CopyButton } from '../copy-button';
import { getBotSnippets, SNIPPET_LANGUAGES, SnippetLanguage } from '@/lib/configs/bot-snippets.config';
import { Badge } from '@/components/ui/badge';

interface BotCredentialsTabProps {
  botId: string;
  apiKey: string;
  exchange: string;
  pair: string;
}

export function BotCredentialsTab({ botId, apiKey, exchange, pair }: BotCredentialsTabProps) {
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
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-main">API credentials</h2>
          <p className="mt-1 text-sm text-muted">Copy a runtime snippet without exposing the secret surface in the layout.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {SNIPPET_LANGUAGES.map((lang) => (
            <button
              key={lang.value}
              type="button"
              onClick={() => setSelectedLanguage(lang.value)}
              className={`rounded-full border border-border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                selectedLanguage === lang.value ? 'bg-positive-soft text-positive' : 'bg-surface text-muted hover:bg-surface-hover'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border bg-canvas-elevated">
        <div className="absolute right-3 top-3">
          <CopyButton value={snippetText} className="h-8 w-8" />
        </div>
        <pre className="max-h-[440px] overflow-auto p-5 pr-14 font-mono text-xs leading-relaxed text-muted">      
          <code className="whitespace-pre-wrap">{snippetText}</code>
        </pre>
      </div>
    </section>
  );
}
