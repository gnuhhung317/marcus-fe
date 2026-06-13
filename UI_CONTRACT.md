# UI_CONTRACT

## 1. Naming Conventions
- **Files & Directories:** Strictly use `kebab-case` for all files and folders (e.g., `bot-detail-card.tsx`, not `BotDetailCard.tsx`).
- **Components:** Strictly use `PascalCase` for React component function names (e.g., `export function BotDetailCard()`).
- **Types/Interfaces:** Define all shared interfaces in `lib/contracts/types.ts` using `PascalCase`.

## 2. Directory Structure
- Place domain-specific components in `components/<domain>/<feature>/`.
- Place highly reusable, cross-domain components in `components/shared/` or `components/ui/`.
- **Absolute Imports:** NEVER use relative paths traversing more than two directories (`../../`). Use the `@/` alias for all imports (e.g., `import { Button } from '@/components/ui/button'`).

## 3. Design System & Styling (STRICT UI ENFORCEMENT)
- **NO RAW COLORS:** You are FORBIDDEN from using arbitrary hex codes (`bg-[#123456]`), rgba values (`text-[rgba(255,255,255,0.5)]`), or raw Tailwind color scales (`bg-emerald-500`, `text-red-400`). You MUST use semantic theme tokens configured in tailwind (e.g., `bg-surface`, `text-positive`, `text-muted`, `border-border`).
- **NO RAW SVGS:** You are FORBIDDEN from generating or pasting raw `<svg>` HTML tags. You MUST use imports from `lucide-react` (e.g., `<ArrowRight className="w-4 h-4 text-muted" />`).
- **USE UI PRIMITIVES:** Do not build custom buttons, cards, or badges using base Tailwind utility classes if a shared primitive exists in `@/components/ui/`. You MUST use `<Button>`, `<Card>`, `<Badge>`, etc.
- **CLASS MERGING:** When combining conditional Tailwind classes, ALWAYS use `cn()` utility (combining `clsx` and `tailwind-merge`). Do not use template literals with messy ternary operators for class names.

## 4. Icons
- **Icons:** Use `lucide-react` for all UI iconography with a standard size of `w-4 h-4` or `w-5 h-5` unless specified otherwise.
