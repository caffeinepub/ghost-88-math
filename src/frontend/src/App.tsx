import { Input } from "@/components/ui/input";
import { Clock, Gamepad2, Heart, Maximize2, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

// ─── Static game data ────────────────────────────────────────────────────────
interface GameEntry {
  id: number;
  name: string;
  url: string;
  category: string;
  description: string;
}

const GAMES: GameEntry[] = [
  {
    id: 1,
    name: "Slope",
    url: "https://duckmath.org/games/slope",
    category: "Action",
    description: "Guide a ball down a neon slope at breakneck speed",
  },
  {
    id: 2,
    name: "Snake",
    url: "https://duckmath.org/games/snake",
    category: "Classic",
    description: "Classic snake — eat, grow, and don't bite yourself",
  },
  {
    id: 3,
    name: "1v1.LOL",
    url: "https://duckmath.org/games/1v1lol",
    category: "Shooter",
    description: "Build structures and battle opponents head-to-head",
  },
  {
    id: 4,
    name: "Retro Bowl",
    url: "https://duckmath.org/games/retro-bowl",
    category: "Sports",
    description: "Old-school pixel football at its finest",
  },
  {
    id: 5,
    name: "Drift Boss",
    url: "https://duckmath.org/games/drift-boss",
    category: "Racing",
    description: "Keep your car on the track as it drifts and twists",
  },
  {
    id: 6,
    name: "2048",
    url: "https://duckmath.org/games/2048",
    category: "Puzzle",
    description: "Merge tiles and reach the elusive 2048 square",
  },
  {
    id: 7,
    name: "Moto X3M",
    url: "https://duckmath.org/games/moto-x3m",
    category: "Racing",
    description: "Pull off insane motorcycle stunts across wild tracks",
  },
  {
    id: 8,
    name: "Run 3",
    url: "https://duckmath.org/games/run-3",
    category: "Action",
    description: "Sprint through crumbling space tunnels at warp speed",
  },
  {
    id: 9,
    name: "Flappy Bird",
    url: "https://duckmath.org/games/flappy-bird",
    category: "Classic",
    description: "Tap to keep your bird alive through endless pipes",
  },
  {
    id: 10,
    name: "Geometry Dash",
    url: "https://duckmath.org/games/geometry-dash",
    category: "Action",
    description: "Rhythm-based platformer with pounding beats",
  },
  {
    id: 11,
    name: "Among Us",
    url: "https://duckmath.org/games/among-us",
    category: "Multiplayer",
    description: "Find the impostor before it's too late",
  },
  {
    id: 12,
    name: "Minecraft Classic",
    url: "https://duckmath.org/games/minecraft-classic",
    category: "Sandbox",
    description: "Classic block-building Minecraft in your browser",
  },
  {
    id: 13,
    name: "Subway Surfers",
    url: "https://duckmath.org/games/subway-surfers",
    category: "Action",
    description: "Endless runner — dodge trains, grab coins",
  },
  {
    id: 14,
    name: "Happy Wheels",
    url: "https://duckmath.org/games/happy-wheels",
    category: "Action",
    description: "Ragdoll physics chaos on deadly obstacle courses",
  },
  {
    id: 15,
    name: "Tetris",
    url: "https://duckmath.org/games/tetris",
    category: "Classic",
    description: "Stack falling blocks in the timeless arcade original",
  },
  {
    id: 16,
    name: "Cookie Clicker",
    url: "https://duckmath.org/games/cookie-clicker",
    category: "Idle",
    description: "Click cookies to build a delicious empire",
  },
  {
    id: 17,
    name: "Crossy Road",
    url: "https://duckmath.org/games/crossy-road",
    category: "Classic",
    description: "Hop across busy roads without getting flattened",
  },
  {
    id: 18,
    name: "Basketball Stars",
    url: "https://duckmath.org/games/basketball-stars",
    category: "Sports",
    description: "Street basketball — show off your moves",
  },
  {
    id: 19,
    name: "Krunker",
    url: "https://duckmath.org/games/krunker",
    category: "Shooter",
    description: "Lightning-fast first-person shooter in your browser",
  },
  {
    id: 20,
    name: "Vex 5",
    url: "https://duckmath.org/games/vex-5",
    category: "Action",
    description: "Stickman platformer with brutal precision levels",
  },
];

const CATEGORIES = [
  "All",
  ...Array.from(new Set(GAMES.map((g) => g.category))).sort(),
];

const LS_KEY = "ghost88_recently_played";
const LS_LIKED_KEY = "ghost88_liked";

function getRecentlyPlayed(): GameEntry[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const ids: number[] = JSON.parse(raw);
    return ids
      .map((id) => GAMES.find((g) => g.id === id))
      .filter((g): g is GameEntry => !!g);
  } catch {
    return [];
  }
}

function saveRecentlyPlayed(game: GameEntry): void {
  const current = getRecentlyPlayed();
  const filtered = current.filter((g) => g.id !== game.id);
  const updated = [game, ...filtered].slice(0, 6);
  localStorage.setItem(LS_KEY, JSON.stringify(updated.map((g) => g.id)));
}

function getLikedGames(): Set<number> {
  try {
    const raw = localStorage.getItem(LS_LIKED_KEY);
    if (!raw) return new Set();
    const ids: number[] = JSON.parse(raw);
    return new Set(ids);
  } catch {
    return new Set();
  }
}

function saveLikedGames(liked: Set<number>): void {
  localStorage.setItem(LS_LIKED_KEY, JSON.stringify(Array.from(liked)));
}

// ─── Category color map ──────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  Action: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
  Classic: "border-amber-500/40 text-amber-400 bg-amber-500/10",
  Shooter: "border-red-500/40 text-red-400 bg-red-500/10",
  Sports: "border-sky-500/40 text-sky-400 bg-sky-500/10",
  Racing: "border-orange-500/40 text-orange-400 bg-orange-500/10",
  Puzzle: "border-violet-500/40 text-violet-400 bg-violet-500/10",
  Multiplayer: "border-pink-500/40 text-pink-400 bg-pink-500/10",
  Sandbox: "border-teal-500/40 text-teal-400 bg-teal-500/10",
  Idle: "border-yellow-500/40 text-yellow-400 bg-yellow-500/10",
};

function getCategoryColor(category: string) {
  return (
    CATEGORY_COLORS[category] ?? "border-primary/40 text-primary bg-primary/10"
  );
}

// ─── Game Card ───────────────────────────────────────────────────────────────
interface GameCardProps {
  game: GameEntry;
  index: number;
  markerPrefix: string;
  isLiked: boolean;
  onToggleLike: (id: number) => void;
  onClick: (game: GameEntry) => void;
}

function GameCard({
  game,
  index,
  markerPrefix,
  isLiked,
  onToggleLike,
  onClick,
}: GameCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      data-ocid={`${markerPrefix}.item.${index + 1}`}
      onClick={() => onClick(game)}
      className="group relative cursor-pointer rounded-md border border-border bg-card card-hover overflow-hidden"
    >
      {/* Hover glow accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Like button */}
      <button
        type="button"
        data-ocid={`${markerPrefix}.toggle.${index + 1}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleLike(game.id);
        }}
        className="absolute top-2 right-2 z-10 p-1 rounded transition-opacity duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label={isLiked ? "Unlike game" : "Like game"}
      >
        <Heart
          size={14}
          className={
            isLiked
              ? "text-red-500 fill-red-500"
              : "text-muted-foreground hover:text-red-400"
          }
        />
      </button>

      <div className="p-4 flex flex-col gap-2.5 h-full">
        <div className="flex items-start justify-between gap-2 pr-5">
          <h3 className="font-semibold text-foreground text-sm leading-tight group-hover:text-primary transition-colors duration-200 truncate">
            {game.name}
          </h3>
          {isLiked && (
            <Heart
              size={10}
              className="shrink-0 mt-0.5 text-red-500 fill-red-500"
            />
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {game.description}
        </p>
        <div className="mt-auto pt-1">
          <span
            className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded border ${getCategoryColor(game.category)}`}
          >
            {game.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Compact recently-played card ───────────────────────────────────────────
interface RecentCardProps {
  game: GameEntry;
  index: number;
  onClick: (game: GameEntry) => void;
}

function RecentCard({ game, index, onClick }: RecentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      data-ocid={`recently_played.item.${index + 1}`}
      onClick={() => onClick(game)}
      className="flex-shrink-0 w-36 cursor-pointer group rounded-md border border-border bg-card card-hover overflow-hidden"
    >
      <div className="p-3 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <Gamepad2 size={10} className="text-primary shrink-0" />
          <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors truncate">
            {game.name}
          </span>
        </div>
        <span
          className={`self-start inline-flex items-center text-[9px] font-medium px-1.5 py-0.5 rounded border ${getCategoryColor(game.category)}`}
        >
          {game.category}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Game Modal ──────────────────────────────────────────────────────────────
interface GameModalProps {
  game: GameEntry;
  isLiked: boolean;
  onToggleLike: (id: number) => void;
  onClose: () => void;
}

function GameModal({ game, isLiked, onToggleLike, onClose }: GameModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleFullscreen = () => {
    iframeRef.current?.requestFullscreen?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      data-ocid="game_modal.dialog"
      className="fixed inset-0 z-50 bg-black flex flex-col"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-950 border-b border-zinc-800 shrink-0">
        <span className="font-semibold text-white text-sm truncate max-w-xs">
          {game.name}
        </span>
        <div className="flex items-center gap-1">
          {/* Like button */}
          <button
            type="button"
            data-ocid="game_modal.like_button"
            onClick={() => onToggleLike(game.id)}
            className="p-2 rounded hover:bg-white/10 transition-colors"
            aria-label={isLiked ? "Unlike game" : "Like game"}
          >
            <Heart
              size={16}
              className={
                isLiked
                  ? "text-red-500 fill-red-500"
                  : "text-zinc-400 hover:text-red-400"
              }
            />
          </button>
          {/* Fullscreen button */}
          <button
            type="button"
            data-ocid="game_modal.fullscreen_button"
            onClick={handleFullscreen}
            className="p-2 rounded hover:bg-white/10 transition-colors"
            aria-label="Enter fullscreen"
          >
            <Maximize2 size={16} className="text-zinc-400 hover:text-white" />
          </button>
          {/* Close button */}
          <button
            type="button"
            data-ocid="game_modal.close_button"
            onClick={onClose}
            className="p-2 rounded hover:bg-white/10 transition-colors"
            aria-label="Close game"
          >
            <X size={16} className="text-zinc-400 hover:text-white" />
          </button>
        </div>
      </div>

      {/* Game iframe */}
      <iframe
        ref={iframeRef}
        src={game.url}
        title={game.name}
        className="w-full flex-1 border-0"
        allow="fullscreen"
        allowFullScreen
      />
    </motion.div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [recentlyPlayed, setRecentlyPlayed] =
    useState<GameEntry[]>(getRecentlyPlayed);
  const [likedGames, setLikedGames] = useState<Set<number>>(getLikedGames);
  const [activeGame, setActiveGame] = useState<GameEntry | null>(null);

  // Sync recently played from localStorage whenever focus returns
  useEffect(() => {
    const handler = () => setRecentlyPlayed(getRecentlyPlayed());
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, []);

  const handleGameClick = (game: GameEntry) => {
    saveRecentlyPlayed(game);
    setRecentlyPlayed(getRecentlyPlayed());
    setActiveGame(game);
  };

  const toggleLike = (id: number) => {
    setLikedGames((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      saveLikedGames(next);
      return next;
    });
  };

  const filteredGames = useMemo(() => {
    const q = search.trim().toLowerCase();
    return GAMES.filter((g) => {
      const matchesCategory =
        activeCategory === "All" || g.category === activeCategory;
      const matchesSearch =
        !q ||
        g.name.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen bg-background scanline-bg">
      <div className="relative z-10">
        {/* ── Header ─────────────────────────────────────────────── */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-3 shrink-0">
              <h1 className="font-mono-display text-lg font-bold neon-text tracking-tight">
                Ghost-88.Math
              </h1>
              <span className="hidden sm:inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded border border-primary/30 text-primary/60 bg-primary/5">
                UNBLOCKED
              </span>
            </div>
            <div className="relative w-full sm:max-w-xs ml-auto">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                data-ocid="header.search_input"
                type="text"
                placeholder="Search games..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-8 text-sm bg-muted border-border focus-visible:ring-primary focus-visible:border-primary/60 placeholder:text-muted-foreground/60"
              />
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">
          {/* ── Recently Played ───────────────────────────────────── */}
          <AnimatePresence>
            {recentlyPlayed.length > 0 && (
              <motion.section
                key="recently-played"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={13} className="text-primary" />
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Recently Played
                  </h2>
                </div>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                  <AnimatePresence>
                    {recentlyPlayed.map((game, i) => (
                      <RecentCard
                        key={game.id}
                        game={game}
                        index={i}
                        onClick={handleGameClick}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* ── Category Tabs ─────────────────────────────────────── */}
          <section>
            <div className="flex flex-wrap gap-1.5 mb-6">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  data-ocid="category.tab"
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs font-medium px-3 py-1.5 rounded border transition-all duration-150 ${
                    activeCategory === cat
                      ? "border-primary/60 text-primary bg-primary/10 shadow-[0_0_8px_oklch(0.82_0.18_160_/_0.25)]"
                      : "border-border text-muted-foreground bg-transparent hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* ── Games Grid ──────────────────────────────────────── */}
            {filteredGames.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
              >
                <AnimatePresence mode="popLayout">
                  {filteredGames.map((game, i) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      index={i}
                      markerPrefix="games"
                      isLiked={likedGames.has(game.id)}
                      onToggleLike={toggleLike}
                      onClick={handleGameClick}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div
                data-ocid="games.empty_state"
                className="text-center py-20 text-muted-foreground"
              >
                <p className="font-mono-display text-sm">
                  No games found for &ldquo;{search}&rdquo;
                </p>
                <p className="text-xs mt-1">
                  Try a different search or category.
                </p>
              </div>
            )}
          </section>
        </main>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <footer className="border-t border-border mt-16">
          <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="font-mono-display text-[11px]">Ghost-88.Math</span>
            <span>
              © {new Date().getFullYear()}.{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Built with ♥ using caffeine.ai
              </a>
            </span>
          </div>
        </footer>
      </div>

      {/* ── Game Modal ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeGame && (
          <GameModal
            key={activeGame.id}
            game={activeGame}
            isLiked={likedGames.has(activeGame.id)}
            onToggleLike={toggleLike}
            onClose={() => setActiveGame(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
