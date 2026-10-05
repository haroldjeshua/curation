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
Optional: raw notes or context below this line; scripts ignore it.

<!--
Filename is the slug: save this file as intake/candidates/<slug>.md
(lowecase, hyphens). The seeder uses the filename, not a frontmatter field.
Scores 0–2 per criterion; published needs total ≥ 8 with craft and
teachable each ≥ 1. See CURATION-PLAYBOOK.md §2–§3.
-->
