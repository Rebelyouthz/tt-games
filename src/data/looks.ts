import type { Look, Profile } from "@/lib/types"

export const defaultLook: Look = {
  frame: "line",
  banner: "ink",
  flair: "none",
  pose: "rest",
  name: "studio",
}

type Option<K extends keyof Look> = {
  key: K
  value: Look[K]
  label: string
  earn: string
  earned: (profile: Profile) => boolean
}

export const lookOptions: Option<keyof Look>[] = [
  { key: "frame", value: "line", label: "Line frame", earn: "Yours when you sit down.", earned: () => true },
  { key: "frame", value: "gold", label: "Gold frame", earn: "Look at a game.", earned: (profile) => profile.visitedEver.length > 0 },
  { key: "frame", value: "ember", label: "Ember frame", earn: "Wish for a game.", earned: (profile) => profile.wishlist.length > 0 },
  { key: "frame", value: "twin", label: "Twin frame", earn: "Earn a badge.", earned: (profile) => profile.badges.length > 0 },
  { key: "banner", value: "ink", label: "Ink banner", earn: "Yours when you sit down.", earned: () => true },
  { key: "banner", value: "gold", label: "Gold banner", earn: "Warm the shell.", earned: (profile) => profile.shellWarmed },
  { key: "banner", value: "ember", label: "Ember banner", earn: "Leave a line on the wall.", earned: (profile) => profile.wallCount > 0 },
  { key: "banner", value: "dusk", label: "Dusk banner", earn: "Hatch the egg.", earned: (profile) => profile.pets.some((pet) => pet.stage !== "egg") },
  { key: "flair", value: "none", label: "No flair", earn: "Yours when you sit down.", earned: () => true },
  { key: "flair", value: "drip", label: "Drip flair", earn: "Look at a game.", earned: (profile) => profile.visitedEver.length > 0 },
  { key: "flair", value: "spark", label: "Spark flair", earn: "Earn a badge.", earned: (profile) => profile.badges.length > 0 },
  { key: "pose", value: "rest", label: "Rest", earn: "Yours when you sit down.", earned: () => true },
  { key: "pose", value: "lean", label: "Lean", earn: "Bond past 20.", earned: (profile) => profile.pets.some((pet) => pet.bond >= 20) },
  { key: "pose", value: "hop", label: "Hop", earn: "Reach level 5.", earned: (profile) => profile.pets.some((pet) => pet.level >= 5) },
  { key: "name", value: "studio", label: "Studio name", earn: "Yours when you sit down.", earned: () => true },
  { key: "name", value: "tracked", label: "Wide tracking", earn: "Wish for a game.", earned: (profile) => profile.wishlist.length > 0 },
  { key: "name", value: "gold", label: "Gold name", earn: "Warm the shell.", earned: (profile) => profile.shellWarmed },
]

export function earnedLook(profile: Profile | null, key: keyof Look, value: string) {
  const option = lookOptions.find((item) => item.key === key && item.value === value)
  if (!option) return false
  if (!profile) return false
  return option.earned(profile)
}
