# Mock Data and Real Endpoint Mapping

## Overview
This report documents the current relationship between `lib/contracts/mock-data.ts` and the real backend API endpoints used by the frontend.

The frontend currently uses a hybrid model:
- Real API endpoints when available through `requestJson()` / `executeApiRequest()`.
- Mock fallback data from `lib/contracts/mock-data.ts` when the endpoint fails or returns no usable payload.

The endpoint registry is defined in `lib/contracts/endpoints.ts`.

## Mock data sources
`lib/contracts/mock-data.ts` exports contract-shaped UI data for fallback and marketing content:
- `marketTickers`
- `principles`
- `trainingCourses`
- `marketplaceBots`
- `leaderboardRows`
- `blogPosts`
- `researchReports`
- `terminalKpis`
- `strategyTrades`
- `profileApiKeys`

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

### Gap routes (mock fallback expected)
The following routes are marked `status: 'gap'` and appear to be still using mock content:
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

## Notes on auth
Auth routing has been updated to use internal proxy routes:
- `app/api/auth/login/route.ts`
- `app/api/auth/register/route.ts`

These routes call the real backend auth endpoints and set cookies, so auth is now separate from mock fallback content.

## Recommendation
1. Prioritize replacing marketing-gap pages with real endpoints once the backend is available.
2. Keep the current fallback model for terminal flows during the transition, but mark pages using mock fallback clearly in docs.
3. Update `lib/contracts/endpoints.ts` status from `gap` to `available` once each API is validated.
4. Add smoke tests for both mock-driven marketing routes and real endpoint terminal flows to catch contract drift.

## Conclusion
The repo is already using a hybrid mock/real model:
- real endpoints for core terminal app data and auth
- mock fallback for marketing and some research/training content
- explicit gap tracking in `lib/contracts/endpoints.ts`

This file is the current map between the mock payloads and the backend API surface.
