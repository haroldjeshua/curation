import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/empty-state";
import { SectionFilters } from "@/components/section-filters";
import { getEntries, getSection, sections } from "@/lib/entries";

const facets: Record<string, { field: string; label: string }> = {
  sites: { field: "type", label: "Type" },
  systems: { field: "focus", label: "Focus" },
  libraries: { field: "category", label: "Category" },
  skills: { field: "type", label: "Type" },
  reading: { field: "format", label: "Format" },
};

export function generateStaticParams() {
  return sections.map((s) => ({ section: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section: slug } = await params;
  const section = getSection(slug);
  return { title: section ? section.title : "Not found" };
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: slug } = await params;
  const section = getSection(slug);
  if (!section) notFound();

  const entries = getEntries(slug);
  const facet = facets[slug] ?? { field: "type", label: "Type" };

  return (
    <section className="py-12 sm:py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Section
      </p>
      <h1 className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl">{section.title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        {section.description}
      </p>

      {entries.length > 0 ? (
        <SectionFilters
          sectionSlug={slug}
          entries={entries}
          facetField={facet.field}
          facetLabel={facet.label}
        />
      ) : (
        <div className="mt-8">
          <EmptyState title="Nothing published here yet." hint="Check back after the next curation pass." />
        </div>
      )}
    </section>
  );
}
