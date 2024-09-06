import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";

type InspirationTag = {
  name: string;
};

const inspirationTags: InspirationTag[] = [
  { name: "Product Websites" },
  { name: "Digital Agencies" },
  { name: "Portfolios" },
  { name: "Mobile Apps" },
  { name: "E-commerce" },
  { name: "Marketing" },
];

export default function page() {
  return (
    <section className="flex flex-col gap-4 px-4 pb-12 pt-24">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Inspiration</h2>
        <p className="text-sm text-muted-foreground">
          Product websites, digital agencies, portfolios, mobile apps, and more.
        </p>
      </div>

      <div className="mb-12 flex flex-row flex-wrap gap-2">
        {inspirationTags.map((tag) => (
          <Badge key={tag.name}>{tag.name}</Badge>
        ))}
      </div>

      <EmptyState />
    </section>
  );
}
