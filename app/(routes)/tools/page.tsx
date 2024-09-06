import { EmptyState } from "../inspiration/page";

export default function page() {
  return (
    <section className="flex flex-col px-4 pb-12 pt-24">
      <div className="mb-12 space-y-2">
        <h2 className="text-3xl font-bold">Tools</h2>
        <p className="text-sm text-muted-foreground">
          Toolkit for designers, developers, and product managers.
        </p>
      </div>

      <div className="hidden grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <h1>insert inspiration grid here</h1>
      </div>

      <EmptyState />
    </section>
  );
}
