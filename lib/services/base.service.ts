import { contractRoutes } from '@/lib/contracts/endpoints';
import {
  AuthLoginResponse,
  AuthRefreshRequest,
  requestAuthJson,
  requestJson,
} from '@/lib/api/http';
import {
  BotTrade,
  TrainingCourse,
  DeveloperBotStatus,
} from '@/lib/contracts/types';

export const DEFAULT_BOT_ID = 'kinetic-alpha-v4';

export type PathParams = Record<string, string | number>;

export function normalizePath(path: string) {
  return path.startsWith('/') ? path : `/${path}`;
}

export function getContractRoute(routeId: string) {
  const route = contractRoutes.find((item) => item.id === routeId);
  if (!route) {
    throw new Error(`Contract route not found: ${routeId}`);
  }

  return route;
}

export function buildContractPath(
  routeId: string,
  pathParams?: PathParams,
  queryParams?: Record<string, string | number | boolean | undefined>,
) {
  const route = getContractRoute(routeId);
  let path = route.path;

  path = path.replace(/\{([^}]+)\}/g, (_match, key) => {
    const value = pathParams?.[key];
    if (value === undefined || value === null) {
      throw new Error(`Missing path parameter '${key}' for route '${routeId}'`);
    }
    return encodeURIComponent(String(value));
  });

  return `${normalizePath(path)}${toQuery(queryParams ?? {})}`;
}

export async function requestContractJson<T>(
  routeId: string,
  options?: {
    pathParams?: PathParams;
    queryParams?: Record<string, string | number | boolean | undefined>;
    init?: RequestInit;
  },
): Promise<T> {
  const route = getContractRoute(routeId);
  const normalizedPath = buildContractPath(routeId, options?.pathParams, options?.queryParams);

  return requestJson<T>(normalizedPath, {
    method: options?.init?.method ?? route.method,
    ...options?.init,
  });
}

export function toQuery(params: Record<string, string | number | boolean | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export function mapAuthSession(response?: AuthLoginResponse) {
  return {
    accessToken: response?.accessToken ?? '',
    refreshToken: response?.refreshToken ?? '',
    tokenType: response?.tokenType ?? 'Bearer',
    accessTokenExpiresInSeconds: Math.max(60, Math.round(toNumber(response?.accessTokenExpiresInSeconds, 3600))),
    refreshTokenExpiresInSeconds: Math.max(60, Math.round(toNumber(response?.refreshTokenExpiresInSeconds, 604800))),
    userId: response?.userId ?? '',
    username: response?.username ?? '',
    role: response?.role ?? 'TRADER',
  };
}

export function toNumber(value: unknown, fallback = 0): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return fallback;
  }

  return value;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatSignedCurrency(value: number, digits = 2) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });

  return `${value >= 0 ? '+' : ''}${formatter.format(value)}`;
}

export function formatSignedPercent(value: number, digits = 2) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(digits)}%`;
}

export function formatRatio(value: number, digits = 2) {
  return Number.isFinite(value) ? value.toFixed(digits) : '0.00';
}

export function normalizeTradeSide(side: string | undefined): BotTrade['side'] {
  return (side ?? '').toUpperCase().includes('SHORT') ? 'SHORT' : 'LONG';
}

export function normalizeCourseLevel(level: string | undefined): TrainingCourse['level'] {
  const normalized = (level ?? '').toUpperCase();

  if (normalized === 'EXPERT') {
    return 'EXPERT';
  }

  if (normalized === 'ADVANCED') {
    return 'ADVANCED';
  }

  return 'FOUNDATION';
}

export function normalizeDeveloperBotStatus(status?: string): DeveloperBotStatus {
  const normalized = (status ?? 'ACTIVE').toUpperCase();

  if (normalized === 'PAUSED' || normalized === 'DELETED' || normalized === 'DOWN') {
    return normalized;
  }

  return 'ACTIVE';
}

export function toDateOnly(value: string | undefined, fallback: string): string {
  if (!value) {
    return fallback;
  }

  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return value;
  }

  return new Date(parsed).toISOString().slice(0, 10);
}
