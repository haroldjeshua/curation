# Curation

A personal, annotated reference library for design engineers: Sites · Systems · Libraries · Skills · Reading. Humans browse it; agents can query it (`/llms.txt`, `/entries.json`, per-entry Markdown). Every entry carries a curator's note — no note, no entry.

Live target: `curation.harv.computer` · Legacy shell: `harv-curation.vercel.app` (2024, preserved in `main` history)

## Status

On `scaffold/fresh-next16`: fresh Next 16 + Tailwind v4 + pnpm scaffold with Phases 0–2 done (62 entries, faceted sections, ⌘K search, generated machine surface). Sites gallery lands in Phase 3. See `.agents/docs/` (`PROJECT.md`, `PHILOSOPHY.md`, `PHASES.md`), `AGENTS.md`, and `CURATION-ARCHAEOLOGY.md`.

## Develop

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm lint
pnpm build      # runs prebuild: regenerates public/llms.txt, entries.json, entry Markdown
```

## Content

Entries live in `content/*.json` (DB-shaped for the Phase 4 Postgres move). Add one in under a minute:

```bash
pnpm add-entry --kind library --title "…" --url "https://…" --tagline "…" --note "…" --tags "a,b"
```

New entries land as drafts; flip `status` to `published` after review. The build fails if a published entry lacks a note.

## Annotate (dev only)

`pnpm dev`, then use the toolbar (bottom-right, or Cmd/Ctrl+Shift+F): click any element, write feedback, copy the Markdown, paste it to your agent. Output includes selectors, source paths, and the component tree — no more "the blue button" guessing. The toolbar never ships to production (dev-only dynamic import).

Optional real-time sync for local agents: `npx agentation-mcp server`, with the toolbar already pointed at `http://localhost:4747` (see `components/annotation-tools.tsx`).
