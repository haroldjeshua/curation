import { CircleSlash2 } from "lucide-react";

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="relative flex flex-col items-center justify-center gap-4 border px-4 py-16">
      <div aria-hidden="true" className="absolute left-0 top-0 size-4 border-l-2 border-t-2 border-border" />
      <div aria-hidden="true" className="absolute right-0 top-0 size-4 border-r-2 border-t-2 border-border" />
      <div aria-hidden="true" className="absolute bottom-0 left-0 size-4 border-b-2 border-l-2 border-border" />
      <div aria-hidden="true" className="absolute bottom-0 right-0 size-4 border-b-2 border-r-2 border-border" />
      <CircleSlash2 className="size-10 text-muted-foreground" strokeWidth={1} />
      <div className="text-center">
        <p className="text-sm font-medium">{title}</p>
        {hint ? <p className="mt-1 text-sm text-muted-foreground">{hint}</p> : null}
      </div>
    </div>
  );
}
