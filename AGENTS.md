# Curation — Agent Entry Point

> Live target: `curation.harv.computer` · Legacy: `harv-curation.vercel.app` (2024 shell, zero content)
> Source of truth: `.agents/docs/` — read all three before touching code: `PROJECT.md`, `PHILOSOPHY.md`, `PHASES.md`. Then read `CURATION-ARCHAEOLOGY.md` (Phase 0 report, repo root).

## What this is

Personal, annotated reference library for design engineers: Sites · Systems · Libraries · Skills · Reading. Humans browse; agents query a static machine surface generated from the same data. Every entry carries a curator's note — no note, no entry.

## Locked decisions (2026-10-01, Harv)

- v1 IA: 3Ps-5 with References folded into `Libraries.category=reference`. Tools CUT from v1 (parked in Later).
- Data: content-in-repo (JSON/MDX) for Phases 1–3; Postgres on Neon + Drizzle at Phase 4 (suggestion queue + link-health job). Entry shape already defined in `PROJECT.md` §4.4 — keep JSON rows migratable 1:1 to DB rows.
- Fresh scaffold (Next 16 App Router + TypeScript strict + Tailwind v4 + pnpm) on branch `scaffold/fresh-next16`. The 2024 Next 14 shell stays preserved in `main` history — do not upgrade it in place.

## Working rules

1. Read the 3Ps + archaeology report first.
2. Work only within the current phase (`PHASES.md`); stop at exit criteria and report what remains unchecked.
3. One phase or task at a time; explain non-obvious choices briefly; justify every new dependency in one sentence.
4. Never publish an entry without a note. No votes, rankings, comments, trending, or community mechanics.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
