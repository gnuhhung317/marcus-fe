import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TRAILING_QUOTES = ['USDT', 'USDC', 'BUSD', 'USD', 'FDUSD', 'TUSD', 'BTC', 'ETH', 'BNB', 'TRY', 'EUR'];

export function normalizeTradingSymbolForDisplay(symbol?: string | null): string | null {
  if (!symbol) return null;

  const raw = symbol.trim();
  if (!raw) return null;
  if (raw.includes('/')) return raw;

  const [baseAndQuote, suffix] = raw.split(':', 2);
  const normalizedBase = normalizeSymbolWithoutSuffix(baseAndQuote);
  return suffix ? `${normalizedBase}:${suffix}` : normalizedBase;
}

function normalizeSymbolWithoutSuffix(symbol: string): string {
  const upper = symbol.trim().toUpperCase();
  for (const quote of TRAILING_QUOTES) {
    if (upper.endsWith(quote) && upper.length > quote.length) {
      return `${upper.slice(0, -quote.length)}/${quote}`;
    }
  }
  return upper;
}
