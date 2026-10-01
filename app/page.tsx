import Link from "next/link";
import { Globe, Layers, Newspaper, PackageOpen, Sparkles } from "lucide-react";
import { getEntryCount, sections } from "@/lib/entries";

const sectionIcons: Record<string, React.ReactNode> = {
  sites: <Globe className="size-12" strokeWidth={1} />,
  systems: <Layers className="size-12" strokeWidth={1} />,
  libraries: <PackageOpen className="size-12" strokeWidth={1} />,
  skills: <Sparkles className="size-12" strokeWidth={1} />,
  reading: <Newspaper className="size-12" strokeWidth={1} />,
};

export default function Home() {
  return (
    <>
      <section className="py-16 sm:py-24">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          A personal reference library
        </p>
        <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Things worth knowing, using, studying, and keeping around.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Curation is a small, opinionated library for design engineers. Every entry
          carries a curator&rsquo;s note — what it is, why it&rsquo;s here, what to
          steal. Systems, Libraries, Reading, and Skills are curated below; Sites
          still shows seed content until the Phase&nbsp;3 gallery.
        </p>
      </section>

      <section aria-label="Sections" className="grid gap-4 pb-16 sm:grid-cols-2 lg:grid-cols-3 sm:pb-24">
        {sections.map((section) => (
          <Link
            key={section.slug}
            href={`/${section.slug}`}
            className="group rounded-xl bg-foreground/10 p-6 backdrop-blur transition-colors hover:bg-foreground/[0.15]"
          >
            <span aria-hidden="true" className="block text-foreground">
              {sectionIcons[section.slug]}
            </span>
            <span className="mt-4 flex items-baseline justify-between gap-3">
              <span className="text-xl font-semibold tracking-tight transition-colors group-hover:text-accent">
                {section.title}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {getEntryCount(section.slug)} entries
              </span>
            </span>
            <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
              {section.description}
            </span>
          </Link>
        ))}
      </section>
    </>
  );
}
