# Endpoint Mapping (API-Only)

## Overview
This report documents the current relationship between the real backend API endpoints and frontend contract client mappings.

The frontend now follows an API-only model:
- Real API endpoints through `requestJson()` / `requestContractJson()`.
- No runtime mock fallback payloads when endpoints fail.

The endpoint registry is defined in `lib/contracts/endpoints.ts`.

## Runtime data policy
Runtime UI data is sourced from API responses only. On endpoint failure, the contract layer now surfaces errors or empty collections rather than injecting mock payloads.

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
- `GET /strategies/{strategyId}`
- `GET /strategies/{strategyId}/metrics`
- `GET /strategies/{strategyId}/performance-series`
- `GET /strategies/{strategyId}/trades`
- `GET /paper/session`
- `GET /paper/signals`
- `POST /paper/orders`
- `GET /users/me`
- `GET /users/me/api-keys`
- `GET /signals`
- `GET /leaderboard/strategies`
- `GET /leaderboard/featured`
- `GET /bots/my-bots`
- `GET /bots/{botId}`
- `GET /bots/{botId}/integration-health`
- `GET /subscriptions/{botId}/active`
- `PATCH /bots/{botId}/status`
- `PATCH /bots/{botId}/metadata`
- `DELETE /bots/{botId}`
- `GET /system/connectivity`
- `GET /system/execution-logs`

### Gap routes (no runtime fallback)
The following routes are marked `status: 'gap'` and require backend availability for data:
- `GET /academy/courses`
- `GET /academy/metrics`
- `GET /content/blog/posts`
- `GET /content/research/reports`
- `GET /market/overview`

## Page-by-page mapping

### Marketing pages
The marketing pages are mostly mock-driven:
- `app/(marketing)/page.tsx` — home content is powered by `marketTickers` and `principles`.
- `app/(marketing)/training/page.tsx` — training content is powered by `trainingCourses`.
- `app/(marketing)/market/page.tsx` — market leaderboard uses `leaderboardRows`.
- `app/(marketing)/blog/page.tsx` — blog feed uses `blogPosts`.
- `app/(marketing)/research/page.tsx` — research page uses `researchReports`.

These pages are currently not fully wired to the corresponding `gap` endpoints.

### Terminal dashboard and data pages
The terminal app uses real backend endpoints with fallback mock data.

#### Dashboard
- Real endpoints:
  - `GET /dashboard/overview`
  - `GET /dashboard/exchange-allocation`
  - `GET /strategies/{strategyId}/trades`
- Mock fallback:
  - `terminalKpis`
  - `strategyTrades`
  - `defaultAllocations` defined in page code

#### Marketplace
- Real endpoints:
  - `GET /bots`
  - `GET /bots/{botId}`
  - `POST /subscriptions/{botId}`
  - `DELETE /subscriptions/{botId}`
- Mock fallback:
  - `marketplaceBots` for bot feed and detail fallback
  - subscription stub data when endpoint is unavailable

#### Profile
- Real endpoints:
  - `GET /users/me`
  - `GET /users/me/api-keys`
  - `GET /users/me/login-activities`
- Mock fallback:
  - `profileApiKeys`
  - `defaultLoginActivities`

#### Strategies
- Real endpoints:
  - `GET /strategies/{strategyId}`
  - `GET /strategies/{strategyId}/metrics`
  - `GET /strategies/{strategyId}/performance-series`
  - `GET /strategies/{strategyId}/trades`
- Mock fallback:
  - `strategyTrades`
  - fallback series and metrics when endpoint payload is missing or unavailable

#### Paper trading
- Real endpoints:
  - `GET /paper/session`
  - `GET /paper/signals`
  - `POST /paper/orders`
  - `POST /paper/session/pause`
  - `POST /paper/session/resume`
- Mock fallback:
  - fallback session data and signal list
  - fallback paper order response data

#### Developer console
- Real endpoints:
  - `GET /system/connectivity`
  - `GET /signals`
  - `GET /system/execution-logs`
- Mock fallback:
  - when these endpoints fail, stubbed operational state is rendered instead

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
  - Signals with `metadata.simulation=true` are flagged `isSimulated` in response
  - Simulated signals bypass Kafka/WebSocket routing; visible only in developer views

## Notes on auth
Auth routing has been updated to use internal proxy routes:
- `app/api/auth/login/route.ts`
- `app/api/auth/register/route.ts`

These routes call the real backend auth endpoints and set cookies, so auth is now separate from mock fallback content.

## Recommendation
1. Prioritize replacing remaining `gap` endpoints with available backend implementations.
2. Keep contract error/empty-state UX consistent for endpoint outages.
3. Update `lib/contracts/endpoints.ts` status from `gap` to `available` once each API is validated.
4. Add smoke tests for all contract routes to catch drift early.

## Conclusion
The frontend contract layer now operates in API-only mode:
- real endpoints for terminal, marketing, and auth paths
- no runtime mock fallback payload injection
- explicit gap tracking in `lib/contracts/endpoints.ts`
