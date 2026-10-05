// Seeds validated intake/published/*.md files into content/*.json.
// Usage: pnpm intake:seed
// Aborts on any validation error. Skips slugs/URLs already in the DB.
// Seeded files move to intake/seeded/ (gitignored) for provenance.

import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import {
  KIND_FILES,
  collectIntake,
  contentDir,
  ensureDirs,
  intakeDir,
  normalizeUrl,
  readDb,
  validateFile,
} from "./intake-lib.mjs";

ensureDirs();

const db = readDb();
const dbSlugs = new Set(db.map((e) => `${e.kind}/${e.slug}`));
const dbUrls = new Set();
for (const e of db) {
  try {
    dbUrls.add(normalizeUrl(e.url));
  } catch {
    // validator reports bad db urls; seed only cares about collisions
  }
}

const files = collectIntake().filter((f) => f.stage === "published");
if (files.length === 0) {
  console.log("intake:seed: nothing in intake/published/");
  process.exit(0);
}

let fatal = false;
for (const f of files) {
  const { errors } = validateFile(f, { strict: true });
  if (errors.length > 0) {
    fatal = true;
    for (const e of errors) console.error(`  - ${e}`);
  }
}
if (fatal) {
  console.error("intake:seed ABORTED: fix validation errors first");
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const byKind = {};
let seeded = 0;
let skipped = 0;

for (const f of files) {
  const d = f.data;
  const slug = basename(f.path, ".md");
  if (dbSlugs.has(`${d.kind}/${slug}`) || dbUrls.has(normalizeUrl(d.url))) {
    console.log(`  skip (already in db): published/${slug}.md`);
    skipped++;
    continue;
  }
  const entry = {
    id: `${d.kind}-${slug}`.slice(0, 80),
    slug,
    kind: d.kind,
    title: d.title,
    url: d.url,
    tagline: d.tagline,
    note: f.body,
    tags: Array.isArray(d.tags) ? d.tags : [],
    status: "published",
    source: d.source ?? "manual",
    added_at: d.found ?? today,
    reviewed_at: today,
    link_status: "unknown",
    lens: Array.isArray(d.lens) ? d.lens : [],
    featured: d.featured === true,
    meta: d.meta && typeof d.meta === "object" ? d.meta : {},
  };
  (byKind[d.kind] ??= []).push(entry);
  const seededDir = join(intakeDir, "seeded");
  mkdirSync(seededDir, { recursive: true });
  renameSync(f.path, join(seededDir, basename(f.path)));
  seeded++;
}

for (const [kind, rows] of Object.entries(byKind)) {
  const file = join(contentDir, KIND_FILES[kind]);
  const existing = JSON.parse(readFileSync(file, "utf-8"));
  existing.push(...rows);
  writeFileSync(file, JSON.stringify(existing, null, 2) + "\n");
  console.log(`  seeded ${rows.length} → content/${KIND_FILES[kind]}`);
}

console.log(`intake:seed: ${seeded} seeded, ${skipped} skipped`);
