"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, List, Rows3 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type { Entry } from "@/lib/entries";
import { EmptyState } from "./empty-state";
import { EntryCard } from "./entry-card";
import { EntryRow } from "./entry-row";
import { EntryTextLine } from "./entry-text-line";

export type SectionView = "cards" | "list" | "text";

const VIEWS: { value: SectionView; label: string; icon: React.ReactNode }[] = [
  { value: "cards", label: "Cards", icon: <LayoutGrid className="size-4" /> },
  { value: "list", label: "List", icon: <List className="size-4" /> },
  { value: "text", label: "Text", icon: <Rows3 className="size-4" /> },
];

interface SectionFiltersProps {
  sectionSlug: string;
  entries: Entry[];
  facetField: string;
  facetLabel: string;
  view: SectionView;
}

export function SectionFilters({ sectionSlug, entries, facetField, facetLabel, view }: SectionFiltersProps) {
  const [query, setQuery] = useState("");
  const [facet, setFacet] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const changeView = (next: SectionView) => {
    window.localStorage.setItem(`curation:view:${sectionSlug}`, next);
    router.replace(`${pathname}?view=${next}`, { scroll: false });
  };

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

      <div className="mt-4 flex items-center justify-between gap-3">
        <p aria-live="polite" className="font-mono text-xs text-muted-foreground">
          {filtered.length} of {entries.length} entries
        </p>
        <div role="group" aria-label="View options" className="flex shrink-0 rounded-md border">
          {VIEWS.map((v, i) => (
            <button
              key={v.value}
              type="button"
              onClick={() => changeView(v.value)}
              aria-pressed={view === v.value}
              aria-label={`${v.label} view`}
              title={`${v.label} view`}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs transition-colors ${
                i === 0 ? "rounded-l-[5px]" : ""
              } ${i === VIEWS.length - 1 ? "rounded-r-[5px]" : ""} ${
                view === v.value ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v.icon}
              <span className="hidden sm:inline">{v.label}</span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        view === "list" ? (
          <div className="mt-2 border-b">
            {filtered.map((entry, i) => (
              <EntryRow key={entry.id} entry={entry} sectionSlug={sectionSlug} index={i} />
            ))}
          </div>
        ) : view === "text" ? (
          <div className="mt-2 border-b">
            {filtered.map((entry) => (
              <EntryTextLine key={entry.id} entry={entry} sectionSlug={sectionSlug} />
            ))}
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((entry) => (
              <EntryCard key={entry.id} entry={entry} sectionSlug={sectionSlug} />
            ))}
          </div>
        )
      ) : (
        <div className="mt-4">
          <EmptyState title="Nothing matches." hint="Clear the filter or try another term." />
        </div>
      )}
    </div>
  );
}
