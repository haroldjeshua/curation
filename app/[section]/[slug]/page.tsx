import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntries, getEntry, getSection, sections } from "@/lib/entries";

export function generateStaticParams() {
  return sections.flatMap((s) =>
    getEntries(s.slug).map((e) => ({ section: s.slug, slug: e.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string; slug: string }>;
}): Promise<Metadata> {
  const { section: sectionSlug, slug } = await params;
  const entry = getEntry(sectionSlug, slug);
  if (!entry) return { title: "Not found" };
  return { title: entry.title, description: entry.tagline };
}

function humanize(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(", ");
  if (value === null || value === undefined) return "—";
  return String(value);
}

export default async function EntryPage({
  params,
}: {
  params: Promise<{ section: string; slug: string }>;
}) {
  const { section: sectionSlug, slug } = await params;
  const section = getSection(sectionSlug);
  const entry = getEntry(sectionSlug, slug);
  if (!section || !entry) notFound();

  const metaRows = Object.entries(entry.meta);

  return (
    <article className="w-full max-w-2xl py-12 sm:py-16">
      <nav aria-label="Breadcrumb">
        <Link
          href={`/${section.slug}`}
          className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent"
        >
          ← {section.title}
        </Link>
      </nav>

      <h1 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">{entry.title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{entry.tagline}</p>

      <a
        href={entry.url}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
      >
        Visit ↗
        <span className="sr-only">(opens in a new tab)</span>
      </a>

      <aside aria-label="Curator's note" className="mt-8 rounded-lg border bg-muted/50 p-5">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Curator&rsquo;s note
        </p>
        <p className="mt-2 text-sm leading-relaxed">{entry.note}</p>
      </aside>

      {entry.tags.length > 0 ? (
        <ul aria-label="Tags" className="mt-6 flex flex-wrap gap-1.5">
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

      {metaRows.length > 0 ? (
        <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t pt-6 font-mono text-xs">
          {metaRows.map(([key, value]) => (
            <div key={key} className="contents">
              <dt className="uppercase tracking-widest text-muted-foreground">{humanize(key)}</dt>
              <dd className="text-foreground">{formatValue(value)}</dd>
            </div>
          ))}
          <div className="contents">
            <dt className="uppercase tracking-widest text-muted-foreground">Reviewed</dt>
            <dd className="text-foreground">{entry.reviewed_at}</dd>
          </div>
        </dl>
      ) : null}
    </article>
  );
}
