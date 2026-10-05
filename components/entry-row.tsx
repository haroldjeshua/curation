"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Entry } from "@/lib/entries";

export function EntryRow({
  entry,
  sectionSlug,
  index,
}: {
  entry: Entry;
  sectionSlug: string;
  index: number;
}) {
  return (
    <Link
      href={`/${sectionSlug}/${entry.slug}`}
      className="group flex items-baseline gap-4 border-t py-3"
    >
      <span aria-hidden="true" className="w-8 shrink-0 font-mono text-xs text-muted-foreground">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium tracking-tight transition-colors group-hover:text-accent">
          {entry.title}
        </span>
        <span className="block truncate text-sm text-muted-foreground">{entry.tagline}</span>
        {entry.lens.length > 0 ? (
          <span className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {entry.lens.map((lens) => (
              <span key={lens}>◆ {lens}</span>
            ))}
            <span>rev. {entry.reviewed_at}</span>
          </span>
        ) : null}
      </span>
      {entry.tags.length > 0 ? (
        <span aria-label="Tags" className="hidden shrink-0 gap-1.5 md:flex">
          {entry.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded border px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </span>
      ) : null}
      <ArrowUpRight
        aria-hidden="true"
        className="size-4 shrink-0 self-center text-muted-foreground transition-colors group-hover:text-accent"
      />
    </Link>
  );
}
