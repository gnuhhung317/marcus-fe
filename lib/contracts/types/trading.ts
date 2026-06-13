export interface PaperSignal {
  signalId: string;
  botId: string;
  assetPair: string;
  side: string;
  confidence: number;
  status: string;
  generatedAt: string;
}

export interface PaperSessionData {
  sessionId: string;
  status: string;
  virtualBalance: number;
  openPnl: number;
  buyingPower: number;
}

export interface PaperTradingPageData {
  session: PaperSessionData;
  signals: PaperSignal[];
}

export interface PaperOrderInput {
  assetPair: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  estimatedPrice: number;
  signalId?: string;
}

export interface PaperOrderResult {
  orderId: string;
  status: string;
  filledQuantity: number;
  avgFillPrice: number;
  submittedAt: string;
}
