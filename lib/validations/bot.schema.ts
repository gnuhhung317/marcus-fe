import { z } from 'zod';

export const registerBotSchema = z.object({
  botName: z.string().min(3, 'Bot name must be at least 3 characters').max(50, 'Bot name is too long').trim(),
  exchange: z.enum(['BINANCE', 'BYBIT', 'OKX']),
  tradingPair: z
    .string()
    .min(1, 'Trading pair is required')
    .regex(/^[A-Z0-9]+\/[A-Z0-9]+$/, 'Must be in format ASSET/QUOTE (e.g., BTC/USDT)')
    .trim(),
  description: z.string().max(200, 'Description is too long').optional(),
});

export type RegisterBotFormValues = z.infer<typeof registerBotSchema>;
