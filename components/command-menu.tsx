"use client";

import { Command } from "cmdk";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface MenuItem {
  href: string;
  label: string;
  hint?: string;
  group?: string;
  keywords?: string;
}

export function CommandMenu({ items }: { items: MenuItem[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  const groups = useMemo(() => {
    const order: string[] = [];
    const byGroup = new Map<string, MenuItem[]>();
    for (const item of items) {
      const name = item.group ?? "Results";
      if (!byGroup.has(name)) {
        byGroup.set(name, []);
        order.push(name);
      }
      byGroup.get(name)?.push(item);
    }
    return order.map((name) => ({ name, items: byGroup.get(name) ?? [] }));
  }, [items]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Search the library"
      >
        <Search className="size-4" />
        <span className="hidden sm:inline">Search…</span>
        <kbd className="hidden rounded border px-1 font-mono text-[11px] sm:inline">⌘K</kbd>
      </button>
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Search the library"
        className="fixed left-1/2 top-[20vh] z-50 w-[min(36rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-lg border bg-background shadow-xl"
        overlayClassName="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-[2px]"
      >
        <Command.Input
          placeholder="Search entries by title, tagline, or tag…"
          className="w-full border-b bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
        />
        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-center text-sm text-muted-foreground">
            No matches. Try a tag like “tokens” or “css”.
          </Command.Empty>
          {groups.map((group) => (
            <Command.Group
              key={group.name}
              heading={group.name}
              className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted-foreground"
            >
              {group.items.map((item) => (
                <Command.Item
                  key={item.href}
                  value={`${item.label} ${item.hint ?? ""} ${item.keywords ?? ""}`}
                  onSelect={() => go(item.href)}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 text-sm aria-selected:bg-muted aria-selected:text-foreground"
                >
                  <span className="truncate">{item.label}</span>
                  {item.hint ? (
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">{item.hint}</span>
                  ) : null}
                </Command.Item>
              ))}
            </Command.Group>
          ))}
        </Command.List>
      </Command.Dialog>
    </>
  );
}
