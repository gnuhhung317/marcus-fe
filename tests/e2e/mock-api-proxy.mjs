import http from 'node:http';

const listenPort = Number(process.env.MOCK_API_PORT ?? 4010);
const realApiBaseUrl = (process.env.REAL_API_BASE_URL ?? 'https://marcus-api.tromoi.xyz/api/v1').replace(/\/$/, '');
const apiPrefix = '/api/v1';
const runtimeSnapshotTestBotId = 'runtime-snapshot-test-bot';

function json(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(body));
}

async function readJsonBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return null;
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return null;
  }
}

function createSession(username = 'trader@example.com') {
  const normalizedUsername = String(username || 'trader@example.com');
  return {
    accessToken: `mock-access-${normalizedUsername}`,
    refreshToken: `mock-refresh-${normalizedUsername}`,
    tokenType: 'Bearer',
    accessTokenExpiresInSeconds: 3600,
    refreshTokenExpiresInSeconds: 604800,
    userId: `user-${normalizedUsername}`,
    username: normalizedUsername,
    role: 'TRADER',
  };
}

function getRuntimeSnapshotTestMode(authHeader = '') {
  if (authHeader.includes('runtime-snapshot-historical')) {
    return 'historical';
  }

  if (authHeader.includes('runtime-snapshot-fallback')) {
    return 'fallback';
  }

  if (authHeader.includes('runtime-snapshot-dry-run')) {
    return 'dry-run';
  }

  return null;
}

function createRuntimeSnapshotTestPayload(mode) {
  const detail = {
    botId: runtimeSnapshotTestBotId,
    botName: 'Runtime Snapshot Test Bot',
    description: 'Deterministic fixture for marketplace runtime snapshot consistency.',
    status: 'ACTIVE',
    tradingPair: 'BTC/USDT',
    exchange: 'BINANCE',
    performanceSource: mode === 'historical' ? 'HISTORICAL' : mode === 'fallback' ? 'SIGNAL_BASED' : 'DRY_RUN',
    performance: {
      annualReturn: 21.3742,
      maxDrawdown: 1.0,
      sharpe: 51.55,
      winRate: 0.1111,
      avgTradeReturn: 0.42,
      tradesPerDay: 1.5,
    },
    viewerSubscription: null,
  };

  const metrics = {
    total: {
      annualReturn: 5.3612,
      maxDrawdown: -0.4821,
      sharpe: 2.707,
      sortino: 3.404,
      calmar: 4.501,
      profitFactor: 1.55,
      winRate: 0.7381,
      sampleSizeDays: 110,
      sampleSizeTrades: 42,
      statisticalSignificanceWarning: null,
    },
    historical: {
      annualReturn: 1.1111,
      maxDrawdown: -0.1234,
      sharpe: 1.11,
      sortino: 2.22,
      calmar: 3.33,
      profitFactor: 1.44,
      winRate: 0.55,
      sampleSizeDays: 40,
      sampleSizeTrades: 12,
      statisticalSignificanceWarning: null,
    },
    outOfSample: {
      annualReturn: 4.2492,
      maxDrawdown: -1.9842,
      sharpe: 0.71,
      sortino: 8.88,
      calmar: 2.14,
      profitFactor: 1.02,
      winRate: 0.8667,
      sampleSizeDays: 70,
      sampleSizeTrades: 30,
      statisticalSignificanceWarning: null,
    },
  };

  const performanceSeries = {
    splitTimestamp: '2026-05-11T00:00:00Z',
    points: [
      { timestamp: '2026-04-01T00:00:00Z', value: 0, phase: 'HISTORICAL' },
      { timestamp: '2026-05-10T00:00:00Z', value: 35.5, phase: 'HISTORICAL' },
      { timestamp: '2026-05-11T00:00:00Z', value: 36.0, phase: 'OUT_OF_SAMPLE' },
      { timestamp: '2026-07-10T00:00:00Z', value: 61.25, phase: 'OUT_OF_SAMPLE' },
    ],
  };

  return {
    detail,
    metrics,
    performanceSeries,
  };
}

function handleRuntimeSnapshotTestRoute(req, res, pathname, search, authHeader) {
  const mode = getRuntimeSnapshotTestMode(authHeader);
  if (!mode) {
    return false;
  }

  const { detail, metrics, performanceSeries } = createRuntimeSnapshotTestPayload(mode);
  const detailPath = `${apiPrefix}/bots/${runtimeSnapshotTestBotId}`;
  const metricsPath = `${detailPath}/analytics/metrics`;
  const seriesPath = `${detailPath}/analytics/performance-series`;
  const decisionsPath = `${apiPrefix}/dashboard/portfolio/decisions`;

  if (req.method === 'GET' && pathname === detailPath) {
    json(res, 200, detail);
    return true;
  }

  if (req.method === 'GET' && pathname === metricsPath) {
    json(res, 200, metrics);
    return true;
  }

  if (req.method === 'GET' && pathname === seriesPath) {
    const range = new URLSearchParams(search).get('range');
    if (range && range.toUpperCase() !== 'ALL') {
      json(res, 200, { ...performanceSeries, points: performanceSeries.points.slice(-2) });
      return true;
    }

    json(res, 200, performanceSeries);
    return true;
  }

  if (req.method === 'GET' && pathname === decisionsPath) {
    json(res, 200, {
      decisions: [],
      summary: {
        totalCount: 0,
        activeCount: 0,
        reviewNeededCount: 0,
        highRiskCount: 0,
      },
    });
    return true;
  }

  return false;
}

async function handleAuthRoute(req, res, pathname) {
  if (req.method !== 'POST') {
    json(res, 405, { message: 'Method not allowed.' });
    return true;
  }

  const body = await readJsonBody(req);
  if (!body) {
    json(res, 400, { message: 'Invalid request payload.' });
    return true;
  }

  if (pathname === `${apiPrefix}/auth/login`) {
    if (body.password === 'wrong-password') {
      json(res, 401, { message: 'Invalid username/email or password.' });
      return true;
    }

    json(res, 200, createSession(body.username));
    return true;
  }

  if (pathname === `${apiPrefix}/auth/register`) {
    json(res, 200, createSession(body.username ?? body.email));
    return true;
  }

  if (pathname === `${apiPrefix}/auth/refresh`) {
    if (!body.refreshToken || String(body.refreshToken).includes('expired')) {
      json(res, 401, { message: 'refresh_failed' });
      return true;
    }

    json(res, 200, createSession(body.username));
    return true;
  }

  return false;
}

async function proxyToRealBackend(req, res, pathname, search) {
  const upstreamUrl = new URL(`${pathname.slice(apiPrefix.length)}${search}`, realApiBaseUrl);
  const headers = new Headers();
  const authHeader = typeof req.headers.authorization === 'string' ? req.headers.authorization : '';

  if (handleRuntimeSnapshotTestRoute(req, res, pathname, search, authHeader)) {
    return;
  }

  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value !== 'string') {
      continue;
    }

    if (['host', 'content-length', 'connection'].includes(key.toLowerCase())) {
      continue;
    }

    headers.set(key, value);
  }

  const init = {
    method: req.method,
    headers,
    cache: 'no-store',
  };

  if (req.method && !['GET', 'HEAD'].includes(req.method.toUpperCase())) {
    init.body = await new Promise((resolve, reject) => {
      const chunks = [];
      req.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', reject);
    });
  }

  const upstreamResponse = await fetch(upstreamUrl, init);
  const responseHeaders = new Headers();

  upstreamResponse.headers.forEach((value, key) => {
    responseHeaders.set(key, value);
  });

  const isBotDetailRoute = /^\/api\/v1\/bots\/[^/]+$/.test(pathname) && req.method === 'GET';
  if (isBotDetailRoute && upstreamResponse.ok) {
    const payload = await upstreamResponse.json();
    const shouldInjectViewerSubscription = authHeader.includes('viewer-subscribed');
    const responseBody = shouldInjectViewerSubscription && payload && typeof payload === 'object' && !Array.isArray(payload)
      ? {
          ...payload,
          viewerSubscription: {
            status: 'ACTIVE',
            wsToken: 'ws_viewer_subscription',
          },
        }
      : payload;

    responseHeaders.delete('content-length');
    responseHeaders.set('content-type', 'application/json; charset=utf-8');

    const responseText = JSON.stringify(responseBody);
    responseHeaders.set('content-length', String(Buffer.byteLength(responseText)));

    res.writeHead(upstreamResponse.status, Object.fromEntries(responseHeaders.entries()));
    res.end(responseText);
    return;
  }

  res.writeHead(upstreamResponse.status, Object.fromEntries(responseHeaders.entries()));
  const buffer = Buffer.from(await upstreamResponse.arrayBuffer());
  res.end(buffer);
}

const server = http.createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url ?? '/', `http://127.0.0.1:${listenPort}`);
    const { pathname, search } = requestUrl;

    if (pathname === `${apiPrefix}/auth/login` || pathname === `${apiPrefix}/auth/register` || pathname === `${apiPrefix}/auth/refresh`) {
      const handled = await handleAuthRoute(req, res, pathname);
      if (handled) {
        return;
      }
    }

    if (!pathname.startsWith(apiPrefix)) {
      json(res, 404, { message: 'Not found.' });
      return;
    }

    await proxyToRealBackend(req, res, pathname, search);
  } catch (error) {
    json(res, 500, { message: 'Mock API proxy failed.', error: String(error) });
  }
});

server.listen(listenPort, '127.0.0.1', () => {
  process.stdout.write(`Mock API proxy listening on http://127.0.0.1:${listenPort}\n`);
});

process.on('SIGINT', () => server.close(() => process.exit(0)));
process.on('SIGTERM', () => server.close(() => process.exit(0)));
