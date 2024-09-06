import { CircleSlash2 } from "lucide-react";

export function EmptyState() {
  return (
    <div className="relative flex min-h-[calc(100vh-215px)] flex-col items-center justify-center gap-4 border border-muted/10 px-4 pb-4">
      <div className="absolute left-0 top-0 size-4 border-l-2 border-t-2 border-border" />
      <div className="absolute right-0 top-0 size-4 border-r-2 border-t-2 border-border" />
      <div className="absolute bottom-0 left-0 size-4 border-b-2 border-l-2 border-border" />
      <div className="absolute bottom-0 right-0 size-4 border-b-2 border-r-2 border-border" />

      <CircleSlash2 className="size-16 text-muted" />
      <h2 className="text-center">This is currently under construction</h2>
    </div>
  );
}
