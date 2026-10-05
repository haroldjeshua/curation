# Curation — CURATION-PLAYBOOK.md

> How raw captures (Obsidian, Brave bookmarks, daily finds) become a small, high-bar library.
> Companion docs: `PROJECT.md`, `PHILOSOPHY.md`, `PHASES.md`.
> Rule of thumb: **capturing is cheap, publishing is expensive.** Daily notes stay as they are. Curation is a separate, deliberate act.

---

## 1. The funnel

```
Capture (daily, untouched)      Obsidian daily notes, tagged notes, Brave bookmarks
        ↓  extract
Candidates (staging)            intake/candidates/*.md   (NOT in the database)
        ↓  pass 1: gut check     keep ~20–30%
Shortlist                       intake/shortlist/*.md
        ↓  pass 2: rubric        keep entries scoring ≥ threshold
Annotated                       note + tagline written, link and license checked
        ↓  pass 3: cooling-off   48 hours, then re-read
Published                       validated, seeded to DB, appears on site
```

Expect most things to die in the first two passes. A healthy overall pass rate is **well under 10%** of what you've collected. If more than that survives, the bar is too low.

---

## 2. The bar (selection rubric)

Score each shortlisted item 0–2 on each criterion. These extend the four criteria in `PROJECT.md` §7.

| Criterion | 0 | 1 | 2 |
|---|---|---|---|
| **Craft** | Competent | Notably polished | Makes you stop and study it |
| **Teachable** | Nothing specific to say | One takeaway | Several concrete things to steal |
| **Durable** | Trend-dependent | Likely good for ~1 year | Still relevant in several years |
| **Distinct** | Many near-duplicates already in the library | Overlaps partly | Fills a real gap or does it better |
| **Attributable** | Source or license unclear | Partly known | Author, source, license all known |

**Publish threshold (suggested):** total ≥ 8 of 10, with **Craft ≥ 1** and **Teachable ≥ 1**. Tune after your first real pass, then freeze it.

### Tests that beat the rubric

- **The note test.** If you cannot write the 1–3 sentence note ("what it is, why it's here, what to steal"), cut it.
- **The peer test.** Would you send this to a respected peer unprompted?
- **The resurface test.** Did you come back to it, or remember it, more than two weeks after capturing it? Things you forgot were not top-tier.
- **The swap test.** Once a section is at its cap, a new entry must be better than the weakest current one. Remove one to add one.

### Section caps (v1, matching `PROJECT.md`)

Sites ~30 · Systems ~15 · Libraries ~15 · Skills ~10 · Reading ~20. Caps are a feature. Revisit only after launch.

---

## 3. The input format

One canonical format: **a Markdown file with YAML frontmatter, one file per candidate.** Easy to write by hand in Obsidian, easy for scripts to generate from bookmarks, easy for agents to read, and diff-friendly.

Location in repo: `intake/candidates/`, `intake/shortlist/`, `intake/published/` (moved or archived after seeding).

### Template

```markdown
---
url: https://example.com
kind: site                # site | system | library | skill | reading
title: Example
tagline: One line describing what it is.
lens: [craft, deseng]     # craft | deseng | delight  (why it's good)
tags: [pricing-page, motion]   # free tags: topic, page type, industry
source: obsidian          # obsidian | brave | manual | suggestion
found: 2026-09-14         # when you captured it
score:
  craft: 2
  teachable: 2
  durable: 1
  distinct: 2
  attributable: 2
meta:                     # kind-specific, see PROJECT.md §4.4
  type: product           # for kind: site
  industry: [devtools]
featured: false           # optional: a small set of "essentials"
---

Curator's note (1–3 sentences). What it is, why it's here, what to steal.
Optional: your raw notes or context below this line; scripts ignore it.
```

### Rules the validator should enforce

- `url` valid, normalized (strip tracking params, trailing slash, `www.` consistency), unique across all folders.
- `kind` is one of the five; `meta` matches the kind.
- Published entries have a non-empty note and a score meeting the threshold.
- No `source: seed` entries in production (see §7).
- Section caps are not exceeded.

### Bulk alternative

For fast first passes, scripts may emit a flat `candidates.csv` (`url,title,source,found,folder,tags`) for quick scanning in a spreadsheet. Anything that survives becomes a Markdown file; the CSV is never the source of truth.

---

## 4. Sourcing from Obsidian

Tags you already use map like this. The mapping is a proposal; adjust it if your tags mean something different.

| Obsidian tag | Curation field | Notes |
|---|---|---|
| `#craft` | `lens: craft` | Exceptional execution |
| `#deseng` | `lens: deseng` | Design-engineering relevance |
| `#delight` | `lens: delight` | Interaction, motion, personality |
| `#skills` | `kind: skill` | Assumes agent skills/configs; see open question at the end |

`lens` is a **why it's good** facet, orthogonal to `kind`. A site can be both `craft` and `delight`.

### Going forward: one extra tag, no new habit

Leave daily capture exactly as is. Add a single promotion tag **`#curate`** that you apply only when something passes the resurface test during a weekly review. The extractor then pulls `#curate` first and treats everything else as low-priority.

### Extraction (build as a script; agent task)

`pnpm intake:obsidian --vault <path>`:

1. Walk the vault (or a chosen folder). Find URLs and the surrounding line/heading/tags.
2. Attach `lens`/`kind` from the tag mapping; record the note's date as `found`.
3. Skip URLs already in `intake/` or the database.
4. Write one candidate file per URL. Put the surrounding text under the frontmatter so context is preserved.
5. **Dry-run by default**; print counts per tag and per month before writing anything.

Do the first run against `#curate`-tagged notes only, then widen if the pool is too thin.

---

## 5. Sourcing from Brave bookmarks

Brave is Chromium-based. Two ways to get the data:

- **Export from the UI:** open the bookmark manager (Ctrl/Cmd + Shift + O), use the menu to export bookmarks. This produces a standard HTML file.
- **Read the profile file:** Chromium stores a JSON `Bookmarks` file in the browser profile directory. Copy it elsewhere before reading; do not read the live file while the browser is running.

`pnpm intake:bookmarks <file>`:

1. Parse the HTML (or JSON). Keep folder path as a hint, not as truth.
2. Normalize URLs and **drop duplicates** against Obsidian candidates and the database.
3. Drop obvious non-candidates: localhost, login/dashboard URLs, search results, docs for tools you only used once, anything behind auth.
4. Run a link check; mark dead ones.
5. Guess `kind` from domain/folder if possible (e.g., a design-system site vs a blog); otherwise leave `kind` blank for manual triage.
6. Write candidate files with `source: brave`.

Bookmarks are the noisiest source. Expect a low pass rate and do not import them into the database directly.

---

## 6. Triage passes (do these as separate sittings)

1. **Gut pass (≈5 seconds each).** Open candidate, yes / maybe / no. No scoring, no notes. Target: keep 20–30%.
2. **Rubric pass.** Score the survivors. Cut anything below threshold. Check section fit and cap.
3. **Annotate pass.** Write `tagline` and `note`. If the note won't come, cut. Check link, source, and license (especially for systems, libraries, skills).
4. **Cooling-off.** Wait 48 hours, re-read, remove anything you now doubt.
5. **Publish.** Run the validator, seed, deploy.

Keep a short `intake/DECISIONS.md` log of cut/keep reasoning for borderline entries. It will calibrate the bar over time.

---

## 7. Seed data hygiene

The current development entries are fictional and unaudited. Mark them so they cannot leak:

- Add `source: seed` (or an `is_seed` column) to every placeholder entry.
- `pnpm intake:validate` and the production build **fail** if any seed entry is present in a production dataset.
- Replace seed entries section by section as real ones pass the funnel.

---

## 8. View options (Phase 3 addition)

A **three-state segmented control** (not a binary switch): **Cards · List · Text**.

| View | Shows | Best for |
|---|---|---|
| Cards | Thumbnail, title, tagline | Sites |
| List | Favicon or glyph, title, tagline, lens/tags, date | Systems, Libraries |
| Text | One line per entry: title — tagline | Reading, Skills; fastest scanning, design.how-style |

Requirements:

- **Per-section defaults:** Sites → Cards; Systems and Libraries → List; Reading and Skills → Text. User choice overrides.
- **URL-driven:** `?view=cards|list|text`, so views are shareable and server-rendered with no layout shift. Remember the last choice per section in a cookie or localStorage as a fallback.
- **Accessible:** a labelled radio group or toggle buttons with `aria-pressed`; keyboard operable; a visible focus state.
- **Graceful without media:** List and Text must be fully useful with no images. Until favicon support lands (see backlog), List uses a neutral glyph.
- **Machine parity:** the view is presentation only. `llms.txt` and JSON are unaffected.
- Same entries, same order, same filters across all three views.

---

## 9. Your checklist (in order)

**A. Set the rules (about an hour)**
- [ ] Confirm the rubric and publish threshold in §2.
- [ ] Confirm section caps.
- [ ] Decide the `#skills` meaning (see open question).

**B. Prepare the machinery (builder agent)**
- [ ] Create `intake/` folders and the template in §3.
- [ ] Build `intake:validate`, `intake:obsidian`, `intake:bookmarks`, and the seed command.
- [ ] Add `source: seed` marking and the production guard (§7).
- [ ] Add the view toggle (§8).

**C. Gather**
- [ ] Add `#curate` to your Obsidian workflow; do one retroactive pass over existing tagged notes.
- [ ] Export Brave bookmarks.
- [ ] Run both extractors in dry-run, review the counts, then write candidates.

**D. Filter**
- [ ] Gut pass → Rubric pass → Annotate pass → Cooling-off (see §6).
- [ ] Keep each section at or under its cap.

**E. Audit before publish**
- [ ] Every entry has a note, source, and license (where relevant).
- [ ] Links checked; no seed entries remain.
- [ ] A second reader skims the result and flags weak or duplicate entries.

**F. Ongoing**
- [ ] Weekly: tag new keepers `#curate`.
- [ ] Monthly: run the extractor, triage new candidates, one-in-one-out at the cap.
- [ ] Quarterly: re-read the whole library; archive anything stale or that no longer clears the bar.

---

## 10. Backlog (not for Phase 3 unless noted)

1. **Thumbnail scale.** How do inspiration and resource sites like Seesaw handle large volumes of image and video thumbnails? Research and decide. *Overlaps `PROJECT.md` T4 (capture method and storage); the image half must be at least minimally decided in Phase 3, video can wait.*
2. **Site metadata and favicons.** How to gather and display each site's metadata, including favicon, inline, rather than just name and link. *Directly improves the List view.*
3. **Accounts and personal collections (future).** Auth/login/signup so people can keep their own curated collections (bookmarks in the spirit of Rauno's bmrks.com), share lists such as "my top 10 design engineering resources," or share tech stacks and tools. **This conflicts with `PHILOSOPHY.md` principles 2 and 8 (taste not traffic; a single curator's voice).** Decide deliberately, before building anything. Questions to answer then: does this belong in Curation or a sibling project, what stays curator-only, and what does it cost in moderation and privacy.

---

## Open question

In your Obsidian notes, does **`#skills`** mean *agent skills/configs* (SKILL.md, MCP, prompts) or *skills worth learning*? The mapping above assumes the first. If it's the second, those notes belong under `Reading`, not `Skills`.
