# UI_CONTRACT

## 1. Naming Conventions
- **Files & Directories:** Strictly use `kebab-case` for all files and folders (e.g., `bot-detail-card.tsx`, not `BotDetailCard.tsx`).
- **Components:** Strictly use `PascalCase` for React component function names (e.g., `export function BotDetailCard()`).
- **Types/Interfaces:** Define all shared interfaces in `lib/contracts/types.ts` using `PascalCase`.

## 2. Directory Structure
- Place domain-specific components in `components/<domain>/<feature>/`.
- Place highly reusable, cross-domain components in `components/shared/`.
- **Absolute Imports:** NEVER use relative paths traversing more than two directories (`../../`). Use the `@/` alias for all imports (e.g., `import { Button } from '@/components/shared/button'`).

## 3. Design System & Styling
- **No Hardcoded Colors:** Do not guess Tailwind color scales for semantic meanings.
  - Use `.text-positive` (not `text-emerald-400` or `text-green-500`).
  - Use `.text-negative` (not `text-red-500`).
  - Use `.text-muted` (not `text-gray-400`).
- **Interactive Elements:** Apply the `.cta-primary` class for main action buttons.
- **Surfaces:** Use `.glass` or `.glass-strong` for cards and floating panels over raw background colors.
- **Icons:** Use `lucide-react` for all UI iconography with a standard size of `w-4 h-4` or `w-5 h-5` unless specified otherwise.
