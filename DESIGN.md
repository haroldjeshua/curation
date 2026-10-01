# Curation — DESIGN.md

> Visual direction for v1. Decided in Phase 1; update here, not in scattered classNames. Quiet interface, content leads.

## Palette

Warm paper neutrals + one editorial accent. No rainbow, no gradients in v1.

| Token | Light | Dark | Use |
|---|---|---|---|
| `background` | `#FAFAF9` | `#131211` | Page |
| `foreground` | `#1C1917` | `#EDEBE7` | Body text |
| `muted` | `#F0EEEA` | `#1F1D1C` | Subtle surfaces, wells |
| `muted-foreground` | `#78716C` | `#A8A29E` | Secondary text, meta |
| `border` | `#E4E1DC` | `#2B2927` | Hairlines, card edges |
| `accent` | `#C2410C` | `#F97316` | Links, focus, active states only |
| `accent-foreground` | `#FAFAF9` | `#131211` | Text on accent |

Rules: body copy is only `foreground` / `muted-foreground`. Accent is never a background wash — links, markers, focus rings. Dark mode is class-based (`.dark` via `next-themes`), tokens swap 1:1.

## Type

- Sans: Geist Sans (`--font-geist-sans`), Mono: Geist Mono for meta/labels/data.
- Titles `tracking-tight`, meta/labels uppercase `tracking-widest` at 11–12px in mono.
- No custom scale: Tailwind defaults (`text-sm` body, `text-3xl/4xl` titles). Entry notes set at `text-sm/relaxed`.

## Density

- Shell is full-width and left-aligned — no centered container — to match the top-left header pill. Reading measure `max-w-2xl` on prose only; card grids run full width (2 cols → 3 on `lg`).
- Section rhythm `py-16/24`; card padding `p-5/6`; gaps `gap-4/6`. Air over chrome.

## Motion

- 150–200ms `ease-out` on hover/focus only. No entrance choreography, no layout animation in v1.
- `prefers-reduced-motion` kills all transitions globally (see `globals.css`).

## Brand mark

- The 2024 arch mark (`components/logo/logo.tsx`), always shown rotated −90° in the header pill. Gradient `#CA0C64 → #FFB6E1` is part of the mark — never recolor, works on both themes as-is.
- Glass language: floating header pill (`bg-background/60 backdrop-blur-md`), section cards and entry cards as translucent washes (`bg-foreground/10 → /[0.15]`, `rounded-xl`, no borders), corner-tick empty states. Chrome stays quiet; the wash is the brand.
