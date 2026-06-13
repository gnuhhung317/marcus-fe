export enum DecisionReason {
  SOLID_PERFORMER = 'SOLID_PERFORMER',
  NEEDS_REVIEW = 'NEEDS_REVIEW',
  HIGH_RISK = 'HIGH_RISK',
  SLIPPING = 'SLIPPING',
}

export interface PortfolioOverview {
  activeBotsCount: number;
  totalSubscribedCapital: number;
  aggregateWinRate24h: number;  // 0.0 to 1.0
  atRiskSubscriptionCount: number;
  totalEquity: number;
  aggregateOpenPnL: number;
  lastUpdated: string;  // ISO timestamp
}

export interface BotDecisionCard {
  subscriptionId: string;
  botId: string;
  botName: string;
  botIcon: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PAUSED';
  currentPnL: number;
  pnlPercent: number;
  drawdownPercent: number;
  winRate: number;
  signalCount24h: number;
  successfulSignals24h: number;
  reason: DecisionReason;
  reasonExplanation: string;
  riskScore: number;  // 0.0 to 1.0
  subscribedSinceDay: number;
  daysAtRisk: number;
  lastSignal: string | null;
  exchange: string;
}

export interface PortfolioDecisionsResponse {
  decisions: BotDecisionCard[];
  summary: {
    totalCount: number;
    activeCount: number;
    reviewNeededCount: number;
    highRiskCount: number;
  };
}

export interface DecisionDashboardData {
  overview: PortfolioOverview;
  decisions: PortfolioDecisionsResponse;
}
