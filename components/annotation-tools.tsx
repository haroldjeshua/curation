"use client";

import { useEffect, useState, type ElementType } from "react";

// Dev-only annotation toolbar (bottom-right, toggle with Cmd/Ctrl+Shift+F).
// Dynamically imported behind a NODE_ENV gate so it never ships
// in the production bundle and renders nothing outside development.
export function AnnotationTools() {
  const [Agentation, setAgentation] = useState<ElementType | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      import("agentation").then((mod) => setAgentation(() => mod.Agentation));
    }
  }, []);

  if (Agentation === null) return null;
  // endpoint syncs browser annotations to the local agentation-mcp
  // server, so the agent can read and resolve them directly.
  return <Agentation endpoint="http://localhost:4747" />;
}
