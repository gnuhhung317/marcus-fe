import http from 'node:http';

const listenPort = Number(process.env.MOCK_API_PORT ?? 4010);
const realApiBaseUrl = (process.env.REAL_API_BASE_URL ?? 'https://marcus-api.tromoi.xyz/api/v1').replace(/\/$/, '');
const apiPrefix = '/api/v1';

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
