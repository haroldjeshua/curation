// Minimal admin path: add one entry to content/*.json in under five minutes.
// Usage:
//   pnpm add-entry --kind library --title "Radix Primitives" --url "https://…" \
//     --tagline "…" --note "…" [--tags "react,accessibility"] [--meta '{"category":"ui"}']
// New entries land as drafts; flip `status` to `published` after review.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const kindFiles = {
  site: "sites.json",
  system: "systems.json",
  library: "libraries.json",
  skill: "skills.json",
  reading: "reading.json",
};

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].slice(2);
      out[key] = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "true";
    }
  }
  return out;
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

const args = parseArgs(process.argv.slice(2));
const kind = args.kind;
const missing = ["kind", "title", "url", "tagline", "note"].filter((k) => !args[k]);

if (!kindFiles[kind] || missing.length > 0) {
  console.error("usage: pnpm add-entry --kind <site|system|library|skill|reading> --title <t> --url <u> --tagline <t> --note <n> [--tags a,b] [--meta '{…}']");
  if (missing.length > 0) console.error(`missing: ${missing.join(", ")}`);
  process.exit(1);
}

let meta = {};
if (args.meta) {
  try {
    meta = JSON.parse(args.meta);
  } catch {
    console.error("could not parse --meta as JSON");
    process.exit(1);
  }
}

const file = join(root, "content", kindFiles[kind]);
const entries = JSON.parse(readFileSync(file, "utf-8"));
const slug = args.slug ?? slugify(args.title);

if (entries.some((e) => e.slug === slug)) {
  console.error(`slug already exists in ${kindFiles[kind]}: ${slug}`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const entry = {
  id: `${kind}-${slug}`.slice(0, 80),
  slug,
  kind,
  title: args.title,
  url: args.url,
  tagline: args.tagline,
  note: args.note,
  tags: args.tags ? args.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
  status: "draft",
  source: "curator",
  added_at: today,
  reviewed_at: today,
  link_status: "unknown",
  meta,
};

entries.push(entry);
writeFileSync(file, JSON.stringify(entries, null, 2) + "\n");
console.log(`added draft to content/${kindFiles[kind]}: ${slug}`);
console.log("next: review the note, then flip status to \"published\".");
