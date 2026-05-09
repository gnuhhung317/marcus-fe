import { getApiBaseUrl } from '../config/env';

const ACCESS_TOKEN_COOKIE = 'marcus_access_token';
const REFRESH_TOKEN_COOKIE = 'marcus_refresh_token';

let browserRefreshInFlight: Promise<string | undefined> | null = null;

export interface AuthRefreshRequest {
  refreshToken: string;
}

export interface AuthLoginResponse {
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  accessTokenExpiresInSeconds?: number;
  refreshTokenExpiresInSeconds?: number;
  userId?: string;
  username?: string;
  role?: string;
}

function normalizePath(path: string) {
  return path.startsWith('/') ? path : `/${path}`;
}

function readBrowserCookie(name: string): string | undefined {
  if (typeof document === 'undefined') {
    return undefined;
  }

  const prefix = `${name}=`;
  const cookie = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  if (!cookie) {
    return undefined;
  }

  return decodeURIComponent(cookie.slice(prefix.length));
}

function readBrowserStorage(name: string): string | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    return window.localStorage.getItem(name) ?? undefined;
  } catch {
    return undefined;
  }
}

async function readServerCookie(name: string): Promise<string | undefined> {
  if (typeof window !== 'undefined') {
    return undefined;
  }

  try {
    const { cookies } = await import('next/headers');
    return cookies().get(name)?.value;
  } catch {
    return undefined;
  }
}

async function resolveAccessToken(): Promise<string | undefined> {
  const browserToken = readBrowserCookie(ACCESS_TOKEN_COOKIE);
  if (browserToken) {
    return browserToken;
  }

  const storageToken = readBrowserStorage(ACCESS_TOKEN_COOKIE);
  if (storageToken) {
    return storageToken;
  }

  return readServerCookie(ACCESS_TOKEN_COOKIE);
}

async function executeApiRequest(path: string, init?: RequestInit): Promise<Response> {
  const normalizedPath = normalizePath(path);
  const headers = new Headers(init?.headers);

  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Ensure Authorization header is attached when an access token is available
  try {
    const accessToken = await resolveAccessToken();
    if (accessToken && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
  } catch {
    // ignore resolution errors and proceed without token
  }

  return fetch(`${getApiBaseUrl()}${normalizedPath}`, {
    cache: 'no-store',
    // Include credentials (cookies) by default so cross-origin backend requests carry auth cookies
    credentials: init?.credentials ?? 'include',
    ...init,
    headers,
  });
}

async function refreshSessionInBrowser(): Promise<string | undefined> {
  if (browserRefreshInFlight) {
    return browserRefreshInFlight;
  }

  browserRefreshInFlight = (async () => {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      cache: 'no-store',
      credentials: 'include',
    });

    if (!response.ok) {
      return undefined;
    }

    const payload = (await response.json()) as { accessToken?: string };
    return payload.accessToken;
  })();

  try {
    return await browserRefreshInFlight;
  } finally {
    browserRefreshInFlight = null;
  }
}

async function tryRefreshAccessToken(): Promise<string | undefined> {
  if (typeof window !== 'undefined') {
    return refreshSessionInBrowser();
  }

  const refreshToken = await readServerCookie(REFRESH_TOKEN_COOKIE);
  if (!refreshToken) {
    return undefined;
  }

  try {
    const session = await refreshWithToken({ refreshToken });
    return session.accessToken || undefined;
  } catch {
    return undefined;
  }
}

export async function requestAuthJson(path: string, body: unknown): Promise<AuthLoginResponse> {
  const response = await executeApiRequest(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${normalizePath(path)}`);
  }

  return (await response.json()) as AuthLoginResponse;
}

export async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const normalizedPath = normalizePath(path);
  const headers = new Headers(init?.headers);
  const currentAccessToken = await resolveAccessToken();

  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (currentAccessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${currentAccessToken}`);
  }

  let response = await executeApiRequest(normalizedPath, {
    ...init,
    headers,
  });

  if (response.status === 401) {
    const refreshedAccessToken = await tryRefreshAccessToken();

    if (refreshedAccessToken) {
      const retryHeaders = new Headers(headers);
      retryHeaders.set('Authorization', `Bearer ${refreshedAccessToken}`);

      response = await executeApiRequest(normalizedPath, {
        ...init,
        headers: retryHeaders,
      });
    }
  }

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${normalizedPath}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function refreshWithToken(payload: AuthRefreshRequest) {
  return requestAuthJson('/auth/refresh', payload);
}
