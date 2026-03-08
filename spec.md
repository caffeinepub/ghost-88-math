# Ghost-88.Math

## Current State
- Site name displayed as "Quiz-88.live" in header and footer
- Black background with neon green accents
- Foreground/text uses a muted near-white (oklch 0.94) — not pure white
- Clicking a game card calls `window.open(game.url, "_blank")` — opens duckmath.org in a new tab
- No in-app game player, no like functionality, no fullscreen option

## Requested Changes (Diff)

### Add
- In-app game modal / overlay: when a game card is clicked, open a full-viewport modal containing an `<iframe>` embedding the duckmath.org game URL directly
- Like button on each game card (heart icon) — persists liked state in localStorage; liked games show a filled heart
- Fullscreen button inside the game modal — calls `iframeRef.requestFullscreen()` to go fullscreen
- Close button in the game modal to dismiss the iframe and return to the grid

### Modify
- Site name: rename "Quiz-88.live" → "Ghost-88.Math" everywhere (header title, footer, localStorage key prefix)
- Text color: change foreground from near-white to pure white (`oklch(1 0 0)`) — update `--foreground`, `--card-foreground`, `--popover-foreground`, `--secondary-foreground`, `--sidebar-foreground` tokens
- `handleGameClick`: instead of `window.open`, open the in-app modal; still call `addRecentlyPlayed`
- Game card: replace `ExternalLink` icon with a heart/like icon; add like toggle button

### Remove
- `window.open` navigation behavior on game click
- `ExternalLink` import and usage in `GameCard`

## Implementation Plan
1. Update CSS tokens in `index.css`: set foreground values to pure white `1 0 0`
2. In `App.tsx`:
   - Rename all "Quiz-88.live" text strings to "Ghost-88.Math"
   - Update localStorage key to `ghost88_recently_played` (keep fallback for old key)
   - Add `likedGames` state (Set<number>) backed by localStorage
   - Add `activeGame` state (GameEntry | null) to track which game is open in modal
   - Replace `handleGameClick` to set `activeGame` (and call `addRecentlyPlayed`)
   - Update `GameCard` to show a like heart button (stop propagation so card click still opens game)
   - Build `GameModal` component: full-screen overlay with iframe, close button, fullscreen button, like button
3. Add `data-ocid` markers for: game modal dialog, modal close button, fullscreen button, like buttons
