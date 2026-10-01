// Generates the machine surface from content/*.json. Runs on `prebuild`
// (every deploy) and manually via `pnpm generate-surface`.
// Fails the build if any published entry breaks the editorial rule:
// no note, no entry.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = join(root, "content");
const publicDir = join(root, "public");

const kinds = [
  { kind: "site", file: "sites.json", section: "sites", title: "Sites" },
  { kind: "system", file: "systems.json", section: "systems", title: "Systems" },
  { kind: "library", file: "libraries.json", section: "libraries", title: "Libraries" },
  { kind: "skill", file: "skills.json", section: "skills", title: "Skills" },
  { kind: "reading", file: "reading.json", section: "reading", title: "Reading" },
];

const errors = [];
const published = [];

for (const { kind, file, section } of kinds) {
  const entries = JSON.parse(readFileSync(join(contentDir, file), "utf-8"));
  const seen = new Set();
  for (const e of entries) {
    if (e.kind !== kind) errors.push(`${file}: entry ${e.id} has kind ${e.kind}, expected ${kind}`);
    if (seen.has(e.slug)) errors.push(`${file}: duplicate slug ${e.slug}`);
    seen.add(e.slug);
    if (e.status !== "published") continue;
    for (const field of ["title", "url", "tagline", "note"]) {
      if (typeof e[field] !== "string" || e[field].trim().length === 0) {
        errors.push(`${file}: published entry ${e.slug} is missing ${field}`);
      }
    }
    published.push({ ...e, section });
  }
}

if (errors.length > 0) {
  console.error("machine surface: validation failed");
  for (const err of errors) console.error(`  - ${err}`);
  process.exit(1);
}

const generatedAt = new Date().toISOString().slice(0, 10);
const counts = Object.fromEntries(kinds.map(({ section }) => [section, 0]));
for (const e of published) counts[e.section] += 1;

// llms.txt
const lines = [
  "# Curation",
  "",
  "> A personal, annotated reference library for design engineers. Every entry carries a curator's note.",
  `> Generated ${generatedAt} from the same source as the human site. ${published.length} published entries.`,
  "",
];
for (const { section, title } of kinds) {
  lines.push(`## ${title}`, "");
  for (const e of published.filter((p) => p.section === section)) {
    lines.push(`- [${e.title}](${e.url}) — ${e.tagline}`);
    lines.push(`  Note: ${e.note}`);
    if (e.tags?.length > 0) lines.push(`  Tags: ${e.tags.join(", ")}`);
  }
  lines.push("");
}
lines.push("Suggest an entry: currently via the curator directly (public form lands in Phase 4).", "");
mkdirSync(publicDir, { recursive: true });
writeFileSync(join(publicDir, "llms.txt"), lines.join("\n"));

// entries.json
writeFileSync(
  join(publicDir, "entries.json"),
  JSON.stringify({ generated_at: generatedAt, counts, entries: published }, null, 2) + "\n",
);

// per-entry Markdown
for (const e of published) {
  const meta = Object.entries(e.meta ?? {})
    .map(([k, v]) => `- ${k}: ${Array.isArray(v) ? v.join(", ") : String(v)}`)
    .join("\n");
  const md = [
    `# ${e.title}`,
    "",
    `> ${e.tagline}`,
    "",
    `- URL: ${e.url}`,
    `- Section: ${e.section}`,
    `- Tags: ${(e.tags ?? []).join(", ") || "—"}`,
    meta,
    `- Reviewed: ${e.reviewed_at}`,
    "",
    "## Curator's note",
    "",
    e.note,
    "",
  ].join("\n");
  const dir = join(publicDir, e.section);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${e.slug}.md`), md);
}

console.log(
  `machine surface: ${published.length} entries → public/llms.txt, public/entries.json, ${published.length} Markdown files`,
);
