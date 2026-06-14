import { AreaSeriesPartialOptions, ChartOptions, ColorType, DeepPartial, LineSeriesPartialOptions } from 'lightweight-charts';
import { buildSemanticChartPalette, resolveThemeColor } from './chart-theme';

export function createChartLayoutOptions(): DeepPartial<ChartOptions> {
  return {
    autoSize: true,
    height: 320,
    layout: {
      background: { type: ColorType.Solid, color: 'transparent' },
      textColor: resolveThemeColor('--muted-foreground'),
    },
    grid: {
      vertLines: { color: resolveThemeColor('--border-line', 0.08) },
      horzLines: { color: resolveThemeColor('--border-line', 0.08) },
    },
    rightPriceScale: {
      borderColor: resolveThemeColor('--border-line', 0.12),
    },
    timeScale: {
      borderColor: resolveThemeColor('--border-line', 0.12),
      timeVisible: true,
    },
    crosshair: {
      vertLine: { color: resolveThemeColor('--semantic-positive', 0.45), width: 1 },
      horzLine: { color: resolveThemeColor('--semantic-positive', 0.35), width: 1 },
    },
  };
}

export function createHistoricalLineOptions(): LineSeriesPartialOptions {
  return {
    color: resolveThemeColor('--muted-foreground'),
    lineWidth: 2,
    priceLineVisible: false,
    lastValueVisible: false,
  };
}

export function createOutOfSampleLineOptions(): LineSeriesPartialOptions {
  return {
    color: resolveThemeColor('--semantic-positive'),
    lineWidth: 3,
    priceLineVisible: false,
  };
}

export function createBacktestAreaOptions(): AreaSeriesPartialOptions {
  return {
    topColor: resolveThemeColor('--muted-foreground', 0.15),
    bottomColor: resolveThemeColor('--muted-foreground', 0),
    lineColor: resolveThemeColor('--muted-foreground'),
    lineWidth: 2 as const,
    priceLineVisible: false,
    lastValueVisible: false,
  };
}

export function createLiveAreaOptions(): AreaSeriesPartialOptions {
  return {
    topColor: resolveThemeColor('--semantic-positive', 0.2),
    bottomColor: resolveThemeColor('--semantic-positive', 0),
    lineColor: resolveThemeColor('--semantic-positive'),
    lineWidth: 2 as const,
    priceLineVisible: false,
  };
}

export function createChartPalette() {
  return buildSemanticChartPalette();
}

