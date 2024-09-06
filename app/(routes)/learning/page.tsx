import { Badge } from "@/components/ui/badge";
import { EmptyState } from "../inspiration/page";

type LearningCategory = {
  name: string;
};

const learningCategories: LearningCategory[] = [
  { name: "Design" },
  { name: "Design Engineering" },
  { name: "Software Engineering" },
  { name: "Tech Personalities" },
  { name: "YouTube Channels" },
  { name: "Courses" },
  { name: "Platforms" },
];

export default function page() {
  return (
    <section className="flex flex-col gap-4 px-4 pb-12 pt-24">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Learning</h2>
        <p className="text-sm text-muted-foreground">
          Learning resources for anyone interested starting their design and
          development journey.
        </p>
      </div>

      <div className="mb-12 flex flex-row flex-wrap gap-2">
        {learningCategories.map((learningCategory) => (
          <Badge key={learningCategory.name}>{learningCategory.name}</Badge>
        ))}
      </div>

      <EmptyState />
    </section>
  );
}
