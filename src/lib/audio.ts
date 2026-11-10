"use client"

const cache = new Map<string, { play: () => void }>()
let mutedCache: boolean | null = null

export function isMuted() {
  if (typeof window === "undefined") return true
  if (mutedCache === null) mutedCache = localStorage.getItem("tt-mute") === "1"
  return mutedCache
}

export function setMuted(muted: boolean) {
  mutedCache = muted
  localStorage.setItem("tt-mute", muted ? "1" : "0")
}

export function play(src: string) {
  if (typeof window === "undefined" || isMuted()) return
  const existing = cache.get(src)
  if (existing) {
    existing.play()
    return
  }
  void import("howler").then(({ Howl }) => {
    const howl = new Howl({ src: [src], volume: 0.4 })
    cache.set(src, howl)
    if (!isMuted()) howl.play()
  })
}

export const playClick = () => play("/sfx/click.wav")
export const playHit = () => play("/sfx/hit.wav")
export const playDrop = () => play("/sfx/drop.wav")
