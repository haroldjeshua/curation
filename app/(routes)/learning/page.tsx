import { EmptyState } from "../inspiration/page";

export default function page() {
  return (
    <section className="flex flex-col px-4 pb-12 pt-24">
      <div className="mb-12 space-y-2">
        <h2 className="text-3xl font-bold">Learning</h2>
        <p className="text-sm text-muted-foreground">
          Learning resources for anyone interested starting their design and
          development journey.
        </p>
      </div>

      <EmptyState />
    </section>
  );
}
