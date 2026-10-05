"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { SectionView } from "./section-filters";

// localStorage fallback for the URL-driven view toggle: on first load
// without an explicit ?view=, re-apply the remembered per-section choice.
export function ViewRestore({
  sectionSlug,
  serverView,
}: {
  sectionSlug: string;
  serverView: SectionView;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const current = new URLSearchParams(window.location.search).get("view");
    if (current === "cards" || current === "list" || current === "text") return;
    const saved = window.localStorage.getItem(`curation:view:${sectionSlug}`);
    if ((saved === "cards" || saved === "list" || saved === "text") && saved !== serverView) {
      router.replace(`${pathname}?view=${saved}`, { scroll: false });
    }
  }, [pathname, router, sectionSlug, serverView]);

  return null;
}
