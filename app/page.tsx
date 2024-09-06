import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { siteConfig } from "@/config/site";

export default function Home() {
  return (
    <>
      <section className="w-full px-4 pb-12 pt-24">
        <h1 className="text-5xl font-bold">Curation</h1>
        <p>Curated design inspiration and resources</p>
      </section>

      <ScrollArea>
        <section className="relative flex min-h-[calc(100vh-216px)] w-full flex-row flex-nowrap gap-4 overflow-y-auto px-4 pb-4">
          {siteConfig.routes.map((link) => (
            <div
              key={link.name}
              className="flex h-auto w-1/3 min-w-44 flex-col items-center justify-center rounded-xl bg-foreground/15 backdrop-blur transition-colors ease-linear hover:bg-foreground/25 supports-[backdrop-filter]:bg-foreground/15"
            >
              <a
                href={link.href}
                className="flex size-full flex-col items-center justify-center p-4 text-center"
              >
                {link.name}
              </a>
            </div>
          ))}
        </section>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
}
