export type Meter = {
  label: string
  value: string
  /** 0 to 1, only for drawing. The caption is the fact. */
  fill: number
  source: string
  reading?: boolean
}

export type PlaySheet = {
  id: string
  how: string[]
  bars: Meter[]
  gauges: Meter[]
  genre: { label: string; at: number; note: string }
}

export const playSheets: PlaySheet[] = [
  {
    id: "unremembered",
    how: [
      "Ash moves on foot. In player_controller.gd the exported speeds are walk 1.5, run 4.6, and sprint 7.0, before any handling bonus.",
      "A light strike is the left mouse button or J. A heavy strike is the right mouse button. Fox's Mark, in data/combat/forms.json, is light, then light, then heavy.",
      "The fight is cuts, guards, and a bow. It is not a bullet swarm. Projectiles exist. The minute-to-minute play is stepping in and cutting.",
    ],
    bars: [
      { label: "Walk", value: "1.5", fill: 1.5 / 7, source: "player_controller.gd" },
      { label: "Run", value: "4.6", fill: 4.6 / 7, source: "player_controller.gd" },
      { label: "Sprint", value: "7.0", fill: 1, source: "player_controller.gd" },
    ],
    gauges: [
      { label: "Bullet-hell", value: "Low", fill: 0.18, source: "Melee files, plus a bow", reading: true },
    ],
    genre: { label: "Melee, toward a story brawler", at: 0.28, note: "Reading of the combat scripts, not a tag stored in the project." },
  },
  {
    id: "core",
    how: [
      "A run starts with the Hydro Pistol. That id is hydropistol in frontend/src/game/data.js, and engine.js puts it in ownedWeapons unless a start list is passed in.",
      "How many weapons you can carry is two gates. meta.weaponSlots is the character's hold, and the code uses 2 when that number is missing. This run's cap is 1 plus level divided by 4, and never below the weapons you already own. The hold you can fill is the smaller of those two.",
      "A level-up builds a pool and wants up to 4 options, then shows 3. data.js lists a long weapon table, including evolved forms such as hydropistol_evo.",
    ],
    bars: [
      { label: "Slots at run level 0", value: "1", fill: 0.5, source: "min(2, 1 + floor(0 / 4))" },
      { label: "Slots at run level 4", value: "2", fill: 1, source: "min(2, 1 + floor(4 / 4))" },
      { label: "Character hold if unset", value: "2", fill: 1, source: "meta.weaponSlots || 2" },
    ],
    gauges: [
      { label: "Bullet-hell", value: "High", fill: 0.86, source: "Survivor weapons and shots", reading: true },
    ],
    genre: { label: "Survivor, projectile", at: 0.84, note: "Reading. The repo does not store a bullet-hell score." },
  },
  {
    id: "remnant",
    how: [
      "No Remnant source was readable in the local Base44 cache. What follows is the screen Timmy captured, not a balance file.",
      "The title says Waterdrop Survivor Remnant. The lines under it are: the lake remembers what you were, and the stones remember what you will become.",
      "The menu that was open said Chapter 2, Echoes of the Crash, and the quest line said survive 8 waves near the crash debris. The camp map has a quest hall, a rune tree, and a resource run you enter. The fight shown is top-down, in the rain, with shots and a warm meter. WASD and E are printed on that camp screen.",
    ],
    bars: [
      { label: "Waves on that quest card", value: "8", fill: 0.8, source: "On-screen quest, one capture", reading: true },
      { label: "Chapter on that menu", value: "2", fill: 0.2, source: "On-screen menu, one capture", reading: true },
    ],
    gauges: [
      { label: "Bullet-hell", value: "High", fill: 0.8, source: "The rain fight in the capture", reading: true },
    ],
    genre: { label: "Survivor, camp between runs", at: 0.78, note: "Reading of the capture. Not measured from source." },
  },
]
