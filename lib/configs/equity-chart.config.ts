import {
  AreaSeriesPartialOptions,
  ChartOptions,
  ColorType,
  DeepPartial,
  LineSeriesPartialOptions,
  TickMarkFormatter,
  Time,
  isBusinessDay,
} from 'lightweight-charts';
import { resolveThemeColor } from './chart-theme';

export type EquityChartTimeframe = '1D' | '7D' | '30D' | 'ALL';

function toFormatterDate(time: Time) {
  if (typeof time === 'number') {
    return new Date(time * 1000);
  }

  if (isBusinessDay(time)) {
    return new Date(Date.UTC(time.year, time.month - 1, time.day));
  }

  const parsed = new Date(time);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function createTickMarkFormatter(timeframe: EquityChartTimeframe): TickMarkFormatter {
  return (time: Time, _tickMarkType, locale: string) => {
    const date = toFormatterDate(time);
    if (!date) {
      return null;
    }

    if (timeframe === '1D') {
      return new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    }

    if (timeframe === 'ALL') {
      return new Intl.DateTimeFormat(locale, {
        month: 'short',
        year: '2-digit',
      }).format(date);
    }

    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
    }).format(date);
  };
}

export function createEquityChartLayoutOptions(timeframe: EquityChartTimeframe): DeepPartial<ChartOptions> {
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
      timeVisible: timeframe === '1D',
      secondsVisible: false,
      tickMarkFormatter: createTickMarkFormatter(timeframe),
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
    crosshairMarkerRadius: 4,
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
