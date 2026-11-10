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
  logo?: string
  still?: string
  stills?: string[]
  clip?: string
  story?: string[]
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
    statusLabel: "Playable on this machine",
    updated: "2026-10-11",
    accent: "#e07a2f",
    texture: "stripe",
    series: null,
    summary:
      "A father and his son spend one night collecting evidence. The Basement Clinic billed them for therapy they never attended. Mayor Raven holds the eviction and the invoice. Story films sit between the acts.",
    standout: "Fourteen maps, films between the acts, and a couch or online second player.",
    still: "/media/hnt-hideout.png",
    stills: ["/media/hnt-street.png"],
    clip: "/media/hnt-highlight.mp4",
    story: [
      "The Basement Clinic billed them for family therapy they never attended. Mayor Raven holds the eviction and the invoice on the same clipboard. They collect coping evidence so the clinic does not take the apartment or the Son's tutoring license. The night is one plot: a film between every act, then the Processing Floor.",
      "The story file opens on Raven Wharf, three nights ago. The clinic lights are still on. The Son says they were billed for a session they skipped. The Father says he was networking in the alley, with his feelings. Twelve sessions, nobody sat down, and the couch still charged rent. He did not even take off his shoes. The Son says that is the invoice.",
      "The homework is to collect coping evidence and file it in blood. If they file it, the Son keeps the tutoring license and the Father keeps the fridge. Dock Street is still hiring. Then the Intake Lot, the Fire Escapes, Group Circle, Neon Exchange, the Waiting Room, Rail Bridge, City Hall, Copay Orchard, Sleet Hour, Raven Grid, Ledger Dive, and Invoice Pier. The last fight is The Family Plan. The armor comes off first.",
    ],
    focus: [
      { label: "Co-op", value: 92 },
      { label: "Films", value: 84 },
      { label: "Maps", value: 96 },
      { label: "Pixel", value: 80 },
    ],
    facts: [
      { label: "On this machine", value: "father n son clips\\HnT" },
      { label: "Repo", value: "Rebelyouthz/HnT" },
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
      "Memories of the Forgotten. The title on this machine is a night shore: a moon, lanterns in a tree, and the pixel word UNREMEMBERED. Combat is light and heavy cuts. Fox's Mark is light, light, heavy: two short cuts, then a flat middle cut. A level cut at the neck takes the head off. Fox's Mark at the neck always does. A level cut above the eyes takes the top of the skull instead.",
    standout: "Fox's Mark. Light, light, heavy. The neck comes away.",
    logo: "/media/unremembered-logo.jpg",
    still: "/media/unremembered-title.png",
    stills: ["/media/unremembered-combat.png"],
    clip: "/media/unremembered-highlight.mp4",
    story: [
      "Ash washes up with no memory. The first act is the home country: Reedwake, Hollowroot, Lantern Vale, Stillbough, Coppermere, Thornwick, and the Brine Flats. He survives, builds Hollowroot, and learns to fight from Ochre, from the wizard Mordecai, and from the books. Eren is with him. The first name that comes back is Aldric.",
      "Before the shore he belonged to a resistance cell. They followed the Order through transport lists, payments, and seals, looking for people who had gone missing. In a prison archive he found the proof: the missing were still alive when the Order wiped their names.",
      "The campaign goes on with the friends who forgot too. In the rainforest he finds three of the cell. Tamsin Reed read the maps. Bram Hollis was learning the forge. Sister Wynn leaked the church registers. None of them remembers all of it. When two people who were there tell their half of a memory at the same fire, that memory plays for both. The first shared one is What I Told Them.",
      "They look for more survivors. Corvin, the cell's coder, has been framed in Vesperhaven. Nell Marrow is the prisoner Ash freed, and she remembers the rescue he has lost. They meet at the inn called The Copper Gull. That night they decide to build a guild: The Unremembered, Guild of the Forgotten Ones.",
      "Hearthward, outside Vesperhaven, becomes the new home. Hollowroot stays. The forge moves. At a round table they plan the work against the Order. The plan then runs four operations, through the wetlands, the sands, and the winter country, and ends above the clouds at the Crown of Glass. The last choice is Remember, Forget, Become, or the Eighth Time.",
    ],
    focus: [
      { label: "World", value: 78 },
      { label: "Melee", value: 86 },
      { label: "Pixel", value: 90 },
      { label: "Story", value: 70 },
    ],
    facts: [
      { label: "On this machine", value: "Conspiracy Of everything" },
      { label: "Move", value: "WASD, left click light, right click heavy" },
      { label: "Fox's Mark", value: "Light, light, heavy, at the neck" },
      { label: "Beheading", value: "A level neck cut. Fox's Mark always." },
    ],
    repo: null,
  },
  {
    id: "core",
    title: "Waterdrop Survivor",
    kicker: "Pixi, and the Space folder",
    genre: "Survivor",
    engine: "React and PixiJS",
    language: "JavaScript",
    method: "Browser, WebGL",
    status: "playable",
    statusLabel: "Same game, two folders",
    updated: "2026-10-02",
    accent: "#e4b15a",
    texture: "liquid",
    series: "waterdrop",
    still: "/media/waterdrop-forms.png",
    summary:
      "One game. The playable build is Waterdrop Pixi at C:\\Users\\timmi\\WaterdropPixi\\wd2d2Pixi-main, last written 2 October 2026. The folder named Waterdrop Survivor (Space edition) holds an older copy of that same Pixi game, from 18 August 2026, plus extra fonts and sounds. The menu that opened here asks you to choose a form: Pure Drop, Emberkin, Voidwalker, Runebearer, Eye-bound, Spectre. A.I.D.A. awakens. The first weapon is a rib snapped off the station.",
    standout: "Pixi and the Space edition folder are the same game. This is the page for both.",
    focus: [
      { label: "Weapons", value: 76 },
      { label: "Camp", value: 82 },
      { label: "Browser", value: 94 },
      { label: "Bosses", value: 64 },
    ],
    facts: [
      { label: "Playable folder", value: "WaterdropPixi\\wd2d2Pixi-main" },
      { label: "Older copy", value: "OneDrive\\Waterdrop Survivor (Space edition)" },
      { label: "Opened here", value: "Choose your form" },
      { label: "First weapon", value: "A snapped station rib" },
    ],
    repo: "https://github.com/Rebelyouthz/waterdroppixi-2026-10-02",
  },
  {
    id: "remnant",
    title: "Remnant",
    kicker: "Waterdrop Survivor",
    genre: "Survivor",
    engine: "Browser",
    language: "Not named in the capture",
    method: "Base44, in the browser",
    status: "playable",
    statusLabel: "Playing in the browser",
    updated: "2026-11-11",
    accent: "#b9a394",
    texture: "ash",
    series: "waterdrop",
    summary:
      "Waterdrop Survivor Remnant. The lake remembers what you were. The stones remember what you will become. Chapter 2 is Echoes of the Crash: survive the waves near the crash debris.",
    standout: "Rain, a camp between runs, and a resource run back through the gate.",
    still: "/media/remnant-title.png",
    stills: ["/media/remnant-fight.png", "/media/remnant-camp.png"],
    clip: "/media/remnant-highlight.mp4",
    story: [
      "The title is Waterdrop Survivor Remnant. Under it: the lake remembers what you were, and the stones remember what you will become.",
      "Chapter 2 is Echoes of the Crash. The job on the menu is to survive eight waves near the crash debris. Between runs the camp is still there: quest hall, rune tree, and a gate into a resource run.",
      "Aida asks for timber and stone. Through the gate, chop and mine, then carry it back. A raised rune tree pays skill points.",
    ],
    focus: [
      { label: "Ash", value: 52 },
      { label: "Liquid", value: 66 },
      { label: "Source", value: 8 },
      { label: "Trailer", value: 12 },
    ],
    facts: [
      { label: "Seen as", value: "Waterdrop Survivor Remnant" },
      { label: "Chapter", value: "2, Echoes of the Crash" },
      { label: "Camp", value: "Quest hall, rune tree, resource run" },
      { label: "Where", value: "Browser, Base44" },
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
  "Waterdrop Pixi and the folder named Waterdrop Survivor (Space edition) are the same game. The Space folder is the older copy. Both live on the Waterdrop Survivor page.",
  "Emegent-waterdrop-2d, wd2d, wd2d2, wd2d2New, and wd2d2Pixi are earlier or parallel passes of that same game.",
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
    gameId: "core",
    date: "2026-08-18",
    title: "The Space folder is the same Pixi game",
    status: "playable" as const,
    detail: "C:\\Users\\timmi\\OneDrive\\Waterdrop Survivor (Space edition)\\WaterdropPixi is an older copy of Waterdrop Pixi, not a second game.",
    next: "Keep one page. The October Pixi folder is the newer build.",
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
