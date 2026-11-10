export type Stage = "egg" | "newborn" | "pup" | "teen" | "tuffie" | "prime"

export type StatKey = "str" | "agi" | "vit" | "foc" | "cha" | "lck"

export type Stats = Record<StatKey, number>

export type Genes = {
  body: "small" | "round" | "long" | "heavy"
  furLength: "bald" | "short" | "fluff" | "long" | "locs" | "tufts"
  furPrimary: string
  furSecondary: string
  pattern: "solid" | "belly" | "stripes" | "spots" | "mask"
  eyeShape: "round" | "sleepy" | "angry" | "star" | "uneven"
  eyeColor: string
  mouth: "line" | "gap" | "tooth" | "none"
  earTuft: "none" | "two" | "one"
}

export type GearSlots = {
  weapon: string | null
  armor: string | null
  hat: string | null
  dye: string | null
  eyes: string | null
  collar: boolean
}

export type Pet = {
  id: string
  name: string
  stage: Stage
  genes: Genes | null
  reserved: boolean
  stats: Stats
  unspent: number
  hunger: number
  mood: number
  bond: number
  xp: number
  level: number
  hatchedAt: number | null
  hatchAt: number
  warmed: boolean
  skills: Record<string, number>
  train: { brawl: number; guard: number; care: number }
  gear: GearSlots
  hair: string | null
  dirtyUntil: string | null
  energy: number
  energyDate: string
  cooldownBreed: number | null
  scar: boolean
  carded: boolean
}

export type Daily = {
  date: string
  fed: boolean
  trained: boolean
  pet: boolean
  games: string[]
  wallPosts: number
  roadmap: boolean
  wished: boolean
  cardClaimed: boolean
}

export type InboxNote = {
  id: string
  title: string
  body: string
  at: number
  read: boolean
}

export type Profile = {
  id: string
  name: string
  email: string
  owner: boolean
  createdAt: number
  inviteCode: string
  demoGuest: boolean
  kibble: number
  credits: number
  foodBags: number
  charmTokens: number
  charms: Partial<Stats>
  vipPass: boolean
  inner: boolean
  invites: number
  streak: number
  lastLoginDate: string | null
  lastHungerDate: string
  wishlist: string[]
  visitedEver: string[]
  shellWarmed: boolean
  wallCount: number
  alpha: Record<string, boolean>
  passes: string[]
  ownsCollar: boolean
  badges: string[]
  fulfilled: string[]
  owned: { weapons: string[]; armors: string[]; hats: string[]; eyes: string[]; dyes: string[]; hairs: string[] }
  inbox: InboxNote[]
  pets: Pet[]
  activePetId: string
  daily: Daily
  bankedXp: number
  rerolls: number
  freeRematch: string | null
}

export type WallPost = {
  id: string
  authorId: string
  authorName: string
  rank: string
  body: string
  target: string
  at: number
  reports: string[]
}

export type BreedOffer = {
  id: string
  fromId: string
  fromName: string
  toId: string
  petName: string
  genes: Genes
  stats: Stats
  mood: number
  stage: Stage
  expires: number
}

export type Desk = {
  roadmap: {
    id: string
    gameId: string
    date: string | null
    title: string
    status: "playable" | "building" | "named" | "private"
    detail: string
    next: string
  }[]
  media: Record<string, { video?: string; still?: string; build?: string }>
  barks: { id: string; tag: string; text: string }[]
  devlog: { id: string; title: string; body: string; at: number }[]
}

export type Root = {
  version: 1
  activeId: string | null
  profiles: Record<string, Profile>
  wall: WallPost[]
  redeems: { code: string; redeemerId: string; paid: boolean }[]
  breedOffers: BreedOffer[]
  desk: Desk
}
