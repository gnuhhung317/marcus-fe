import { z } from 'zod';

type MessageFn = (key: string, values?: Record<string, string | number>) => string;

export function createRegisterBotSchema(t: MessageFn) {
  return z.object({
    botName: z.string().min(3, t('nameMin')).max(50, t('nameMax')).trim(),
    exchange: z.enum(['BINANCE', 'BYBIT', 'OKX']),
    tradingPair: z
      .string()
      .min(1, t('pairRequired'))
      .regex(/^[A-Z0-9]+\/[A-Z0-9]+$/, t('pairFormat'))
      .trim(),
    description: z.string().max(200, t('descriptionMax')).optional(),
  });
}

export type RegisterBotFormValues = z.infer<ReturnType<typeof createRegisterBotSchema>>;
