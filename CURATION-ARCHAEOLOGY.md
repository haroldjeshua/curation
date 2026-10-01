# Curation — Archaeology (Phase 0)

> Status: Phase 0 report · 2026-10-01 · builder-agent
> Sources: actual codebase on `main` (`7047cf3`), live-shell behavior, `.agents/docs` (PROJECT/PHILOSOPHY/PHASES v0.1), audit doc `CURATION-2026-REOPENING-ALIGNMENT-AUDIT.md`
> Rule followed: no code changed for this report. No redesign, refactor, migration, or dependency install.

---

## 1. Existing project architecture

- Next.js 14.2.8 App Router (`app/layout.tsx`, `app/page.tsx`, `app/(routes)/*`), TypeScript, npm (no pnpm lock — `package-lock.json`), Tailwind v3 (`tailwind.config.ts` + `app/globals.css`), `next-themes`, Radix (`dropdown-menu`, `scroll-area`, `slot`), `class-variance-authority` + `clsx` + `tailwind-merge`, `lucide-react`, `tailwindcss-animate`.
- `next.config.mjs` is empty. No `drizzle`, `neon`, `postgres`, `prisma`, `mdx`, search, auth, API routes, tests, seed scripts, or env config.
- Layout: `Nav` (fixed, floating) + `CtaFloating` (Submit button, top-right, no handler) + `<main>` + `Footer` (© 2024 + ThemeSwitcher). Fonts: local Geist Sans/Mono via `next/font/local`.

## 2. Existing routes

| Route | File | State |
|---|---|---|
| `/` | `app/page.tsx` | 5 clickable cards from `siteConfig.routes`. Has stray `console.log(routeWithIcons)`. |
| `/inspiration` | `app/(routes)/inspiration/page.tsx` | 6 chips + `<EmptyState/>`. No content. |
| `/tools` | `app/(routes)/tools/page.tsx` | 3 chips + `<EmptyState/>`. No content. |
| `/resources` | `app/(routes)/resources/page.tsx` | 3 chips + hidden `insert inspiration grid here` + `<EmptyState/>`. No content. |
| `/learning` | `app/(routes)/learning/page.tsx` | 7 chips + `<EmptyState/>`. No content. |
| `/blogs` | `app/(routes)/blogs/page.tsx` | 5 chips + `<EmptyState/>`. No content. |

No dynamic routes (`[slug]`), no entry pages, no search, no submit handler, no sitemap/robots.

## 3. Existing content / data model

None. Zero entries, zero JSON/MDX/DB, zero media. The only "data" is hardcoded chip arrays in each page:

- Inspiration: Product Websites, Digital Agencies, Portfolios, Mobile Apps, E-commerce, Marketing
- Tools: Design Tools, Development Tools, Productivity Tools
- Resources: Design Resources, Development Resources, Productivity Resources (duplicate of Tools)
- Learning: Design, Design Engineering, Software Engineering, Tech Personalities, YouTube Channels, Courses, Platforms
- Blogs: Design, Development, Productivity, Newsletters, Articles

Nothing to migrate — only IA intent to map.

## 4. Existing categories

2024 IA: Inspiration · Tools · Resources · Learning · Blogs & Newsletters · Submit (CTA only). Confirmed bugs from PROJECT.md §3.1 reproduced in code: Tools ≡ Resources (same 3 buckets), Inspiration mixes kind (Product/Agency/Portfolio/App) with industry/purpose (E-commerce/Marketing).

## 5. Existing content inventory

Empty by construction. Every section renders `<EmptyState/>` ("currently under construction"). No drafts, no archived items, no images in `app/` beyond fonts + `favicon.ico`.

## 6. Existing visual system

- shadcn-style HSL tokens (`background/foreground/card/popover/primary/secondary/muted/accent/border/input/ring/chart-*`, `--radius: 0.5rem`) + dark `.dark` variant. Light/dark works via `ThemeProvider` + `ThemeSwitcher`.
- `tailwind.config.ts` adds 6 unused custom palettes (lavender-pink, carnation, azure-radiance, emerald, carrot-orange, amethyst) — none referenced by pages. Dead weight.
- Typography: Geist Sans body intent but `layout.tsx` sets `font-mono` on `<body>` — likely a bug or leftover. No type scale, no `DESIGN.md`, no motion system beyond `tailwindcss-animate` (unused).
- Components: `nav`, `nav-menu`, `footer`, `cta-floating`, `empty-state`, `logo`, `theme-provider/switcher`, `ui/{badge,button,dropdown-menu,scroll-area}`. All presentational, no domain logic. `empty-state` corner-tick style is the only distinctive visual worth remembering.

## 7. Existing dependencies

`next@14.2.8`, `react@18`, `next-themes`, Radix ×3, `cva/clsx/tailwind-merge/lucide/tailwindcss-animate` (prod) + `eslint-8/eslint-config-next-14/postcss/prettier/tailwind-3/typescript-5` (dev). No DB, ORM, validation, search, analytics, or storage deps. 10 commits total, last meaningful commit `7047cf3`. `.agents/` is untracked (`git status: ?? .agents/`).

## 8. Existing technical debt

1. `console.log` in `app/page.tsx`.
2. `body` uses `font-mono` while loading Geist Sans — pick one.
3. Dead custom color palettes (~90 lines) + dead hidden grid in `resources/page.tsx`.
4. `CtaFloating` Submit button goes nowhere; no form, no queue.
5. Route group `(routes)` adds indirection for 5 static pages — harmless but unnecessary.
6. npm + Next 14 + Tailwind v3 + ESLint 8 vs PROJECT.md target (pnpm + Next 15 + Tailwind v4). Upgrade-or-rescaffold decision is unavoidable.
7. No metadata/OG/sitemap per route; single generic `title: "Curation"`.
8. 3Ps docs live only in untracked `.agents/docs` — not in repo root, no `CLAUDE.md` yet.

## 9. What can be preserved (KEEP)

- Intent + IA lessons (what each 2024 section meant, chip lists as seed vocabulary for tags/facets).
- Submit CTA placement idea (floating, first-class) — re-scoped as "suggest an entry."
- Theme dark/light pattern (`theme-provider` + `theme-switcher` + CSS vars) — reimplement in new tokens, don't copy-paste HSL verbatim.
- Geist local-font loading pattern.
- `empty-state` corner-tick motif (optional, for future empty search/filter states).
- Logo component (verify mark before reuse).

## 10. What conflicts with the 2026 direction (REWORK / REMOVE)

- REMOVE: all 5 route pages as built (static chips + empty states), Tools ≡ Resources duplication, dead palettes, hidden placeholder grid, `console.log`, `(routes)` grouping if rescaffolding.
- REWORK: `siteConfig.routes` (becomes Sites · Systems · Libraries · Skills · Reading), visual tokens (new minimal set per PROJECT.md T3, no token-per-value), typography (real scale + `DESIGN.md` in Phase 1), home page (from nav-cards to curated entry point).
- DO NOT PRESERVE: old stack versions, old category URLs as contracts (no inbound links to protect — zero content, legacy host is a shell).

## 11. Proposed minimal architecture (for alignment, not yet built)

- Fresh scaffold per PROJECT.md T2 default: Next 15 App Router + TypeScript strict + Tailwind v4 (CSS-var tokens) + pnpm + Vercel + `curation.harv.computer`, legacy URL redirects.
- Data: **decided 2026-10-01 by Harv: content-in-repo (JSON/MDX) for Phases 1–3; Postgres on Neon + Drizzle at Phase 4** (suggestion queue + link-health job). JSON rows must match the PROJECT.md §4.4 entry shape 1:1 so the migration is mechanical. Static exports (`llms.txt`, per-entry `.md`, JSON) generate at build either way.
- Media deferred to Phase 3 (Sites). No accounts/votes/comments/ranking (both docs agree).

## 12. Proposed migration strategy

No data migration — nothing to migrate. Migration = IA mapping + chip-to-facet conversion:

| 2024 / Audit-7 | 2026 v1 (recommended: 3Ps-5) |
|---|---|
| Inspiration (+ Audit Inspiration) → | `Sites` (kind: product/portfolio/agency/app × industry tags; E-commerce/Marketing demoted to tags) |
| Tools (Audit keeps) → | CUT from v1 → parked in Later; revisit post-launch |
| Resources (Audit splits) → | `Libraries` (category: ui/icons/motion/fonts/3d/**reference**) |
| Blogs & Newsletters + Learning (Audit: Reading + Learning separate) → | single `Reading` (format: blog/newsletter/course/magazine/talk/etc.) |
| Audit References (CSS/API/a11y/patterns/cheatsheets) → | folded into `Libraries.category=reference` for v1; promote to 6th section only if volume justifies |
| (new) Systems, Skills → | `Systems`, `Skills` as specified (text-first, cheapest) |
| Submit → | suggest-an-entry → private review queue (Phase 4) |

Seed v1 targets unchanged: ~30 Sites, 15 Systems, 15 Libraries, 10 Skills, 20 Reading — every entry with a `note`, or it doesn't ship.

## 13. Risks / unknowns

- T1 (Postgres vs repo content) unmade — blocks Phase 1 schema work.
- T3 (new tokens vs `@pilipinas/themes`) unmade; T4 (screenshot capture) correctly deferred to Phase 3.
- 3Ps docs + `CLAUDE.md` not yet in repo root; domain/redirect not verified in this pass (needs Vercel access).
- Screenshot legal/attribution norms for Sites unreviewed (flagged in PROJECT.md §8, unchecked).
- design.how Systems page unread (blocked bot) — install-pattern details unknown; Phase 5 review queued.
- Solo-maintainer risk stands: 5 sections nearly stalled the project in 2024; v1 caps + text-first order are the mitigation.

## 14. Questions requiring discussion (need Harv decisions)

1. Confirm v1 IA: 3Ps-5 with References-folded (recommended) vs Audit-7? 
2. Confirm Tools CUT from v1 (parked) vs kept as 6th/7th section?
3. T1: Postgres+Neon now, or content-in-repo for v1 with DB at Phase 4? 
4. Fresh scaffold (recommended) vs upgrade-in-place of Next 14/Tailwind v3?
5. OK to write 3Ps to repo root + add `CLAUDE.md` + `CONTENT-MODEL.md`/`EDITORIAL.md` stubs as Phase 0 close?

---

## KEEP / REWORK / REMOVE

- KEEP: IA intent + chip vocabulary, Submit placement idea, theme pattern, Geist loading, logo (verify), empty-state motif.
- REWORK: `siteConfig.routes`, tokens, typography, home, entry model (new), machine surface (new).
- REMOVE: 5 static pages as built, Tools/Resources duplication, dead palettes, placeholder grid, `console.log`, old toolchain versions.
- UNKNOWN: none material — inventory is empty, so confidence is high.

## Phase 0 exit status

- [x] Audit recorded (this file).
- [x] Decisions recorded 2026-10-01 (Harv): (1) v1 IA = 3Ps-5 with References folded into `Libraries.category=reference`; (2) Tools CUT from v1, parked in Later; (3) content-in-repo for Phases 1–3, Postgres at Phase 4; (4) fresh scaffold; (5) 3Ps stay in `.agents/docs/`, root pointers `AGENTS.md` + `CLAUDE.md` created.
- [ ] 3Ps committed to git (`.agents/` is still untracked — commit it; do NOT gitignore the source of truth, see note below).
- [ ] Domain resolves to deployed page + legacy redirect plan (needs Vercel check — out of scope for code agent, flagging for Harv).

> Gitignore note: `.agents/docs` is three small Markdown files (~15 KB), not bloat — and `AGENTS.md`/`CLAUDE.md` point at them, so ignoring them would leave dangling pointers for every fresh clone, agent session, and deploy. Gitignore also doesn't shrink your local worktree; it only drops files from history. Keep the 3Ps tracked; ignore generated artifacts instead (screenshots, exports) if bloat ever appears.
