import Link from "next/link";
import { getEntries, sections } from "@/lib/entries";
import type { MenuItem } from "./command-menu";
import { CommandMenu } from "./command-menu";
import { Logo } from "./logo/logo";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const items: MenuItem[] = [
    { href: "/", label: "Home", group: "Sections" },
    ...sections.map((s) => ({ href: `/${s.slug}`, label: s.title, group: "Sections" })),
    ...sections.flatMap((s) =>
      getEntries(s.slug).map((e) => ({
        href: `/${s.slug}/${e.slug}`,
        label: e.title,
        hint: s.title,
        group: "Entries",
        keywords: `${e.tagline} ${e.tags.join(" ")} ${e.note}`,
      })),
    ),
  ];

  return (
    <header className="fixed left-4 top-4 z-40 flex h-11 max-w-[calc(100vw-2rem)] items-center gap-1 rounded-lg border bg-background/60 px-3 backdrop-blur-md">
      <Link
        href="/"
        aria-label="Curation home"
        title="Curation"
        className="mr-1 shrink-0 rounded-md p-1 transition-colors hover:bg-muted"
      >
        <Logo className="size-5 -rotate-90" />
      </Link>
      <nav aria-label="Sections" className="hidden items-center gap-1 md:flex">
        {sections.map((s) => (
          <Link
            key={s.slug}
            href={`/${s.slug}`}
            className="shrink-0 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {s.title}
          </Link>
        ))}
      </nav>
      <MobileNav sections={sections} />
      <div aria-hidden="true" className="h-5 w-px shrink-0 bg-border" />
      <div className="flex shrink-0 items-center gap-1">
        <CommandMenu items={items} />
        <ThemeToggle />
      </div>
    </header>
  );
}
