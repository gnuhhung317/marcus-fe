type ChartThemeToken =
  | '--muted-foreground'
  | '--border-line'
  | '--semantic-positive'
  | '--semantic-warning'
  | '--semantic-info'
  | '--semantic-negative'
  | '--bg-surface-strong';

const fallbackHsl: Record<ChartThemeToken, string> = {
  '--muted-foreground': '215 20% 65%',
  '--border-line': '217 18% 20%',
  '--semantic-positive': '160 84% 39%',
  '--semantic-warning': '38 92% 50%',
  '--semantic-info': '217 91% 60%',
  '--semantic-negative': '347 77% 55%',
  '--bg-surface-strong': '223 33% 12%',
};

export function resolveThemeColor(token: ChartThemeToken, alpha = 1) {
  const resolved =
    typeof window === 'undefined'
      ? fallbackHsl[token]
      : getComputedStyle(document.documentElement).getPropertyValue(token).trim() || fallbackHsl[token];

  return alpha === 1 ? `hsl(${resolved})` : `hsl(${resolved} / ${alpha})`;
}

export function buildSemanticChartPalette() {
  return [
    resolveThemeColor('--semantic-positive'),
    resolveThemeColor('--semantic-info'),
    resolveThemeColor('--semantic-warning'),
    resolveThemeColor('--semantic-negative'),
    resolveThemeColor('--semantic-positive', 0.72),
    resolveThemeColor('--semantic-info', 0.72),
    resolveThemeColor('--semantic-warning', 0.72),
  ];
}

