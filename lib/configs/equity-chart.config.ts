import { AreaSeriesPartialOptions, ChartOptions, ColorType, DeepPartial, LineSeriesPartialOptions } from 'lightweight-charts';
import { resolveThemeColor } from './chart-theme';

export function createEquityChartLayoutOptions(): DeepPartial<ChartOptions> {
  return {
    autoSize: true,
    height: 320,
    layout: {
      background: { type: ColorType.Solid, color: 'transparent' },
      textColor: resolveThemeColor('--muted-foreground'),
    },
    grid: {
      vertLines: { color: resolveThemeColor('--border-line', 0.03) },
      horzLines: { color: resolveThemeColor('--border-line', 0.03) },
    },
    rightPriceScale: {
      borderColor: resolveThemeColor('--border-line', 0.06),
    },
    timeScale: {
      borderColor: resolveThemeColor('--border-line', 0.06),
      timeVisible: true,
    },
    crosshair: {
      vertLine: { color: resolveThemeColor('--semantic-positive', 0.35), width: 1 },
      horzLine: { color: resolveThemeColor('--semantic-positive', 0.35), width: 1 },
    },
  };
}

export function createEquityLineOptions(): LineSeriesPartialOptions {
  return {
    color: resolveThemeColor('--semantic-positive'),
    lineWidth: 2,
    priceLineVisible: false,
  };
}

export function createEquityAreaOptions(): AreaSeriesPartialOptions {
  return {
    topColor: resolveThemeColor('--semantic-positive', 0.2),
    bottomColor: resolveThemeColor('--semantic-positive', 0),
    lineColor: resolveThemeColor('--semantic-positive'),
    lineWidth: 2,
    priceLineVisible: false,
  };
}
