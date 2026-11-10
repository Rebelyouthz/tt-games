import type { Genes, Stage, Stats } from "@/lib/types"

export type Status = "playable" | "building" | "named" | "private"

export type Entry = {
  id: string
  title: string
  kicker: string
  genre: string
  engine: string
  language: string
  method: string
  status: Status
  statusLabel: string
  updated: string | null
  accent: string
  texture: "crt" | "stripe" | "liquid" | "stars" | "ash" | "iron" | "lake"
  series: "waterdrop" | null
  summary: string
  standout: string
  focus: { label: string; value: number }[]
  facts: { label: string; value: string }[]
  repo: string | null
}

export const entries: Entry[] = [
  {
    id: "hnt",
    title: "HnT",
    kicker: "Father and Son",
    genre: "Co-op beat 'em up",
    engine: "Godot 4.7",
    language: "GDScript",
    method: "Pixel, couch and online co-op",
    status: "playable",
    statusLabel: "Playable in the repo",
    updated: "2026-09-27",
    accent: "#e07a2f",
    texture: "stripe",
    series: null,
    summary:
      "A father and his son spend one night collecting evidence. The Basement Clinic billed them for therapy they never attended. Mayor Raven holds the eviction and the invoice. Story films sit between the acts.",
    standout: "Fourteen maps, films between the acts, and a couch or online second player.",
    focus: [
      { label: "Co-op", value: 92 },
      { label: "Films", value: 84 },
      { label: "Maps", value: 96 },
      { label: "Pixel", value: 80 },
    ],
    facts: [
      { label: "Repo", value: "Rebelyouthz/HnT" },
      { label: "Last commit", value: "27 Sep 2026" },
      { label: "Players", value: "Solo, couch, or host and join" },
      { label: "Acts", value: "Dock Street through the Processing Floor" },
    ],
    repo: "https://github.com/Rebelyouthz/HnT",
  },
  {
    id: "unremembered",
    title: "Unremembered",
    kicker: "Memories of the Forgotten",
    genre: "Open-world hack and slash",
    engine: "Godot 4.7",
    language: "GDScript",
    method: "Pixel, 2.5D story ARPG",
    status: "private",
    statusLabel: "Private build",
    updated: "2026-11-04",
    accent: "#d7c4a1",
    texture: "crt",
    series: null,
    summary:
      "A small open-world hack-and-slash ARPG. Pixel figures in a 2.5D world, built in Godot 4.7. The studio mark lives in this repo. The game itself stays private until a trailer is cut.",
    standout: "One world, melee, and the studio ident that this site redraws.",
    focus: [
      { label: "World", value: 78 },
      { label: "Melee", value: 86 },
      { label: "Pixel", value: 90 },
      { label: "Story", value: 70 },
    ],
    facts: [
      { label: "Repo", value: "Rebelyouthz/unremembered" },
      { label: "Last commit", value: "4 Nov 2026" },
      { label: "Visibility", value: "Private" },
      { label: "Logo", value: "Redrawn here as vectors" },
    ],
    repo: null,
  },
  {
    id: "core",
    title: "Core",
    kicker: "Waterdrop Survivor",
    genre: "Survivor",
    engine: "React and Canvas",
    language: "JavaScript",
    method: "Browser, 2D canvas",
    status: "playable",
    statusLabel: "Public snapshot",
    updated: "2026-10-02",
    accent: "#e4b15a",
    texture: "liquid",
    series: "waterdrop",
    summary:
      "The public browser build from 2 October 2026. Six weapons, seven enemies, two bosses, a camp, and a skill tree. Gold and water. Earlier canvas repos are passes of this same game, not extra editions.",
    standout: "A full browser run: weapons, camp, and two bosses.",
    focus: [
      { label: "Weapons", value: 76 },
      { label: "Camp", value: 82 },
      { label: "Browser", value: 94 },
      { label: "Bosses", value: 64 },
    ],
    facts: [
      { label: "Repo", value: "waterdroppixi-2026-10-02" },
      { label: "Last commit", value: "2 Oct 2026" },
      { label: "Weapons", value: "6, plus starters in the data" },
      { label: "Enemies", value: "7, and 2 bosses" },
    ],
    repo: "https://github.com/Rebelyouthz/waterdroppixi-2026-10-02",
  },
  {
    id: "space",
    title: "Space Edition",
    kicker: "Waterdrop Survivor",
    genre: "Survivor",
    engine: "Not matched",
    language: "Not matched",
    method: "Not matched to a repository",
    status: "named",
    statusLabel: "Named, no source yet",
    updated: null,
    accent: "#9eb6d6",
    texture: "stars",
    series: "waterdrop",
    summary:
      "Space Edition is a named part of the series. The Waterdrop repositories were read. None of them is this edition. The page stays up so the cold accent, the trailer gate, and the roadmap have a home.",
    standout: "Cold light and stars, in the same liquid frame as the rest of the series.",
    focus: [
      { label: "Stars", value: 48 },
      { label: "Liquid", value: 70 },
      { label: "Source", value: 8 },
      { label: "Trailer", value: 12 },
    ],
    facts: [
      { label: "Repo", value: "No match" },
      { label: "Language", value: "Not matched" },
      { label: "Method", value: "Not matched" },
      { label: "Status", value: "Named edition" },
    ],
    repo: null,
  },
  {
    id: "remnant",
    title: "Remnant",
    kicker: "Waterdrop Survivor",
    genre: "Survivor",
    engine: "Not matched",
    language: "Not matched",
    method: "Not matched to a repository",
    status: "named",
    statusLabel: "Named, no source yet",
    updated: null,
    accent: "#b9a394",
    texture: "ash",
    series: "waterdrop",
    summary:
      "Remnant is a named part of the series. No repository read as this edition. Ash in the same frame, and empty gates for film. It will not be guessed from a folder name.",
    standout: "Ash and afterheat. The drop is still the drop.",
    focus: [
      { label: "Ash", value: 52 },
      { label: "Liquid", value: 66 },
      { label: "Source", value: 8 },
      { label: "Trailer", value: 12 },
    ],
    facts: [
      { label: "Repo", value: "No match" },
      { label: "Language", value: "Not matched" },
      { label: "Method", value: "Not matched" },
      { label: "Status", value: "Named edition" },
    ],
    repo: null,
  },
  {
    id: "v4",
    title: "V4 Native",
    kicker: "Waterdrop Survivor",
    genre: "Survivor ARPG",
    engine: "Godot 4",
    language: "GDScript",
    method: "Native PC",
    status: "building",
    statusLabel: "Scaffold",
    updated: "2026-07-06",
    accent: "#c4b39a",
    texture: "iron",
    series: "waterdrop",
    summary:
      "The private Godot build that calls itself the one which should finish. The blueprint wants weighted movement, a camp of twelve, and a real ending. In the repo today: the project scaffold, the stat system, and an open phase 1.",
    standout: "Native PC, not another browser pass. The player controller is the next cut.",
    focus: [
      { label: "Native", value: 84 },
      { label: "Combat", value: 46 },
      { label: "Camp", value: 40 },
      { label: "Ending", value: 22 },
    ],
    facts: [
      { label: "Repo", value: "waterdrop-survivor-v4" },
      { label: "Blueprint", value: "6 Jul 2026" },
      { label: "Visibility", value: "Private" },
      { label: "Next", value: "Player controller" },
    ],
    repo: null,
  },
  {
    id: "sandbox",
    title: "Sandbox",
    kicker: "Engine 2.0",
    genre: "Survivor RPG",
    engine: "THREE.js",
    language: "JavaScript",
    method: "Browser, 3D arena and camp",
    status: "playable",
    statusLabel: "0.810 alpha",
    updated: "2026-06-24",
    accent: "#7ec8c3",
    texture: "lake",
    series: "waterdrop",
    summary:
      "RasmusVersion, last pushed 24 June 2026. A sentient waterdrop in an alien-contaminated lake, trying to get back to the collective. Sandbox 2.0 is the live game: a 3D camp, a crash site, an obelisk, and an AI named A.I.D.A. Its own build, not a copy of the canvas game.",
    standout: "3D camp and arena. Version 0.810 alpha in the repo's own notes.",
    focus: [
      { label: "3D", value: 88 },
      { label: "Camp", value: 74 },
      { label: "Combat", value: 80 },
      { label: "Story", value: 68 },
    ],
    facts: [
      { label: "Repo", value: "RasmusVersion" },
      { label: "Last push", value: "24 Jun 2026" },
      { label: "Stack", value: "THREE.js, global scripts" },
      { label: "Live file", value: "sandbox.html" },
    ],
    repo: "https://github.com/Rebelyouthz/RasmusVersion",
  },
]

export const lineage = [
  "Emegent-waterdrop-2d, wd2d, wd2d2, wd2d2New, and wd2d2Pixi are earlier or parallel React and canvas passes of the same 2D game. They sit under Core.",
  "waterdroppixi-september is a snapshot archive. Its active code is that same canvas line.",
  "Small-watersrop-survivor is a zip of the same frontend and backend shape, not a separate edition.",
  "ws is an empty repository. WaterdropSurvivorEmergent is a readme and no game.",
]

export type RoadmapRow = {
  id: string
  gameId: string
  date: string | null
  title: string
  status: Status
  detail: string
  next: string
}

export const roadmapSeed: RoadmapRow[] = [
  {
    id: "unr-ident",
    gameId: "unremembered",
    date: "2026-11-04",
    title: "Studio ident in the private build",
    status: "private" as const,
    detail: "The Godot ident and the painted mark are in the Unremembered repo. This site redraws that mark. No trailer yet.",
    next: "Cut a short ident capture and drop the URL in the desk.",
  },
  {
    id: "core-public",
    gameId: "core",
    date: "2026-10-02",
    title: "Public canvas snapshot",
    status: "playable" as const,
    detail: "React, canvas, six weapons, seven enemies, two bosses, camp and skill data.",
    next: "Put a gameplay still in the hero gate.",
  },
  {
    id: "hnt-maps",
    gameId: "hnt",
    date: "2026-09-27",
    title: "Fourteen maps in the repo",
    status: "playable" as const,
    detail: "Father and Son plays from Dock Street to the Processing Floor, with films between acts. Last commit on this date.",
    next: "A trailer, then a build link when a demo is worth posting.",
  },
  {
    id: "v4-scaffold",
    gameId: "v4",
    date: "2026-07-06",
    title: "Native blueprint and scaffold",
    status: "building" as const,
    detail: "Godot 4 project, event bus, pools, and the stat system. Phase 1 movement is not started.",
    next: "The player controller.",
  },
  {
    id: "sandbox-alpha",
    gameId: "sandbox",
    date: "2026-06-24",
    title: "Sandbox 2.0 alpha",
    status: "playable" as const,
    detail: "THREE.js survivor at 0.810. Lake, camp, crash site, obelisk. The repo calls Sandbox 2.0 the live game.",
    next: "A capture from sandbox.html for the hero gate.",
  },
  {
    id: "space-named",
    gameId: "space",
    date: null,
    title: "Space Edition is named",
    status: "named" as const,
    detail: "No repository read as Space Edition. Language and method stay blank on purpose.",
    next: "Match a repo when one actually is this edition, or start it.",
  },
  {
    id: "remnant-named",
    gameId: "remnant",
    date: null,
    title: "Remnant is named",
    status: "named" as const,
    detail: "No repository read as Remnant. The ash accent is reserved.",
    next: "Match a repo when one actually is this edition, or start it.",
  },
]

export function getEntry(id: string) {
  return entries.find((entry) => entry.id === id) ?? null
}

export function editions() {
  return entries.filter((entry) => entry.series === "waterdrop")
}

export function mergeRoadmap(extra: RoadmapRow[]) {
  return [...roadmapSeed, ...extra].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
}

export function prettyDate(iso: string | null) {
  if (!iso) return "No source date"
  const [year, month, day] = iso.split("-").map(Number)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return `${day} ${months[(month || 1) - 1]} ${year}`
}

export const weapons = {
  spoon: { name: "Spoon", atk: 1, kibble: 20, blurb: "Humble. Still a weapon." },
  pin: { name: "Gold pin", atk: 2, kibble: 70, blurb: "A bright little stab." },
  bass: { name: "Bass guitar", atk: 3, kibble: 120, blurb: "Heavy string, short swing." },
  hose: { name: "Drop hose", atk: 3, kibble: 160, blurb: "It whips. It drips." },
  hammer: { name: "Pixel hammer", atk: 4, kibble: 210, blurb: "A square hit." },
} as const

export const armors = {
  blankie: { name: "Blankie", def: 1, kibble: 25, blurb: "Soft. Counts." },
  shell: { name: "Eggshell shard", def: 1, kibble: 60, blurb: "A piece of the first room." },
  leather: { name: "Leather vest", def: 2, kibble: 100, blurb: "Sleeves optional." },
  jacket: { name: "Rock jacket", def: 3, kibble: 170, blurb: "Loud, and harder to chew." },
} as const

export const hats = [
  { id: "cap", name: "Soft cap", credits: 50 },
  { id: "crown", name: "Spike crown", credits: 70 },
  { id: "bell", name: "Bell hat", credits: 60 },
]

export const eyeExtras = [
  { id: "shine", name: "Shine", credits: 40 },
  { id: "glint", name: "Star glint", credits: 55 },
]

export const hairs = [
  { id: "fluff", name: "Fluff" },
  { id: "locs", name: "Locs" },
  { id: "mohawk", name: "Mohawk" },
  { id: "spikes", name: "Rock spikes" },
  { id: "mullet", name: "Mullet" },
  { id: "page", name: "Page" },
  { id: "braids", name: "Braids" },
  { id: "fringe", name: "Wet fringe" },
  { id: "bald", name: "Bald" },
]

export const dyes = [
  { id: "ink", name: "Ink", hex: "#1a120c", rare: false },
  { id: "gold", name: "Gold", hex: "#e4b15a", rare: false },
  { id: "amber", name: "Amber", hex: "#c47a2a", rare: false },
  { id: "cream", name: "Cream", hex: "#f3e2c4", rare: false },
  { id: "copper", name: "Copper", hex: "#a85a32", rare: false },
  { id: "green", name: "Rare green", hex: "#3f6b45", rare: true },
  { id: "red", name: "Rare red", hex: "#8e2f2a", rare: true },
]

export const eyeColors = [
  { id: "ink", hex: "#1a120c" },
  { id: "gold", hex: "#e4b15a" },
  { id: "cream", hex: "#f3e2c4" },
  { id: "ember", hex: "#e07a2f" },
  { id: "green", hex: "#8fbf7a" },
]

export const skills = [
  { id: "nap", tree: "brawl" as const, name: "Nap", level: 5, train: 0, blurb: "A short head-first bump." },
  { id: "headbutt", tree: "brawl" as const, name: "Headbutt", level: 10, train: 1, blurb: "Heavy, and it shows." },
  { id: "spike", tree: "brawl" as const, name: "Spike Roll", level: 20, train: 2, blurb: "A rolling hit that favors speed." },
  { id: "encore", tree: "brawl" as const, name: "Encore", level: 30, train: 3, blurb: "Hits again, a little softer." },
  { id: "puff", tree: "guard" as const, name: "Puff Up", level: 5, train: 0, blurb: "The next hit lands smaller." },
  { id: "stare", tree: "guard" as const, name: "Stare", level: 10, train: 1, blurb: "The other side swings softer." },
  { id: "shed", tree: "guard" as const, name: "Shed", level: 20, train: 2, blurb: "The next hit loses its edge." },
  { id: "beg", tree: "care" as const, name: "Beg", level: 10, train: 0, blurb: "A small heal. The eyes do the work." },
  { id: "feast", tree: "care" as const, name: "Feast", level: 20, train: 1, blurb: "Heals more when hunger is high." },
  { id: "hype", tree: "care" as const, name: "Hype", level: 30, train: 2, blurb: "A short, louder swing." },
]

export const rivals = [
  { id: "pebble", name: "Pebble", line: "The studio bell. Adult, round, already in." },
  { id: "soot", name: "Soot", line: "Async loadout. Carries the pixel hammer." },
  { id: "wick", name: "Wick", line: "Prime. Collar on. Does not rush." },
]

export const pebble: { stage: Stage; mood: number; stats: Stats; genes: Genes } = {
  stage: "tuffie",
  mood: 82,
  stats: { str: 8, agi: 7, vit: 9, foc: 6, cha: 8, lck: 5 },
  genes: {
    body: "round",
    furLength: "fluff",
    furPrimary: "#e4b15a",
    furSecondary: "#1a120c",
    pattern: "belly",
    eyeShape: "round",
    eyeColor: "#1a120c",
    mouth: "line",
    earTuft: "two",
  },
}

export const creditPacks = [
  { sku: "pouch", name: "Pouch", sek: 29, credits: 50 },
  { sku: "tin", name: "Tin", sek: 79, credits: 150 },
  { sku: "crate", name: "Crate", sek: 179, credits: 400 },
]

export function passProducts() {
  return [
    ...entries.map((entry) => ({
      sku: `pass-${entry.id}`,
      name: `${entry.title} Early Access`,
      sek: 89,
      scope: entry.id,
    })),
    { sku: "pass-studio", name: "Studio pass", sek: 199, scope: "studio" },
  ]
}

export function productBySku(sku: string) {
  const pack = creditPacks.find((item) => item.sku === sku)
  if (pack) return { sku, name: pack.name, sek: pack.sek, kind: "credits" as const, credits: pack.credits, scope: "" }
  const pass = passProducts().find((item) => item.sku === sku)
  if (pass) return { sku, name: pass.name, sek: pass.sek, kind: "pass" as const, credits: 500, scope: pass.scope }
  return null
}

function bark(tag: string, texts: string[]) {
  return texts.map((text, index) => ({ id: `${tag}-${index}`, tag, text }))
}

export const barks = [
  ...bark("default", ["Here.", "What now?", "Gold light."]),
  ...bark("egg", ["Tap. Tap.", "Warm?", "Not yet."]),
  ...bark("hatch_soon", ["The shell ticks!", "Soon?", "Hold still!"]),
  ...bark("hunger_low", ["Food.", "The spoon?", "Belly says no."]),
  ...bark("mood_low", ["Hmph.", "Not today.", "Come closer?"]),
  ...bark("level_up", ["Again!", "Taller?", "That counted!"]),
  ...bark("game_waterdrop", ["Drip.", "The lake?", "Wet gold."]),
  ...bark("game_hnt", ["Father and son!", "Hit!", "Invoice?"]),
  ...bark("game_unremembered", ["Pixel dark.", "A sword?", "I forget."]),
  ...bark("idle", ["Zzz.", "Still here.", "Blink."]),
  ...bark("shop", ["Shiny.", "Not a box.", "Point at it."]),
  ...bark("roadmap", ["Next?", "Dates.", "Then that."]),
  ...bark("wall", ["Say it.", "Short!", "They can read."]),
  ...bark("breed_ready", ["Both say yes?", "Not alone.", "Three days."]),
  ...bark("energy_empty", ["Tomorrow.", "No more fights.", "Sleep it off."]),
  ...bark("win", ["Yes!", "Again?", "Mud on them."]),
  ...bark("loss", ["Ow.", "Again tomorrow?", "Gear stays."]),
  ...bark("feed", ["More.", "Good.", "Crunch."]),
  ...bark("pet", ["Again!", "Soft.", "Stay."]),
]

export const badgeInfo: Record<string, string> = {
  hatch: "First hatch",
  win: "First win",
  wish3: "Three wishlists",
  scout: "Scout",
  supporter: "Supporter",
  prime: "Prime",
  breed: "First breed",
  live: "First live win",
  streak: "Seven-day streak",
}

export const gameIds = entries.map((entry) => entry.id)
