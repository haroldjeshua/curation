// Shared intake helpers: frontmatter parsing, URL normalization,
// kind/meta rules. Imported by intake-validate and intake-seed.
// No dependencies — hand-rolled subset-YAML (scalars, inline arrays,
// one level of nesting) so the intake format never needs a parser dep.

import { mkdirSync, readFileSync, readdirSync, existsSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const root = join(dirname(fileURLToPath(import.meta.url)), "..");
export const contentDir = join(root, "content");
export const intakeDir = join(root, "intake");

export const KINDS = ["site", "system", "library", "skill", "reading"];

export const KIND_FILES = {
  site: "sites.json",
  system: "systems.json",
  library: "libraries.json",
  skill: "skills.json",
  reading: "reading.json",
};

export const KIND_SECTION = {
  site: "sites",
  system: "systems",
  library: "libraries",
  skill: "skills",
  reading: "reading",
};

export const LENSES = ["craft", "deseng", "delight"];

// null = required free string; array = required enum.
export const KIND_META = {
  site: { type: ["product", "portfolio", "agency", "app"] },
  system: { org: null, docs_url: null },
  library: { category: ["ui", "icons", "motion", "fonts", "3d", "reference"] },
  skill: { type: ["mcp", "repo", "guide", "spec", "workflow"] },
  reading: { format: ["blog", "newsletter", "magazine", "course", "talk"] },
};

export const SCORE_KEYS = ["craft", "teachable", "durable", "distinct", "attributable"];
export const SCORE_THRESHOLD = 8;

export const CAPS = { sites: 30, systems: 15, libraries: 15, skills: 10, reading: 20 };

function parseScalar(raw) {
  const v = raw.trim();
  if (v === "true") return true;
  if (v === "false") return false;
  if (/^-?\d+$/.test(v)) return Number(v);
  if (v.startsWith("[") && v.endsWith("]")) {
    const inner = v.slice(1, -1).trim();
    if (inner === "") return [];
    return inner.split(",").map((s) => parseScalar(s));
  }
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  return v;
}

function stripComment(line) {
  // Template files carry "  # hint" suffixes; real values rarely
  // contain two spaces followed by #. Documented limitation.
  return line.replace(/ {2,}#.*$/, "").replace(/\s+$/, "");
}

export function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: text.trim(), error: "missing frontmatter block" };
  const data = {};
  const lines = m[1].split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const line = stripComment(lines[i]);
    if (line.trim() === "") {
      i++;
      continue;
    }
    const indent = lines[i].search(/\S/);
    const colon = line.indexOf(":");
    if (colon === -1) {
      i++;
      continue;
    }
    const key = line.slice(0, colon).trim();
    const rest = line.slice(colon + 1).trim();
    if (rest === "") {
      const nested = {};
      i++;
      while (i < lines.length && lines[i].search(/\S/) > indent) {
        const child = stripComment(lines[i]);
        if (child.trim() !== "") {
          const c = child.indexOf(":");
          if (c !== -1) nested[child.slice(0, c).trim()] = parseScalar(child.slice(c + 1));
        }
        i++;
      }
      // No indented children: bare `key:` means empty string, not an
      // empty map (extractor output leaves unknown fields blank).
      data[key] = Object.keys(nested).length > 0 ? nested : "";
    } else {
      data[key] = parseScalar(rest);
      i++;
    }
  }
  return { data, body: m[2].trim() };
}

const TRACKING_PARAMS = /^(utm_|fbclid|gclid|gclsrc|mc_|igshid|igsh|vero_|_hs|msclkid|yclid|twclid|srsltid|gad_|wbraid|gbraid)/i;

export function normalizeUrl(raw) {
  const u = new URL(raw.trim());
  u.hash = "";
  for (const key of [...u.searchParams.keys()]) {
    if (TRACKING_PARAMS.test(key)) u.searchParams.delete(key);
  }
  let host = u.hostname.toLowerCase();
  if (host.startsWith("www.")) host = host.slice(4);
  u.hostname = host;
  u.pathname = u.pathname.replace(/\/+$/, "") || "/";
  return u.toString();
}

export function isValidSlug(slug) {
  return typeof slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export function readDb() {
  const entries = [];
  for (const kind of KINDS) {
    const file = join(contentDir, KIND_FILES[kind]);
    if (!existsSync(file)) continue;
    for (const e of JSON.parse(readFileSync(file, "utf-8"))) entries.push(e);
  }
  return entries;
}

export function collectIntake() {
  const files = [];
  for (const stage of ["candidates", "shortlist", "published"]) {
    const dir = join(intakeDir, stage);
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir).sort()) {
      if (!name.endsWith(".md")) continue;
      const path = join(dir, name);
      const { data, body, error } = parseFrontmatter(readFileSync(path, "utf-8"));
      files.push({ stage, path, slug: basename(name, ".md"), data, body, parseError: error });
    }
  }
  return files;
}

export function ensureDirs() {
  for (const d of [intakeDir, join(intakeDir, "candidates"), join(intakeDir, "shortlist"), join(intakeDir, "published"), join(intakeDir, "seeded")]) {
    mkdirSync(d, { recursive: true });
  }
}

// Per-file checks. Global checks (duplicates, caps) live in the validator.
export function validateFile(f, { strict }) {
  const errors = [];
  const warnings = [];
  const where = `${f.stage}/${f.slug}.md`;
  if (f.parseError) {
    errors.push(`${where}: ${f.parseError}`);
    return { errors, warnings };
  }
  const d = f.data;
  if (!isValidSlug(f.slug)) errors.push(`${where}: filename must be a slug (lowercase, hyphens)`);
  if (typeof d.url !== "string" || d.url.trim() === "") {
    errors.push(`${where}: missing url`);
  } else {
    try {
      normalizeUrl(d.url);
    } catch {
      errors.push(`${where}: invalid url`);
    }
  }
  if (!d.kind) {
    if (f.stage === "candidates") warnings.push(`${where}: kind blank — needs manual triage`);
    else errors.push(`${where}: missing kind`);
  } else if (!KINDS.includes(d.kind)) {
    errors.push(`${where}: unknown kind ${d.kind}`);
  } else {
    const rules = KIND_META[d.kind];
    const meta = d.meta && typeof d.meta === "object" ? d.meta : {};
    // Extractor output (candidates stage) legitimately has no meta yet —
    // triage fills it in. Enforce meta only once present or past candidates.
    const metaEmpty = Object.keys(meta).length === 0;
    if (!(f.stage === "candidates" && metaEmpty)) {
      for (const [field, rule] of Object.entries(rules)) {
        const v = meta[field];
        if (v === undefined || v === null || v === "") {
          errors.push(`${where}: meta.${field} required for kind ${d.kind}`);
        } else if (Array.isArray(rule) && !rule.includes(v)) {
          errors.push(`${where}: meta.${field} must be one of ${rule.join("|")}`);
        }
      }
    }
  }
  if (d.lens !== undefined) {
    const lenses = Array.isArray(d.lens) ? d.lens : [d.lens];
    for (const l of lenses) {
      if (!LENSES.includes(l)) errors.push(`${where}: lens must be craft|deseng|delight`);
    }
  }
  if (strict) {
    if (typeof d.title !== "string" || d.title.trim() === "") errors.push(`${where}: missing title`);
    if (typeof d.tagline !== "string" || d.tagline.trim() === "") errors.push(`${where}: missing tagline`);
    if (typeof f.body !== "string" || f.body.trim() === "") {
      errors.push(`${where}: missing curator's note (no note, no entry)`);
    }
    const score = d.score && typeof d.score === "object" ? d.score : {};
    let total = 0;
    for (const k of SCORE_KEYS) {
      const v = score[k];
      if (!Number.isInteger(v) || v < 0 || v > 2) {
        errors.push(`${where}: score.${k} must be 0, 1, or 2`);
      } else {
        total += v;
      }
    }
    if (total < SCORE_THRESHOLD) errors.push(`${where}: score ${total} below threshold ${SCORE_THRESHOLD}`);
    if (score.craft < 1 || score.teachable < 1) {
      errors.push(`${where}: craft and teachable must each be ≥ 1`);
    }
  }
  return { errors, warnings };
}
