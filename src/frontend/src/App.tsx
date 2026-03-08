import { Input } from "@/components/ui/input";
import {
  Clock,
  Flame,
  Gamepad2,
  Heart,
  Maximize2,
  Search,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

// ─── Static game data ────────────────────────────────────────────────────────
interface GameEntry {
  id: number;
  name: string;
  url: string;
  category: string;
  description: string;
  plays: number;
  thumbnail: string;
}

function formatPlays(n: number): string {
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return String(n);
}

const GAMES: GameEntry[] = [
  {
    id: 1,
    name: "1v1.LOL",
    url: "https://quiz-77.pro/g4m3s/1v1-lol/game.html",
    category: "Multiplayer",
    description: "Build structures and battle opponents head-to-head",
    plays: 395000,
    thumbnail: "https://quiz-77.pro/g4m3s/1v1-lol/splash.png",
  },
  {
    id: 2,
    name: "1 on 1 Soccer",
    url: "https://quiz-77.pro/g4m3s/1v1-soccer/game.html",
    category: "Sport",
    description: "Fast-paced one-on-one soccer showdown",
    plays: 142000,
    thumbnail: "https://quiz-77.pro/g4m3s/1v1-soccer/logo.jpg",
  },
  {
    id: 3,
    name: "3D Bowling",
    url: "https://quiz-77.pro/g4m3s/3d-bowling/game.html",
    category: "Sport",
    description: "Roll strikes in realistic 3D bowling",
    plays: 98000,
    thumbnail: "https://quiz-77.pro/g4m3s/3d-bowling/logo.jpg",
  },
  {
    id: 4,
    name: "8 Ball",
    url: "https://quiz-77.pro/g4m3s/8-ball/game.html",
    category: "Arcade",
    description: "Classic billiards pool in your browser",
    plays: 187000,
    thumbnail:
      "https://quiz-77.pro/g4m3s/8-ball/tmp/8BallBilliardsClassicTeaser.jpg",
  },
  {
    id: 5,
    name: "10 Minutes Till Dawn",
    url: "https://quiz-77.pro/g4m3s/10-minutes-till-dawn/game.html",
    category: "Arcade",
    description: "Survive waves of monsters for 10 minutes",
    plays: 231000,
    thumbnail: "https://quiz-77.pro/g4m3s/10-minutes-till-dawn/splash.png",
  },
  {
    id: 6,
    name: "2048",
    url: "https://quiz-77.pro/g4m3s/2048/game.html",
    category: "Puzzle",
    description: "Merge tiles and reach the elusive 2048 square",
    plays: 325000,
    thumbnail: "https://quiz-77.pro/g4m3s/2048/thumb.png",
  },
  {
    id: 7,
    name: "Ages of Conflict",
    url: "https://quiz-77.pro/g4m3s/ages-of-conflict/game.html",
    category: "Arcade",
    description: "Command armies across the ages of history",
    plays: 76000,
    thumbnail: "https://quiz-77.pro/g4m3s/ages-of-conflict/splash.jpg",
  },
  {
    id: 8,
    name: "Among Us",
    url: "https://quiz-77.pro/g4m3s/among-us/game.html",
    category: "Arcade",
    description: "Find the impostor before it's too late",
    plays: 360000,
    thumbnail: "https://quiz-77.pro/g4m3s/among-us/red.png",
  },
  {
    id: 9,
    name: "Angry Sharks",
    url: "https://quiz-77.pro/g4m3s/angry-sharks/game.html",
    category: "Arcade",
    description: "Dodge and survive hungry shark attacks",
    plays: 88000,
    thumbnail:
      "https://quiz-77.pro/g4m3s/angry-sharks/assets/favicon/icon-512x512.png",
  },
  {
    id: 10,
    name: "Sandboxels",
    url: "https://quiz-77.pro/g4m3s/sandboxels/game.html",
    category: "Arcade",
    description: "Play with falling sand and elemental reactions",
    plays: 112000,
    thumbnail: "https://quiz-77.pro/g4m3s/sandboxels/icons/icon.jpg",
  },
  {
    id: 11,
    name: "Aquapark Slides",
    url: "https://quiz-77.pro/g4m3s/aquapark-slides/game.html",
    category: "Arcade",
    description: "Race down wild waterpark slides",
    plays: 154000,
    thumbnail: "https://quiz-77.pro/g4m3s/aquapark-slides/splash.png",
  },
  {
    id: 12,
    name: "Arcane Archer",
    url: "https://quiz-77.pro/g4m3s/arcane-archer/game.html",
    category: "Arcade",
    description: "Unleash magical arrows on waves of enemies",
    plays: 67000,
    thumbnail: "https://quiz-77.pro/g4m3s/arcane-archer/logo.avif",
  },
  {
    id: 13,
    name: "Awesome Tanks 2",
    url: "https://quiz-77.pro/g4m3s/awesome-tanks-2/game.html",
    category: "Arcade",
    description: "Drive and upgrade tanks to destroy enemies",
    plays: 143000,
    thumbnail: "https://quiz-77.pro/g4m3s/awesome-tanks-2/logo.jpg",
  },
  {
    id: 14,
    name: "Backrooms",
    url: "https://quiz-77.pro/g4m3s/backrooms/game.html",
    category: "Arcade",
    description: "Explore the eerie infinite liminal backrooms",
    plays: 198000,
    thumbnail: "https://quiz-77.pro/g4m3s/backrooms/img/splash.jpg",
  },
  {
    id: 15,
    name: "Backrooms 2D",
    url: "https://quiz-77.pro/g4m3s/backrooms-2d/game.html",
    category: "Arcade",
    description: "2D survival horror in the backrooms",
    plays: 134000,
    thumbnail: "https://quiz-77.pro/g4m3s/backrooms-2d/Backrooms2D.png",
  },
  {
    id: 16,
    name: "Bacon May Die",
    url: "https://quiz-77.pro/g4m3s/bacon-may-die/game.html",
    category: "Arcade",
    description: "A bacon fighter battles hordes of enemies",
    plays: 121000,
    thumbnail: "https://quiz-77.pro/g4m3s/bacon-may-die/BaconMayDie.png",
  },
  {
    id: 17,
    name: "Bad Ice Cream",
    url: "https://quiz-77.pro/g4m3s/bad-ice-cream/game.html",
    category: "Arcade",
    description: "Smash ice and collect fruit as a frozen treat",
    plays: 167000,
    thumbnail: "https://quiz-77.pro/g4m3s/bad-ice-cream/bad-ice-cream.png",
  },
  {
    id: 18,
    name: "Baldi's Basics",
    url: "https://quiz-77.pro/g4m3s/baldis-basics/game.html",
    category: "Arcade",
    description: "Survive Baldi's school of nightmares",
    plays: 209000,
    thumbnail: "https://quiz-77.pro/g4m3s/baldis-basics/splash.png",
  },
  {
    id: 19,
    name: "Ballistic",
    url: "https://quiz-77.pro/g4m3s/ballistic/game.html",
    category: "Arcade",
    description: "Fire cannons and destroy enemy forces",
    plays: 83000,
    thumbnail: "https://quiz-77.pro/g4m3s/ballistic/logo.jpg",
  },
  {
    id: 20,
    name: "Basket Random",
    url: "https://quiz-77.pro/g4m3s/basket-random/game.html",
    category: "Sport",
    description: "Wacky random physics basketball chaos",
    plays: 176000,
    thumbnail: "https://quiz-77.pro/g4m3s/basket-random/BasketRandom.png",
  },
  {
    id: 21,
    name: "Basketball Stars",
    url: "https://quiz-77.pro/g4m3s/basketball-stars/game.html",
    category: "Sport",
    description: "Street basketball — show off your moves",
    plays: 248000,
    thumbnail:
      "https://quiz-77.pro/g4m3s/basketball-stars/assets/images/basketball-stars.png",
  },
  {
    id: 22,
    name: "Big Tower Tiny Square",
    url: "https://quiz-77.pro/g4m3s/big-tower-tiny-square/game.html",
    category: "Arcade",
    description: "Tiny square navigates a massive tower",
    plays: 118000,
    thumbnail: "https://quiz-77.pro/g4m3s/big-tower-tiny-square/images.png",
  },
  {
    id: 23,
    name: "Bitcoin Clicker",
    url: "https://quiz-77.pro/g4m3s/bitcoin-clicker/game.html",
    category: "Clicker",
    description: "Mine bitcoin and build a crypto empire",
    plays: 92000,
    thumbnail: "https://quiz-77.pro/g4m3s/bitcoin-clicker/BitcoinClicker.png",
  },
  {
    id: 24,
    name: "BitLife",
    url: "https://quiz-77.pro/g4m3s/bl/game.html",
    category: "Arcade",
    description: "Live your entire life through text choices",
    plays: 512000,
    thumbnail: "https://quiz-77.pro/g4m3s/bl/logo.png",
  },
  {
    id: 25,
    name: "BloonsTD 4",
    url: "https://quiz-77.pro/g4m3s/bloonstd-4/game.html",
    category: "Arcade",
    description: "Pop balloons with towers in the classic TD",
    plays: 284000,
    thumbnail: "https://quiz-77.pro/g4m3s/bloonstd-4/logo.jpg",
  },
  {
    id: 26,
    name: "Bloxorz",
    url: "https://quiz-77.pro/g4m3s/bloxors/game.html",
    category: "Arcade",
    description: "Roll a block to fall into the square hole",
    plays: 156000,
    thumbnail: "https://quiz-77.pro/g4m3s/bloxors/block.png",
  },
  {
    id: 27,
    name: "Blumgi Rocket",
    url: "https://quiz-77.pro/g4m3s/blumgi-rocket/game.html",
    category: "Arcade",
    description: "Fly a rocket through chaotic levels",
    plays: 74000,
    thumbnail: "https://quiz-77.pro/g4m3s/blumgi-rocket/thumb.png",
  },
  {
    id: 28,
    name: "Blumgi Slime",
    url: "https://quiz-77.pro/g4m3s/blumgi-slime/game.html",
    category: "Arcade",
    description: "Bounce slimes through colorful obstacle courses",
    plays: 81000,
    thumbnail: "https://quiz-77.pro/g4m3s/blumgi-slime/logo.jpg",
  },
  {
    id: 29,
    name: "Bob the Robber 2",
    url: "https://quiz-77.pro/g4m3s/bob-the-robber-2/game.html",
    category: "Adventure",
    description: "Sneak through guarded buildings as Bob",
    plays: 163000,
    thumbnail: "https://quiz-77.pro/g4m3s/bob-the-robber-2/splash.jpeg",
  },
  {
    id: 30,
    name: "Bottle Flip",
    url: "https://quiz-77.pro/g4m3s/bottle-flip/game.html",
    category: "Arcade",
    description: "Flip bottles and land them perfectly upright",
    plays: 221000,
    thumbnail: "https://quiz-77.pro/g4m3s/bottle-flip/icons/icon-256.png",
  },
  {
    id: 31,
    name: "Boxel Rebound",
    url: "https://quiz-77.pro/g4m3s/boxel-rebound/game.html",
    category: "Arcade",
    description: "Bounce a box through tight geometric levels",
    plays: 107000,
    thumbnail: "https://quiz-77.pro/g4m3s/boxel-rebound/logo.jpg",
  },
  {
    id: 32,
    name: "Boxing Random",
    url: "https://quiz-77.pro/g4m3s/boxing-random/game.html",
    category: "Arcade",
    description: "Wild random-physics boxing battles",
    plays: 138000,
    thumbnail: "https://quiz-77.pro/g4m3s/boxing-random/512x512.jpg",
  },
  {
    id: 33,
    name: "Cars Simulator",
    url: "https://quiz-77.pro/g4m3s/cars-simulator/game.html",
    category: "Car",
    description: "Drive and simulate a variety of cars",
    plays: 172000,
    thumbnail: "https://quiz-77.pro/g4m3s/cars-simulator/splash.png",
  },
  {
    id: 34,
    name: "CircloO",
    url: "https://quiz-77.pro/g4m3s/circlo/game.html",
    category: "Arcade",
    description: "Grow your circle and conquer the arena",
    plays: 94000,
    thumbnail: "https://quiz-77.pro/g4m3s/circlo/img/download.png",
  },
  {
    id: 35,
    name: "CircloO 2",
    url: "https://quiz-77.pro/g4m3s/circlo-2/game.html",
    category: "Arcade",
    description: "More circle-growing arena mayhem",
    plays: 86000,
    thumbnail: "https://quiz-77.pro/g4m3s/circlo-2/thumv.png",
  },
  {
    id: 36,
    name: "Climb Over It",
    url: "https://quiz-77.pro/g4m3s/climb-over-it/game.html",
    category: "Arcade",
    description: "Frustrating but addictive climbing challenge",
    plays: 193000,
    thumbnail: "https://quiz-77.pro/g4m3s/climb-over-it/thumb.jpg",
  },
  {
    id: 37,
    name: "Cluster Rush",
    url: "https://quiz-77.pro/g4m3s/cluster-rush/game.html",
    category: "Arcade",
    description: "Jump across speeding trucks at insane speeds",
    plays: 267000,
    thumbnail: "https://quiz-77.pro/g4m3s/cluster-rush/splash.png",
  },
  {
    id: 38,
    name: "Cookie Clicker",
    url: "https://quiz-77.pro/g4m3s/cookie-clicker/game.html",
    category: "Clicker",
    description: "Click cookies to build a delicious empire",
    plays: 441000,
    thumbnail: "https://quiz-77.pro/g4m3s/cookie-clicker/thumb.png",
  },
  {
    id: 39,
    name: "Core Ball",
    url: "https://quiz-77.pro/g4m3s/core-ball/game.html",
    category: "Arcade",
    description: "Launch pins into a spinning core without hitting others",
    plays: 88000,
    thumbnail: "https://quiz-77.pro/g4m3s/core-ball/pr_source.png",
  },
  {
    id: 40,
    name: "Crazy Cars",
    url: "https://quiz-77.pro/g4m3s/crazy-cars/game.html",
    category: "Car",
    description: "Race at insane speeds in wild car chaos",
    plays: 119000,
    thumbnail: "https://quiz-77.pro/g4m3s/crazy-cars/logo.jpg",
  },
  {
    id: 41,
    name: "Crossy Road",
    url: "https://quiz-77.pro/g4m3s/crossy-road/game.html",
    category: "Arcade",
    description: "Hop across busy roads without getting flattened",
    plays: 195000,
    thumbnail: "https://quiz-77.pro/g4m3s/crossy-road/crossyroad.png",
  },
  {
    id: 42,
    name: "CS:GO Clicker",
    url: "https://quiz-77.pro/g4m3s/csgo-clicker/game.html",
    category: "Clicker",
    description: "Click your way to CS:GO glory",
    plays: 73000,
    thumbnail: "https://quiz-77.pro/g4m3s/csgo-clicker/logo.png",
  },
  {
    id: 43,
    name: "Deal or No Deal",
    url: "https://quiz-77.pro/g4m3s/deal-or-no-deal/game.html",
    category: "Arcade",
    description: "Play the classic TV game show in your browser",
    plays: 102000,
    thumbnail: "https://quiz-77.pro/g4m3s/deal-or-no-deal/index.jpg",
  },
  {
    id: 44,
    name: "Death Run 3D",
    url: "https://quiz-77.pro/g4m3s/death-run-3d/game.html",
    category: "Arcade",
    description: "Sprint through a deadly 3D obstacle tunnel",
    plays: 312000,
    thumbnail: "https://quiz-77.pro/g4m3s/death-run-3d/img/death.png",
  },
  {
    id: 45,
    name: "Doge Miner",
    url: "https://quiz-77.pro/g4m3s/doge-miner/game.html",
    category: "Clicker",
    description: "Mine doge coins and reach the moon",
    plays: 68000,
    thumbnail: "https://quiz-77.pro/g4m3s/doge-miner/img/dogeminer_300x300.png",
  },
  {
    id: 46,
    name: "Doodle Jump",
    url: "https://quiz-77.pro/g4m3s/doodle-jump/game.html",
    category: "Arcade",
    description: "Bounce your doodler up an endless platform tower",
    plays: 278000,
    thumbnail: "https://quiz-77.pro/g4m3s/doodle-jump/doodle.png",
  },
  {
    id: 47,
    name: "Draw the Hill",
    url: "https://quiz-77.pro/g4m3s/draw-the-hill/game.html",
    category: "Arcade",
    description: "Draw the terrain to guide your car to the finish",
    plays: 143000,
    thumbnail: "https://quiz-77.pro/g4m3s/draw-the-hill/icons/icon-512.png",
  },
  {
    id: 48,
    name: "Drift Boss",
    url: "https://quiz-77.pro/g4m3s/drift-boss/game.html",
    category: "Car",
    description: "Keep your car on the track as it drifts and twists",
    plays: 337000,
    thumbnail: "https://quiz-77.pro/g4m3s/drift-boss/drift-boss.png",
  },
  {
    id: 49,
    name: "Drive Mad",
    url: "https://quiz-77.pro/g4m3s/drive-mad/game.html",
    category: "Car",
    description: "Balance and drive over insane obstacle courses",
    plays: 421000,
    thumbnail: "https://quiz-77.pro/g4m3s/drive-mad/logo.jpg",
  },
  {
    id: 50,
    name: "Duck Life 4",
    url: "https://quiz-77.pro/g4m3s/duck-life-4/game.html",
    category: "Arcade",
    description: "Train your duck and race to victory",
    plays: 189000,
    thumbnail: "https://quiz-77.pro/g4m3s/duck-life-4/splash.jpg",
  },
  {
    id: 51,
    name: "Elastic Face",
    url: "https://quiz-77.pro/g4m3s/elastic-face/game.html",
    category: "Arcade",
    description: "Stretch a face in hilariously elastic ways",
    plays: 97000,
    thumbnail: "https://quiz-77.pro/g4m3s/elastic-face/ElasticFace.png",
  },
  {
    id: 52,
    name: "Fireboy and Watergirl",
    url: "https://quiz-77.pro/g4m3s/fire-boy-water-girl/game.html",
    category: "Arcade",
    description: "Guide fire and water through elemental puzzles",
    plays: 376000,
    thumbnail: "https://quiz-77.pro/g4m3s/fire-boy-water-girl/logo.jpeg",
  },
  {
    id: 53,
    name: "Flappy Bird",
    url: "https://quiz-77.pro/g4m3s/flappy-bird/game.html",
    category: "Arcade",
    description: "Tap to keep your bird alive through endless pipes",
    plays: 380000,
    thumbnail: "https://quiz-77.pro/g4m3s/flappy-bird/assets/thumb.png",
  },
  {
    id: 54,
    name: "Flash Tetris",
    url: "https://quiz-77.pro/g4m3s/flash-tetris/game.html",
    category: "Classic",
    description: "Stack falling blocks in the timeless arcade classic",
    plays: 241000,
    thumbnail: "https://quiz-77.pro/g4m3s/flash-tetris/flashtetris.png",
  },
  {
    id: 55,
    name: "Five Nights at Freddy's",
    url: "https://quiz-77.pro/g4m3s/fnaf/game.html",
    category: "Arcade",
    description: "Survive the night shift at Freddy's diner",
    plays: 463000,
    thumbnail: "https://quiz-77.pro/g4m3s/fnaf/logo.jpg",
  },
  {
    id: 56,
    name: "Football Legends",
    url: "https://quiz-77.pro/g4m3s/football-legends/game.html",
    category: "Sport",
    description: "Play legendary football against friends",
    plays: 157000,
    thumbnail: "https://quiz-77.pro/g4m3s/football-legends/logo.jpg",
  },
  {
    id: 57,
    name: "Football Strike",
    url: "https://quiz-77.pro/g4m3s/football-strike/game.html",
    category: "Sport",
    description: "Strike and score in this soccer freekick game",
    plays: 134000,
    thumbnail: "https://quiz-77.pro/g4m3s/football-strike/logo.jpg",
  },
  {
    id: 58,
    name: "Fruit Ninja",
    url: "https://quiz-77.pro/g4m3s/fruit-ninja/game.html",
    category: "Adventure",
    description: "Slice flying fruit with razor-sharp precision",
    plays: 298000,
    thumbnail: "https://quiz-77.pro/g4m3s/fruit-ninja/logo.jpg",
  },
  {
    id: 59,
    name: "Funny Shooter 2",
    url: "https://quiz-77.pro/g4m3s/funny-shooter-2/game.html",
    category: "Shooting",
    description: "Shoot waves of silly enemies in this action shooter",
    plays: 187000,
    thumbnail: "https://quiz-77.pro/g4m3s/funny-shooter-2/thumb.png",
  },
  {
    id: 60,
    name: "Geometry Dash",
    url: "https://quiz-77.pro/g4m3s/geometry-dash/game.html",
    category: "Arcade",
    description: "Rhythm-based platformer with pounding beats",
    plays: 430000,
    thumbnail: "https://quiz-77.pro/g4m3s/geometry-dash/geoscratchicon.png",
  },
  {
    id: 61,
    name: "Getaway Shootout",
    url: "https://quiz-77.pro/g4m3s/getaway-shootout/game.html",
    category: "Shooting",
    description: "Race and shoot your way to escape",
    plays: 176000,
    thumbnail: "https://quiz-77.pro/g4m3s/getaway-shootout/img/images.jpg",
  },
  {
    id: 62,
    name: "Getting Over It",
    url: "https://quiz-77.pro/g4m3s/getting-over-it/game.html",
    category: "Arcade",
    description: "Climb a mountain with only a hammer — rage included",
    plays: 289000,
    thumbnail: "https://quiz-77.pro/g4m3s/getting-over-it/GettingOverIt.png",
  },
  {
    id: 63,
    name: "Google Feud",
    url: "https://quiz-77.pro/g4m3s/google-feud/game.html",
    category: "Arcade",
    description: "Guess Google autocomplete suggestions",
    plays: 218000,
    thumbnail: "https://quiz-77.pro/g4m3s/google-feud/splash.png",
  },
  {
    id: 64,
    name: "Idle Breakout",
    url: "https://quiz-77.pro/g4m3s/idle-breakout/game.html",
    category: "Clicker",
    description: "Idle brick-breaking with upgradeable balls",
    plays: 163000,
    thumbnail: "https://quiz-77.pro/g4m3s/idle-breakout/img/thumbnail.png",
  },
  {
    id: 65,
    name: "Idle Mining",
    url: "https://quiz-77.pro/g4m3s/idle-mining/game.html",
    category: "Clicker",
    description: "Build the ultimate idle mining operation",
    plays: 97000,
    thumbnail: "https://quiz-77.pro/g4m3s/idle-mining/logo.jpg",
  },
  {
    id: 66,
    name: "Iron Snout",
    url: "https://quiz-77.pro/g4m3s/iron-snout/game.html",
    category: "Arcade",
    description: "Pig fights wolves in a frantic brawler",
    plays: 204000,
    thumbnail: "https://quiz-77.pro/g4m3s/iron-snout/IronSnout.png",
  },
  {
    id: 67,
    name: "JustFall.LOL",
    url: "https://quiz-77.pro/g4m3s/just-fall/game.html",
    category: "Multiplayer",
    description: "Fall and survive on breaking platforms",
    plays: 231000,
    thumbnail: "https://quiz-77.pro/g4m3s/just-fall/unnamed.png",
  },
  {
    id: 68,
    name: "Learn to Fly",
    url: "https://quiz-77.pro/g4m3s/learn-to-fly/game.html",
    category: "Arcade",
    description: "Help a penguin learn to fly with upgrades",
    plays: 178000,
    thumbnail: "https://quiz-77.pro/g4m3s/learn-to-fly/learntofly.png",
  },
  {
    id: 69,
    name: "Mario Bros",
    url: "https://quiz-77.pro/g4m3s/mario-bros/game.html",
    category: "Adventure",
    description: "Classic Mario platformer adventure",
    plays: 487000,
    thumbnail: "https://quiz-77.pro/g4m3s/mario-bros/NewSuperMarioBros.png",
  },
  {
    id: 70,
    name: "Merge Round Racers",
    url: "https://quiz-77.pro/g4m3s/merge-round-racers/game.html",
    category: "Car",
    description: "Merge cars to unlock faster racers",
    plays: 112000,
    thumbnail: "https://quiz-77.pro/g4m3s/merge-round-racers/splash.png",
  },
  {
    id: 71,
    name: "Minecraft 1.5",
    url: "https://quiz-77.pro/g4m3s/minecraft-15/game.html",
    category: "Arcade",
    description: "Classic Minecraft 1.5 in the browser",
    plays: 356000,
    thumbnail: "https://quiz-77.pro/g4m3s/minecraft-15/splash.jpeg",
  },
  {
    id: 72,
    name: "Minecraft 1.8",
    url: "https://quiz-77.pro/g4m3s/minecraft-18/game.html",
    category: "Arcade",
    description: "Play Minecraft 1.8 directly in your browser",
    plays: 398000,
    thumbnail: "https://quiz-77.pro/g4m3s/minecraft-18/splash.png",
  },
  {
    id: 73,
    name: "Mini-putt",
    url: "https://quiz-77.pro/g4m3s/miniputt/game.html",
    category: "Arcade",
    description: "Sink holes in classic mini golf",
    plays: 143000,
    thumbnail: "https://quiz-77.pro/g4m3s/miniputt/miniputt.png",
  },
  {
    id: 74,
    name: "MotoX3M",
    url: "https://quiz-77.pro/g4m3s/motox3m/game.html",
    category: "Car",
    description: "Pull off insane motorcycle stunts across wild tracks",
    plays: 312000,
    thumbnail: "https://quiz-77.pro/g4m3s/motox3m/splash.jpg",
  },
  {
    id: 75,
    name: "MotoX3M 2",
    url: "https://quiz-77.pro/g4m3s/motox3m2/game.html",
    category: "Car",
    description: "More motorcycle stunts and bigger explosions",
    plays: 241000,
    thumbnail: "https://quiz-77.pro/g4m3s/motox3m/splash.jpg",
  },
  {
    id: 76,
    name: "MotoX3M Pool",
    url: "https://quiz-77.pro/g4m3s/motox3m-pool/game.html",
    category: "Car",
    description: "MotoX3M on a poolside summer track",
    plays: 178000,
    thumbnail: "https://quiz-77.pro/g4m3s/motox3m-pool/splash.jpg",
  },
  {
    id: 77,
    name: "MotoX3M Spooky",
    url: "https://quiz-77.pro/g4m3s/motox3m-spooky/game.html",
    category: "Car",
    description: "Halloween-themed motorcycle mayhem",
    plays: 163000,
    thumbnail: "https://quiz-77.pro/g4m3s/motox3m-spooky/splash.jpeg",
  },
  {
    id: 78,
    name: "MotoX3M Winter",
    url: "https://quiz-77.pro/g4m3s/motox3m-winter/game.html",
    category: "Car",
    description: "Frozen tracks and icy motorcycle stunts",
    plays: 148000,
    thumbnail: "https://quiz-77.pro/g4m3s/motox3m-winter/download.jpeg",
  },
  {
    id: 79,
    name: "Mr Bullet",
    url: "https://quiz-77.pro/g4m3s/mr-bullet/game.html",
    category: "Shooting",
    description: "Ricochet bullets to take down all enemies",
    plays: 192000,
    thumbnail: "https://quiz-77.pro/g4m3s/mr-bullet/icon-256.png",
  },
  {
    id: 80,
    name: "n-gon",
    url: "https://quiz-77.pro/g4m3s/n-gon/game.html",
    category: "Arcade",
    description: "Fast-paced geometric survival shooter",
    plays: 76000,
    thumbnail: "https://quiz-77.pro/g4m3s/n-gon/bot.png",
  },
  {
    id: 81,
    name: "Nut Simulator",
    url: "https://quiz-77.pro/g4m3s/nut-simulator/game.html",
    category: "Arcade",
    description: "Tighten and loosen nuts in this oddly satisfying sim",
    plays: 84000,
    thumbnail: "https://quiz-77.pro/g4m3s/nut-simulator/NutSimulator.png",
  },
  {
    id: 82,
    name: "OvO",
    url: "https://quiz-77.pro/g4m3s/ovo/game.html",
    category: "Arcade",
    description: "Lightning-fast stickman parkour platformer",
    plays: 267000,
    thumbnail: "https://quiz-77.pro/g4m3s/ovo/ovo.png",
  },
  {
    id: 83,
    name: "OvO 2",
    url: "https://quiz-77.pro/g4m3s/ovo-2/game.html",
    category: "Arcade",
    description: "More insane stickman parkour challenges",
    plays: 198000,
    thumbnail: "https://quiz-77.pro/g4m3s/ovo-2/logo.jpg",
  },
  {
    id: 84,
    name: "OvO Dimensions",
    url: "https://quiz-77.pro/g4m3s/ovo-dimensions/game.html",
    category: "IO",
    description: "OvO goes multiplayer in dimension-bending arenas",
    plays: 143000,
    thumbnail: "https://quiz-77.pro/g4m3s/ovo-dimensions/logo.jpg",
  },
  {
    id: 85,
    name: "Paper.io 2",
    url: "https://quiz-77.pro/g4m3s/paper-io-2/game.html",
    category: "IO",
    description: "Capture territory and destroy rivals on the paper grid",
    plays: 334000,
    thumbnail: "https://quiz-77.pro/g4m3s/paper-io-2/images/icon512.png",
  },
  {
    id: 86,
    name: "Paper.io 3",
    url: "https://quiz-77.pro/g4m3s/paper-io-3/game.html",
    category: "IO",
    description: "Next-gen territory conquest on the paper grid",
    plays: 287000,
    thumbnail: "https://quiz-77.pro/g4m3s/paper-io-3/PaperIo3.png",
  },
  {
    id: 87,
    name: "Retro Bowl",
    url: "https://quiz-77.pro/g4m3s/retro-bowl/game.html",
    category: "Classic",
    description: "Old-school pixel football at its finest",
    plays: 478000,
    thumbnail: "https://quiz-77.pro/g4m3s/retro-bowl/img/icon.jpg",
  },
  {
    id: 88,
    name: "Retro Bowl College",
    url: "https://quiz-77.pro/g4m3s/retro-bowl-college/game.html",
    category: "Classic",
    description: "College edition of the beloved retro football game",
    plays: 312000,
    thumbnail: "https://quiz-77.pro/g4m3s/retro-bowl-college/unnamed.png",
  },
  {
    id: 89,
    name: "Rise Higher",
    url: "https://quiz-77.pro/g4m3s/rise-higher/game.html",
    category: "Arcade",
    description: "Stack blocks and rise as high as possible",
    plays: 87000,
    thumbnail: "https://quiz-77.pro/g4m3s/rise-higher/RiseHigher.png",
  },
  {
    id: 90,
    name: "Rooftop Snipers",
    url: "https://quiz-77.pro/g4m3s/rooftop-snipers/game.html",
    category: "Shooting",
    description: "Knock your opponent off the rooftop",
    plays: 243000,
    thumbnail: "https://quiz-77.pro/g4m3s/rooftop-snipers/img/thumb.png",
  },
  {
    id: 91,
    name: "Scrap Metal",
    url: "https://quiz-77.pro/g4m3s/scrap-metal/game.html",
    category: "Car",
    description: "Drive and crash scrap metal cars in physics chaos",
    plays: 119000,
    thumbnail: "https://quiz-77.pro/g4m3s/scrap-metal/img/splash.png",
  },
  {
    id: 92,
    name: "Slope",
    url: "https://quiz-77.pro/g4m3s/slope/game.html",
    category: "Arcade",
    description: "Guide a ball down a neon slope at breakneck speed",
    plays: 582000,
    thumbnail: "https://quiz-77.pro/g4m3s/slope/slope4.jpeg",
  },
  {
    id: 93,
    name: "Slope 2",
    url: "https://quiz-77.pro/g4m3s/slope-2/game.html",
    category: "Arcade",
    description: "Even faster neon slopes and sharper turns",
    plays: 341000,
    thumbnail: "https://quiz-77.pro/g4m3s/slope-2/slope-2-logo.png",
  },
  {
    id: 94,
    name: "Snow Rider 3D",
    url: "https://quiz-77.pro/g4m3s/snow-ride/game.html",
    category: "Arcade",
    description: "Sled down icy mountains at full speed",
    plays: 198000,
    thumbnail: "https://quiz-77.pro/g4m3s/snow-ride/logo.jpg",
  },
  {
    id: 95,
    name: "Snowbattle",
    url: "https://quiz-77.pro/g4m3s/snowbattle/game.html",
    category: "Arcade",
    description: "Throw snowballs and battle friends in winter arenas",
    plays: 112000,
    thumbnail: "https://quiz-77.pro/g4m3s/snowbattle/img/logo.png",
  },
  {
    id: 96,
    name: "Soccer Random",
    url: "https://quiz-77.pro/g4m3s/soccer-random/game.html",
    category: "Sport",
    description: "Random physics soccer chaos with wild rules",
    plays: 187000,
    thumbnail: "https://quiz-77.pro/g4m3s/soccer-random/unnamed.png",
  },
  {
    id: 97,
    name: "Soccer Skills Euro Cup",
    url: "https://quiz-77.pro/g4m3s/soccer-skills/game.html",
    category: "Sport",
    description: "Compete in the Euro Cup with soccer skill challenges",
    plays: 143000,
    thumbnail: "https://quiz-77.pro/g4m3s/soccer-skills/splash.png",
  },
  {
    id: 98,
    name: "Stack",
    url: "https://quiz-77.pro/g4m3s/stack/game.html",
    category: "Puzzle",
    description: "Stack blocks perfectly to build the tallest tower",
    plays: 221000,
    thumbnail: "https://quiz-77.pro/g4m3s/stack/stack.png",
  },
  {
    id: 99,
    name: "Stick Duel Battle",
    url: "https://quiz-77.pro/g4m3s/stick-duel-battle/game.html",
    category: "Arcade",
    description: "Stickman duels with weapons and physics",
    plays: 134000,
    thumbnail: "https://quiz-77.pro/g4m3s/stick-duel-battle/512x512.jpg",
  },
  {
    id: 100,
    name: "Stick Merge",
    url: "https://quiz-77.pro/g4m3s/stick-merge/game.html",
    category: "Arcade",
    description: "Merge stickmen to create the ultimate warrior",
    plays: 98000,
    thumbnail: "https://quiz-77.pro/g4m3s/stick-merge/splash.png",
  },
  {
    id: 101,
    name: "Stickman Hook",
    url: "https://quiz-77.pro/g4m3s/stickman-hook/game.html",
    category: "Arcade",
    description: "Swing through levels as a grappling stickman",
    plays: 276000,
    thumbnail: "https://quiz-77.pro/g4m3s/stickman-hook/unnamed.jpg",
  },
  {
    id: 102,
    name: "Subway Surfers",
    url: "https://quiz-77.pro/g4m3s/subway-surfers/game.html",
    category: "Arcade",
    description: "Endless runner — dodge trains, grab coins",
    plays: 467000,
    thumbnail: "https://quiz-77.pro/g4m3s/subway-surfers/img/splash.jpg",
  },
  {
    id: 103,
    name: "Subway Surfers New York",
    url: "https://quiz-77.pro/g4m3s/subway-surfers-ny/game.html",
    category: "Arcade",
    description: "Surf the New York subway in this special edition",
    plays: 312000,
    thumbnail: "https://quiz-77.pro/g4m3s/subway-surfers-ny/NewYorkIcon.png",
  },
  {
    id: 104,
    name: "Super Mario 64",
    url: "https://quiz-77.pro/g4m3s/super-mario-64/game.html",
    category: "Adventure",
    description: "The legendary Mario 64 experience in your browser",
    plays: 534000,
    thumbnail: "https://quiz-77.pro/g4m3s/super-mario-64/logo.jfif",
  },
  {
    id: 105,
    name: "Superhot",
    url: "https://quiz-77.pro/g4m3s/superhot/game.html",
    category: "Arcade",
    description: "Time moves only when you move in this mind-bending shooter",
    plays: 298000,
    thumbnail: "https://quiz-77.pro/g4m3s/superhot/hot.jpg",
  },
  {
    id: 106,
    name: "Tag",
    url: "https://quiz-77.pro/g4m3s/tag/game.html",
    category: "Arcade",
    description: "Classic tag game — don't get caught",
    plays: 87000,
    thumbnail: "https://quiz-77.pro/g4m3s/tag/logo.jpg",
  },
  {
    id: 107,
    name: "Tanuki Sunset",
    url: "https://quiz-77.pro/g4m3s/tanuki-sunset/game.html",
    category: "Arcade",
    description: "Longboard as a raccoon through beautiful sunsets",
    plays: 156000,
    thumbnail: "https://quiz-77.pro/g4m3s/tanuki-sunset/img/logo.png",
  },
  {
    id: 108,
    name: "Temple Run 2",
    url: "https://quiz-77.pro/g4m3s/temple-run-2/game.html",
    category: "Arcade",
    description: "Outrun the demon monkeys through ancient temples",
    plays: 412000,
    thumbnail: "https://quiz-77.pro/g4m3s/temple-run-2/img/og-icon.png",
  },
  {
    id: 109,
    name: "Territorial",
    url: "https://quiz-77.pro/g4m3s/territorial/game.html",
    category: "Arcade",
    description: "Conquer territory and dominate the map",
    plays: 124000,
    thumbnail: "https://quiz-77.pro/g4m3s/territorial/Territorial.png",
  },
  {
    id: 110,
    name: "There is No Game",
    url: "https://quiz-77.pro/g4m3s/there-is-no-game/game.html",
    category: "Arcade",
    description: "There is no game here — or is there?",
    plays: 189000,
    thumbnail: "https://quiz-77.pro/g4m3s/there-is-no-game/logo.png",
  },
  {
    id: 111,
    name: "Tiny Fishing",
    url: "https://quiz-77.pro/g4m3s/tiny-fishing/game.html",
    category: "Arcade",
    description: "Cast your line and reel in rare fish",
    plays: 213000,
    thumbnail: "https://quiz-77.pro/g4m3s/tiny-fishing/thumb.png",
  },
  {
    id: 112,
    name: "Toss the Turtle",
    url: "https://quiz-77.pro/g4m3s/toss-the-turtle/game.html",
    category: "Arcade",
    description: "Launch a turtle as far as possible with upgrades",
    plays: 167000,
    thumbnail: "https://quiz-77.pro/g4m3s/toss-the-turtle/tosstheturtle.png",
  },
  {
    id: 113,
    name: "Tunnel Rush",
    url: "https://quiz-77.pro/g4m3s/tunnel-rush/game.html",
    category: "Arcade",
    description: "Rush through a neon tunnel full of spinning obstacles",
    plays: 389000,
    thumbnail: "https://quiz-77.pro/g4m3s/tunnel-rush/img/tunnel.jpg",
  },
  {
    id: 114,
    name: "Volley Random",
    url: "https://quiz-77.pro/g4m3s/volley-random/game.html",
    category: "Sport",
    description: "Wacky random-physics volleyball battles",
    plays: 143000,
    thumbnail: "https://quiz-77.pro/g4m3s/volley-random/splash.png",
  },
  {
    id: 115,
    name: "Wordle",
    url: "https://quiz-77.pro/g4m3s/wordle/game.html",
    category: "Puzzle",
    description: "Guess the 5-letter word in 6 tries",
    plays: 276000,
    thumbnail: "https://quiz-77.pro/g4m3s/wordle/img/logo_192x192.png",
  },
  {
    id: 116,
    name: "World's Hardest Game",
    url: "https://quiz-77.pro/g4m3s/worlds-hardest-game/game.html",
    category: "Arcade",
    description: "Navigate the world's hardest game without dying",
    plays: 348000,
    thumbnail:
      "https://quiz-77.pro/g4m3s/worlds-hardest-game/images/splash.jpg",
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
  Arcade: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
  Classic: "border-amber-500/40 text-amber-400 bg-amber-500/10",
  Shooting: "border-red-500/40 text-red-400 bg-red-500/10",
  Sport: "border-sky-500/40 text-sky-400 bg-sky-500/10",
  Car: "border-orange-500/40 text-orange-400 bg-orange-500/10",
  Puzzle: "border-violet-500/40 text-violet-400 bg-violet-500/10",
  Multiplayer: "border-pink-500/40 text-pink-400 bg-pink-500/10",
  IO: "border-teal-500/40 text-teal-400 bg-teal-500/10",
  Clicker: "border-yellow-500/40 text-yellow-400 bg-yellow-500/10",
  Adventure: "border-indigo-500/40 text-indigo-400 bg-indigo-500/10",
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

      {/* Game thumbnail image */}
      <div className="relative h-20 overflow-hidden bg-zinc-900">
        <img
          src={game.thumbnail}
          alt={game.name}
          className="h-20 w-full object-cover"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        {/* Subtle bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Like button */}
      <button
        type="button"
        data-ocid={`${markerPrefix}.toggle.${index + 1}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleLike(game.id);
        }}
        className="absolute top-[4.5rem] right-2 z-10 p-1 rounded transition-opacity duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
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

      <div className="p-3 flex flex-col gap-2 h-full">
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
        {/* Play count */}
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Users size={10} className="shrink-0" />
          <span>{formatPlays(game.plays)} plays</span>
        </div>
        <div className="mt-auto pt-0.5">
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

// ─── Popular Bar ─────────────────────────────────────────────────────────────
interface PopularBarProps {
  onGameClick: (game: GameEntry) => void;
}

function PopularBar({ onGameClick }: PopularBarProps) {
  const popularGames = useMemo(
    () => [...GAMES].sort((a, b) => b.plays - a.plays).slice(0, 12),
    [],
  );

  // Duplicate items so the marquee loops seamlessly
  const items = [...popularGames, ...popularGames];

  return (
    <div
      data-ocid="popular_bar.section"
      className="sticky top-[57px] z-30 border-b border-border bg-zinc-950/95 backdrop-blur-sm overflow-hidden"
      style={{ height: "52px" }}
    >
      <div className="flex items-center h-full">
        {/* Static "Popular" label */}
        <div className="flex items-center gap-1.5 shrink-0 px-3 h-full border-r border-border bg-zinc-950 z-10">
          <Flame size={13} className="text-orange-400 shrink-0" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-orange-400 whitespace-nowrap">
            Popular
          </span>
        </div>

        {/* Scrolling track */}
        <div className="popular-bar-track flex-1 overflow-hidden h-full flex items-center relative">
          {/* Left fade mask */}
          <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
          {/* Right fade mask */}
          <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee flex items-center gap-3 pl-3">
            {items.map((game, i) => (
              <button
                key={`${game.id}-${i}`}
                type="button"
                data-ocid={`popular_bar.item.${(i % popularGames.length) + 1}`}
                onClick={() => onGameClick(game)}
                className="flex items-center gap-2 shrink-0 px-2.5 py-1 rounded border border-zinc-800 bg-zinc-900/60 hover:border-primary/50 hover:bg-zinc-800/80 transition-all duration-150 group"
                aria-label={`Play ${game.name}`}
              >
                {/* Thumbnail */}
                <div className="relative w-7 h-7 rounded overflow-hidden shrink-0 bg-zinc-800">
                  <img
                    src={game.thumbnail}
                    alt={game.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                {/* Game name */}
                <span className="text-[11px] font-medium text-zinc-300 group-hover:text-white transition-colors whitespace-nowrap max-w-[100px] truncate">
                  {game.name}
                </span>
                {/* HOT badge */}
                <span className="flex items-center gap-0.5 text-[9px] font-bold text-orange-400 bg-orange-400/10 border border-orange-400/25 px-1 py-0.5 rounded shrink-0">
                  <Flame size={8} className="shrink-0" />
                  HOT
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
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
              <div className="flex flex-col">
                <h1 className="font-mono-display text-lg font-bold text-white tracking-tight leading-tight">
                  Ghost-88.Math
                </h1>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Level up your math skills.
                </p>
              </div>
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

        {/* ── Popular Bar ────────────────────────────────────────── */}
        <PopularBar onGameClick={handleGameClick} />

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
