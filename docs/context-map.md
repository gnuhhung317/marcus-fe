## Context Map

### Files to Modify
| File | Purpose | Changes Needed |
|------|---------|----------------|
| app/layout.tsx | Global metadata and font system | Apply Orbitron/Exo2 and app title for Marcus Next.js |
| app/globals.css | Global design tokens and utility styles | Add dark fintech theme variables, grid texture, reusable glass classes |
| app/(marketing)/layout.tsx | Marketing route shell | Wrap marketing pages with shared header/footer shell |
| app/(marketing)/page.tsx | Home landing page | Implement hero, market snapshot, core principles |
| app/(marketing)/training/page.tsx | Training academy page | Build course progress cards and academy narrative |
| app/(marketing)/market/page.tsx | Public market leaderboard page | Implement ranking table and metric display |
| app/(marketing)/blog/page.tsx | Blog overview page | Build article feed and alert card |
| app/(marketing)/research/page.tsx | Research portal page | Build reports grid and PDF library panel |
| app/terminal/layout.tsx | Terminal app shell route layout | Apply left nav shell for app pages |
| app/terminal/page.tsx | Terminal dashboard | Render KPIs, active bot performance table, allocation bars |
| app/terminal/marketplace/page.tsx | Marketplace app page | Render bot cards and deploy CTA |
| app/terminal/strategies/page.tsx | Strategy analytics page | Render strategy curve and trade logs |
| app/terminal/create-bot/page.tsx | Bot wizard page | Render step flow and strategy configuration form |
| app/terminal/paper-trading/page.tsx | Paper trading page | Render session controls, equity curve, quick order fields |
| app/terminal/profile/page.tsx | User profile page | Render subscription and API key sections |
| app/terminal/developer-console/page.tsx | Developer console page | Render signal schema and stream logs |
| app/terminal/leaderboard/page.tsx | Terminal leaderboard page | Render top strategy cards and actions |
| lib/contracts/types.ts | Contract type model | Define reusable contract and view-model types |
| lib/contracts/endpoints.ts | API endpoint registry | Map page features to OpenAPI operationId and track gaps |
| lib/contracts/mock-data.ts | Legacy reference | Historical mock payload source (no runtime fallback in current client) |
| lib/contracts/client.ts | Contract data accessor | Centralize async mock data getters |
| app/page.tsx | Legacy starter page | Remove old starter route replaced by marketing route group |

### Dependencies (may need updates)
| File | Relationship |
|------|--------------|
| components/marketing/marketing-shell.tsx | Depends on site-header and site-footer |
| app/(marketing)/page.tsx | Consumes marketTickers and principles from mock contract layer |
| app/(marketing)/training/page.tsx | Consumes trainingCourses from mock contract layer |
| app/(marketing)/market/page.tsx | Consumes leaderboardRows from mock contract layer |
| app/(marketing)/blog/page.tsx | Consumes blogPosts from mock contract layer |
| app/(marketing)/research/page.tsx | Consumes researchReports from mock contract layer |
| app/terminal/page.tsx | Uses KpiCard component and terminal contract data |
| app/terminal/marketplace/page.tsx | Uses marketplaceBots from mock contract layer |
| app/terminal/strategies/page.tsx | Uses strategyTrades from mock contract layer |
| app/terminal/profile/page.tsx | Uses profileApiKeys from mock contract layer |
| lib/contracts/client.ts | Depends on endpoint registry and API HTTP client |

### Test Files
| Test | Coverage |
|------|----------|
| (none yet) | Current repo has no existing UI test suite; recommend adding Playwright smoke tests by route |

### Reference Patterns
| File | Pattern |
|------|---------|
| stitch_trader_dashboard/home_marcus_trading_1/code.html | Kinetic hero + live snapshot + principles |
| stitch_trader_dashboard/training_marcus_trading/code.html | Academy card hierarchy and progress bars |
| stitch_trader_dashboard/market_leaderboard_marcus_trading_2/code.html | Leaderboard table and filter-first layout |
| stitch_trader_dashboard/dashboard_marcus_trading/code.html | Terminal sidebar and KPI dashboard shell |
| stitch_trader_dashboard/explore_bots_marcus_trading/code.html | Marketplace cards with bot metrics |

### Risk Assessment
- [x] Breaking changes to public API: No runtime backend API calls changed in frontend; contract layer is additive.
- [ ] Database migrations needed: Not applicable in this frontend phase.
- [ ] Configuration changes required: No env var required yet; API base URL wiring pending integration phase.
