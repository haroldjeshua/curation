import Link from "next/link";
import { Globe, Layers, Newspaper, PackageOpen, Sparkles } from "lucide-react";
import { getEntryCount, sections } from "@/lib/entries";

const sectionIcons: Record<string, React.ReactNode> = {
  sites: <Globe className="size-10" strokeWidth={1} />,
  systems: <Layers className="size-10" strokeWidth={1} />,
  libraries: <PackageOpen className="size-10" strokeWidth={1} />,
  skills: <Sparkles className="size-10" strokeWidth={1} />,
  reading: <Newspaper className="size-10" strokeWidth={1} />,
};

export default function Home() {
  return (
    <>
      <section className="py-16 sm:py-24">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          A personal reference library
        </p>
        <h1 className="mt-3 max-w-2xl text-4xl font-medium tracking-tight sm:text-5xl">
          Things worth knowing, using, studying, and keeping around.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Curation is a reference library for design engineers. Each entry has a
          note that says why it is listed and what is worth stealing. Systems,
          Libraries, Reading and Skills are filled in. Sites follows in Phase 3.
        </p>
      </section>

      <section aria-label="Sections" className="pb-16 sm:pb-24">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {sections.map((section) => (
            <Link
              key={section.slug}
              href={`/${section.slug}`}
              className="group flex aspect-[9/16] w-52 shrink-0 flex-col rounded-xl bg-foreground/10 p-5 backdrop-blur transition-colors hover:bg-foreground/[0.15] sm:w-60"
            >
              <span aria-hidden="true" className="block text-foreground">
                {sectionIcons[section.slug]}
              </span>
              <span className="mt-auto block">
                <span className="block text-xl font-semibold tracking-tight transition-colors group-hover:text-accent">
                  {section.title}
                </span>
                <span className="mt-1 block font-mono text-xs text-muted-foreground">
                  {getEntryCount(section.slug)} entries
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
                  {section.description}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
