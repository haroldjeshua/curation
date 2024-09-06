import { EmptyState } from "../inspiration/page";

export default function page() {
  return (
    <section className="flex flex-col px-4 pb-12 pt-24">
      <div className="mb-12 space-y-2">
        <h2 className="text-3xl font-bold">Blogs & Newsletters</h2>
        <p className="text-sm text-muted-foreground">
          Meticulously curated blogs and newsletters to keep you up to date.
        </p>
      </div>

      <EmptyState />
    </section>
  );
}
