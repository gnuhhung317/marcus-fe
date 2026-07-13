'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { BotProvisioningCredentials, RegisterBotInput } from '@/lib/contracts/types';

interface DeploySnippetCardProps {
  formValues: RegisterBotInput;
  credentials: BotProvisioningCredentials | null;
}

function canonicalJson(obj: any): string {
  return JSON.stringify(obj, Object.keys(obj).sort());
}

async function generateHmac(payload: any, secret: string, timestamp: string): Promise<string> {
  if (!secret || secret.startsWith('<')) return '<computed-signature>';
  try {
    const message = `${timestamp}\n${canonicalJson(payload)}`;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const msgData = encoder.encode(message);

    const cryptoObj = typeof window !== 'undefined' ? window.crypto : (globalThis as any).crypto;
    if (!cryptoObj || !cryptoObj.subtle) {
      return '<crypto-not-supported>';
    }

    const key = await cryptoObj.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBuffer = await cryptoObj.subtle.sign(
      'HMAC',
      key,
      msgData
    );

    const hashArray = Array.from(new Uint8Array(signatureBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    console.error('Failed to generate HMAC:', err);
    return '<signature-generation-failed>';
  }
}

export function DeploySnippetCard({ formValues, credentials }: DeploySnippetCardProps) {
  const t = useTranslations('DeveloperDashboard.deploySnippet');
  const botId = credentials?.botId ?? '<botId-from-response>';
  const apiKey = credentials?.apiKey ?? '<apiKey-from-response>';
  const rawSecret = credentials?.rawSecret ?? '<rawSecret-from-response>';

  const [timestamp, setTimestamp] = useState<string>('<current-timestamp>');
  const [signature, setSignature] = useState<string>('<computed-signature>');

  useEffect(() => {
    const ts = Date.now().toString();
    setTimestamp(ts);

    const payload = {
      signalId: 'sig_20260407_001',
      botId: botId,
      exchangeSlug: formValues.exchange.toLowerCase(),
      symbol: formValues.tradingPair,
      action: 'OPEN_LONG',
      price: 67321.12,
      timestamp: '2026-04-07T08:30:00Z',
    };

    if (rawSecret && !rawSecret.startsWith('<')) {
      generateHmac(payload, rawSecret, ts).then(sig => {
        setSignature(sig);
      });
    } else {
      setSignature('<computed-signature>');
    }
  }, [botId, rawSecret, formValues.exchange, formValues.tradingPair]);

  const snippet = `POST /api/v1/signals
X-Bot-Api-Key: ${apiKey}
X-Timestamp: ${timestamp}
X-Signature: ${signature}
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
