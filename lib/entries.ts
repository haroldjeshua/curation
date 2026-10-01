import { readFileSync } from "node:fs";
import { join } from "node:path";

// Server-only by convention: import only from Server Components, route
// handlers, or build-time code. Never from "use client" modules.

export type EntryKind = "site" | "system" | "library" | "skill" | "reading";
export type EntryStatus = "draft" | "published" | "archived";
export type EntrySource = "curator" | "suggestion" | "seed";

export interface Entry {
  id: string;
  slug: string;
  kind: EntryKind;
  title: string;
  url: string;
  tagline: string;
  /** Curator's note. Required to publish — no note, no entry. */
  note: string;
  tags: string[];
  status: EntryStatus;
  source: EntrySource;
  added_at: string;
  reviewed_at: string;
  link_status: "unknown" | "ok" | "dead";
  media?: { thumbnail?: string };
  meta: Record<string, unknown>;
}

export interface Section {
  slug: "sites" | "systems" | "libraries" | "skills" | "reading";
  title: string;
  description: string;
  kind: EntryKind;
}

export const sections: Section[] = [
  {
    slug: "sites",
    title: "Sites",
    description: "Websites, apps, and portfolios worth looking at — and stealing from.",
    kind: "site",
  },
  {
    slug: "systems",
    title: "Systems",
    description: "Company design systems with docs and tokens you can actually read.",
    kind: "system",
  },
  {
    slug: "libraries",
    title: "Libraries",
    description:
      "UI, icon, motion, type, and reference libraries worth building on.",
    kind: "library",
  },
  {
    slug: "skills",
    title: "Skills",
    description: "Agent skills and workflow knowledge for design engineering.",
    kind: "skill",
  },
  {
    slug: "reading",
    title: "Reading",
    description: "Blogs, newsletters, courses, and talks worth following.",
    kind: "reading",
  },
];

const contentDir = join(process.cwd(), "content");

const kindFiles: Record<EntryKind, string> = {
  site: "sites.json",
  system: "systems.json",
  library: "libraries.json",
  skill: "skills.json",
  reading: "reading.json",
};

function readKind(kind: EntryKind): Entry[] {
  const raw = readFileSync(join(contentDir, kindFiles[kind]), "utf-8");
  return JSON.parse(raw) as Entry[];
}

export function getSection(slug: string): Section | undefined {
  return sections.find((s) => s.slug === slug);
}

export function getEntries(sectionSlug: string): Entry[] {
  const section = getSection(sectionSlug);
  if (!section) return [];
  return readKind(section.kind).filter((e) => e.status === "published");
}

export function getEntry(sectionSlug: string, slug: string): Entry | undefined {
  const section = getSection(sectionSlug);
  if (!section) return undefined;
  return readKind(section.kind).find(
    (e) => e.slug === slug && e.status === "published",
  );
}

export function getEntryCount(sectionSlug: string): number {
  return getEntries(sectionSlug).length;
}
