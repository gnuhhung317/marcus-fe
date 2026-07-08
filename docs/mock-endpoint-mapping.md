# Endpoint Mapping (API-Only)

## Overview
This report documents the current relationship between backend endpoints and the frontend contract layer.

The frontend follows an API-only runtime policy:
- Real API calls go through `requestJson()` and `requestContractJson()`.
- There is no runtime mock payload injection when an endpoint fails.
- Some public marketing surfaces still use static presentation copy by design, even when related backend routes exist.

The endpoint registry is defined in `lib/contracts/endpoints.ts`.

## Runtime data policy
Runtime UI data is sourced from API responses only. On endpoint failure, the contract layer surfaces errors or empty collections rather than silently substituting fake payloads.

## Endpoint registry
`lib/contracts/endpoints.ts` defines the canonical frontend API contract list.

### Available backend endpoints
The following routes are marked `status: 'available'`:
- `GET /dashboard/overview`
- `GET /dashboard/equity-series`
- `GET /dashboard/exchange-allocation`
- `GET /bots`
- `POST /bots`
- `POST /signals`
- `GET /bots/{botId}`
- `GET /bots/{botId}/analytics/metrics`
- `GET /bots/{botId}/analytics/performance-series`
- `GET /bots/{botId}/trades`
- `GET /users/me`
- `GET /users/me/api-keys`
- `GET /signals`
- `GET /leaderboard/bots`
- `GET /leaderboard/featured`
- `GET /bots/my-bots`
- `GET /bots/{botId}/integration-health`
- `GET /subscriptions/{botId}/active`
- `PATCH /bots/{botId}/status`
- `PATCH /bots/{botId}/metadata`
- `DELETE /bots/{botId}`
- `GET /system/connectivity`
- `GET /system/execution-logs`

### Gap routes (no runtime fallback)
The following routes are still tracked as `status: 'gap'` in the frontend registry and should not be treated as production-grade content sources yet:
- `GET /academy/courses`
- `GET /academy/metrics`
- `GET /content/blog/posts`
- `GET /content/research/reports`
- `GET /market/overview`

Important note for Academy and content:
- `/academy/courses` and `/academy/metrics` currently resolve to backend responses backed by static editorial placeholders.
- They are not live academy operations data and should not be presented on the public marketing route as verified production metrics.
- `/content/blog/posts` and `/content/research/reports` are still gap content routes and should not be presented on public marketing routes as published editorial or research material.

## Page-by-page mapping

### Marketing pages
The marketing pages mix API-backed content, static presentation content, and prelaunch placeholders:
- `app/(marketing)/page.tsx` uses real market overview data alongside static marketing copy.
- `app/(marketing)/training/page.tsx` is intentionally a prelaunch page with static copy and real CTAs; it does not consume academy placeholder endpoints on the public route.
- `app/(marketing)/market/page.tsx` uses contract-backed leaderboard data.
- `app/(marketing)/blog/page.tsx` is intentionally a prelaunch page with static copy and real CTAs; it does not consume gap blog content endpoints on the public route.
- `app/(marketing)/research/page.tsx` is intentionally a prelaunch page with static copy and real CTAs; it does not consume gap research content endpoints on the public route.

### Terminal dashboard and data pages
The terminal app uses real backend endpoints with limited, explicitly coded fallback behavior in some surfaces.

#### Dashboard
- Real endpoints:
  - `GET /dashboard/overview`
  - `GET /dashboard/exchange-allocation`
  - `GET /bots/{botId}/trades`
- UI fallback behavior:
  - `terminalKpis`
  - `botTrades`
  - `defaultAllocations` defined in page code

#### Marketplace
- Real endpoints:
  - `GET /bots`
  - `GET /bots/{botId}`
  - `POST /subscriptions/{botId}`
  - `DELETE /subscriptions/{botId}`
- UI fallback behavior:
  - `marketplaceBots` for bot feed and detail fallback
  - subscription stub data when endpoint is unavailable

#### Profile
- Real endpoints:
  - `GET /users/me`
  - `GET /users/me/api-keys`
  - `GET /users/me/login-activities`
- UI fallback behavior:
  - `profileApiKeys`
  - `defaultLoginActivities`

#### Bot analytics
- Real endpoints:
  - `GET /bots/{botId}`
  - `GET /bots/{botId}/analytics/metrics`
  - `GET /bots/{botId}/analytics/performance-series`
  - `GET /bots/{botId}/trades`
- UI fallback behavior:
  - `botTrades`
  - fallback series and metrics when endpoint payload is missing or unavailable

#### Developer console
- Real endpoints:
  - `GET /system/connectivity`
  - `GET /signals`
  - `GET /system/execution-logs`
- UI fallback behavior:
  - stubbed operational state when those endpoints fail

#### Developer dashboard
- Real endpoints:
  - `GET /bots/my-bots`
  - `GET /bots/{botId}`
  - `GET /bots/{botId}/integration-health`
  - `GET /subscriptions/{botId}/active`
  - `GET /signals?botId={botId}`
  - `PATCH /bots/{botId}/status`
  - `PATCH /bots/{botId}/metadata`
  - `DELETE /bots/{botId}`
- Simulation support:
  - Signals with `metadata.simulation=true` are flagged `isSimulated` in response.
  - Simulated signals bypass Kafka/WebSocket routing and remain visible only in developer views.

## Notes on auth
Auth routing uses internal proxy routes:
- `app/api/auth/login/route.ts`
- `app/api/auth/register/route.ts`

These routes call the real backend auth endpoints and set cookies, so auth is separate from presentation-layer placeholder content.

## Recommendation
1. Prioritize replacing remaining `gap` endpoints with validated backend implementations or clearly marked prelaunch content.
2. Keep contract error and empty-state UX consistent for endpoint outages.
3. Update `lib/contracts/endpoints.ts` status from `gap` to `available` only after each API is validated as a real production data source.
4. Add smoke tests for key contract routes to catch drift early.

## Conclusion
The frontend contract layer operates in API-only mode, but public marketing pages may still choose static or prelaunch presentation when the backend source is not yet production-ready.
