# Curation — Claude Entry Point

> This repo's agent contract lives in `AGENTS.md` (root) and `.agents/docs/` (`PROJECT.md`, `PHILOSOPHY.md`, `PHASES.md`) plus `CURATION-ARCHAEOLOGY.md` (Phase 0 report). Read them in that order before touching code.

## Claude-specific notes

- Follow `AGENTS.md` working rules as stated there; do not duplicate them here.
- Work only within the current phase per `PHASES.md`; stop at exit criteria.
- Entry rule is absolute: never publish an entry without a curator's note.
- Locked stack direction: fresh scaffold (Next 16 + TS strict + Tailwind v4 + pnpm), content-in-repo until Phase 4. Do not introduce Postgres, auth, or search services in Phases 1–3.
