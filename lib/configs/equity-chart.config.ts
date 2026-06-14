import { ChartOptions, DeepPartial, LineSeriesPartialOptions, ColorType } from 'lightweight-charts';

export const equityChartLayoutOptions: DeepPartial<ChartOptions> = {
  autoSize: true,
  height: 320,
  layout: {
    background: { type: ColorType.Solid, color: 'transparent' },
    textColor: '#94a3b8',
  },
  grid: {
    vertLines: { color: 'rgba(255, 255, 255, 0.03)' },
    horzLines: { color: 'rgba(255, 255, 255, 0.03)' },
  },
  rightPriceScale: {
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  timeScale: {
    borderColor: 'rgba(255, 255, 255, 0.06)',
    timeVisible: true,
  },
  crosshair: {
    vertLine: { color: 'rgba(16, 185, 129, 0.35)', width: 1 },
    horzLine: { color: 'rgba(16, 185, 129, 0.35)', width: 1 },
  },
};

export const equityLineOptions: LineSeriesPartialOptions = {
  color: '#10b981',
  lineWidth: 2,
  priceLineVisible: false,
};
