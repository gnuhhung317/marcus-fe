# Color Literal Inventory — Targeted Replacement Plan

Purpose: extract unique hardcoded color literals (hex and rgba), categorize their semantic intent, and propose explicit, targeted replacements to semantic design tokens.

Note: This file does NOT apply changes — it documents findings and a recommended per-literal mapping for safe, explicit refactors.

## Summary
- Hex literals discovered: `#05060b`, `#0b0e14`, `#f8fafc`, `#94a3b8`, `#00be73`, `#f43f5e`, `#05060d`, `#022c22`, `#04120d`, `#04111a`, `#0b0f19`, `#151921`, `#facc15`, `#5865F2`, `#9ad7ff`, `#060a12`, `#04120d`
- RGBA / functional colors discovered: many uses of `rgba(8,13,22,...)`, `rgba(6,10,18,...)`, `rgba(148,163,184,...)`, `rgba(16,185,129,...)`, `rgba(0,190,115,...)`, `rgba(62,183,255,...)`, `rgba(167,243,208,...)`, `rgba(254,226,226,...)`, `rgba(0,0,0,0.22)`, etc.

## Detected literals (representative)

### Brand / Global tokens (from `app/globals.css`)
- `--bg-0: #05060b` — base background (app/globals.css)
- `--bg-1: #0b0e14` — secondary background (app/globals.css)
- `--fg: #f8fafc` — foreground (text) (app/globals.css)
- `--fg-muted: #94a3b8` — muted text (app/globals.css)
- `--primary: #00be73` — primary brand (app/globals.css)
- `--positive: #00be73` — positive/success (app/globals.css)
- `--negative: #f43f5e` — negative/error (app/globals.css)

Recommendation: keep these in `app/globals.css` as canonical source-of-truth. Do NOT replace.

### Frequently used hex literals (needs review)
- `#022c22` — used inside `.cta-primary` for text color (app/globals.css line ~93)
- `#04120d`, `#04111a` — dark text used as button text color (components/SubscriptionsList.tsx, SubscriptionEditor.tsx)
- `#0b0f19`, `#151921` — dark surface backgrounds used in a few modals and panels
- `#facc15` — accent/yellow in marketing page (app/(marketing)/page.tsx)
- `#5865F2` — single CTA in marketing page (app/(marketing)/page.tsx)
- `#9ad7ff` — cyan code / pre text (developer console)

Action: These hex values should be categorized (brand / accent / neutral / semantic). For accents that represent semantic meaning (success, danger, brand), map to `--primary`, `--positive`, `--negative`, or new CSS variables. For isolated decorative accents (e.g., `#5865F2`), either keep inline if intentionally unique or migrate to `--accent-1` after product sign-off.

### RGBA and functional color usages (representative)
- `bg-[rgba(8,13,22,0.72)]` / `bg-[rgba(8,13,22,0.96)]` — many card/modal backgrounds (components/SubscriptionsList.tsx, SubscriptionEditor.tsx, SubscribeModal.tsx)
- `border-[rgba(148,163,184,0.22)]` / `border-[rgba(148,163,184,0.3)]` — lots of subtle borders (many pages)
- `bg-[rgba(6,10,18,0.55)]` / `bg-[rgba(6,10,18,0.75)]` — pre/code backgrounds and console panels
- `bg-[rgba(0,190,115,0.08)]` / `bg-[rgba(0,190,115,0.12)]` — positive accent backgrounds (monitoring/terminal)
- `text-[rgba(167,243,208,0.95)]` / `text-[rgba(254,226,226,0.95)]` — success / failure text colors in a few lists
- `box-shadow: 0 30px 70px rgba(0,0,0,0.5)` etc. — shadow tokens
- `linear-gradient(...)` with rgba stops — hero/background accents (login page)

Action: Map the common RGBA values to semantic tokens where appropriate:
- All card/modal backgrounds using `rgba(8,13,22,...)` → `glass` or `glass-strong` classes that read `var(--panel)` / `var(--panel-strong)` respectively.
- Border opacities using `rgba(148,163,184,...)` → a `--panel-border` variable (already present) and use `border-[var(--panel-border)]` or Tailwind `border-[var(--panel-border)]` utility.
- Positive accents using `rgba(0,190,115,...)` → use `var(--primary-soft)` or add `bg-positive-soft` utility.
- Pre/code cyan `#9ad7ff` and info borders `rgba(62,183,255,0.3)` → map to an `--info` token (add to `app/globals.css`) if used in multiple places.

## Recommended explicit replacement mapping (targeted)
Below are explicit mappings for safe, targeted replacements. Each mapping lists example files where replacement is suggested.

- `bg-[rgba(8,13,22,0.72)]`, `bg-[#060a12]`, `bg-[rgba(8,13,22,0.96)]` → replace with `glass` or `glass-strong` (examples: `components/SubscriptionsList.tsx`, `components/SubscriptionEditor.tsx`, `components/SubscribeModal.tsx`, `app/login/login-client.tsx`).
- `border-[rgba(148,163,184,0.22)]`, `border-[rgba(148,163,184,0.3)]`, `border-[rgba(148,163,184,0.12)]` → replace with `border-[var(--panel-border)]` (examples: many pages under `app/terminal` and shared components).
- `text-emerald-400`, `bg-emerald-500`, `focus:border-emerald-500` → replace with `text-positive`, `cta-primary`, `focus:border-[var(--primary)]` (examples: decision pages, register form). Note: Do not blindly replace all `emerald-*` tokens — verify semantics per usage.
- `text-[#04120d]`, `text-[#04111a]` (button text on emerald bg) → replace with `text-cta-on-primary` (new semantic token pointing at `#022c22`) or use existing `.cta-primary` which already sets text color.
- `text-[rgba(167,243,208,0.95)]` → `text-positive` (paper trading checks)
- `text-[rgba(254,226,226,0.95)]` → `text-negative`
- `bg-[rgba(6,10,18,0.55)]` / code pre → map to `bg-code` / `token-pre` class (or use `glass-strong` + `text-info` for code text). Example: `app/terminal/developer-console/page.tsx`.
- `#5865F2` on marketing CTA — keep as `--marketing-accent-1` if product approves; otherwise preserve.

## Next steps (proposed safe workflow)
1. Review and approve the explicit mapping above. Mark any literal that should be preserved as-is (e.g., intentional marketing accents).
2. I will run a codemod that performs only the approved explicit replacements, file-by-file, producing a single small PR per domain (e.g., `components/shared`, `components/Auth`).
3. Run lint and dev server smoke (verify no build errors). If any replacements cause visual regressions, revert and flag for product review.

## Notes / Caveats
- Avoid broad regex replacements (e.g., `text-\[#.*\]` / `bg-\[rgba\(.*\)\]`) — they are too risky. Use the explicit mapping above.
- Some color literals exist only inside `app/globals.css` as canonical variables and should NOT be modified.

If you approve the mapping above, I will proceed to apply the replacements in `components/shared` and `components/Auth` (per your Batch C priority), one file at a time and stop if any ambiguity appears.
