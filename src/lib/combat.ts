import { armors, skills, weapons } from "@/data/catalog"

export type FighterCard = {
  name: string
  stage: string
  str: number
  agi: number
  vit: number
  foc: number
  cha: number
  lck: number
  skills: Record<string, number>
  weapon: string | null
  armor: string | null
  hunger: number
  bond: number
  collar: boolean
}

type Side = {
  name: string
  hp: number
  max: number
  atk: number
  def: number
  spd: number
  crit: number
  dodge: number
  skills: Record<string, number>
  hunger: number
  guard: boolean
  shed: number
  items: number
  last: number
}

export type Match = {
  id: string
  mode: "dummy" | "async" | "live"
  seed: number
  turn: "you" | "them"
  over: boolean
  winner: "you" | "them" | null
  you: Side
  them: Side
  log: string[]
  energyCost: number
  rivalId: string | null
}

const rivals: Record<string, FighterCard> = {
  pebble: {
    name: "Pebble",
    stage: "tuffie",
    str: 8,
    agi: 7,
    vit: 9,
    foc: 6,
    cha: 8,
    lck: 5,
    skills: { nap: 2, puff: 2, headbutt: 1 },
    weapon: "spoon",
    armor: "blankie",
    hunger: 64,
    bond: 40,
    collar: false,
  },
  soot: {
    name: "Soot",
    stage: "tuffie",
    str: 12,
    agi: 6,
    vit: 11,
    foc: 7,
    cha: 4,
    lck: 4,
    skills: { headbutt: 2, spike: 1, stare: 1 },
    weapon: "hammer",
    armor: "leather",
    hunger: 50,
    bond: 22,
    collar: false,
  },
  wick: {
    name: "Wick",
    stage: "prime",
    str: 13,
    agi: 12,
    vit: 12,
    foc: 10,
    cha: 9,
    lck: 8,
    skills: { spike: 2, encore: 1, shed: 2, hype: 1 },
    weapon: "pin",
    armor: "jacket",
    hunger: 70,
    bond: 84,
    collar: true,
  },
}

function clamp(value: number, max = 40) {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.min(max, Math.round(value)))
}

function mulberry32(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function toSide(card: FighterCard): Side {
  const str = clamp(card.str)
  const agi = clamp(card.agi)
  const vit = clamp(card.vit)
  const foc = clamp(card.foc)
  const lck = clamp(card.lck)
  const weapon = card.weapon && card.weapon in weapons ? weapons[card.weapon as keyof typeof weapons].atk : 0
  const armor = card.armor && card.armor in armors ? armors[card.armor as keyof typeof armors].def : 0
  const bond = clamp(card.bond, 100) + (card.collar ? 1 : 0)
  let atk = 3 + str + weapon
  if (clamp(card.hunger, 100) < 20) atk = Math.max(1, atk - 2)
  return {
    name: String(card.name || "Tuffie").slice(0, 24),
    hp: 24 + vit * 5,
    max: 24 + vit * 5,
    atk,
    def: 1 + Math.floor(vit / 3) + armor + (bond >= 70 ? 1 : 0),
    spd: 6 + agi,
    crit: 0.04 + foc * 0.012 + lck * 0.005,
    dodge: 0.03 + agi * 0.01,
    skills: card.skills || {},
    hunger: clamp(card.hunger, 100),
    guard: false,
    shed: 0,
    items: 1,
    last: 4,
  }
}

function hit(att: Side, def: Side, rng: () => number, power: number) {
  if (rng() < def.dodge) return { dmg: 0, note: "miss" }
  let dmg = Math.max(1, Math.round(att.atk * power - def.def * 0.45))
  if (def.guard) {
    dmg = Math.max(1, Math.round(dmg * 0.45))
    def.guard = false
  }
  if (def.shed > 0) {
    dmg = Math.max(1, Math.round(dmg * def.shed))
    def.shed = 0
  }
  if (rng() < att.crit) return { dmg: Math.round(dmg * 1.6), note: "crit" }
  return { dmg, note: "hit" }
}

function applySkill(att: Side, def: Side, rng: () => number, skillId: string) {
  const rank = Math.max(0, Math.min(3, att.skills[skillId] || 0))
  if (rank <= 0) return `${att.name} has no such trick.`
  if (skillId === "nap") {
    const swing = hit(att, def, rng, 0.7)
    def.hp -= swing.dmg
    att.last = swing.dmg
    return `${att.name} naps in for ${swing.dmg}.`
  }
  if (skillId === "headbutt") {
    const swing = hit(att, def, rng, 1.15)
    def.hp -= swing.dmg
    att.last = swing.dmg
    return `${att.name} headbutts for ${swing.dmg}.`
  }
  if (skillId === "spike") {
    const swing = hit(att, def, rng, 0.95 + rank * 0.05)
    def.hp -= swing.dmg
    att.last = swing.dmg
    return `${att.name} rolls through for ${swing.dmg}.`
  }
  if (skillId === "encore") {
    const dmg = Math.max(1, Math.round(att.last * (0.7 + rank * 0.08)))
    def.hp -= dmg
    return `${att.name} encores for ${dmg}.`
  }
  if (skillId === "puff") {
    att.guard = true
    att.def += rank
    return `${att.name} puffs up.`
  }
  if (skillId === "stare") {
    def.atk = Math.max(1, def.atk - (1 + rank))
    return `${att.name} stares. ${def.name} shrinks.`
  }
  if (skillId === "shed") {
    att.shed = Math.max(0.35, 0.6 - rank * 0.08)
    return `${att.name} sheds. The next hit will be smaller.`
  }
  if (skillId === "beg") {
    const heal = 4 + rank * 2
    att.hp = Math.min(att.max, att.hp + heal)
    return `${att.name} begs and mends ${heal}.`
  }
  if (skillId === "feast") {
    const heal = att.hunger > 60 ? 8 + rank * 2 : 2
    att.hp = Math.min(att.max, att.hp + heal)
    return `${att.name} feasts for ${heal}.`
  }
  att.atk += 1 + rank
  return `${att.name} gets loud.`
}

function strike(att: Side, def: Side, rng: () => number) {
  const swing = hit(att, def, rng, 1)
  def.hp -= swing.dmg
  att.last = swing.dmg
  const word = swing.note === "miss" ? "misses" : swing.note === "crit" ? "cracks" : "hits"
  return `${att.name} ${word} for ${swing.dmg}.`
}

function finish(match: Match): Match {
  if (match.you.hp <= 0 || match.them.hp <= 0 || match.log.length >= 28) {
    const youRatio = match.you.hp / match.you.max
    const themRatio = match.them.hp / match.them.max
    const winner = match.you.hp <= 0 ? "them" : match.them.hp <= 0 ? "you" : youRatio === themRatio ? "them" : youRatio > themRatio ? "you" : "them"
    return { ...match, over: true, winner, you: { ...match.you, hp: Math.max(0, match.you.hp) }, them: { ...match.them, hp: Math.max(0, match.them.hp) } }
  }
  return match
}

export function rewards(match: Match) {
  const win = match.winner === "you"
  if (match.mode === "dummy") {
    return { xp: win ? 20 : 8, kibble: win ? 4 : 1, mood: win ? 6 : -4, hunger: -3, dirty: false, energyCost: 0, win, live: false }
  }
  return {
    xp: win ? 50 : 15,
    kibble: win ? 8 : 2,
    mood: win ? 10 : -12,
    hunger: win ? -4 : -8,
    dirty: !win,
    energyCost: match.energyCost,
    win,
    live: match.mode === "live",
  }
}

export function publicState(match: Match) {
  return {
    id: match.id,
    mode: match.mode,
    over: match.over,
    winner: match.winner,
    turn: match.turn,
    you: { name: match.you.name, hp: Math.max(0, match.you.hp), max: match.you.max },
    them: { name: match.them.name, hp: Math.max(0, match.them.hp), max: match.them.max },
    log: match.log.slice(-8),
    rewards: match.over ? rewards(match) : null,
    skills: skills.filter((skill) => (match.you.skills[skill.id] || 0) > 0).map((skill) => skill.id),
  }
}

export function createMatch(input: { id: string; mode: Match["mode"]; you: FighterCard; rivalId?: string | null; free?: boolean }) {
  const rival = input.mode === "dummy" ? rivals.pebble : rivals[input.rivalId || "pebble"]
  if (!rival) return { error: "That rival is not in the bell." }
  const you = toSide(input.you)
  const them = toSide(input.mode === "dummy" ? { ...rivals.pebble, name: "Post", str: 4, agi: 4, vit: 5, skills: { nap: 1 } } : rival)
  const seed = (Date.now() ^ you.spd * 13) >>> 0
  const rng = mulberry32(seed || 1)
  const turn: Match["turn"] = you.spd === them.spd ? (rng() < 0.5 ? "you" : "them") : you.spd > them.spd ? "you" : "them"
  let match: Match = {
    id: input.id,
    mode: input.mode,
    seed,
    turn,
    over: false,
    winner: null,
    you,
    them,
    log: [`${you.name} faces ${them.name}.`],
    energyCost: input.mode === "dummy" ? 0 : input.free ? 0 : 1,
    rivalId: input.rivalId || null,
  }
  if (match.turn === "them") match = aiStep(match)
  return { match }
}

function aiStep(match: Match): Match {
  if (match.over || match.turn !== "them") return match
  const rng = mulberry32(match.seed + match.log.length * 17)
  const them = { ...match.them }
  const you = { ...match.you }
  let line = ""
  if (them.hp < them.max * 0.35 && them.items > 0) {
    them.items -= 1
    them.hp = Math.min(them.max, them.hp + 8)
    line = `${them.name} uses a ration.`
  } else if (them.hp < them.max * 0.5 && (them.skills.puff || 0) > 0 && !them.guard) {
    line = applySkill(them, you, rng, "puff")
  } else if ((them.skills.headbutt || 0) > 0 && rng() < 0.45) {
    line = applySkill(them, you, rng, "headbutt")
  } else {
    line = strike(them, you, rng)
  }
  match = finish({ ...match, you, them, log: [...match.log, line], turn: "you", seed: (match.seed + 1) >>> 0 })
  return match
}

export function act(match: Match, move: string, skillId?: string) {
  if (match.over) return match
  if (match.turn !== "you") return match
  const rng = mulberry32(match.seed + match.log.length * 29)
  const you = { ...match.you }
  const them = { ...match.them }
  let line = ""
  if (move === "guard") {
    you.guard = true
    line = `${you.name} guards.`
  } else if (move === "item") {
    if (you.items <= 0) line = `${you.name} pats an empty pocket.`
    else {
      you.items -= 1
      you.hp = Math.min(you.max, you.hp + 9)
      line = `${you.name} eats a ration.`
    }
  } else if (move === "skill") {
    line = applySkill(you, them, rng, skillId || "nap")
  } else {
    line = strike(you, them, rng)
  }
  let next = finish({ ...match, you, them, log: [...match.log, line], turn: "them" })
  if (!next.over) next = aiStep(next)
  return next
}

export { rivals }
