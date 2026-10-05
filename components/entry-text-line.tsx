"use client";

import Link from "next/link";
import type { Entry } from "@/lib/entries";

export function EntryTextLine({ entry, sectionSlug }: { entry: Entry; sectionSlug: string }) {
  return (
    <p className="border-t py-2 text-sm leading-relaxed">
      <Link href={`/${sectionSlug}/${entry.slug}`} className="font-medium transition-colors hover:text-accent">
        {entry.title}
      </Link>
      <span className="text-muted-foreground"> — {entry.tagline}</span>
    </p>
  );
}
