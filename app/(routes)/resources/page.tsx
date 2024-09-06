import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";

type ResourcesCategory = {
  name: string;
};

const resourcesCategories: ResourcesCategory[] = [
  { name: "Design Resources" },
  { name: "Development Resources" },
  { name: "Productivity Resources" },
];

export default function page() {
  return (
    <section className="flex flex-col gap-4 px-4 pb-12 pt-24">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Resources</h2>
        <p className="text-sm text-muted-foreground">
          Resources for designers, developers, and product managers.
        </p>
      </div>

      <div className="mb-12 flex flex-row flex-wrap gap-2">
        {resourcesCategories.map((resourcesCategory) => (
          <Badge key={resourcesCategory.name}>{resourcesCategory.name}</Badge>
        ))}
      </div>

      <div className="hidden grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <h1>insert inspiration grid here</h1>
      </div>

      <EmptyState />
    </section>
  );
}
