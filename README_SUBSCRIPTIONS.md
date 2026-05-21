Developer Subscriptions UI scaffold

Files added:
- `app/developer/bots/[botId]/subscriptions/page.tsx` — page wrapper
- `components/SubscriptionsList.tsx` — list + actions
- `components/SubscriptionEditor.tsx` — modal editor
- `components/SubscribeModal.tsx` — subscribe flow modal
- `hooks/useSubscriptions.ts` — react-query hook

How to try locally (from project root):

1. Ensure the API backend is running and reachable at the same origin or configure a proxy in `next.config.js`.
2. Start the dev server:

```bash
cd marcus-nextjs
npm install
npm run dev
```
