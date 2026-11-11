"use client"

import { badgeInfo, entries } from "@/data/catalog"
import { defaultLook, earnedLook, lookOptions } from "@/data/looks"
import { useStudio } from "@/components/studio"
import { TuffieSprite } from "@/components/sprite"
import { groupsOf, titleRank, xpToNext } from "@/lib/model"
import type { Look } from "@/lib/types"
import Link from "next/link"
import { useEffect, useState } from "react"

const banner: Record<Look["banner"], string> = {
  ink: "linear-gradient(90deg, #090807, #161310)",
  gold: "linear-gradient(90deg, #2a2116, #e4b15a)",
  ember: "linear-gradient(90deg, #2a160e, #e07a2f)",
  dusk: "linear-gradient(90deg, #e4b15a, #e07a2f)",
}

const frame: Record<Look["frame"], string> = {
  line: "1px solid rgba(228,177,90,0.45)",
  gold: "2px solid #e4b15a",
  ember: "2px solid #e07a2f",
  twin: "3px double #e4b15a",
}

function nameClass(style: Look["name"]) {
  if (style === "tracked") return "tracking-[0.18em] uppercase"
  if (style === "gold") return "text-gold"
  return ""
}

export default function Page() {
  const { profile, pet, root, switchSeat, logout, equipLook } = useStudio()
  const [copied, setCopied] = useState(false)
  const [preview, setPreview] = useState<Look>(defaultLook)
  const [note, setNote] = useState("")
  useEffect(() => {
    try {
      const raw = localStorage.getItem("tt-look-preview")
      if (raw) setPreview({ ...defaultLook, ...JSON.parse(raw) })
    } catch {
      /* preview stays plain */
    }
  }, [])
  const look = profile?.look || preview
  const savePreview = (next: Look) => {
    setPreview(next)
    localStorage.setItem("tt-look-preview", JSON.stringify(next))
  }
  const choose = (key: keyof Look, value: string) => {
    const next = { ...look, [key]: value }
    if (!profile) {
      savePreview(next)
      setNote("Preview on this machine. A seat keeps a look only after you earn it.")
      return
    }
    if (!earnedLook(profile, key, value)) {
      const option = lookOptions.find((item) => item.key === key && item.value === value)
      setNote(option ? option.earn : "Not earned.")
      return
    }
    equipLook(next)
    setNote("")
  }
  return (
    <div className="max-w-3xl space-y-6">
      <header className="p-6" style={{ background: banner[look.banner], border: frame[look.frame] }}>
        <p className="text-xs tracking-[0.16em] text-gold uppercase">{look.flair === "none" ? "Member" : look.flair === "drip" ? "Drip" : "Spark"}</p>
        <h1 className={`text-5xl ${nameClass(look.name)}`}>{profile?.name || "Local preview"}</h1>
        {profile && pet ? <p className="text-gold">Rank {titleRank(profile, pet.level)}</p> : <p className="text-sm text-muted">No seat yet. The looks below are a preview, not a purchase.</p>}
        {profile && pet ? <p className="text-sm text-muted">Group {groupsOf(profile, pet.level).join(", ")}</p> : null}
      </header>
      {profile && pet ? (
        <div className="plate flex items-center gap-4 p-4">
          <div className={`w-28 ${look.pose === "hop" ? "jump" : ""}`} style={{ transform: look.pose === "lean" ? "rotate(-8deg)" : undefined }}>
            <TuffieSprite pet={pet} />
          </div>
          <div>
            <p>Level {pet.level}</p>
            <div className="mt-2 h-2 w-48 bg-black/40"><div className="h-full bg-[var(--gold)]" style={{ width: `${pet.stage === "egg" ? 8 : Math.min(100, (pet.xp / xpToNext(pet.level)) * 100)}%` }} /></div>
            <Link className="mt-2 inline-block text-sm text-gold" href="/tuffie">Open the den</Link>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted">Sit down when you want the egg. Trying a frame does not open a loot box.</p>
      )}
      <section className="space-y-4">
        <h2 className="text-2xl">Looks</h2>
        <p className="max-w-2xl text-sm text-muted">Frames, banners, flair, pose, and the name style are earned on the site. Gold and orange only. Nothing here is sold.</p>
        {(["frame", "banner", "flair", "pose", "name"] as const).map((key) => (
          <div key={key}>
            <p className="text-xs tracking-[0.14em] text-gold uppercase">{key}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {lookOptions.filter((item) => item.key === key).map((item) => {
                const on = look[key] === item.value
                const owned = profile ? earnedLook(profile, key, item.value) : true
                return (
                  <button key={item.value} className="plate px-3 py-2 text-left text-sm" style={{ borderColor: on ? "#e4b15a" : undefined }} onClick={() => choose(key, item.value)}>
                    <span className="block">{item.label}</span>
                    <span className="block text-xs text-muted">{profile && !owned ? item.earn : profile ? "Earned" : "Preview"}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
        {note ? <p className="text-sm text-gold">{note}</p> : null}
      </section>
      {profile && pet ? (
        <>
          <section>
            <h2 className="text-2xl">Badges</h2>
            <ul className="mt-2 flex flex-wrap gap-2">{profile.badges.map((badge) => <li key={badge} className="plate px-2 py-1 text-sm text-gold">{badgeInfo[badge] || badge}</li>)}</ul>
            {profile.badges.length === 0 ? <p className="text-sm text-muted">The ones you have show up here. The rest stay hidden.</p> : null}
          </section>
          <section>
            <h2 className="text-2xl">Wishlist</h2>
            <ul className="mt-2 text-sm">{profile.wishlist.map((id) => <li key={id}>{entries.find((entry) => entry.id === id)?.title || id}</li>)}</ul>
            {profile.wishlist.length === 0 ? <p className="text-sm text-muted">Nothing wished yet.</p> : null}
          </section>
          <section className="plate p-4 text-sm">
            <h2 className="text-2xl">Alpha</h2>
            <p className="mt-2">The demo is not up yet.</p>
          </section>
          <section className="space-y-2 text-sm">
            <button
              className="plate px-3 py-2"
              onClick={() => {
                const link = `${window.location.origin}/login?invite=${profile.inviteCode}`
                void navigator.clipboard.writeText(link)
                setCopied(true)
              }}
            >
              {copied ? "Link copied" : "Copy invite link"}
            </button>
            <div className="flex flex-wrap gap-2">
              {Object.values(root.profiles).map((seat) => (
                <button key={seat.id} className="plate px-3 py-1" onClick={() => switchSeat(seat.id)}>{seat.name}{seat.id === profile.id ? " · here" : ""}</button>
              ))}
            </div>
            <button className="text-muted" onClick={logout}>Leave this seat</button>
          </section>
        </>
      ) : (
        <Link className="plate inline-block px-4 py-2" href="/login">Sit down</Link>
      )}
    </div>
  )
}
