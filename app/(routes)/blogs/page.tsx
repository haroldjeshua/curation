import { Badge } from "@/components/ui/badge";
import { EmptyState } from "../inspiration/page";

type BlogsCategory = {
  name: string;
};

const blogsCategories: BlogsCategory[] = [
  { name: "Design" },
  { name: "Development" },
  { name: "Productivity" },
  { name: "Newsletters" },
  { name: "Articles" },
];

export default function page() {
  return (
    <section className="flex flex-col gap-4 px-4 pb-12 pt-24">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Blogs & Newsletters</h2>
        <p className="text-sm text-muted-foreground">
          Meticulously curated blogs and newsletters to keep you up to date.
        </p>
      </div>

      <div className="mb-12 flex flex-row flex-wrap gap-2">
        {blogsCategories.map((blogsCategory) => (
          <Badge key={blogsCategory.name}>{blogsCategory.name}</Badge>
        ))}
      </div>

      <EmptyState />
    </section>
  );
}
