# UX_CONTRACT

## 1. Data Fetching & State
- **Server State:** Use Next.js Server Components for initial data loads. Pass this data as props to Client Components.
- **Mutations:** Use `@tanstack/react-query` (`useMutation`) for all POST/PUT/DELETE actions. Do not manually orchestrate `isLoading` states if React Query can handle it.
- **Browser APIs:** NEVER access `window`, `document`, or `localStorage` directly in the root of a component or custom hook. Always wrap browser-specific APIs in `useEffect` to prevent SSR hydration crashes.

## 2. Loading & Empty States
- **Page/Section Loads:** Import and use `<LoadingStateCard />` from `@/components/shared/api-state`. Do not write custom spinner `div`s.
- **Empty States:** Use `<EmptyStateCard />` with a clear actionable message if lists or data sets return `0` results.
- **Button Loading:** Forms must disable the submit button and show a loading indicator using the `isSubmitting` boolean.

## 3. Error Handling
- **API Failures:** Wrap failing UI sections in `<ErrorStateCard />`.
- **Form Validation:** Display validation errors immediately below the corresponding input field, not just at the bottom of the form.
- **Destructive Actions:** Any action that deletes data, unsubscribes from a bot, or risks capital MUST require a secondary confirmation step (modal or inline confirm) before execution.
