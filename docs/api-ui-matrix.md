## Marcus Next.js API-UI Matrix

### Coverage Legend
- AVAILABLE: Already defined in signal-core-backend/docs/openapi/marcus-trading-delta.yaml
- GAP: Needed by UI but not present in current delta contract

### 1) Marketing: Home
| UI Block | API Contract | Method | OperationId | Status | Notes |
|---|---|---|---|---|---|
| Live Market Snapshot tickers | /market/overview | GET | getMarketOverview | AVAILABLE | Used by Home API-first snapshot block |
| CTA Launch App | n/a | n/a | n/a | AVAILABLE | Pure navigation |
| Core principles cards | /content/home/principles | GET | listHomePrinciples | GAP | Can fallback to CMS/static config |

### 2) Marketing: Training
| UI Block | API Contract | Method | OperationId | Status | Notes |
|---|---|---|---|---|---|
| Course cards | /academy/courses | GET | listAcademyCourses | AVAILABLE | Supports modules list and progress |
| KPI strip | /academy/metrics | GET | getAcademyMetrics | AVAILABLE | Active students, deployed strategies |
| Start training action | /academy/courses/{courseId}/enroll | POST | enrollCourse | GAP | Optional but needed for CTA consistency |

### 3) Marketing: Market Leaderboard
| UI Block | API Contract | Method | OperationId | Status | Notes |
|---|---|---|---|---|---|
| Ranking table | /leaderboard/strategies | GET | listLeaderboardStrategies | AVAILABLE | Supports timeframe and rankMetric filters |
| Featured cards | /leaderboard/featured | GET | listLeaderboardFeatured | AVAILABLE | Top ranked tiles |
| Spotlights | /leaderboard/spotlights | GET | listStrategySpotlights | AVAILABLE | Strategy spotlight section |

### 4) Marketing: Blog
| UI Block | API Contract | Method | OperationId | Status | Notes |
|---|---|---|---|---|---|
| Blog list and category filter | /content/blog/posts | GET | listBlogPosts | AVAILABLE | Used by API-first blog feed |
| Blog detail page | /content/blog/posts/{postId} | GET | getBlogPostDetail | GAP | Needed when user opens article |
| Newsletter subscribe | /content/newsletter/subscriptions | POST | subscribeNewsletter | GAP | Enables newsletter form |

### 5) Marketing: Research
| UI Block | API Contract | Method | OperationId | Status | Notes |
|---|---|---|---|---|---|
| Report cards | /content/research/reports | GET | listResearchReports | AVAILABLE | Main research feed |
| PDF library list | /content/research/reports/library | GET | listResearchLibraryFiles | AVAILABLE | Sidebar download list |
| Download report | /content/research/reports/{reportId}/download | POST | requestResearchReportDownload | GAP | Generates signed URL |

### 6) Terminal: Dashboard
| UI Block | API Contract | Method | OperationId | Status | Notes |
|---|---|---|---|---|---|
| KPI cards | /dashboard/overview | GET | getDashboardOverview | AVAILABLE | Total equity, PnL, active bots |
| Equity chart | /dashboard/equity-series | GET | getDashboardEquitySeries | AVAILABLE | Range-driven chart |
| Exchange allocation | /dashboard/exchange-allocation | GET | getExchangeAllocation | AVAILABLE | Donut/stack chart |
| Execution stream table | /executions | GET | listExecutions | AVAILABLE | Cursor pagination |
| Connectivity panel | /system/connectivity | GET | getSystemConnectivityHealth | AVAILABLE | Core infra health |

### 7) Terminal: Marketplace
| UI Block | API Contract | Method | OperationId | Status | Notes |
|---|---|---|---|---|---|
| Bot cards and filters | /bots | GET | listPublicBotsWithFilters | AVAILABLE | Supports q, asset, risk, sort |
| Bot detail modal | /bots/{botId} | GET | getBotDetail | AVAILABLE | Bot metadata |
| Subscribe/deploy action | /subscriptions/{botId} | POST | subscribeBot | AVAILABLE | Trading subscription |

### 8) Terminal: Strategy Analytics
| UI Block | API Contract | Method | OperationId | Status | Notes |
|---|---|---|---|---|---|
| Header + strategy identity | /strategies/{strategyId} | GET | getStrategyDetail | AVAILABLE | Strategy descriptor |
| Metric cards | /strategies/{strategyId}/metrics | GET | getStrategyMetrics | AVAILABLE | feeMode aware |
| Performance chart | /strategies/{strategyId}/performance-series | GET | getStrategyPerformanceSeries | AVAILABLE | Range filter |
| Trade logs | /strategies/{strategyId}/trades | GET | listStrategyTradeLogs | AVAILABLE | Pageable table |
| Export actions | /strategies/{strategyId}/export/pdf | POST | exportStrategyReportPdf | AVAILABLE | Async export |
| Export JSON | /strategies/{strategyId}/export/json | POST | exportStrategySnapshotJson | AVAILABLE | Async export |
| Deploy to paper | /strategies/{strategyId}/paper-history | GET | listStrategyPaperHistory | AVAILABLE | History lookup for CTA context |

### 9) Terminal: Create Bot
| UI Block | API Contract | Method | OperationId | Status | Notes |
|---|---|---|---|---|---|
| Register bot metadata | /bots | POST | registerBot | AVAILABLE | Returns botId, apiKey, rawSecret for one-time credential setup |
| Deploy runtime signal channel | /signals | POST | submitSignal | AVAILABLE | Bot process authenticates using apiKey + rawSecret |
| Credential display UX | n/a | n/a | n/a | AVAILABLE | Frontend should show rawSecret once and force secure storage |

### 10) Terminal: Paper Trading
| UI Block | API Contract | Method | OperationId | Status | Notes |
|---|---|---|---|---|---|
| Session metrics | /paper/session | GET | getPaperSessionSummary | AVAILABLE | Session status and balances |
| Signal terminal | /paper/signals | GET | listPaperSignals | AVAILABLE | Active/executed feed |
| Quick order | /paper/orders | POST | createPaperOrder | AVAILABLE | Market/limit input |
| Pause/resume | /paper/session/pause | POST | pausePaperSession | AVAILABLE | Session control |
| Resume | /paper/session/resume | POST | resumePaperSession | AVAILABLE | Session control |
| Logs | /paper/logs | GET | listPaperExecutionLogs | AVAILABLE | Cursor log stream |

### 11) Terminal: Profile
| UI Block | API Contract | Method | OperationId | Status | Notes |
|---|---|---|---|---|---|
| User info | /users/me | GET | getCurrentUserProfile | AVAILABLE | Identity card |
| Preference update | /users/me/preferences | PUT | updateUserPreferences | AVAILABLE | Locale/timezone |
| API key list | /users/me/api-keys | GET | listApiKeys | AVAILABLE | API vault |
| New API key | /users/me/api-keys | POST | createApiKey | AVAILABLE | Key creation |
| Revoke key | /users/me/api-keys/{apiKeyId} | DELETE | deleteApiKey | AVAILABLE | Key revocation |
| Login activity | /users/me/login-activities | GET | listLoginActivities | AVAILABLE | Security activity table |

### 12) Terminal: Developer Console
| UI Block | API Contract | Method | OperationId | Status | Notes |
|---|---|---|---|---|---|
| Signal stream | /signals | GET | listSignals | AVAILABLE | Monitoring feed |
| Signal submit test | /signals | POST | submitSignal | AVAILABLE | Ingestion test |
| System execution logs | /system/execution-logs | GET | listSystemExecutionLogs | AVAILABLE | System log panel |
| Webhook health latency bins | /system/webhook-health | GET | getWebhookHealth | GAP | Useful for top-right latency chart |

## Priority GAP Backlog
1. Content detail/mutation endpoints: blog detail, newsletter subscribe, research report download.
2. Home principles CMS endpoint: /content/home/principles.
3. Training enroll action endpoint: /academy/courses/{courseId}/enroll.
4. Developer webhook health endpoint for operator monitoring.
