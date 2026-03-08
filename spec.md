# Ghost-88.Math

## Current State
The app is a full-stack unblocked games site with 20 games sourced from quiz-66.pro (which blocks iframe embedding). Each game card shows a locally generated thumbnail image, play count, category badge, like button, and opens the game in an in-app fullscreen modal via iframe. Features include search, category filter tabs, recently played row, and like persistence via localStorage.

## Requested Changes (Diff)

### Add
- All 116 games from quiz-77.pro using the full game list from `assets/data/oyunlar.js`
- Real thumbnails pulled directly from quiz-77.pro using the `game_image_icon` paths (e.g. `https://quiz-77.pro/g4m3s/slope/slope4.jpeg`)
- Categories derived from quiz-77.pro's own category data per game

### Modify
- Replace all 20 existing game entries with the 116 games from quiz-77.pro
- Game URLs updated to `https://quiz-77.pro/<game_url>` (e.g. `https://quiz-77.pro/g4m3s/slope/game.html`)
- Thumbnail `src` updated to `https://quiz-77.pro/<game_image_icon>` for every game
- Category list updated to reflect quiz-77.pro categories (Multiplayer, Sport, Puzzle, Clicker, Car, Arcade, Shooting, Classic, IO, Adventure)
- Play counts reassigned with realistic per-game values

### Remove
- All locally generated thumbnail image references (`/assets/generated/thumb-*.png`)
- quiz-66.pro URLs

## Implementation Plan
1. Replace the GAMES array in App.tsx with all 116 entries from quiz-77.pro's oyunlar.js
2. For each game: set `url` to `https://quiz-77.pro/<game_url>`, set `thumbnail` to `https://quiz-77.pro/<game_image_icon>`, set `category` from the first entry in `categories` array (or "Arcade" as fallback)
3. Update CATEGORY_COLORS map to include all new categories from quiz-77.pro
4. Remove any imports or references to generated thumbnail assets
5. Keep all other UI/UX (modal, like, fullscreen, recently played, search, category tabs) unchanged
