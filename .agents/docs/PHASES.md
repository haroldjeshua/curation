# Curation — PHASES.md

> Build order, deliverables, and exit criteria. One phase at a time. An agent working in this repo should read `PROJECT.md` and `PHILOSOPHY.md` first, then work only on the current phase.
> Mark a phase done only when every exit criterion is checked.

**Current phase:** 3 (Sites gallery and media; not started)

---

## Phase 0 — Audit and reset

**Goal:** decide what survives from 2024, and put the groundwork in place.

Tasks
- [x] Audit the old repo (CURATION-ARCHAEOLOGY.md, 2026-10-01).
- [x] Decide fresh scaffold vs reuse (fresh; see PROJECT.md T2).
- [x] Commit `PROJECT.md`, `PHILOSOPHY.md`, `PHASES.md` to the repo (kept in `.agents/docs/` per 2026-10-01 decision; `AGENTS.md` + `CLAUDE.md` at root instead).
- [x] Write a project `CLAUDE.md` pointing agents at the 3Ps and the stack.
- [ ] Point `curation.harv.computer` at the Vercel project; plan the redirect from the legacy URL.
- [ ] Replace the legacy site with a minimal "reopening" holding page (optional but cheap).

Exit criteria
- [x] Keep/discard decision recorded in the repo.
- [ ] Domain resolves to a deployed page.
- [x] 3Ps and `CLAUDE.md` are in the repo.

---

## Phase 1 — Foundation

**Goal:** the skeleton the content will live in.

Tasks
- [x] Scaffold Next.js 16 + TypeScript strict + Tailwind v4 + pnpm (branch `scaffold/fresh-next16`, `pnpm build` verified 2026-10-01).
- [x] Define design tokens as CSS custom properties; write a short `DESIGN.md` (palette, type, density, motion).
- [x] Layout, header nav with the five sections, footer, theme handling.
- [x] Content schema for `entries` (common fields + `meta`, JSON per PROJECT.md §4.4, DB-shaped for the Phase 4 migration) + seed script with a handful of fake entries per kind.
- [x] Section index page and entry detail page, reading from content-in-repo.
- [x] ⌘K command palette shell (navigation only at this stage).

Exit criteria
- [x] All five section routes render from content-in-repo (verified `pnpm build`: 5 section + 10 entry pages SSG, 2026-10-01).
- [x] Entry detail pages render the note and metadata.
- [ ] Lighthouse accessibility check passes with no critical issues (baked in: landmarks, labels, focus-visible, AA-contrasting tokens; full run needs a deployed preview — Harv).
- [ ] Deployed to production domain (needs Harv: Vercel project + `curation.harv.computer`).

---

## Phase 2 — Text-first sections and the machine surface

**Goal:** real content in the sections that need no screenshots, plus the agent-readable outputs.

Order: **Systems → Libraries → Reading → Skills.** (Most structured and cheapest first.)

Tasks
- [x] Facets and filters per kind (meta facet per section + text filter, client-side).
- [x] Search: ⌘K searches entries (title, tagline, tags, note) across all sections.
- [x] Populate to v1 targets: 15 Systems, 15 Libraries, 20 Reading, 10 Skills. Every entry has a note.
- [x] Generate `/llms.txt`, per-entry Markdown (`/<section>/<slug>.md`), and read-only `/entries.json` via `prebuild` script (gitignored, regenerated every build).
- [x] Minimal admin path: `pnpm add-entry` CLI script (draft by default, flip to publish).

Exit criteria
- [x] Four sections populated at target sizes, every entry has a note (prebuild validation fails the build otherwise).
- [x] `llms.txt` and JSON regenerate from content-in-repo and match the site (verified live 2026-10-01: counts 2/15/15/10/20, notes present).
- [x] Adding one entry end-to-end takes under five minutes (smoke-tested `add-entry` → flip status → rebuild).

---

## Phase 3 — Sites gallery and media

**Goal:** the original Seesaw/Mobbin-lane vision, scoped small.

**Prerequisite:** the intake pipeline and bar in CURATION-PLAYBOOK.md (candidates → shortlist → annotated → published) must exist before Sites is populated; never populate Sites from unfiltered notes or bookmarks.

Tasks
- [ ] Decide capture method (manual vs headless) and storage (see PROJECT.md T4).
- [ ] Thumbnail + optional detail image pipeline with sensible size limits.
- [ ] Gallery layout with `type` and `industry` facets.
- [ ] Attribution and link-back on every card and detail page.
- [ ] Populate ~30 Sites with notes, only from entries that cleared the playbook's bar.
- [ ] Build intake tooling: `intake:validate`, `intake:obsidian`, `intake:bookmarks`, and a seed command (PLAYBOOK §3–§7).
- [ ] Mark all placeholder entries `source: seed`; the production build fails if any remain.
- [ ] View options: Cards · List · Text segmented control, URL-driven (`?view=`), per-section defaults, accessible (PLAYBOOK §8).

Exit criteria
- [ ] Gallery loads fast on mobile and degrades gracefully without images.
- [ ] Every site entry has a note, attribution, and captured date.
- [ ] All three views render the same entries and filters; List and Text are useful without images.
- [ ] No seed entries in the production dataset.

---

## Phase 4 — Suggestions and upkeep

**Goal:** let others contribute without creating obligations, and keep the library honest over time.

Tasks
- [ ] Suggest-an-entry form (URL, kind, short reason) with spam protection and rate limiting.
- [ ] Private review queue; accept, reject, or convert to draft.
- [ ] Link-health job (scheduled) that updates `link_status` and flags dead entries.
- [ ] `reviewed_at` surfaced in the admin view; stale-entry list.
- [ ] Archive flow with a stored reason.

Exit criteria
- [ ] A test suggestion travels form → queue → published entry.
- [ ] Link-health job has run at least once in production and flagged a deliberate dead test link.

---

## Phase 5 — Agent interface

**Goal:** let an agent query Curation directly, beyond static files.

Tasks
- [ ] Review what design.how's skills mechanism looks like once it is no longer placeholder; decide whether to follow its install pattern.
- [ ] Choose the agent surface: a published Curation skill, a small MCP server, or an expanded JSON API with query params.
- [ ] Ship the smallest useful version: "given a page type or component, return the best references with notes."
- [ ] Document usage in the repo and on a `/agents` page.

Exit criteria
- [ ] An agent in a fresh project can retrieve relevant references with a single documented command or tool call.

---

## Phase 6 — Polish and launch

Tasks
- [ ] Final design pass against `DESIGN.md`; motion audit; keyboard and screen-reader pass.
- [ ] Open Graph images, metadata, sitemap.
- [ ] Optional newsletter signup (only if Harv will actually write it).
- [ ] Redirect legacy URL permanently.
- [ ] Soft launch to a few peers; collect feedback.

Exit criteria
- [ ] PROJECT.md §9 success criteria are all met.

---

## Later (parked, not scheduled)

- Tools directory
- Fonts as a first-class kind (relationship to other Filipino type projects TBD)
- Filipino lens/tag across entries
- Collections or curated "packs" (e.g., "references for a dashboard")
- Reuse of `@pilipinas/themes` tokens
- **Brave bookmark importer:** parse exported bookmark HTML into draft entries for triage (see `CURATING.md` funnel)

### Backlog (recorded, not scheduled)

- **Thumbnail scale:** how inspiration/resource sites like Seesaw handle large volumes of image and video thumbnails. Overlaps T4; the image half needs a minimal answer in Phase 3, video can wait.
- **Site metadata and favicons:** gather and display each site's metadata (including favicon) inline, not just name and link. Improves the List view.
- **Accounts and personal collections:** auth/login/signup so people can keep their own curated collections (in the spirit of bmrks.com), share lists like "top 10 design engineering resources", or share tech stacks and tools. Conflicts with PHILOSOPHY.md principles 2 and 8. Decide deliberately before building; do not build speculatively.

## Agent working rules for this repo

1. Read `PROJECT.md`, `PHILOSOPHY.md`, and this file before changing code.
2. Work only within the current phase; list what you are about to do before doing it.
3. Explain non-obvious decisions briefly; flag any new dependency with a one-line justification.
4. Stop at the exit criteria and report what remains unchecked.
5. Never publish an entry without a note.
