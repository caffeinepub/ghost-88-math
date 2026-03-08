# Ghost-88.Math

## Current State
- Full game website with 116 games from quiz-77.pro
- Black background with neon-green accent color scheme
- Header is sticky at top (z-40)
- Popular bar is sticky below header (`sticky top-[57px] z-30`)
- All text uses foreground/muted-foreground tokens (mostly white/gray)
- No particle background effect
- Scanline texture overlay exists via `.scanline-bg::before`

## Requested Changes (Diff)

### Add
- Animated floating white particles canvas in the background that move around continuously (canvas-based, behind all content)

### Modify
- Popular bar: change from `sticky top-[57px]` to `sticky top-0 z-40` so it is pinned at the very top of the viewport (above the header, or reorder so popular bar comes first and header below — actually: make the popular bar itself stick to the top-most position, above the main content scroll area but below the header; the header stays at top-0 z-40, popular bar stays at top-[57px] z-30 BUT the intent is it should NOT scroll away with the page — it is already sticky, so confirm it truly stays fixed. The real fix: popular bar `sticky top-[57px]` likely means it scrolls until it hits 57px from top, which is correct. If the issue is it disappears on scroll, we need to verify the parent `div.relative.z-10` does not have overflow:hidden or similar. Remove any wrapping div that could break sticky positioning.)
- Actually the user says "only stay at the top" — the popular bar should be sticky/fixed at the top at all times. Move popular bar ABOVE the main header so it is the topmost fixed element. Header becomes `sticky top-[52px]`. Popular bar becomes `sticky top-0 z-50`.
- Entire website: ensure all text is white (`text-white` / foreground = pure white). Ensure background is pure black. Make muted-foreground tokens closer to white/light-gray (increase lightness). Category badge text should remain colored but readable. Card backgrounds remain very dark but text inside should be white.
- index.css: update `--foreground` and `--card-foreground` to full white (already `1 0 0`). Update `--muted-foreground` from `0.52` to `0.75` to make secondary text more visible white. Border tokens remain subtle.

### Remove
- Nothing removed

## Implementation Plan
1. In `index.css`: increase `--muted-foreground` lightness to ~0.80 so all secondary text appears clearly white/light. Adjust card/popover foreground to pure white if not already.
2. In `App.tsx`: reorder layout so `<PopularBar>` renders before `<header>`, change PopularBar sticky class to `sticky top-0 z-50`, change header sticky class to `sticky top-[52px] z-40`, update PopularBar `sticky top-[57px]` reference.
3. Add a `<ParticlesBackground>` React component using HTML5 Canvas + `requestAnimationFrame` that renders ~60 small white circular particles floating and slowly drifting in random directions with gentle wrapping at edges. Canvas sits fixed behind all content (z-index: -1 or z-0 behind z-10 wrapper).
4. Ensure all hardcoded `text-zinc-*` inside PopularBar and cards use white-leaning values.
