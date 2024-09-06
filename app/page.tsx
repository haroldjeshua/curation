export default function Home() {
  return (
    <main className="min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)]">
      <section className="mx-auto w-full max-w-screen-xl px-4 py-16">
        <h1 className="text-5xl font-bold">Curation</h1>
        <p>Curated design inspiration</p>
      </section>

      <section className="mx-auto w-full max-w-screen-xl px-4 grid grid-cols-1 gap-4 md:grid-cols-1">
        <div>latest</div>
        <div>inspiration</div>
        <div>tools</div>
        <div>resources</div>
        <div>learning</div>
        <div>blogs</div>
      </section>
    </main>
  );
}
