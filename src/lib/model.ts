import { dyes, eyeColors, skills } from "@/data/catalog"
import type { Daily, Desk, Genes, Pet, Profile, Root, StatKey, Stats, Stage } from "@/lib/types"

export const statKeys: StatKey[] = ["str", "agi", "vit", "foc", "cha", "lck"]

export function stockholmDate(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Stockholm",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now)
}

export function prevDate(today: string) {
  const [year, month, day] = today.split("-").map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  date.setUTCDate(date.getUTCDate() - 1)
  return date.toISOString().slice(0, 10)
}

export function daysBetween(from: string, to: string) {
  const [ay, am, ad] = from.split("-").map(Number)
  const [by, bm, bd] = to.split("-").map(Number)
  const a = Date.UTC(ay, am - 1, ad)
  const b = Date.UTC(by, bm - 1, bd)
  return Math.round((b - a) / 86400000)
}

export function makeId() {
  return crypto.randomUUID().slice(0, 8)
}

export function stageFor(level: number): Stage {
  if (level < 5) return "newborn"
  if (level < 10) return "pup"
  if (level < 20) return "teen"
  if (level < 40) return "tuffie"
  return "prime"
}

export function xpToNext(level: number) {
  return 50 * Math.max(level, 1)
}

export function freshDaily(date: string): Daily {
  return { date, fed: false, trained: false, pet: false, games: [], wallPosts: 0, roadmap: false, wished: false, cardClaimed: false }
}

export function emptyDesk(): Desk {
  return { roadmap: [], media: {}, barks: [], devlog: [] }
}

export function emptyRoot(): Root {
  return { version: 1, activeId: null, profiles: {}, wall: [], redeems: [], breedOffers: [], desk: emptyDesk() }
}

export function activePet(profile: Profile) {
  return profile.pets.find((pet) => pet.id === profile.activePetId) ?? profile.pets.find((pet) => !pet.carded) ?? null
}

export function denCount(profile: Profile) {
  return profile.pets.filter((pet) => !pet.carded).length
}

function pick<T>(rng: () => number, list: readonly T[]): T {
  return list[Math.floor(rng() * list.length)]
}

export function rollGenes(rng: () => number, invited: boolean): Genes {
  const commons = dyes.filter((dye) => !dye.rare)
  const rares = dyes.filter((dye) => dye.rare)
  const bodies = ["small", "round", "long", "heavy"] as const
  const lengths = ["bald", "short", "fluff", "long", "locs", "tufts"] as const
  const patterns = ["solid", "belly", "stripes", "spots", "mask"] as const
  const eyes = ["round", "sleepy", "angry", "star", "uneven"] as const
  const mouths = ["line", "gap", "tooth", "none"] as const
  const ears = ["none", "two", "one"] as const
  const primary = rng() < (invited ? 0.55 : 0.08) ? pick(rng, rares) : pick(rng, commons)
  return {
    body: pick(rng, bodies),
    furLength: pick(rng, lengths),
    furPrimary: primary.hex,
    furSecondary: pick(rng, commons).hex,
    pattern: pick(rng, patterns),
    eyeShape: pick(rng, eyes),
    eyeColor: pick(rng, eyeColors).hex,
    mouth: pick(rng, mouths),
    earTuft: pick(rng, ears),
  }
}

function statBias(body: Genes["body"], key: StatKey) {
  if (body === "heavy" && (key === "str" || key === "vit")) return 1
  if (body === "small" && key === "agi") return 1
  if (body === "small" && key === "str") return -1
  if (body === "long" && (key === "agi" || key === "foc")) return 1
  if (body === "round" && (key === "vit" || key === "cha")) return 1
  return 0
}

export function rollStats(rng: () => number, genes: Genes): Stats {
  const stats = {} as Stats
  for (const key of statKeys) {
    const rolled = 3 + Math.floor(rng() * 4) + statBias(genes.body, key)
    stats[key] = Math.max(3, Math.min(6, rolled))
  }
  return stats
}

export function questFlags(profile: Profile) {
  return {
    game: profile.visitedEver.length > 0,
    wish: profile.wishlist.length > 0,
    fed: profile.shellWarmed,
    wall: profile.wallCount > 0,
  }
}

export function questsDone(profile: Profile) {
  const flags = questFlags(profile)
  return flags.game && flags.wish && flags.fed && flags.wall
}

export function addXp(profile: Profile, amount: number, petId?: string) {
  if (amount <= 0) return { profile, leveled: false }
  const id = petId ?? profile.activePetId
  const index = profile.pets.findIndex((pet) => pet.id === id)
  if (index < 0) return { profile, leveled: false }
  const pet = profile.pets[index]
  if (pet.stage === "egg") return { profile: { ...profile, bankedXp: profile.bankedXp + amount }, leveled: false }
  let level = pet.level
  let xp = pet.xp + amount
  let gained = 0
  let guard = 0
  while (level > 0 && xp >= 50 * level && guard < 80) {
    xp -= 50 * level
    level += 1
    gained += 1
    guard += 1
  }
  const stage = stageFor(level)
  const nextPet: Pet = { ...pet, level, xp, stage, unspent: pet.unspent + gained, scar: pet.scar || stage === "prime" }
  const pets = profile.pets.slice()
  pets[index] = nextPet
  const badges = stage === "prime" && !profile.badges.includes("prime") ? [...profile.badges, "prime"] : profile.badges
  return { profile: { ...profile, pets, badges }, leveled: gained > 0 }
}

function note(profile: Profile, title: string, body: string, now: number) {
  return {
    ...profile,
    inbox: [{ id: makeId(), title, body, at: now, read: false }, ...profile.inbox].slice(0, 40),
  }
}

function openEgg(profile: Profile, pet: Pet, now: number) {
  const genes = pet.reserved && pet.genes ? pet.genes : rollGenes(Math.random, profile.demoGuest)
  const stats = pet.reserved ? pet.stats : rollStats(Math.random, genes)
  const born: Pet = {
    ...pet,
    genes,
    stats,
    stage: "newborn",
    level: 1,
    xp: 0,
    hatchedAt: now,
    hunger: 72,
    mood: 78,
    bond: 8,
    unspent: 0,
    energy: 5,
  }
  let next: Profile = { ...profile, pets: profile.pets.map((item) => (item.id === pet.id ? born : item)) }
  const bonus = pet.reserved ? 100 : 100 + next.bankedXp
  if (!pet.reserved) next = { ...next, bankedXp: 0 }
  next = addXp(next, bonus, pet.id).profile
  if (!next.badges.includes("hatch")) next = { ...next, badges: [...next.badges, "hatch"] }
  return note(next, "The shell opened", `${born.name} has genes now. They were not bought.`, now)
}

export function tryHatch(profile: Profile, now: number) {
  let next = profile
  for (const pet of profile.pets) {
    const current = next.pets.find((item) => item.id === pet.id)
    if (!current || current.stage !== "egg") continue
    const ready = current.reserved ? current.warmed || now >= current.hatchAt : questsDone(next) || now >= current.hatchAt
    if (!ready) continue
    next = openEgg(next, current, now)
  }
  return next
}

export function settleProfile(profile: Profile, today: string, now: number) {
  let next = profile
  if (next.daily.date !== today) next = { ...next, daily: freshDaily(today) }
  if (next.lastHungerDate !== today) {
    const missed = Math.min(7, Math.max(0, daysBetween(next.lastHungerDate, today)))
    next = {
      ...next,
      lastHungerDate: today,
      pets: next.pets.map((pet) => (pet.stage === "egg" || missed <= 0 ? pet : { ...pet, hunger: Math.max(0, pet.hunger - 18 * missed) })),
    }
  }
  if (next.pets.some((pet) => pet.energyDate !== today)) {
    next = { ...next, pets: next.pets.map((pet) => (pet.energyDate === today ? pet : { ...pet, energy: 5, energyDate: today })) }
  }
  if (next.pets.some((pet) => pet.dirtyUntil && pet.dirtyUntil <= today)) {
    next = { ...next, pets: next.pets.map((pet) => (pet.dirtyUntil && pet.dirtyUntil <= today ? { ...pet, dirtyUntil: null } : pet)) }
  }
  if (next.lastLoginDate !== today) {
    const streak = next.lastLoginDate === prevDate(today) ? next.streak + 1 : 1
    let stepped: Profile = { ...next, streak, lastLoginDate: today }
    let xp = 25
    if (streak % 7 === 0) {
      xp += 100
      stepped = {
        ...stepped,
        rerolls: stepped.rerolls + 1,
        badges: stepped.badges.includes("streak") ? stepped.badges : [...stepped.badges, "streak"],
      }
    }
    next = addXp(stepped, xp).profile
  }
  return tryHatch(next, now)
}

export function payInvites(root: Root, today: string, now: number) {
  if (!root.redeems.some((redeem) => !redeem.paid)) return root
  const profiles = { ...root.profiles }
  let changed = false
  const redeems = root.redeems.map((redeem) => {
    if (redeem.paid) return redeem
    const owner = Object.values(profiles).find((profile) => profile.inviteCode === redeem.code)
    if (!owner) return redeem
    let next = settleProfile(owner, today, now)
    next = { ...next, invites: next.invites + 1, kibble: next.kibble + 50, foodBags: next.foodBags + 1 }
    if (!next.badges.includes("scout")) next = { ...next, badges: [...next.badges, "scout"] }
    next = addXp(next, 200).profile
    next = note(next, "Someone used your link", "200 XP, a food bag, and 50 Kibble. That is a step toward Scout.", now)
    profiles[next.id] = next
    changed = true
    return { ...redeem, paid: true }
  })
  return changed ? { ...root, profiles, redeems } : root
}

export function settleRoot(root: Root, today: string, now: number) {
  let changed = false
  const profiles = { ...root.profiles }
  for (const id of Object.keys(profiles)) {
    const next = settleProfile(profiles[id], today, now)
    if (next !== profiles[id]) {
      profiles[id] = next
      changed = true
    }
  }
  const paid = payInvites({ ...root, profiles }, today, now)
  if (paid !== root && paid.redeems !== root.redeems) return paid
  return changed ? { ...root, profiles } : root
}

export function makeEgg(name: string, now: number, today: string): Pet {
  return {
    id: makeId(),
    name,
    stage: "egg",
    genes: null,
    reserved: false,
    stats: { str: 0, agi: 0, vit: 0, foc: 0, cha: 0, lck: 0 },
    unspent: 0,
    hunger: 80,
    mood: 80,
    bond: 0,
    xp: 0,
    level: 0,
    hatchedAt: null,
    hatchAt: now + 24 * 60 * 60 * 1000,
    warmed: false,
    skills: {},
    train: { brawl: 0, guard: 0, care: 0 },
    gear: { weapon: null, armor: null, hat: null, dye: null, eyes: null, collar: false },
    hair: null,
    dirtyUntil: null,
    energy: 5,
    energyDate: today,
    cooldownBreed: null,
    scar: false,
    carded: false,
  }
}

export function blankOwned() {
  return { weapons: [] as string[], armors: [] as string[], hats: [] as string[], eyes: [] as string[], dyes: [] as string[], hairs: [] as string[] }
}

export function groupsOf(profile: Profile, level: number) {
  const groups = ["Member"]
  if (profile.invites >= 1) groups.push("Scout")
  if (profile.invites >= 5) groups.push("Recruiter")
  if (profile.streak >= 7) groups.push("Regular")
  if (profile.passes.length > 0) groups.push("Supporter")
  if ((profile.passes.length > 0 && level >= 15) || profile.vipPass) groups.push("VIP")
  if (profile.inner) groups.push("Inner")
  return groups
}

export function titleRank(profile: Profile, level: number) {
  const groups = groupsOf(profile, level)
  return groups[groups.length - 1] || "Member"
}

export function skillPoints(pet: Pet) {
  const spent = Object.values(pet.skills).reduce((sum, value) => sum + value, 0)
  return Math.max(0, pet.level - spent)
}

export function skillOpen(pet: Pet, skillId: string) {
  const skill = skills.find((item) => item.id === skillId)
  if (!skill || pet.stage === "egg") return false
  return pet.level >= skill.level && pet.train[skill.tree] >= skill.train
}

export function derived(pet: Pet, charms: Partial<Stats>) {
  const str = pet.stats.str + (charms.str || 0)
  const agi = pet.stats.agi + (charms.agi || 0)
  const vit = pet.stats.vit + (charms.vit || 0)
  const foc = pet.stats.foc + (charms.foc || 0)
  const cha = pet.stats.cha + (charms.cha || 0)
  const lck = pet.stats.lck
  const bond = pet.bond
  return { str, agi, vit, foc, cha, lck, bond }
}

export function charmTotal(charms: Partial<Stats>) {
  return statKeys.reduce((sum, key) => sum + (key === "lck" ? 0 : charms[key] || 0), 0)
}

export function dailyCard(today: string) {
  const games = ["hnt", "unremembered", "core", "remnant", "v4", "sandbox"]
  const cares = ["feed", "pet", "train"] as const
  const socials = ["wall", "wishlist"] as const
  let hash = 0
  for (const char of today) hash = (hash * 33 + char.charCodeAt(0)) >>> 0
  return { gameId: games[hash % games.length], care: cares[hash % 3], social: socials[(hash >> 3) % 2] }
}

export function cardReady(profile: Profile, pet: Pet) {
  const card = dailyCard(profile.daily.date)
  const game = profile.daily.games.includes(card.gameId)
  const care = pet.stage === "egg" ? pet.warmed : card.care === "feed" ? profile.daily.fed : card.care === "pet" ? profile.daily.pet : profile.daily.trained
  const social = card.social === "wall" ? profile.daily.wallPosts > 0 : profile.daily.wished
  return { card, game, care, social, done: game && care && social }
}

const geneRows: { key: keyof Genes; values: readonly string[] }[] = [
  { key: "body", values: ["small", "round", "long", "heavy"] },
  { key: "furLength", values: ["bald", "short", "fluff", "long", "locs", "tufts"] },
  { key: "pattern", values: ["solid", "belly", "stripes", "spots", "mask"] },
  { key: "eyeShape", values: ["round", "sleepy", "angry", "star", "uneven"] },
  { key: "mouth", values: ["line", "gap", "tooth", "none"] },
  { key: "earTuft", values: ["none", "two", "one"] },
]

function stepValue(rng: () => number, values: readonly string[], current: string) {
  const index = Math.max(0, values.indexOf(current))
  const next = index + (rng() < 0.5 ? -1 : 1)
  return values[Math.max(0, Math.min(values.length - 1, next))]
}

export function inherit(a: Genes, b: Genes, aStats: Stats, bStats: Stats, rng: () => number) {
  const genes = { ...a }
  for (const row of geneRows) {
    const picked = rng() < 0.5 ? a[row.key] : b[row.key]
    genes[row.key] = (rng() < 0.1 ? stepValue(rng, row.values, String(picked)) : picked) as never
  }
  genes.furPrimary = rng() < 0.5 ? a.furPrimary : b.furPrimary
  genes.furSecondary = rng() < 0.5 ? a.furSecondary : b.furSecondary
  genes.eyeColor = rng() < 0.5 ? a.eyeColor : b.eyeColor
  if (rng() < 0.1) genes.furPrimary = rollGenes(rng, false).furPrimary
  const statsA = {} as Stats
  const statsB = {} as Stats
  for (const key of statKeys) {
    const lo = Math.min(aStats[key], bStats[key])
    const hi = Math.max(aStats[key], bStats[key])
    const span = hi - lo + 1
    statsA[key] = lo + Math.floor(rng() * span)
    statsB[key] = lo + Math.floor(rng() * span)
  }
  return { genes, statsA, statsB }
}

export function childPet(name: string, genes: Genes, stats: Stats, now: number, today: string, carded: boolean): Pet {
  return {
    ...makeEgg(name, now, today),
    genes,
    stats,
    reserved: true,
    carded,
    name,
  }
}

export function canFight(stage: Stage, mode: "dummy" | "async" | "live") {
  if (stage === "egg" || stage === "newborn") return false
  if (mode === "dummy") return stage === "pup" || stage === "teen" || stage === "tuffie" || stage === "prime"
  if (mode === "async") return stage === "tuffie" || stage === "prime"
  return stage === "teen" || stage === "tuffie" || stage === "prime"
}

export function canBreed(stage: Stage, mood: number) {
  return (stage === "tuffie" || stage === "prime") && mood > 40
}
