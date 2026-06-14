import { buildSemanticChartPalette, resolveThemeColor } from './chart-theme';

export function createSparklineDefaultConfig() {
  return {
    width: 120,
    height: 40,
    strokeWidth: 1.5,
    colors: {
      positive: resolveThemeColor('--semantic-positive'),
      negative: resolveThemeColor('--semantic-negative'),
      warning: resolveThemeColor('--semantic-warning'),
      neutral: resolveThemeColor('--muted-foreground'),
      info: resolveThemeColor('--semantic-info'),
    },
    palette: buildSemanticChartPalette(),
  };
}
