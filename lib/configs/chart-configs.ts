import { ChartOptions, DeepPartial, LineSeriesPartialOptions, ColorType } from 'lightweight-charts';

export const chartLayoutOptions: DeepPartial<ChartOptions> = {
  autoSize: true,
  height: 320,
  layout: {
    background: { type: ColorType.Solid, color: 'transparent' },
    textColor: '#9ca3af',
  },
  grid: {
    vertLines: { color: 'rgba(148, 163, 184, 0.08)' },
    horzLines: { color: 'rgba(148, 163, 184, 0.08)' },
  },
  rightPriceScale: {
    borderColor: 'rgba(148, 163, 184, 0.12)',
  },
  timeScale: {
    borderColor: 'rgba(148, 163, 184, 0.12)',
    timeVisible: true,
  },
  crosshair: {
    vertLine: { color: 'rgba(16, 185, 129, 0.45)', width: 1 },
    horzLine: { color: 'rgba(16, 185, 129, 0.35)', width: 1 },
  },
};

export const historicalLineOptions: LineSeriesPartialOptions = {
  color: '#94a3b8',
  lineWidth: 2,
  priceLineVisible: false,
  lastValueVisible: false,
};

export const oosLineOptions: LineSeriesPartialOptions = {
  color: '#10b981',
  lineWidth: 3,
  priceLineVisible: false,
};

export const backtestAreaOptions = {
  topColor: 'rgba(148, 163, 184, 0.15)',
  bottomColor: 'rgba(148, 163, 184, 0.0)',
  lineColor: '#94a3b8',
  lineWidth: 2 as const,
  priceLineVisible: false,
  lastValueVisible: false,
};

export const liveAreaOptions = {
  topColor: 'rgba(16, 185, 129, 0.2)',
  bottomColor: 'rgba(16, 185, 129, 0.0)',
  lineColor: '#10b981',
  lineWidth: 2 as const,
  priceLineVisible: false,
};


