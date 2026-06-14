import { useState, useMemo } from 'react';
import { CopyButton } from '../copy-button';
import { getBotSnippets, SNIPPET_LANGUAGES, SnippetLanguage } from '@/lib/configs/bot-snippets.config';

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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">API Credentials</h2>
          <p className="mt-1 text-xs text-slate-400 font-sans">Copy a runtime snippet to configure your local trading script.</p>
        </div>
        <div className="flex flex-wrap gap-1.5 font-mono">
          {SNIPPET_LANGUAGES.map((lang) => (
            <button
              key={lang.value}
              type="button"
              onClick={() => setSelectedLanguage(lang.value)}
              className={`rounded-lg border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                selectedLanguage === lang.value ? 'border-positive/20 bg-positive/10 text-positive' : 'border-border bg-surface text-slate-400 hover:text-white hover:border-slate-500/30'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-border bg-black/30">
        <div className="absolute right-3 top-3">
          <CopyButton value={snippetText} className="h-8 w-8 text-slate-400 hover:text-white" />
        </div>
        <pre className="max-h-[440px] overflow-auto p-5 pr-14 font-mono text-[11px] leading-relaxed text-slate-300">      
          <code className="whitespace-pre">{snippetText}</code>
        </pre>
      </div>
    </section>
  );
}
