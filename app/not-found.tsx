import Link from "next/link";

export default function NotFound() {
  return (
    <section className="w-full max-w-2xl py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Nothing curated here.</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        This entry doesn&rsquo;t exist — or hasn&rsquo;t earned its note yet.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-md border px-4 py-2 text-sm transition-colors hover:bg-muted"
      >
        Back to the library
      </Link>
    </section>
  );
}
