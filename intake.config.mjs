// Single source of truth for the Obsidian → intake tag mapping.
// Edit this file (not the extractor scripts) when tags change meaning.
//
// ASSUMPTION (unconfirmed by Harv): #skills means agent skills/configs
// (SKILL.md, MCP, prompts). If it means "skills worth learning" instead,
// change the skills entry below to { kind: "reading" }.

export const tagMap = {
  craft: { lens: "craft" },
  deseng: { lens: "deseng" },
  delight: { lens: "delight" },
  skills: { kind: "skill" },
  // Promotion tag: extractor pulls these first, everything else is low-priority.
  curate: { priority: true },
};

// Folder names (lowercased, bookmarks) that guess a kind. First match wins.
// Anything unmatched leaves kind blank for manual triage.
export const folderKindHints = [
  { match: ["design system", "design-system", "ds "], kind: "system" },
  { match: ["blog", "newsletter", "reading", "essay"], kind: "reading" },
  { match: ["icon", "font", "librar", "component", "css"], kind: "library" },
  { match: ["skill", "agent", "mcp", "prompt"], kind: "skill" },
  { match: ["portfolio", "agency", "website", "inspiration", "site"], kind: "site" },
];
