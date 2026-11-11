"use client"

import { armors, badgeInfo, dyes, hairs, hats, eyeExtras, skills, weapons } from "@/data/catalog"
import { TuffieSprite } from "@/components/sprite"
import { useStudio } from "@/components/studio"
import { Plate } from "@/components/ui"
import { cardReady, charmTotal, derived, groupsOf, questFlags, skillOpen, skillPoints, titleRank, xpToNext } from "@/lib/model"
import type { StatKey } from "@/lib/types"
import Link from "next/link"
import { useEffect, useState } from "react"

function Drill({ label, onDone }: { label: string; onDone: () => void }) {
  const [pos, setPos] = useState(0)
  const [hits, setHits] = useState(0)
  useEffect(() => {
    let frame = 0
    const start = performance.now()
    const loop = (now: number) => {
      const cycle = ((now - start) / 900) % 2
      setPos(cycle < 1 ? cycle : 2 - cycle)
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [])
  return (
    <div className="space-y-2">
      <p className="text-sm">{label}</p>
      <div className="relative h-3 bg-black/50">
        <div className="absolute inset-y-0 left-[42%] w-[16%] bg-[var(--gold)]/50" />
        <div className="absolute top-0 h-3 w-1 bg-paper" style={{ left: `${pos * 100}%` }} />
      </div>
      <button
        className="plate px-3 py-1 text-sm"
        onClick={() => {
          if (pos > 0.42 && pos < 0.58) {
            const next = hits + 1
            setHits(next)
            if (next >= 3) onDone()
          } else setHits(0)
        }}
      >
        Now
      </button>
      <p className="text-xs text-muted">{hits} / 3</p>
    </div>
  )
}

export function Den() {
  const studio = useStudio()
  const { profile, pet } = studio
  const [note, setNote] = useState("")
  const [drill, setDrill] = useState<"brawl" | "guard" | "care" | null>(null)
  if (!profile || !pet) {
    return (
      <div className="plate p-8">
        <h1 className="text-4xl">The den</h1>
        <p className="mt-3 text-muted">An account gets the egg.</p>
        <Plate href="/login?next=/tuffie" className="mt-4 inline-block">Sit down</Plate>
      </div>
    )
  }
  const flags = questFlags(profile)
  const stats = derived(pet, profile.charms)
  const card = cardReady(profile, pet)
  const level = pet.level
  const say = (text: string) => setNote(text)
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-4">
        <div className="plate p-4">
          <TuffieSprite pet={pet} className="mx-auto w-48" />
          <h1 className="mt-2 text-3xl">{pet.name}</h1>
          <p className="text-sm capitalize text-gold">{pet.stage}</p>
          <p className="text-sm text-gold">Rank {titleRank(profile, level)}</p>
          <p className="text-sm text-muted">Group {groupsOf(profile, level).join(", ")}</p>
          {pet.stage !== "egg" ? (
            <div className="mt-3">
              <p className="text-xs text-muted">Level {level} · {pet.xp}/{xpToNext(level)} XP</p>
              <div className="mt-1 h-1.5 bg-black/40"><div className="h-full bg-[var(--gold)]" style={{ width: `${Math.min(100, (pet.xp / xpToNext(level)) * 100)}%` }} /></div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted">Hatches in a day, or the same evening if the four first things are done.</p>
          )}
        </div>
        <div className="plate p-4 text-sm">
          <p>Kibble {profile.kibble}</p>
          <p>Credits {profile.credits}</p>
          <p>Food bags {profile.foodBags}</p>
          <p>Energy {pet.energy}/5</p>
          <p>Rerolls {profile.rerolls}</p>
        </div>
      </aside>
      <div className="space-y-6">
        {pet.stage === "egg" ? (
          <section className="plate p-4">
            <h2 className="text-2xl">The shell</h2>
            <ul className="mt-3 space-y-1 text-sm">
              <li>{flags.game ? "Seen a game." : "Look at a game."}</li>
              <li>{flags.wish ? "Wished." : "Wish for a game."}</li>
              <li>{flags.fed ? "Shell warmed." : "Warm the shell."}</li>
              <li>{flags.wall ? "A line on the wall." : "Leave one line on the wall."}</li>
            </ul>
          </section>
        ) : (
          <section className="plate p-4">
            <h2 className="text-2xl">Stats</h2>
            <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
              {(["str", "agi", "vit", "foc", "cha", "lck"] as StatKey[]).map((key) => (
                <button key={key} className="plate px-2 py-2 uppercase" onClick={() => studio.spendStat(key)}>
                  {key} {stats[key]}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted">Unspent {pet.unspent}. Luck is never charmed. Charms {charmTotal(profile.charms)}/3, tokens {profile.charmTokens}.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["str", "agi", "vit", "foc", "cha"] as StatKey[]).map((key) => (
                <button key={key} className="text-xs text-gold" onClick={() => say(studio.useCharm(key))}>Charm {key}</button>
              ))}
              <button className="text-xs text-gold" onClick={() => say(studio.reroll())}>Reroll genes</button>
            </div>
            {pet.genes ? (
              <p className="mt-3 text-sm text-muted">
                {pet.genes.body}, {pet.genes.furLength}, {pet.genes.pattern}, {pet.genes.eyeShape} eyes, {pet.genes.mouth} mouth, ears {pet.genes.earTuft}.
                {pet.hair ? ` Hair: ${pet.hair}.` : ""}
                {pet.dirtyUntil ? ` Muddy until ${pet.dirtyUntil}.` : ""}
              </p>
            ) : null}
          </section>
        )}
        <section className="plate p-4">
          <h2 className="text-2xl">Care</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Plate onClick={() => say(studio.feed(false))}>{pet.stage === "egg" ? "Warm the shell" : "Feed · 8 Kibble"}</Plate>
            <Plate onClick={() => say(studio.feed(true))}>Use a food bag</Plate>
            <Plate onClick={() => say(studio.cuddle())}>Cuddle</Plate>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3 text-sm">
            <p>Hunger {pet.stage === "egg" ? "—" : pet.hunger}</p>
            <p>Mood {pet.stage === "egg" ? "—" : pet.mood}</p>
            <p>Bond {pet.bond}{pet.gear.collar ? " + collar" : ""}</p>
          </div>
        </section>
        <section className="plate p-4">
          <h2 className="text-2xl">Today</h2>
          <p className="mt-2 text-sm">See {card.card.gameId}. Care: {card.card.care}. Social: {card.card.social}.</p>
          <p className="text-sm text-muted">{card.game ? "Game done." : "Game open."} {card.care ? "Care done." : "Care open."} {card.social ? "Social done." : "Social open."}</p>
          <Plate className="mt-3" onClick={() => say(studio.claimCard())}>{profile.daily.cardClaimed ? "Bag taken" : "Take the food bag"}</Plate>
        </section>
        <section className="plate p-4">
          <h2 className="text-2xl">Drills</h2>
          <p className="text-sm text-muted">One free drill a day. Later ones cost 15 Kibble. Pup starts with Nap and Puff Up.</p>
          <div className="mt-3 flex gap-2">
            {(["brawl", "guard", "care"] as const).map((tree) => (
              <button key={tree} className="plate px-3 py-1 capitalize" onClick={() => setDrill(tree)}>{tree} {pet.train[tree]}</button>
            ))}
          </div>
          {drill ? <div className="mt-3"><Drill label={drill === "brawl" ? "Swing in the gold." : drill === "guard" ? "Hold the look. Same gold bar." : "Beg on the beat."} onDone={() => { say(studio.train(drill)); setDrill(null) }} /></div> : null}
        </section>
        {pet.stage !== "egg" ? (
          <section className="plate p-4">
            <h2 className="text-2xl">Skills</h2>
            <p className="text-sm text-muted">Points left {skillPoints(pet)}. Three in one trick, no more.</p>
            <ul className="mt-3 space-y-2 text-sm">
              {skills.map((skill) => (
                <li key={skill.id} className="flex items-center justify-between gap-3">
                  <span>{skill.name} · {pet.skills[skill.id] || 0}/3 · {skill.blurb}</span>
                  <button className="text-gold" onClick={() => say(studio.spendSkill(skill.id))}>{skillOpen(pet, skill.id) ? "Spend" : "Shut"}</button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        <section className="plate p-4">
          <h2 className="text-2xl">Gear</h2>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            {profile.owned.weapons.map((id) => <button key={id} onClick={() => studio.equip("weapon", id)}>{weapons[id as keyof typeof weapons]?.name}</button>)}
            {profile.owned.armors.map((id) => <button key={id} onClick={() => studio.equip("armor", id)}>{armors[id as keyof typeof armors]?.name}</button>)}
            {profile.owned.hats.map((id) => <button key={id} onClick={() => studio.equip("hat", id)}>{hats.find((hat) => hat.id === id)?.name}</button>)}
            {profile.owned.eyes.map((id) => <button key={id} onClick={() => studio.equip("eyes", id)}>{eyeExtras.find((extra) => extra.id === id)?.name}</button>)}
            {profile.owned.dyes.map((id) => <button key={id} onClick={() => studio.equip("dye", dyes.find((dye) => dye.id === id)?.hex || null)}>{id}</button>)}
            {profile.owned.hairs.map((id) => <button key={id} onClick={() => studio.equip("hair", id)}>{hairs.find((hair) => hair.id === id)?.name}</button>)}
            {profile.ownsCollar ? <button onClick={() => studio.equip("collar", pet.gear.collar ? null : "on")}>Collar</button> : null}
          </div>
          <p className="mt-2 text-xs text-muted">Buy the rest in the shop. Gear is not lost. A loss can muddy it for a day.</p>
        </section>
        <section className="plate p-4">
          <h2 className="text-2xl">Den</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            {profile.pets.map((item) => (
              <button key={item.id} className="w-24 text-center text-xs" onClick={() => (item.carded ? say(studio.bringCard(item.id, pet.id)) : studio.setActive(item.id))}>
                <TuffieSprite pet={item} />
                {item.name} {item.carded ? "(card)" : item.id === pet.id ? "(out)" : "(rest)"}
              </button>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <Plate href="/tuffie/run">Run</Plate>
            <Plate href="/tuffie/arena">Arena</Plate>
            <Plate href="/tuffie/breed">Breed</Plate>
          </div>
        </section>
        <section className="plate p-4">
          <h2 className="text-2xl">Badges</h2>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm text-gold">
            {profile.badges.map((badge) => <li key={badge} className="plate px-2 py-1">{badgeInfo[badge] || badge}</li>)}
          </ul>
          {profile.badges.length === 0 ? <p className="text-sm text-muted">None yet. Missing ones stay off the wall.</p> : null}
        </section>
        {note ? <p className="text-gold">{note}</p> : null}
        <p className="text-sm"><Link href="/account">Profile</Link></p>
      </div>
    </div>
  )
}
