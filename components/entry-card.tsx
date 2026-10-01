"use client";

import Link from "next/link";
import type { Entry } from "@/lib/entries";

export function EntryCard({ entry, sectionSlug }: { entry: Entry; sectionSlug: string }) {
  return (
    <article className="group rounded-xl bg-foreground/[0.06] p-5 backdrop-blur transition-colors hover:bg-foreground/[0.12]">
      <h3 className="text-base font-semibold tracking-tight">
        <Link href={`/${sectionSlug}/${entry.slug}`} className="transition-colors group-hover:text-accent">
          {entry.title}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">{entry.tagline}</p>
      {entry.tags.length > 0 ? (
        <ul aria-label="Tags" className="mt-3 flex flex-wrap gap-1.5">
          {entry.tags.map((tag) => (
            <li
              key={tag}
              className="rounded border px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
