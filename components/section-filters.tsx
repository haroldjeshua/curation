"use client";

import { useMemo, useState } from "react";
import type { Entry } from "@/lib/entries";
import { EmptyState } from "./empty-state";
import { EntryCard } from "./entry-card";

interface SectionFiltersProps {
  sectionSlug: string;
  entries: Entry[];
  facetField: string;
  facetLabel: string;
}

export function SectionFilters({ sectionSlug, entries, facetField, facetLabel }: SectionFiltersProps) {
  const [query, setQuery] = useState("");
  const [facet, setFacet] = useState<string | null>(null);

  const facetValues = useMemo(() => {
    const counts = new Map<string, number>();
    for (const entry of entries) {
      const value = entry.meta[facetField];
      if (typeof value === "string" && value.length > 0) {
        counts.set(value, (counts.get(value) ?? 0) + 1);
      }
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [entries, facetField]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((entry) => {
      if (facet !== null && entry.meta[facetField] !== facet) return false;
      if (q.length === 0) return true;
      const haystack = `${entry.title} ${entry.tagline} ${entry.tags.join(" ")}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [entries, facet, facetField, query]);

  return (
    <div>
      <div className="mt-8 flex flex-col gap-3">
        <div role="search">
          <label htmlFor={`${sectionSlug}-filter`} className="sr-only">
            Filter {sectionSlug} by title, tagline, or tag
          </label>
          <input
            id={`${sectionSlug}-filter`}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by title, tagline, or tag…"
            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-accent"
          />
        </div>
        {facetValues.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5" aria-label={`Filter by ${facetLabel}`}>
            <span className="mr-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              {facetLabel}
            </span>
            <button
              type="button"
              onClick={() => setFacet(null)}
              aria-pressed={facet === null}
              className={`rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                facet === null ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {facetValues.map(([value, count]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFacet((current) => (current === value ? null : value))}
                aria-pressed={facet === value}
                className={`rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                  facet === value ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {value} · {count}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <p aria-live="polite" className="mt-4 font-mono text-xs text-muted-foreground">
        {filtered.length} of {entries.length} entries
      </p>

      {filtered.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((entry) => (
            <EntryCard key={entry.id} entry={entry} sectionSlug={sectionSlug} />
          ))}
        </div>
      ) : (
        <div className="mt-4">
          <EmptyState title="Nothing matches." hint="Clear the filter or try another term." />
        </div>
      )}
    </div>
  );
}
