# UX_CONTRACT

## 1. Data Fetching & State
- **Server State:** Use Next.js Server Components for initial data loads. Pass this data as props to Client Components.    
- **Mutations:** Use `@tanstack/react-query` (`useMutation`) for all POST/PUT/DELETE actions. Do not manually orchestrate `isLoading` states if React Query can handle it.
- **Browser APIs:** NEVER access `window`, `document`, or `localStorage` directly in the root of a component or custom hook. Always wrap browser-specific APIs in `useEffect` to prevent SSR hydration crashes.

## 2. Architectural Discipline (STRICT ENFORCEMENT)
- **COMPONENT SIZE LIMIT:** A single component file MUST NOT exceed 150-200 lines of code. If it grows larger, you MUST decompose it by extracting sub-sections into smaller, dedicated presentational components. 
- **SEPARATION OF CONCERNS (SoC):**
  - **Static Data:** Large text blocks, configuration dictionaries, or mock data MUST be extracted outside the component render function or moved to a separate `*.config.ts` or `*.constants.ts` file.
  - **Business Logic:** Any complex data fetching or multi-step mutation logic MUST be extracted into custom hooks (e.g., `useBotOperations()`) under `@/lib/hooks/`. The UI component should only consume the state and dispatch functions.
- **NO GOD COMPONENTS:** A component should do one thing well. A Layout component should only place items. A Card component should only display data. A Form component should only handle inputs and validation.

## 3. Loading & Empty States
- **Page/Section Loads:** Import and use `<LoadingStateCard />` from `@/components/shared/api-state`. Do not write custom spinner `div`s.
- **Empty States:** Use `<EmptyStateCard />` with a clear actionable message if lists or data sets return `0` results.     
- **Button Loading:** Forms must disable the submit button and show a loading indicator using the `isSubmitting` boolean.  

## 4. Error Handling
- **API Failures:** Wrap failing UI sections in `<ErrorStateCard />`.
- **Form Validation:** Display validation errors immediately below the corresponding input field, not just at the bottom of the form.
- **Destructive Actions:** Any action that deletes data, unsubscribes from a bot, or risks capital MUST require a secondary confirmation step (modal or inline confirm) before execution.
