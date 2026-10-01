# Curation — PHILOSOPHY.md

> The rules that decide things when the spec is silent. If a proposed feature, dependency, or entry conflicts with a principle here, the principle wins unless Harv explicitly overrides it.
> Companion docs: `PROJECT.md`, `PHASES.md`

---

## 1. Opinion over exhaustiveness

Curation is small on purpose. Every entry carries a curator's note: what it is, why it's here, what to steal. An entry without a note does not ship.

- **Do:** cap sections, cut weak entries, write the note first.
- **Don't:** bulk-import lists, scrape directories, or pad counts to look comprehensive.

## 2. Taste, not traffic

The library is ordered by the curator's judgment and by recency, never by popularity. No votes, no view counts, no "trending," no leaderboards.

- **Do:** order by curated position or date added.
- **Don't:** add engagement metrics, even internally, to decide what to feature.

## 3. Two readers, one source of truth

Humans and agents read the same data. The machine surface (`llms.txt`, per-entry Markdown, JSON) is generated from the database, never hand-maintained in parallel.

- **Do:** treat the machine surface as a first-class output of every content change.
- **Don't:** build features that exist only in the human UI and cannot be expressed in the data.

## 4. Text first, media second

Systems, Libraries, Skills, and Reading are metadata and prose. Sites adds screenshots. Ship the text-first sections before building the media pipeline, and make every page useful with images disabled.

## 5. Small surface, deep entries

Five sections, a handful of facets, one search box. Depth lives in the entry page, not in more navigation.

- **Do:** add a facet before adding a section; add a tag before adding a facet.
- **Don't:** reintroduce parallel sections with overlapping scope (the 2024 Tools/Resources mistake).

## 6. Boring code, interesting content

The codebase should be easy to read in an afternoon. Prefer platform features and the existing stack to new dependencies. Understand a tool before adopting it.

- **Do:** justify every new dependency in one sentence in the PR or commit.
- **Don't:** adopt a library because an agent suggested it or because it is fashionable.

## 7. Phased, deliberate building

Work happens in the phases defined in `PHASES.md`. Each phase has an exit criterion. Agents implement one phase (or one task within it) at a time, explain non-obvious choices, and stop at the exit criterion rather than racing ahead.

- **Do:** keep changes small and reviewable.
- **Don't:** one-shot generate a whole phase and merge it unread.

## 8. A single curator's voice

This is a personal library under a personal domain. The voice is Harv's: direct, specific, a little opinionated. Suggestions from others are input; the curator decides.

- **Do:** write notes in plain language, concrete over adjectival.
- **Don't:** write marketing copy ("best-in-class," "stunning").

## 9. Respect the source

Everything links out. Attribute authors and organizations. Record license for systems, libraries, and skills. Honor takedown requests promptly.

## 10. Built to last

Entries have `added_at` and `reviewed_at`. Dead links are flagged automatically. Entries are archived with a reason, not silently deleted. A library people can trust is a library that admits when something is stale.

## 11. The site is itself a reference

Curation should be worth citing as a piece of design engineering: quiet interface that lets the content lead, considered typography, restrained motion, fast, accessible, keyboard-first (⌘K). Visual direction (palette, type, density) is decided in Phase 1 and recorded in a short `DESIGN.md`.

---

## Decision rules

When two good options conflict, use this order:

1. Does it make the **note** better or easier to write? Prefer it.
2. Does it keep **machine and human views in sync**? Prefer it.
3. Does it **reduce** surface area or dependencies? Prefer it.
4. Does it help ship the **current phase** rather than a future one? Prefer it.
5. Otherwise, defer it and record it in `PHASES.md` under "Later."

## Non-goals

Curation is not a social network, a marketplace, a design system product, a template store, or a news feed.
