// Extract intake candidates from exported browser bookmarks.
// Usage: pnpm intake:bookmarks <file.html|file.json> [--write] [--check]
// Accepts Netscape bookmark HTML (bookmark-manager export) or a Chromium
// profile Bookmarks JSON copy (never read the live file while running).
// Dry-run by default: prints counts, writes nothing.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { folderKindHints } from "../intake.config.mjs";
import { collectIntake, intakeDir, normalizeUrl, readDb } from "./intake-lib.mjs";

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

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

function parseHtml(text) {
  // Netscape format: <DT><H3>Folder</H3><DL>…<DT><A HREF="url">Title</A>
  const out = [];
  const stack = [];
  let pendingFolder = null;
  const token = /<(DL|\/DL|H3|A)(\s[^>]*)?>([^<]*)/gi;
  let m;
  while ((m = token.exec(text)) !== null) {
    const tag = m[1].toUpperCase();
    if (tag === "H3") pendingFolder = m[3].trim();
    else if (tag === "DL") {
      if (pendingFolder) {
        stack.push(pendingFolder);
        pendingFolder = null;
      } else stack.push("");
    } else if (tag === "/DL") stack.pop();
    else if (tag === "A") {
      const href = /HREF="([^"]+)"/i.exec(m[2] ?? "")?.[1];
      if (href) out.push({ url: href, title: m[3].trim(), folder: stack.filter(Boolean).join(" / ") });
    }
  }
  return out;
}

function parseChromiumJson(text) {
  const roots = JSON.parse(text).roots ?? {};
  const out = [];
  const walk = (node, folder) => {
    for (const child of node.children ?? []) {
      if (child.type === "folder") walk(child, folder ? `${folder} / ${child.name}` : child.name);
      else if (child.type === "url" && child.url) out.push({ url: child.url, title: child.name ?? "", folder });
    }
  };
  for (const root of Object.values(roots)) walk(root, "");
  return out;
}

function dropReason(url) {
  let u;
  try {
    u = new URL(url);
  } catch {
    return "unparseable";
  }
  if (!["http:", "https:"].includes(u.protocol)) return "non-http protocol";
  const host = u.hostname.toLowerCase();
  if (host === "localhost" || host.startsWith("127.") || host.startsWith("192.168.") || host.startsWith("10.") || host.endsWith(".local")) {
    return "local/private";
  }
  const full = `${host}${u.pathname}`.toLowerCase();
  if (/(^|\/)search(\/|$)/.test(u.pathname.toLowerCase()) && u.search) return "search results";
  if (["google.", "bing.", "duckduckgo.", "yahoo.", "yandex."].some((d) => host.includes(d))) return "search engine";
  if (/login|signin|sign-in|signup|sign-up|auth|account|dashboard|settings/.test(full)) return "auth/app page";
  return null;
}

function guessKind(folder, url) {
  const hay = `${folder} ${url}`.toLowerCase();
  for (const { match, kind } of folderKindHints) {
    if (match.some((m) => hay.includes(m))) return kind;
  }
  return "";
}

async function checkLink(url, timeoutMs = 8000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    let res = await fetch(url, { method: "HEAD", redirect: "follow", signal: ctrl.signal });
    if (res.status === 405 || res.status === 501) {
      res = await fetch(url, { method: "GET", redirect: "follow", signal: ctrl.signal });
    }
    return res.ok ? "ok" : `dead (${res.status})`;
  } catch (e) {
    return `dead (${e.cause?.code ?? e.name})`;
  } finally {
    clearTimeout(timer);
  }
}

const args = parseArgs(process.argv.slice(2));
const file = args._[0];
const write = args.write === "true" || args.write === true;
const check = args.check === "true" || args.check === true;

if (!file || !existsSync(file)) {
  console.error("usage: pnpm intake:bookmarks <bookmarks.html|Bookmarks.json> [--write] [--check]");
  process.exit(1);
}

const raw = readFileSync(file, "utf-8");
const parsed = raw.trimStart().startsWith("{") ? parseChromiumJson(raw) : parseHtml(raw);

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

const dropped = {};
const kept = [];
for (const b of parsed) {
  const reason = dropReason(b.url);
  if (reason) {
    dropped[reason] = (dropped[reason] ?? 0) + 1;
    continue;
  }
  let normalized;
  try {
    normalized = normalizeUrl(b.url);
  } catch {
    dropped["unparseable"] = (dropped["unparseable"] ?? 0) + 1;
    continue;
  }
  if (knownUrls.has(normalized)) {
    dropped["already known"] = (dropped["already known"] ?? 0) + 1;
    continue;
  }
  knownUrls.add(normalized);
  kept.push({ ...b, url: normalized, kind: guessKind(b.folder, normalized) });
}

const kindCounts = {};
for (const k of kept) kindCounts[k.kind || "(blank)"] = (kindCounts[k.kind || "(blank)"] ?? 0) + 1;

console.log(`bookmarks: ${parsed.length} total, ${kept.length} kept`);
console.log("dropped:", JSON.stringify(dropped));
console.log("guessed kind:", JSON.stringify(kindCounts));

if (check) {
  console.log("checking links (this takes a while)…");
  const pool = 5;
  for (let i = 0; i < kept.length; i += pool) {
    const batch = kept.slice(i, i + pool);
    const results = await Promise.all(batch.map((k) => checkLink(k.url)));
    results.forEach((r, j) => {
      batch[j].linkStatus = r;
    });
  }
  const dead = kept.filter((k) => k.linkStatus !== "ok").length;
  console.log(`link check: ${kept.length - dead} ok, ${dead} dead`);
}

if (!write) {
  console.log("dry-run: nothing written. Re-run with --write to emit candidates.");
  process.exit(0);
}

mkdirSync(join(intakeDir, "candidates"), { recursive: true });
const takenSlugs = new Set();
let written = 0;
for (const k of kept) {
  const base = slugify(k.title) || slugify(new URL(k.url).hostname.replace(/^www\./, ""));
  let slug = base || "link";
  let i = 2;
  while (takenSlugs.has(slug)) slug = `${base}-${i++}`;
  takenSlugs.add(slug);
  const front = [
    "---",
    `url: ${k.url}`,
    `kind: ${k.kind}`,
    `title: ${(k.title || k.url).replace(/: /g, " - ")}`,
    "tagline: ",
    "lens: []",
    "tags: []",
    "source: brave",
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
    k.folder ? `Bookmark folder: ${k.folder}` : "",
    k.linkStatus ? `Link check: ${k.linkStatus}` : "",
    "",
  ]
    .filter((l) => l !== null)
    .join("\n");
  writeFileSync(join(intakeDir, "candidates", `${slug}.md`), front);
  written++;
}
console.log(`wrote ${written} candidates to intake/candidates/`);
