# Refactor Checklist — Marcus Next.js

This checklist captures prioritized, actionable refactor tasks to make the repository AI-friendly and production-ready.

High priority (apply immediately)

- [ ] Fix broken imports and enforce absolute imports (`@/`) everywhere.
- [x] Add `REFACTOR_CHECKLIST.md` (this file).
- [x] Replace the typo import in `app/developer/bots/[botId]/subscriptions/page.tsx` with `@/components/SubscriptionsList` and replace `text-emerald-400` with `text-positive`.
- [x] Add ESLint `no-restricted-imports` rule to block deep relative imports.
- [x] Harden `lib/hooks/useFeatureFlag.ts` toggle helper to avoid server-side errors.

Medium priority

- [ ] Create `components/shared/button.tsx` and `components/shared/card.tsx` primitives that map to design tokens (`.cta-primary`, `.glass`).
- [ ] Replace high-impact hardcoded color usages with semantic classes (`text-positive`, `text-negative`, `text-muted`). Start with:
  - `components/Auth/RegisterForm.tsx`
  - `components/shared/lifecycle-badge.tsx`
  - `components/terminal/developer-dashboard/*`
  - `app/terminal/**` pages
- [ ] Consolidate complex fetch/mutation logic into typed react-query hooks under `lib/hooks/` (e.g., `useSubscribeBot`, `usePlans`).
- [ ] Implement `ToastProvider` and skeleton components for heavy UI blocks.

Low priority

- [ ] Rename component filenames and directories to `kebab-case` and keep exported component names PascalCase.
- [ ] Add CI lint job to run ESLint and tests; add pre-commit hook to validate filename casing and lint.
- [ ] Implement optimistic updates for critical user flows (subscribe/unsubscribe, pause/resume sessions).

Notes

- Work in small, safe PRs. Each change should run unit/e2e tests and be validated in a dev server.
- Prioritize changes that prevent AI hallucinations: absolute imports, shared primitives, and centralized hooks/types.
