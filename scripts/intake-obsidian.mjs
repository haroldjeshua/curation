// Extract intake candidates from an Obsidian vault.
// Usage: pnpm intake:obsidian --vault <path> [--write] [--tag <tag>] [--folder <sub>]
// Dry-run by default: prints counts per tag and per month, writes nothing.
// --write emits intake/candidates/<slug>.md. Never reads outside --vault.

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { tagMap } from "../intake.config.mjs";
import { KINDS, collectIntake, intakeDir, normalizeUrl, readDb } from "./intake-lib.mjs";

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].slice(2);
      out[key] = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "true";
    } else {
      out._.push(argv[i]);
    }
  }
  return out;
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith(".")) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (name.toLowerCase() === "trash") continue;
      walk(p, out);
    } else if (name.endsWith(".md")) {
      out.push({ path: p, mtime: st.mtime });
    }
  }
  return out;
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

function slugFromUrl(raw) {
  try {
    const u = new URL(raw);
    const host = u.hostname.replace(/^www\./, "").split(".").slice(0, -1).join("-") || "link";
    const first = u.pathname.split("/").filter(Boolean)[0] ?? "";
    return slugify(`${host}-${first}`.replace(/-$/, "")) || "link";
  } catch {
    return "link";
  }
}

const args = parseArgs(process.argv.slice(2));
const vault = args.vault;
if (!vault || !existsSync(vault) || !statSync(vault).isDirectory()) {
  console.error("usage: pnpm intake:obsidian --vault <path> [--write] [--tag <tag>] [--folder <sub>]");
  process.exit(1);
}
const onlyTag = args.tag ? String(args.tag).toLowerCase() : null;
const subfolder = args.folder ? join(vault, String(args.folder)) : vault;
const write = args.write === "true" || args.write === true;

const knownUrls = new Set();
for (const e of readDb()) {
  try {
    knownUrls.add(normalizeUrl(e.url));
  } catch {
    // validator reports bad db urls
  }
}
for (const f of collectIntake()) {
  if (typeof f.data.url === "string") {
    try {
      knownUrls.add(normalizeUrl(f.data.url));
    } catch {
      // validator reports bad intake urls
    }
  }
}

const tagCounts = {};
const monthCounts = {};
const found = []; // { url, title, context, tags, file, mtime }
const skippedKnown = { count: 0 };

for (const { path, mtime } of walk(subfolder)) {
  const text = readFileSync(path, "utf-8");
  const tags = new Set();
  for (const m of text.matchAll(/(?:^|\s)#([A-Za-z][\w/-]*)/gm)) {
    tags.add(m[1].toLowerCase());
  }
  if (onlyTag && ![...tags].some((t) => t === onlyTag || t.endsWith("/" + onlyTag))) continue;
  const lines = text.split(/\r?\n/);
  let heading = null;
  for (const line of lines) {
    const h = line.match(/^#{1,3}\s+(.*)/);
    if (h) heading = h[1].trim();
    for (const um of line.matchAll(/https?:\/\/[^\s)>\]"']+/g)) {
      let url = um[0].replace(/[.,;!?'"”’]+$/, "");
      let normalized;
      try {
        normalized = normalizeUrl(url);
      } catch {
        continue;
      }
      if (knownUrls.has(normalized)) {
        skippedKnown.count++;
        continue;
      }
      knownUrls.add(normalized);
      for (const t of tags) tagCounts[t] = (tagCounts[t] ?? 0) + 1;
      const month = `${mtime.getFullYear()}-${String(mtime.getMonth() + 1).padStart(2, "0")}`;
      monthCounts[month] = (monthCounts[month] ?? 0) + 1;
      found.push({
        url: normalized,
        title: heading ?? new URL(normalized).hostname.replace(/^www\./, ""),
        context: (heading ? `# ${heading}\n` : "") + line.trim(),
        tags: [...tags],
        file: relative(vault, path),
      });
    }
  }
}

// Priority first: files touched by the promotion tag.
const isPriority = (c) => c.tags.some((t) => t === "curate" || t.endsWith("/curate") || tagMap[t]?.priority);
found.sort((a, b) => Number(isPriority(b)) - Number(isPriority(a)));

console.log(`vault: ${subfolder}`);
console.log(`urls found: ${found.length} new (${skippedKnown.count} already known, skipped)`);
console.log("per tag:", JSON.stringify(tagCounts));
console.log("per month:", JSON.stringify(monthCounts));

if (!write) {
  console.log("dry-run: nothing written. Re-run with --write to emit candidates.");
  process.exit(0);
}

mkdirSync(join(intakeDir, "candidates"), { recursive: true });
const takenSlugs = new Set();
let written = 0;
for (const c of found) {
  let lens = [];
  let kind = "";
  for (const t of c.tags) {
    const short = t.includes("/") ? t.split("/").pop() : t;
    const mapped = tagMap[t] ?? tagMap[short];
    if (!mapped) continue;
    if (mapped.lens) lens.push(mapped.lens);
    if (mapped.kind && KINDS.includes(mapped.kind) && !kind) kind = mapped.kind;
  }
  lens = [...new Set(lens)];
  let slug = slugFromUrl(c.url);
  let i = 2;
  while (takenSlugs.has(slug)) slug = `${slugFromUrl(c.url)}-${i++}`;
  takenSlugs.add(slug);
  const front = [
    "---",
    `url: ${c.url}`,
    `kind: ${kind}`,
    `title: ${c.title.replace(/: /g, " - ")}`,
    "tagline: ",
    `lens: [${lens.join(", ")}]`,
    `tags: [${c.tags.map((t) => t.replace(/\//g, "-")).join(", ")}]`,
    "source: obsidian",
    `found: ${new Date().toISOString().slice(0, 10)}`,
    "score:",
    "  craft: 0",
    "  teachable: 0",
    "  durable: 0",
    "  distinct: 0",
    "  attributable: 0",
    "meta: {}",
    "featured: false",
    "---",
    "",
    "TODO: triage — gut pass, rubric, then write the curator's note here.",
    "",
    `Captured from ${c.file}:`,
    "",
    c.context,
    "",
  ].join("\n");
  writeFileSync(join(intakeDir, "candidates", `${slug}.md`), front);
  written++;
}
console.log(`wrote ${written} candidates to intake/candidates/`);
