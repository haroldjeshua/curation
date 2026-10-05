// Validates the intake funnel + production dataset against PLAYBOOK §3.
// Usage: pnpm intake:validate
// Exit 1 on any error. Fails on: bad URLs, duplicates, kind/meta
// mismatch, missing notes or sub-threshold scores in published/,
// seed entries in production, section caps exceeded.

import {
  CAPS,
  KIND_SECTION,
  collectIntake,
  normalizeUrl,
  readDb,
  validateFile,
} from "./intake-lib.mjs";

const errors = [];
const warnings = [];

const db = readDb();
const files = collectIntake();

// 1. Per-file checks (strict for shortlist/published, lenient for candidates).
for (const f of files) {
  const strict = f.stage !== "candidates";
  const { errors: e, warnings: w } = validateFile(f, { strict });
  errors.push(...e);
  warnings.push(...w);
}

// 2. URL uniqueness across intake + database (normalized).
const seen = new Map(); // normalized url -> location
for (const e of db) {
  try {
    seen.set(normalizeUrl(e.url), `db:${e.kind}/${e.slug}`);
  } catch {
    errors.push(`db:${e.kind}/${e.slug}: invalid url`);
  }
}
for (const f of files) {
  if (typeof f.data.url !== "string" || f.data.url.trim() === "") continue;
  let n;
  try {
    n = normalizeUrl(f.data.url);
  } catch {
    continue; // already reported per-file
  }
  if (seen.has(n)) {
    errors.push(`${f.stage}/${f.slug}.md: duplicate of ${seen.get(n)} (${n})`);
  } else {
    seen.set(n, `${f.stage}/${f.slug}.md`);
  }
}

// 3. No seed entries in the production dataset.
for (const e of db) {
  if (e.status === "published" && e.source === "seed") {
    errors.push(`db:${e.kind}/${e.slug}: seed entry published — replace via the funnel (PLAYBOOK §7)`);
  }
}
for (const f of files) {
  if (f.stage === "published" && f.data.source === "seed") {
    errors.push(`${f.stage}/${f.slug}.md: seed entries must not reach production`);
  }
}

// 4. Section caps (db published + intake/published that would push over).
const dbCounts = {};
for (const e of db) {
  if (e.status !== "published") continue;
  const section = KIND_SECTION[e.kind];
  dbCounts[section] = (dbCounts[section] ?? 0) + 1;
}
const incoming = {};
for (const f of files) {
  if (f.stage !== "published" || !KIND_SECTION[f.data.kind]) continue;
  const section = KIND_SECTION[f.data.kind];
  incoming[section] = (incoming[section] ?? 0) + 1;
}
for (const [section, cap] of Object.entries(CAPS)) {
  const have = dbCounts[section] ?? 0;
  const next = incoming[section] ?? 0;
  if (have > cap) errors.push(`cap: ${section} has ${have} published entries, cap is ${cap} — archive before adding`);
  else if (have + next > cap) errors.push(`cap: ${section} would reach ${have + next} (cap ${cap}) — archive before seeding`);
}

console.log(`intake: ${files.length} files (${db.length} db rows)`);
for (const w of warnings) console.log(`  warn: ${w}`);
if (errors.length > 0) {
  console.error("intake:validate FAILED");
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log("intake:validate OK");
