Developer subscriptions are now backed by the active-subscriptions contract only.

Current entry points:
- `app/developer/bots/[botId]/subscriptions/page.tsx` - active subscription list for a bot
- `components/terminal/developer-dashboard/subscription-table.tsx` - shared table rendering
- `lib/contracts/client.ts` - `listActiveSubscriptionsForBot(botId)`
