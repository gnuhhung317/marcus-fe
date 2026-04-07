import {
  BlogPost,
  LeaderboardRow,
  MarketplaceBot,
  MarketTicker,
  Principle,
  ProfileApiKey,
  ResearchReport,
  StrategyTrade,
  TerminalKpi,
  TrainingCourse,
} from './types';

export const marketTickers: MarketTicker[] = [
  { symbol: 'BTC/USDT', asset: 'Bitcoin', price: '$64,231.50', change: 2.45 },
  { symbol: 'ETH/USDT', asset: 'Ethereum', price: '$3,412.12', change: -1.12 },
  { symbol: 'SOL/USDT', asset: 'Solana', price: '$148.82', change: -0.84 },
];

export const principles: Principle[] = [
  {
    title: 'Precision',
    description: 'Execution at the speed of thought with millisecond-level routing across venues.',
    badge: 'LTC 1.2ms',
  },
  {
    title: 'Security',
    description: 'Hardware-isolated signing and encrypted key vaults for bot orchestration.',
    badge: 'AES-256',
  },
  {
    title: 'Yield',
    description: 'Adaptive strategies balance momentum and drawdown constraints in real time.',
    badge: 'APY 18.4%',
  },
];

export const trainingCourses: TrainingCourse[] = [
  {
    id: 'quant-basics',
    title: 'Quant Basics',
    level: 'FOUNDATION',
    progress: 65,
    summary: 'Statistical arbitrage, volatility structure, and practical execution constraints.',
  },
  {
    id: 'advanced-arbitrage',
    title: 'Advanced Arbitrage',
    level: 'EXPERT',
    progress: 12,
    summary: 'Cross-venue spread capture with robust risk and slippage handling.',
  },
  {
    id: 'bot-optimization',
    title: 'Bot Optimization',
    level: 'ADVANCED',
    progress: 0,
    summary: 'Tune latency, sizing, and fail-safe behavior for production bots.',
  },
];

export const marketplaceBots: MarketplaceBot[] = [
  {
    botId: 'hypertrend-v4',
    name: 'HyperTrend v4',
    tags: ['TREND', 'CRYPTO'],
    pnl30d: 24.8,
    winRate: 68.2,
    drawdown: 4.1,
  },
  {
    botId: 'aegis-grid',
    name: 'Aegis Grid',
    tags: ['GRID', 'FOREX'],
    pnl30d: 12.4,
    winRate: 82.5,
    drawdown: 1.8,
  },
  {
    botId: 'vortex-scalper',
    name: 'Vortex Scalper',
    tags: ['SCALP', 'EQUITIES'],
    pnl30d: 8.2,
    winRate: 54,
    drawdown: 12.5,
  },
];

export const leaderboardRows: LeaderboardRow[] = [
  {
    rank: 1,
    strategyId: 'kinetic-alpha-v4',
    strategyName: 'KINETIC_ALPHA_V4',
    category: 'Arbitrage',
    return24h: 14.28,
    drawdown: 2.14,
    sharpe: 4.82,
    status: 'ACTIVE',
  },
  {
    rank: 2,
    strategyId: 'void-runner-grid',
    strategyName: 'VOID_RUNNER_GRID',
    category: 'Grid',
    return24h: 8.91,
    drawdown: 1.05,
    sharpe: 3.95,
    status: 'ACTIVE',
  },
  {
    rank: 3,
    strategyId: 'neural-storm-x',
    strategyName: 'NEURAL_STORM_X',
    category: 'Neural',
    return24h: 7.22,
    drawdown: 4.4,
    sharpe: 3.11,
    status: 'ACTIVE',
  },
  {
    rank: 4,
    strategyId: 'eclipse-trend-max',
    strategyName: 'ECLIPSE_TREND_MAX',
    category: 'Trend',
    return24h: -2.15,
    drawdown: 12.8,
    sharpe: 1.42,
    status: 'HIBERNATING',
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: 'liquidity-traps',
    title: 'Decoding High-Frequency Liquidity Traps',
    category: 'Strategy',
    excerpt: 'How institutional flows manipulate thin books and how to position around it.',
    readTime: '12 min',
  },
  {
    id: 'zero-latency-ai',
    title: 'AI Agents: The Future of Zero-Latency Execution',
    category: 'Tech',
    excerpt: 'Predictive scheduling agents and edge co-location patterns for execution.',
    readTime: '8 min',
  },
  {
    id: 'risk-calibration-q3',
    title: 'The Volatility Surface: Risk Calibration for Q3',
    category: 'Markets',
    excerpt: 'Macro-sensitive calibration tactics for cross-asset strategy stacks.',
    readTime: '10 min',
  },
];

export const researchReports: ResearchReport[] = [
  {
    id: 'systemic-shifts-2025',
    title: 'The Liquidity Vortex: Systemic Shifts in 2025',
    category: 'Alpha Reports',
    readTime: '12 min',
    publishedAt: '2024-10-24',
  },
  {
    id: 'defi-derivatives-frontier',
    title: 'DeFi Derivatives: The Next Frontier',
    category: 'Market Insights',
    readTime: '12 min',
    publishedAt: '2024-10-11',
  },
  {
    id: 'kinetic-engine-v24',
    title: 'Kinetic Engine v2.4 Patch Notes',
    category: 'System Updates',
    readTime: '6 min',
    publishedAt: '2024-10-05',
  },
];

export const terminalKpis: TerminalKpi[] = [
  {
    label: 'Total Equity',
    value: '$142,509.42',
    delta: '+2.4%',
    context: 'vs yesterday close',
    trend: 'up',
  },
  {
    label: 'Today PnL',
    value: '+$2,410.12',
    delta: '+$680',
    context: 'realized + unrealized',
    trend: 'up',
  },
  {
    label: 'Active Bots',
    value: '08',
    delta: '6 live / 2 paused',
    context: 'manual refresh mode',
    trend: 'neutral',
  },
  {
    label: 'Win Rate 24h',
    value: '72.4%',
    delta: '-1.3%',
    context: 'last 24h executions',
    trend: 'down',
  },
];

export const strategyTrades: StrategyTrade[] = [
  { timestamp: '2024-05-24 14:32:01', pair: 'BTC/USDT', side: 'LONG', pnl: 1240.2 },
  { timestamp: '2024-05-24 13:14:55', pair: 'ETH/USDT', side: 'SHORT', pnl: -326.8 },
  { timestamp: '2024-05-24 11:09:22', pair: 'SOL/USDT', side: 'LONG', pnl: 587.5 },
  { timestamp: '2024-05-24 08:45:18', pair: 'LINK/USDT', side: 'LONG', pnl: 480.9 },
];

export const profileApiKeys: ProfileApiKey[] = [
  {
    id: 'key-binance-main',
    label: 'Binance_Spot_Trading',
    maskedKey: 'mt_ak_************3a9c',
    createdAt: '2024-09-30T08:10:00Z',
  },
  {
    id: 'key-bybit-futures',
    label: 'ByBit_Futures_Main',
    maskedKey: 'mt_ak_************7e21',
    createdAt: '2024-10-02T06:40:00Z',
  },
];
