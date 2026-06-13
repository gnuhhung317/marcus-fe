import {
  PaperOrderInput,
  PaperOrderResult,
  PaperSessionData,
  PaperTradingPageData,
} from '@/lib/contracts/types';
import {
  requestContractJson,
  toNumber,
} from '@/lib/services/base.service';

// --- Internal Response Interfaces ---

interface PaperSessionSummaryResponse {
  sessionId?: string;
  status?: string;
  virtualBalance?: number;
  openPnl?: number;
  buyingPower?: number;
}

interface PaperSignalResponse {
  signalId?: string;
  botId?: string;
  assetPair?: string;
  side?: string;
  confidence?: number;
  status?: string;
  generatedAt?: string;
}

interface PaperOrderResponse {
  orderId?: string;
  status?: string;
  filledQuantity?: number;
  avgFillPrice?: number;
  submittedAt?: string;
}

// --- Service Functions ---

export async function getPaperTradingPageData(): Promise<PaperTradingPageData> {
  const [sessionResponse, signalResponse] = await Promise.all([
    requestContractJson<PaperSessionSummaryResponse>('paper-session'),
    requestContractJson<PaperSignalResponse[]>('paper-signals', {
      queryParams: { limit: 8, status: 'ALL' },
    }),
  ]);

  if (!sessionResponse.sessionId || !sessionResponse.status) {
    throw new Error('Paper trading session response is missing required fields');
  }

  const session = {
    sessionId: sessionResponse.sessionId,
    status: sessionResponse.status,
    virtualBalance: toNumber(sessionResponse.virtualBalance, 248502.94),
    openPnl: toNumber(sessionResponse.openPnl, 4210),
    buyingPower: toNumber(sessionResponse.buyingPower, 1200000),
  };

  const signals = signalResponse
    .map((signal, index) => ({
      signalId: signal.signalId ?? `paper-signal-${index + 1}`,
      botId: signal.botId ?? 'fallback-bot',
      assetPair: signal.assetPair ?? 'BTC/USDT',
      side: signal.side ?? 'BUY',
      confidence: toNumber(signal.confidence, 0.7),
      status: signal.status ?? 'ACTIVE',
      generatedAt: signal.generatedAt ?? new Date().toISOString(),
    }))
    .slice(0, 8);

  return {
    session,
    signals,
  };
}

export async function createPaperOrder(payload: PaperOrderInput): Promise<PaperOrderResult> {
  const response = await requestContractJson<PaperOrderResponse>('paper-order', {
    init: {
      method: 'POST',
      body: JSON.stringify({
        assetPair: payload.assetPair,
        side: payload.side,
        quantity: payload.quantity,
        estimatedPrice: payload.estimatedPrice,
        signalId: payload.signalId,
      }),
    },
  });

  if (!response.orderId || !response.status) {
    throw new Error('Paper order response is missing required fields');
  }

  return {
    orderId: response.orderId,
    status: response.status,
    filledQuantity: toNumber(response.filledQuantity, payload.quantity),
    avgFillPrice: toNumber(response.avgFillPrice, payload.estimatedPrice),
    submittedAt: response.submittedAt ?? new Date().toISOString(),
  };
}

export async function pausePaperSession(): Promise<PaperSessionData> {
  const response = await requestContractJson<PaperSessionSummaryResponse>('paper-session-pause', {
    init: { method: 'POST' },
  });

  if (!response.sessionId || !response.status) {
    throw new Error('Paper session pause response is missing required fields');
  }

  return {
    sessionId: response.sessionId,
    status: response.status,
    virtualBalance: toNumber(response.virtualBalance, 248502.94),
    openPnl: toNumber(response.openPnl, 4210),
    buyingPower: toNumber(response.buyingPower, 1200000),
  };
}

export async function resumePaperSession(): Promise<PaperSessionData> {
  const response = await requestContractJson<PaperSessionSummaryResponse>('paper-session-resume', {
    init: { method: 'POST' },
  });

  if (!response.sessionId || !response.status) {
    throw new Error('Paper session resume response is missing required fields');
  }

  return {
    sessionId: response.sessionId,
    status: response.status,
    virtualBalance: toNumber(response.virtualBalance, 248502.94),
    openPnl: toNumber(response.openPnl, 4210),
    buyingPower: toNumber(response.buyingPower, 1200000),
  };
}
