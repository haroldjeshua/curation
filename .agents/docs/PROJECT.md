# Curation — PROJECT.md

> Status: pre-build · v0.1 · 2026-10-01
> Live target: `curation.harv.computer` · Legacy: `harv-curation.vercel.app` (2024, abandoned)
> Companion docs: `PHILOSOPHY.md`, `PHASES.md`, `CURATION-PLAYBOOK.md`
> Audience for this doc: Harv, and any coding agent working in the repo. Read all three before touching code.

---

## 1. One-liner

A personal, annotated reference library for design engineers: sites, design systems, UI and icon libraries, agent skills, and reading. Humans browse it; agents can query it.

## 2. Why this is being reopened

The 2024 vision was a resource site sitting between Seesaw (hand-picked web design inspiration) and Mobbin / Deadsimplesites (reference galleries). It never got past navigation and placeholder pages.

Two things changed:

1. **"Design engineering" became a named discipline**, and its reference needs (systems, tokens, motion, UI libraries, icon sets) are broader than a screenshot gallery.
2. **Agents became a primary consumer of design references.** design.how frames its pitch as giving agents consistent product taste. A reference library that only a human can skim is now half a product.

Curation should be re-envisioned as a taste layer that serves both readers from one source of truth.

---

## 3. Analysis

### 3.1 What legacy Curation actually is (observed from the live site)

Only the shell exists. The codebase was not reviewed; this is based on the deployed pages.

| Area | State |
|---|---|
| Nav | Inspiration · Tools · Resources · Learning · Blogs & Newsletters · Submit |
| Inspiration | Six category chips (Product Websites, Digital Agencies, Portfolios, Mobile Apps, E-commerce, Marketing). No content. "Under construction." |
| Tools | Three chips (Design, Development, Productivity). No content. |
| Resources | Same three chips as Tools. Contains a literal placeholder: "insert inspiration grid here". |
| Learning, Blogs | Not inspected individually; assumed same shell state. |
| Footer | © 2024 |

Findings:

- **Zero data.** Nothing to migrate. The only real assets are the information architecture and a domain-worth of intent.
- **Tools and Resources are duplicates.** Same three sub-categories, no stated difference.
- **Inspiration mixes two axes.** "Product Websites / Agencies / Portfolios / Mobile Apps" describe *what kind of thing*; "E-commerce / Marketing" describe *industry or purpose*. These should be separate facets, not one list.
- **Five top-level sections is a content-labor commitment** that a solo curator did not sustain.

### 3.2 What design.how is (observed Oct 2026)

- **Thesis:** free, installable design systems for agents. The site itself says the first systems are still in progress.
- **Top-level IA:** Home · Systems · Skills · Directory.
- **Home:** a collage of small product-UI fragments from well-known products (Slack, Stripe, GitHub, Vercel, Figma, Linear-class apps), leading with the tagline.
- **Directory:** three counted lists: company design systems (90), UI libraries (40), icon libraries (17).
- **Skills:** an install-command pattern (`npx … add owner/name`). The page is currently placeholder copy, so the mechanism is a signal of direction, not something to copy verbatim.
- **Systems page** could not be read (site disallows automated access). Treat details of how systems are packaged as unknown.

Structural takeaways:

1. The unit of value is **a thing an agent can install or consume**, not a thing a human admires.
2. The Directory is a **pure index**: names, counts, categories. It is cheap to build and high-utility.
3. design.how is a **producer** (it authors systems and skills). Curation can be a **curator/index** (it points to and annotates others' work). These are complementary, and design.how itself is a valid entry for Curation.

### 3.3 What Seesaw does that matters

- Daily hand-picked sites, each with a name and a one-line description.
- Industry-style category filter (Agency, AI, Design, Developer Tools, Fintech, Portfolios, Social, and others).
- ⌘K search across websites, fonts, and categories.
- Submit and Subscribe as first-class actions.
- Its feed already includes design-engineering references (animation libraries, easing references, design-engineering magazines, personal sites of design engineers). The audience overlap with Curation is real.

Takeaway: the **gallery lane is crowded and screenshot-heavy**. Competing on breadth there is a losing game for a solo curator.

### 3.4 The gap Curation can own

| Axis | Seesaw / Mobbin | design.how | Curation (proposed) |
|---|---|---|---|
| Primary reader | Human | Agent | Both |
| Unit | Screenshot / site | Installable system / skill | Annotated entry (any kind) |
| Voice | Editorial, neutral | Producer | Single curator, opinionated notes |
| Breadth | High | Medium | Deliberately small |
| Machine access | None | Core | First-class (static JSON, `llms.txt`) |

Positioning: **a small, opinionated, annotated library with a curator's note on every entry, available in a human view and a machine view.** The note ("why this is here, what to steal") is the moat. Aggregators do not write it.

### 3.5 Keep / merge / cut / add

| Legacy | Decision | Rationale |
|---|---|---|
| Inspiration | **Keep → rename `Sites`** | Core of the original vision. Split "kind" (product site, portfolio, agency, app UI) from "industry" (tags). |
| Mobile Apps (as a chip) | **Fold into `Sites`** as a kind | One gallery, one pipeline. |
| E-commerce, Marketing (as chips) | **Demote to tags** | They are industry/purpose, not kinds. |
| Tools | **Cut from v1** | Heavily saturated lane, low differentiation, duplicates Resources. Revisit after launch. |
| Resources | **Replace with `Libraries`** | Becomes concrete: UI libraries, icon libraries, motion, fonts. |
| Learning + Blogs & Newsletters | **Merge → `Reading`** | Both are "things you read or follow." Format is a facet (blog, newsletter, course, magazine, talk). |
| (new) | **Add `Systems`** | Company design systems. The design.how lane. Text-first and cheap. |
| (new) | **Add `Skills`** | Curated agent skills / configs relevant to design engineering. Index only; Curation does not author them in v1. |
| Submit | **Keep** | Re-scoped as "suggest an entry"; curator decides. |

Resulting top-level IA (still five, but each is concrete): **Sites · Systems · Libraries · Skills · Reading**.

---

## 4. Product definition

### 4.1 Audience

- Primary: design engineers and frontend engineers who want strong references fast.
- Secondary: designers moving toward code, and developers using coding agents who need design direction to point those agents at.
- Tertiary: agents themselves, acting on behalf of any of the above.

### 4.2 Jobs to be done

1. "I'm building a pricing page. Show me three good ones and tell me why they work."
2. "Which company design systems publish tokens and docs I can actually read?"
3. "Which icon libraries are worth using, and under what license?"
4. "Give my coding agent a list of references to ground its taste."
5. "Which skills/configs exist for design work with agents?"

### 4.3 Surfaces

- **Human web:** browse by section, filter by facet, ⌘K search, entry pages with the curator's note.
- **Machine surface:** `/llms.txt`, per-entry Markdown, and a read-only JSON endpoint, all generated from the same data.
- **Later:** a Curation skill or MCP server so an agent can query the library directly (see Phases).

### 4.4 Entry model (draft)

Common fields for every entry:

`id, slug, kind, title, url, tagline, note, tags[], status (draft|published|archived), source (curator|suggestion|seed), added_at, reviewed_at, link_status, media?, lens[] (craft|deseng|delight), featured? (boolean), meta (jsonb)`

Kind-specific `meta`:

- `site`: `{ type: product|portfolio|agency|app, industry: [], captured_at }`
- `system`: `{ org, docs_url, tokens_url?, figma_url?, repo_url?, has_llms_txt?, license? }`
- `library`: `{ category: ui|icons|motion|fonts|3d|reference, frameworks: [], license, install? }`
- `skill`: `{ install?, repo_url, agents: [] }`
- `reading`: `{ format: blog|newsletter|course|magazine|talk, cadence? }`

The `note` field is required to publish. No note, no entry.

---

## 5. Scope

### In for v1

- All five sections exist with real content (small, hand-picked sets).
- Entry model, filters, ⌘K search, entry pages.
- Static machine surface (`llms.txt`, JSON, per-entry Markdown).
- Suggest-an-entry form with a private review queue.
- Link-health checking.
- Custom domain live at `curation.harv.computer`.

### Out of v1

- User accounts, saves, collections, votes, comments, rankings, "trending."
- Tools directory.
- Authoring or publishing Curation's own design systems or skills.
- MCP server (Phase 5; v1 ships the static surface only).
- Paid tiers, ads, sponsorship.

### Suggested v1 content targets (adjust freely)

Roughly 30 Sites, 15 Systems, 15 Libraries, 10 Skills, 20 Reading. The point is to prove the model and the voice, not to rival a 90-entry directory.

---

## 6. Technical direction

Matches the existing project standard unless noted.

- **Framework:** Next.js 16 (App Router), TypeScript strict, pnpm.
- **Styling:** Tailwind v4 with CSS custom property tokens.
- **Data:** content-in-repo (JSON/MDX) for Phases 1–3, shaped 1:1 to the §4.4 entry model; Postgres on Neon with Drizzle ORM at Phase 4 (suggestion queue + link-health job). TanStack Query only where client-side fetching is genuinely needed.
- **Motion:** Motion, used sparingly.
- **Hosting:** Vercel, custom domain `curation.harv.computer`; legacy `harv-curation.vercel.app` redirects to it.
- **Media:** object storage (e.g. R2) only once Sites needs thumbnails; Phase 3.
- **Search:** start with client-side or Postgres full-text. No search service in v1.

### Open technical decisions (with defaults)

| # | Decision | Default | Why |
|---|---|---|---|
| T1 | Source of truth: Postgres vs content-in-repo (JSON/MDX) | **Decided 2026-10-01: content-in-repo (JSON/MDX) for Phases 1–3; Postgres on Neon + Drizzle at Phase 4** | v1 is ~75 hand-written entries with no queue or link-jobs yet — a DB buys infra overhead (migrations, secrets, local dev DB) for zero payoff. JSON rows shaped 1:1 to the §4.4 entry model migrate mechanically when the suggestion queue + link-health job land. Static exports (`llms.txt`, per-entry Markdown, JSON) generate at build either way. |
| T2 | Fresh repo vs reuse the 2024 repo | **Decided 2026-10-01: fresh scaffold** | Phase 0 archaeology confirmed zero content, Next 14 + Tailwind v3 stack, placeholder-only routes. Do not upgrade in place. |
| T3 | Visual tokens: new vs reuse `@pilipinas/themes` | **New, minimal** | Avoid coupling Curation's launch to another project's roadmap. Revisit if the token system is stable. |
| T4 | Screenshot capture method | **Decide in Phase 3** | Manual vs headless capture changes the whole pipeline. Thumbnail scale is tracked in the PHASES.md backlog; the image half must be minimally decided in Phase 3. |

---

## 7. Curation criteria

An entry is published only if it passes all of these:

1. **Craft:** it is well made in a way a design engineer would notice.
2. **Teachable:** the note can say something specific about what to learn from it.
3. **Durable:** likely still relevant and reachable in a year, or archived with a reason.
4. **Attributable:** source and license are known (critical for systems, libraries, skills).

Note format: 1–3 sentences. What it is, why it's here, what to steal.

---

## 8. Risks

| Risk | Mitigation |
|---|---|
| Project stalls again (it did in 2024) | Small v1 targets, text-first sections shipped before the screenshot gallery, phases with exit criteria. |
| Content labor outpaces one curator | Cap entries per section for v1; suggestions queue is optional input, never an obligation. |
| Crowded gallery lane | Do not compete on breadth. Lead with Systems, Libraries, Skills, and the curator's note. |
| Link rot and stale entries | Link-health job, `reviewed_at`, archive instead of delete. |
| Screenshots of third-party sites | Link back prominently, attribute, honor takedown requests, keep media small. Not legal advice; check the norms before launch. |
| design.how and the agent landscape are still moving | Keep the machine surface boring (static files) so it can adapt cheaply. |
| Overlap with other Filipino-focused projects (e.g. filipino.build, pilipinas-interface) | Curation is general and global; Filipino-specific work lives in those projects. A "Filipino" tag or lens can be added later without restructuring. |

---

## 9. Success criteria for v1

- Live at `curation.harv.computer` with all five sections populated at target sizes.
- Every published entry has a note.
- `llms.txt` and JSON export validate and update on deploy.
- Link-health job runs and flags dead links.
- One person other than Harv has submitted or suggested an entry through the form.
- Harv can add an entry end-to-end in under five minutes.

---

## 10. Reference links

- design.how — https://design.how
- Seesaw — https://www.seesaw.website
- Legacy Curation — https://harv-curation.vercel.app
