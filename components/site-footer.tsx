export function SiteFooter() {
  return (
    <footer className="border-t bg-background/50">
      <div className="flex w-full items-center justify-between gap-2 px-4 py-3">
        <p className="font-mono text-[11px] text-muted-foreground">
          © 2026 Harv · All rights reserved.
        </p>
        <p className="hidden font-mono text-[11px] text-muted-foreground sm:block">
          No entry ships without a note.
        </p>
      </div>
    </footer>
  );
}
