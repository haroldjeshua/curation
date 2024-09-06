const navlinks = [
  { name: "Latest", href: "/" },
  { name: "Inspiration", href: "/" },
  { name: "Tools", href: "/" },
  { name: "Resources", href: "/" },
  { name: "Learning", href: "/" },
  { name: "Blogs", href: "/" },
];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <section className="w-full px-4 pt-24 pb-12">
        <h1 className="text-5xl font-bold">Curation</h1>
        <p>Curated design inspiration</p>
      </section>

      <section className="min-h-[calc(100vh-216px)] relative flex w-full flex-row flex-nowrap gap-2 pl-4 overflow-y-auto">
        {navlinks.map((link) => (
          <div
            key={link.name}
            className="flex min-w-44 h-64 flex-col items-center justify-center rounded-xl bg-foreground/15 backdrop-blur transition-colors ease-linear hover:bg-foreground/25 supports-[backdrop-filter]:bg-foreground/15"
          >
            <a
              href={link.href}
              className="flex size-full flex-col items-center justify-center p-8"
            >
              {link.name}
            </a>
          </div>
        ))}
      </section>
    </main>
  );
}
