import { Badge } from "@/components/ui/badge";
import { EmptyState } from "../inspiration/page";

type ToolsCategory = {
  name: string;
};

const toolsCategories: ToolsCategory[] = [
  { name: "Design Tools" },
  { name: "Development Tools" },
  { name: "Productivity Tools" },
];

export default function page() {
  return (
    <section className="flex flex-col gap-4 px-4 pb-12 pt-24">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Tools</h2>
        <p className="text-sm text-muted-foreground">
          Toolkit for designers, developers, and product managers.
        </p>
      </div>

      <div className="mb-12 flex flex-row flex-wrap gap-2">
        {toolsCategories.map((toolCategory) => (
          <Badge key={toolCategory.name}>{toolCategory.name}</Badge>
        ))}
      </div>

      <EmptyState />
    </section>
  );
}
