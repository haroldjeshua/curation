const navlinks = [
  { name: "Inspiration", href: "/" },
  { name: "Tools", href: "/" },
  { name: "Resources", href: "/" },
  { name: "Learning", href: "/" },
  { name: "Blogs", href: "/" },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <section className="w-full px-4 pb-12 pt-24">
        <h1 className="text-5xl font-bold">Curation</h1>
        <p>Curated design inspiration</p>
      </section>

      <section className="relative flex min-h-[calc(100vh-216px)] w-full flex-row flex-nowrap gap-4 overflow-y-auto px-4 pb-4">
        {navlinks.map((link) => (
          <div
            key={link.name}
            className="flex h-auto w-1/3 min-w-44 flex-col items-center justify-center rounded-xl bg-foreground/15 backdrop-blur transition-colors ease-linear hover:bg-foreground/25 supports-[backdrop-filter]:bg-foreground/15"
          >
            <a
              href={link.href}
              className="flex size-full flex-col items-center justify-center p-4"
            >
              {link.name}
            </a>
          </div>
        ))}
      </section>
    </main>
  );
}
