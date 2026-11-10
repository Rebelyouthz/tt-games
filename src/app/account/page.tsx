"use client"

import { badgeInfo, entries } from "@/data/catalog"
import { useStudio } from "@/components/studio"
import { TuffieSprite } from "@/components/sprite"
import { groupsOf, titleRank, xpToNext } from "@/lib/model"
import Link from "next/link"
import { useState } from "react"

export default function Page() {
  const { profile, pet, root, switchSeat, logout } = useStudio()
  const [copied, setCopied] = useState(false)
  if (!profile || !pet) {
    return (
      <div className="plate max-w-xl p-8">
        <h1 className="text-4xl">Account</h1>
        <p className="mt-3 text-muted">No seat on this machine yet.</p>
        <Link className="plate mt-4 inline-block px-4 py-2" href="/login">Sit down</Link>
      </div>
    )
  }
  const level = pet.level
  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <h1 className="text-5xl">{profile.name}</h1>
        <p className="text-gold">Rank {titleRank(profile, level)}</p>
        <p className="text-sm text-muted">Group {groupsOf(profile, level).join(", ")}</p>
      </header>
      <div className="plate flex items-center gap-4 p-4">
        <div className="w-28"><TuffieSprite pet={pet} /></div>
        <div>
          <p>Level {level}</p>
          <div className="mt-2 h-2 w-48 bg-black/40"><div className="h-full bg-[var(--gold)]" style={{ width: `${pet.stage === "egg" ? 8 : Math.min(100, (pet.xp / xpToNext(level)) * 100)}%` }} /></div>
          <Link className="mt-2 inline-block text-sm text-gold" href="/tuffie">Open the den</Link>
        </div>
      </div>
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
        <p className="text-muted">Early Access, or a guest who came in on an invite, opens a build when a URL is in the desk.</p>
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
    </div>
  )
}
