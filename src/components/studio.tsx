"use client"

import { armors, gameIds, hats, eyeExtras, productBySku, weapons } from "@/data/catalog"
import { ownerEmail } from "@/lib/supabase"
import {
  activePet,
  addXp,
  blankOwned,
  canBreed,
  cardReady,
  charmTotal,
  childPet,
  denCount,
  emptyRoot,
  freshDaily,
  makeEgg,
  makeId,
  rollGenes,
  payInvites,
  settleRoot,
  skillOpen,
  skillPoints,
  stockholmDate,
  titleRank,
  tryHatch,
} from "@/lib/model"
import type { Pet, Profile, Root, StatKey } from "@/lib/types"
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"

type CombatReward = {
  xp: number
  kibble: number
  mood: number
  hunger: number
  dirty: boolean
  energyCost: number
  win: boolean
  live: boolean
}

type StudioValue = {
  ready: boolean
  root: Root
  profile: Profile | null
  pet: Pet | null
  jump: number
  owner: boolean
  look: number
  setLook: (value: number) => void
  createLocal: (name: string, invite?: string) => void
  switchSeat: (id: string) => void
  logout: () => void
  visit: (id: string) => void
  wishlist: (id: string) => void
  readRoadmap: () => void
  postWall: (target: string, body: string) => string
  reportPost: (id: string) => void
  deletePost: (id: string) => void
  feed: (bag?: boolean) => string
  cuddle: () => string
  train: (tree: "brawl" | "guard" | "care") => string
  spendStat: (key: StatKey) => void
  spendSkill: (id: string) => string
  buyKibble: (kind: "weapon" | "armor" | "food" | "hearty", id?: string) => string
  buyCredit: (kind: "hair" | "hat" | "eyes" | "dye" | "vip", id: string) => string
  equip: (slot: "weapon" | "armor" | "hat" | "eyes" | "dye" | "hair" | "collar", id: string | null) => void
  useCharm: (key: StatKey) => string
  reroll: () => string
  claimCard: () => string
  setActive: (id: string) => void
  bringCard: (id: string, swapId?: string) => string
  applyCombat: (reward: CombatReward, rivalId: string | null, mode: string) => void
  grantSku: (sku: string, sessionId: string) => string
  offerBreed: (toId: string) => string
  acceptBreed: (offerId: string) => Promise<string>
  breedPebble: () => Promise<string>
  readInbox: (id: string) => void
  deskRoad: (row: Root["desk"]["roadmap"][number]) => void
  deskMedia: (id: string, patch: { video?: string; still?: string; build?: string }) => void
  deskBark: (tag: string, text: string) => void
  deskLog: (title: string, body: string) => void
  deskInner: (id: string, on: boolean) => void
  deskMail: (title: string, body: string) => void
}

const StudioContext = createContext<StudioValue | null>(null)

function nextDate(today: string) {
  const [year, month, day] = today.split("-").map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  date.setUTCDate(date.getUTCDate() + 1)
  return date.toISOString().slice(0, 10)
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, value))
}

function repair(parsed: Root): Root {
  const base = emptyRoot()
  const profiles: Root["profiles"] = {}
  for (const [id, profile] of Object.entries(parsed.profiles || {})) {
    profiles[id] = {
      ...profile,
      pets: profile.pets || [],
      inbox: profile.inbox || [],
      badges: profile.badges || [],
      wishlist: profile.wishlist || [],
      visitedEver: profile.visitedEver || [],
      passes: profile.passes || [],
      alpha: profile.alpha || {},
      charms: profile.charms || {},
      owned: profile.owned || blankOwned(),
      daily: profile.daily || freshDaily(stockholmDate()),
      fulfilled: profile.fulfilled || [],
      freeRematch: profile.freeRematch || null,
    }
  }
  return {
    ...base,
    ...parsed,
    profiles,
    wall: parsed.wall || [],
    redeems: parsed.redeems || [],
    breedOffers: parsed.breedOffers || [],
    desk: { ...base.desk, ...(parsed.desk || {}) },
  }
}

export function createSeat(root: Root, name: string, invite: string | null, now: number, today: string, email = "", id?: string) {
  const seatId = id || makeId()
  const egg = makeEgg("Tuffie", now, today)
  const knownInvite = Boolean(invite && invite !== seatId)
  const profile: Profile = {
    id: seatId,
    name: (name || "Player").trim().slice(0, 24) || "Player",
    email,
    owner: Object.keys(root.profiles).length === 0 || Boolean(email && email.toLowerCase() === ownerEmail()),
    createdAt: now,
    inviteCode: seatId,
    demoGuest: knownInvite,
    kibble: knownInvite ? 120 : 20,
    credits: 0,
    foodBags: 0,
    charmTokens: 0,
    charms: {},
    vipPass: false,
    inner: false,
    invites: 0,
    streak: 0,
    lastLoginDate: null,
    lastHungerDate: today,
    wishlist: [],
    visitedEver: [],
    shellWarmed: false,
    wallCount: 0,
    alpha: {},
    passes: [],
    ownsCollar: false,
    badges: [],
    fulfilled: [],
    owned: blankOwned(),
    inbox: [
      {
        id: makeId(),
        title: knownInvite ? "You came in with a link" : "The egg is yours",
        body: knownInvite
          ? "100 Kibble, and the egg leans toward a rare color. Look at a game, wish for it, warm the shell, and leave one line."
          : "Look at a game, wish for it, warm the shell, and leave one line on the wall.",
        at: now,
        read: false,
      },
    ],
    pets: [egg],
    activePetId: egg.id,
    daily: freshDaily(today),
    bankedXp: 0,
    rerolls: 0,
    freeRematch: null,
  }
  const redeems = knownInvite ? [...root.redeems, { code: invite as string, redeemerId: seatId, paid: false }] : root.redeems
  return payInvites({ ...root, activeId: seatId, profiles: { ...root.profiles, [seatId]: profile }, redeems }, today, now)
}

function mapActive(profile: Profile, fn: (pet: Pet) => Pet) {
  return { ...profile, pets: profile.pets.map((pet) => (pet.id === profile.activePetId ? fn(pet) : pet)) }
}

function childName(index: number) {
  return ["Pip", "Nub", "Mote", "Kip", "Bub", "Dot"][index % 6]
}

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [root, setRoot] = useState<Root>(emptyRoot)
  const [ready, setReady] = useState(false)
  const [jump, setJump] = useState(0)
  const [look, setLook] = useState(0)
  const fx = useRef(false)
  const rootRef = useRef(root)
  rootRef.current = root

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tt-games-v1")
      if (raw) {
        const parsed = JSON.parse(raw) as Root
        if (parsed?.version === 1) setRoot(settleRoot(repair(parsed), stockholmDate(), Date.now()))
      }
    } catch {
      /* empty seat is fine */
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    localStorage.setItem("tt-games-v1", JSON.stringify(root))
    if (fx.current) {
      fx.current = false
      setJump((value) => value + 1)
    }
  }, [root, ready])

  const commit = useCallback((fn: (current: Root, now: number, today: string) => { root: Root; jump?: boolean } | null) => {
    setRoot((prev) => {
      const now = Date.now()
      const today = stockholmDate()
      const settled = settleRoot(prev, today, now)
      const out = fn(settled, now, today)
      if (!out) return settled
      if (out.jump) fx.current = true
      return out.root
    })
  }, [])

  const profile = root.activeId ? root.profiles[root.activeId] ?? null : null
  const pet = profile ? activePet(profile) : null
  const owner = Boolean(profile && (profile.owner || (profile.email && profile.email.toLowerCase() === ownerEmail())))

  const requireProfile = (current: Root) => (current.activeId ? current.profiles[current.activeId] : null)

  const value = useMemo<StudioValue>(() => {
    const put = (current: Root, profileNext: Profile) => ({ ...current, profiles: { ...current.profiles, [profileNext.id]: profileNext } })
    return {
      ready,
      root,
      profile,
      pet,
      jump,
      owner,
      look,
      setLook,
      createLocal: (name, invite) => commit((current, now, today) => ({ root: createSeat(current, name, invite || null, now, today) })),
      switchSeat: (id) => commit((current) => (current.profiles[id] ? { root: { ...current, activeId: id } } : null)),
      logout: () => commit((current) => ({ root: { ...current, activeId: null } })),
      visit: (id) =>
        commit((current, now) => {
          const seat = requireProfile(current)
          if (!seat || seat.daily.games.includes(id)) return null
          const visitedEver = seat.visitedEver.includes(id) ? seat.visitedEver : [...seat.visitedEver, id]
          let next = addXp({ ...seat, visitedEver, daily: { ...seat.daily, games: [...seat.daily.games, id] } }, 10).profile
          next = mapActive(next, (item) => (item.stage === "egg" ? item : { ...item, bond: clamp(item.bond + 1) }))
          next = tryHatch(next, now)
          return { root: put(current, next) }
        }),
      wishlist: (id) =>
        commit((current, now) => {
          const seat = requireProfile(current)
          if (!seat || seat.wishlist.includes(id)) return null
          const wishlist = [...seat.wishlist, id]
          let badges = seat.badges
          if (wishlist.length >= 3 && !badges.includes("wish3")) badges = [...badges, "wish3"]
          let next = addXp({ ...seat, wishlist, badges, daily: { ...seat.daily, wished: true } }, 40).profile
          next = tryHatch(next, now)
          return { root: put(current, next), jump: true }
        }),
      readRoadmap: () =>
        commit((current) => {
          const seat = requireProfile(current)
          if (!seat || seat.daily.roadmap) return null
          const next = addXp({ ...seat, daily: { ...seat.daily, roadmap: true } }, 10).profile
          return { root: put(current, mapActive(next, (item) => (item.stage === "egg" ? item : { ...item, bond: clamp(item.bond + 1) }))) }
        }),
      postWall: (target, body) => {
        const text = body.trim().slice(0, 280)
        if (!profile || text.length < 1) return "Write a line first."
        commit((current, now) => {
          const seat = requireProfile(current)
          if (!seat) return null
          const posts = seat.daily.wallPosts
          let next = { ...seat, wallCount: seat.wallCount + 1, daily: { ...seat.daily, wallPosts: posts + 1 } }
          if (posts < 3) next = addXp(next, 15).profile
          next = mapActive(next, (item) => (item.stage === "egg" ? item : { ...item, bond: clamp(item.bond + 1) }))
          next = tryHatch(next, now)
          const wall = [
            { id: makeId(), authorId: seat.id, authorName: seat.name, rank: titleRank(seat, activePet(seat)?.level || 0), body: text, target, at: now, reports: [] },
            ...current.wall,
          ].slice(0, 80)
          return { root: { ...put(current, next), wall } }
        })
        return ""
      },
      reportPost: (id) =>
        commit((current) => {
          const seat = requireProfile(current)
          if (!seat) return null
          return {
            root: {
              ...current,
              wall: current.wall.map((post) => (post.id === id && post.authorId !== seat.id && !post.reports.includes(seat.id) ? { ...post, reports: [...post.reports, seat.id] } : post)),
            },
          }
        }),
      deletePost: (id) =>
        commit((current) => {
          const seat = requireProfile(current)
          if (!seat) return null
          return { root: { ...current, wall: current.wall.filter((post) => post.id !== id || (post.authorId !== seat.id && !seat.owner)) } }
        }),
      feed: (bag) => {
        if (!profile || !pet) return "No Tuffie."
        if (bag && profile.foodBags <= 0) return "No food bag."
        if (!bag && pet.stage !== "egg" && profile.kibble < 8) return "Need 8 Kibble."
        commit((current, now) => {
          const seat = requireProfile(current)
          const currentPet = seat ? activePet(seat) : null
          if (!seat || !currentPet) return null
          if (currentPet.stage === "egg") {
            let next = mapActive({ ...seat, shellWarmed: true }, (item) => ({ ...item, warmed: true }))
            if (!next.daily.fed) next = addXp({ ...next, daily: { ...next.daily, fed: true } }, 10).profile
            return { root: put(current, tryHatch(next, now)) }
          }
          const cost = bag ? 0 : 8
          const gain = bag ? 35 : 28
          let next = { ...seat, kibble: seat.kibble - cost, foodBags: seat.foodBags - (bag ? 1 : 0) }
          next = mapActive(next, (item) => ({ ...item, hunger: clamp(item.hunger + gain) }))
          if (!next.daily.fed) next = addXp({ ...next, daily: { ...next.daily, fed: true } }, 10).profile
          return { root: put(current, next) }
        })
        return ""
      },
      cuddle: () => {
        if (!profile || !pet || pet.stage === "egg") return "The shell takes warmth, not a cuddle."
        commit((current) => {
          const seat = requireProfile(current)
          if (!seat) return null
          let next = mapActive(seat, (item) => ({ ...item, mood: clamp(item.mood + 14), bond: clamp(item.bond + 3) }))
          if (!seat.daily.pet) next = addXp({ ...next, daily: { ...next.daily, pet: true } }, 10).profile
          return { root: put(current, next) }
        })
        return ""
      },
      train: (tree) => {
        if (!pet || pet.stage === "egg" || pet.stage === "newborn") return "Training starts at pup."
        if (profile && profile.daily.trained && profile.kibble < 15) return "Extra drills cost 15 Kibble."
        commit((current) => {
          const seat = requireProfile(current)
          const currentPet = seat ? activePet(seat) : null
          if (!seat || !currentPet || currentPet.stage === "egg") return null
          const extra = seat.daily.trained
          if (extra && seat.kibble < 15) return null
          let next = { ...seat, kibble: seat.kibble - (extra ? 15 : 0) }
          next = mapActive(next, (item) => ({ ...item, train: { ...item.train, [tree]: Math.min(8, item.train[tree] + 1) } }))
          if (!extra) next = addXp({ ...next, daily: { ...next.daily, trained: true } }, 20).profile
          return { root: put(current, next) }
        })
        return ""
      },
      spendStat: (key) =>
        commit((current) => {
          const seat = requireProfile(current)
          const currentPet = seat ? activePet(seat) : null
          if (!seat || !currentPet || currentPet.unspent <= 0 || currentPet.stage === "egg") return null
          const next = mapActive(seat, (item) => ({ ...item, unspent: item.unspent - 1, stats: { ...item.stats, [key]: item.stats[key] + 1 } }))
          return { root: put(current, next) }
        }),
      spendSkill: (id) => {
        if (!pet || !skillOpen(pet, id)) return "That trick is still shut."
        if (skillPoints(pet) <= 0) return "No skill points."
        if ((pet.skills[id] || 0) >= 3) return "That trick is full."
        commit((current) => {
          const seat = requireProfile(current)
          const currentPet = seat ? activePet(seat) : null
          if (!seat || !currentPet || !skillOpen(currentPet, id) || skillPoints(currentPet) <= 0) return null
          const rank = currentPet.skills[id] || 0
          if (rank >= 3) return null
          const next = mapActive(seat, (item) => ({ ...item, skills: { ...item.skills, [id]: rank + 1 } }))
          return { root: put(current, next) }
        })
        return ""
      },
      buyKibble: (kind, id) => {
        if (!profile) return "Sit down first."
        if (kind === "food") return "Feed from the den."
        if (kind === "hearty") {
          if (profile.kibble < 20 || !pet || pet.stage === "egg") return "Need 20 Kibble and a hatched Tuffie."
          commit((current) => {
            const seat = requireProfile(current)
            if (!seat || seat.kibble < 20) return null
            const next = mapActive({ ...seat, kibble: seat.kibble - 20 }, (item) => ({ ...item, hunger: clamp(item.hunger + 45), mood: clamp(item.mood + 6) }))
            return { root: put(current, next) }
          })
          return ""
        }
        const item = kind === "weapon" ? weapons[id as keyof typeof weapons] : armors[id as keyof typeof armors]
        if (!id || !item) return "Missing item."
        const owned = kind === "weapon" ? profile.owned.weapons : profile.owned.armors
        if (owned.includes(id)) return "Already on the peg."
        if (profile.kibble < item.kibble) return `Need ${item.kibble} Kibble.`
        const price = item.kibble
        commit((current) => {
          const seat = requireProfile(current)
          if (!seat) return null
          const list = kind === "weapon" ? seat.owned.weapons : seat.owned.armors
          if (list.includes(id) || seat.kibble < price) return null
          const ownedNext = kind === "weapon" ? { ...seat.owned, weapons: [...list, id] } : { ...seat.owned, armors: [...list, id] }
          return { root: put(current, { ...seat, kibble: seat.kibble - price, owned: ownedNext }) }
        })
        return ""
      },
      buyCredit: (kind, id) => {
        if (!profile) return "Sit down first."
        if (kind === "vip") {
          if (profile.credits < 200) return "Need 200 Credits."
          commit((current) => {
            const seat = requireProfile(current)
            if (!seat || seat.credits < 200) return null
            return { root: put(current, { ...seat, credits: seat.credits - 200, vipPass: true }) }
          })
          return ""
        }
        const price = kind === "hair" ? 45 : kind === "hat" ? hats.find((hat) => hat.id === id)?.credits || 0 : kind === "eyes" ? eyeExtras.find((extra) => extra.id === id)?.credits || 0 : 30
        const list = kind === "hair" ? profile.owned.hairs : kind === "hat" ? profile.owned.hats : kind === "eyes" ? profile.owned.eyes : profile.owned.dyes
        if (!price || list.includes(id)) return list.includes(id) ? "Already yours." : "Not for sale."
        if (profile.credits < price) return `Need ${price} Credits.`
        commit((current) => {
          const seat = requireProfile(current)
          if (!seat || seat.credits < price) return null
          const owned = { ...seat.owned }
          if (kind === "hair") owned.hairs = [...owned.hairs, id]
          if (kind === "hat") owned.hats = [...owned.hats, id]
          if (kind === "eyes") owned.eyes = [...owned.eyes, id]
          if (kind === "dye") owned.dyes = [...owned.dyes, id]
          return { root: put(current, { ...seat, credits: seat.credits - price, owned }) }
        })
        return ""
      },
      equip: (slot, id) =>
        commit((current) => {
          const seat = requireProfile(current)
          const currentPet = seat ? activePet(seat) : null
          if (!seat || !currentPet || currentPet.stage === "egg") return null
          if (slot === "weapon" && id && !seat.owned.weapons.includes(id)) return null
          if (slot === "armor" && id && !seat.owned.armors.includes(id)) return null
          if (slot === "hat" && id && !seat.owned.hats.includes(id)) return null
          if (slot === "eyes" && id && !seat.owned.eyes.includes(id)) return null
          if (slot === "dye" && id && !seat.owned.dyes.includes(id)) return null
          if (slot === "hair" && id && !seat.owned.hairs.includes(id) && id !== "bald") return null
          if (slot === "collar" && !seat.ownsCollar) return null
          const next = mapActive(seat, (item) => {
            if (slot === "hair") return { ...item, hair: id }
            if (slot === "collar") return { ...item, gear: { ...item.gear, collar: Boolean(id) } }
            return { ...item, gear: { ...item.gear, [slot]: id } }
          })
          return { root: put(current, next) }
        }),
      useCharm: (key) => {
        if (!profile) return "Sit down first."
        if (key === "lck") return "Luck is not charmed."
        if (profile.charmTokens <= 0) return "No charm."
        if (charmTotal(profile.charms) >= 3) return "Charm cap is +3."
        commit((current) => {
          const seat = requireProfile(current)
          if (!seat || seat.charmTokens <= 0 || charmTotal(seat.charms) >= 3) return null
          return { root: put(current, { ...seat, charmTokens: seat.charmTokens - 1, charms: { ...seat.charms, [key]: (seat.charms[key] || 0) + 1 } }) }
        })
        return ""
      },
      reroll: () => {
        if (!pet || pet.stage === "egg") return "Hatch first."
        if (!profile || profile.rerolls <= 0) return "No reroll."
        commit((current) => {
          const seat = requireProfile(current)
          const currentPet = seat ? activePet(seat) : null
          if (!seat || !currentPet || currentPet.stage === "egg" || seat.rerolls <= 0) return null
          const next = mapActive({ ...seat, rerolls: seat.rerolls - 1 }, (item) => ({ ...item, genes: rollGenes(Math.random, seat.demoGuest) }))
          return { root: put(current, next) }
        })
        return ""
      },
      claimCard: () => {
        if (!profile || !pet) return "No Tuffie."
        const readyCard = cardReady(profile, pet)
        if (!readyCard.done) return "The card is still open."
        if (profile.daily.cardClaimed) return "Already taken today."
        commit((current) => {
          const seat = requireProfile(current)
          const currentPet = seat ? activePet(seat) : null
          if (!seat || !currentPet || !cardReady(seat, currentPet).done || seat.daily.cardClaimed) return null
          return { root: put(current, { ...seat, foodBags: seat.foodBags + 1, daily: { ...seat.daily, cardClaimed: true } }) }
        })
        return ""
      },
      setActive: (id) =>
        commit((current) => {
          const seat = requireProfile(current)
          const chosen = seat?.pets.find((item) => item.id === id && !item.carded)
          if (!seat || !chosen) return null
          return { root: put(current, { ...seat, activePetId: id }) }
        }),
      bringCard: (id, swapId) => {
        if (!profile) return "Sit down first."
        const card = profile.pets.find((item) => item.id === id && item.carded)
        if (!card) return "No such card."
        if (denCount(profile) >= 3 && !swapId) return "The den is full. Swap with someone resting."
        commit((current) => {
          const seat = requireProfile(current)
          if (!seat) return null
          const full = denCount(seat) >= 3
          const pets = seat.pets.map((item) => {
            if (item.id === id) return { ...item, carded: false }
            if (full && item.id === swapId) return { ...item, carded: true }
            return item
          })
          return { root: put(current, { ...seat, pets, activePetId: id }) }
        })
        return ""
      },
      applyCombat: (reward, rivalId, mode) =>
        commit((current, now, today) => {
          const seat = requireProfile(current)
          const currentPet = seat ? activePet(seat) : null
          if (!seat || !currentPet) return null
          let next = addXp(seat, reward.xp, currentPet.id).profile
          next = { ...next, kibble: next.kibble + reward.kibble }
          if (reward.win && !next.badges.includes("win")) next = { ...next, badges: [...next.badges, "win"] }
          if (reward.win && reward.live && !next.badges.includes("live")) next = { ...next, badges: [...next.badges, "live"] }
          if (mode === "async" && rivalId) next = { ...next, freeRematch: rivalId }
          next = mapActive(next, (item) => ({
            ...item,
            mood: clamp(item.mood + reward.mood),
            hunger: clamp(item.hunger + reward.hunger),
            energy: Math.max(0, item.energy - reward.energyCost),
            dirtyUntil: reward.dirty ? nextDate(today) : item.dirtyUntil,
          }))
          const title = reward.win ? "Win" : "Loss"
          next = {
            ...next,
            inbox: [{ id: makeId(), title, body: reward.win ? "The bell kept the win. Gear stays." : "Mood dipped. Gear stays, and may be muddy until tomorrow.", at: now, read: false }, ...next.inbox].slice(0, 40),
          }
          return { root: put(current, next), jump: reward.win }
        }),
      grantSku: (sku, sessionId) => {
        if (!profile) return "Sit down first."
        if (profile.fulfilled.includes(sessionId)) return ""
        const product = productBySku(sku)
        if (!product) return "Unknown product."
        commit((current, now) => {
          const seat = requireProfile(current)
          if (!seat || seat.fulfilled.includes(sessionId)) return null
          const item = productBySku(sku)
          if (!item) return null
          let next: Profile = { ...seat, fulfilled: [...seat.fulfilled, sessionId], credits: seat.credits + item.credits }
          if (item.kind === "pass") {
            const scopes = item.scope === "studio" ? gameIds : [item.scope]
            const alpha = { ...next.alpha }
            for (const scope of scopes) alpha[scope] = true
            next = {
              ...next,
              alpha,
              passes: next.passes.includes(item.scope) ? next.passes : [...next.passes, item.scope],
              charmTokens: next.charmTokens + 1,
              ownsCollar: true,
              badges: next.badges.includes("supporter") ? next.badges : [...next.badges, "supporter"],
            }
            next = mapActive(next, (petItem) => ({ ...petItem, gear: { ...petItem.gear, collar: true } }))
          }
          next = {
            ...next,
            inbox: [{ id: makeId(), title: item.name, body: item.kind === "pass" ? "Early Access is on the account. The alpha opens when a build URL is in the desk." : `${item.credits} Credits are in.`, at: now, read: false }, ...next.inbox],
          }
          return { root: put(current, next) }
        })
        return ""
      },
      offerBreed: (toId) => {
        if (!profile || !pet?.genes) return "Hatch first."
        if (!canBreed(pet.stage, pet.mood)) return "Need an adult in a decent mood."
        if (pet.cooldownBreed && pet.cooldownBreed > Date.now()) return "Still cooling down."
        if (toId === profile.id) return "Not with yourself."
        commit((current, now) => {
          const seat = requireProfile(current)
          const currentPet = seat ? activePet(seat) : null
          if (!seat || !currentPet?.genes || !canBreed(currentPet.stage, currentPet.mood)) return null
          const offer = {
            id: makeId(),
            fromId: seat.id,
            fromName: seat.name,
            toId,
            petName: currentPet.name,
            genes: currentPet.genes,
            stats: currentPet.stats,
            mood: currentPet.mood,
            stage: currentPet.stage,
            expires: now + 10 * 60 * 1000,
          }
          return { root: { ...current, breedOffers: [offer, ...current.breedOffers].slice(0, 20) } }
        })
        return ""
      },
      acceptBreed: async (offerId) => {
        const current = rootRef.current
        const seat = current.activeId ? current.profiles[current.activeId] : null
        const offer = current.breedOffers.find((item) => item.id === offerId)
        const currentPet = seat ? activePet(seat) : null
        if (!seat || !offer || !currentPet?.genes) return "Nothing to accept."
        if (offer.toId !== seat.id) return "That offer is for another seat."
        if (Date.now() > offer.expires) return "The ten minutes passed."
        if (!canBreed(currentPet.stage, currentPet.mood) || !canBreed(offer.stage, offer.mood)) return "Mood or age is short."
        if (currentPet.cooldownBreed && currentPet.cooldownBreed > Date.now()) return "Still cooling down."
        const response = await fetch("/api/breed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ a: { genes: offer.genes, stats: offer.stats }, b: { genes: currentPet.genes, stats: currentPet.stats } }),
        })
        const data = await response.json()
        if (!data.ok) return data.error || "The breed did not take."
        commit((live, now, today) => placeChildren(live, offer.fromId, seat.id, data, now, today, offerId))
        return ""
      },
      breedPebble: async () => {
        const current = rootRef.current
        const seat = current.activeId ? current.profiles[current.activeId] : null
        const currentPet = seat ? activePet(seat) : null
        if (!seat || !currentPet?.genes) return "Hatch first."
        if (!canBreed(currentPet.stage, currentPet.mood)) return "Need an adult in a decent mood."
        if (currentPet.cooldownBreed && currentPet.cooldownBreed > Date.now()) return "Still cooling down."
        const { pebble } = await import("@/data/catalog")
        const response = await fetch("/api/breed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ a: { genes: currentPet.genes, stats: currentPet.stats }, b: { genes: pebble.genes, stats: pebble.stats } }),
        })
        const data = await response.json()
        if (!data.ok) return data.error || "Pebble shook their head."
        commit((live, now, today) => placeChildren(live, seat.id, null, data, now, today, null))
        return ""
      },
      readInbox: (id) =>
        commit((current) => {
          const seat = requireProfile(current)
          if (!seat) return null
          return { root: put(current, { ...seat, inbox: seat.inbox.map((item) => (item.id === id ? { ...item, read: true } : item)) }) }
        }),
      deskRoad: (row) => commit((current) => (ownerOf(current) ? { root: { ...current, desk: { ...current.desk, roadmap: [row, ...current.desk.roadmap] } } } : null)),
      deskMedia: (id, patch) =>
        commit((current) => (ownerOf(current) ? { root: { ...current, desk: { ...current.desk, media: { ...current.desk.media, [id]: { ...current.desk.media[id], ...patch } } } } } : null)),
      deskBark: (tag, text) =>
        commit((current) => (ownerOf(current) ? { root: { ...current, desk: { ...current.desk, barks: [...current.desk.barks, { id: makeId(), tag, text }] } } } : null)),
      deskLog: (title, body) =>
        commit((current, now) => (ownerOf(current) ? { root: { ...current, desk: { ...current.desk, devlog: [{ id: makeId(), title, body, at: now }, ...current.desk.devlog] } } } : null)),
      deskInner: (id, on) =>
        commit((current) => {
          if (!ownerOf(current) || !current.profiles[id]) return null
          const seat = current.profiles[id]
          return { root: put(current, { ...seat, inner: on }) }
        }),
      deskMail: (title, body) =>
        commit((current, now) => {
          if (!ownerOf(current)) return null
          const profiles = { ...current.profiles }
          for (const id of Object.keys(profiles)) {
            profiles[id] = { ...profiles[id], inbox: [{ id: makeId(), title, body, at: now, read: false }, ...profiles[id].inbox].slice(0, 40) }
          }
          return { root: { ...current, profiles } }
        }),
    }
    function ownerOf(current: Root) {
      const seat = current.activeId ? current.profiles[current.activeId] : null
      return Boolean(seat && (seat.owner || (seat.email && seat.email.toLowerCase() === ownerEmail())))
    }
  }, [commit, jump, look, owner, pet, profile, ready, root])

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
}

function placeChildren(root: Root, aId: string, bId: string | null, data: { genes: Pet["genes"]; statsA: Pet["stats"]; statsB: Pet["stats"] }, now: number, today: string, offerId: string | null) {
  const cooldown = now + 3 * 24 * 60 * 60 * 1000
  const profiles = { ...root.profiles }
  const give = (id: string | null, stats: Pet["stats"], genes: Pet["genes"]) => {
    if (!id || !profiles[id] || !genes) return
    const seat = profiles[id]
    const parent = activePet(seat)
    const carded = denCount(seat) >= 3
    const baby = childPet(childName(seat.pets.length), genes, stats, now, today, carded)
    let next = addXp({ ...seat, pets: [...seat.pets, baby] }, 80, parent?.id).profile
    if (!next.badges.includes("breed")) next = { ...next, badges: [...next.badges, "breed"], rerolls: next.rerolls + 1 }
    next = mapActive(next, (item) => ({ ...item, cooldownBreed: cooldown }))
    profiles[id] = {
      ...next,
      inbox: [{ id: makeId(), title: "An egg", body: carded ? `${baby.name} waits as a card until the den has room.` : `${baby.name} is in the den.`, at: now, read: false }, ...next.inbox],
    }
  }
  if (data.genes) {
    give(aId, data.statsA, data.genes)
    if (bId) give(bId, data.statsB, data.genes)
  }
  return {
    root: {
      ...root,
      profiles,
      breedOffers: offerId ? root.breedOffers.filter((offer) => offer.id !== offerId) : root.breedOffers,
    },
  }
}

export function useStudio() {
  const value = useContext(StudioContext)
  if (!value) throw new Error("Studio missing")
  return value
}
