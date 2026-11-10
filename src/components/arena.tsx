"use client"

import { rivals } from "@/data/catalog"
import { useStudio } from "@/components/studio"
import { canFight, derived } from "@/lib/model"
import { useState } from "react"

type State = {
  id: string
  over: boolean
  winner: "you" | "them" | null
  turn: "you" | "them"
  you: { name: string; hp: number; max: number }
  them: { name: string; hp: number; max: number }
  log: string[]
  rewards: { xp: number; kibble: number; mood: number; hunger: number; dirty: boolean; energyCost: number; win: boolean; live: boolean } | null
  skills: string[]
  mode: string
} | null

export function Arena() {
  const { profile, pet, applyCombat } = useStudio()
  const [state, setState] = useState<State>(null)
  const [note, setNote] = useState("")
  const [rival, setRival] = useState("pebble")
  if (!profile || !pet) return <p className="plate p-6">The arena wants an account.</p>
  const card = () => {
    const stats = derived(pet, profile.charms)
    return { name: pet.name, stage: pet.stage, ...stats, skills: pet.skills, weapon: pet.gear.weapon, armor: pet.gear.armor, hunger: pet.hunger, collar: pet.gear.collar }
  }
  const start = async (mode: "dummy" | "async" | "live") => {
    if (!canFight(pet.stage, mode)) {
      setNote(mode === "dummy" ? "Sparring starts at pup." : mode === "async" ? "Async starts at adult." : "Live sparring starts at teen, and both have to accept.")
      return
    }
    if (mode !== "dummy" && pet.energy <= 0 && profile.freeRematch !== rival) {
      setNote("Energy is empty until midnight in Stockholm.")
      return
    }
    const response = await fetch("/api/combat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "start", mode, you: card(), rivalId: rival, free: mode === "async" && profile.freeRematch === rival }),
    })
    const data = await response.json()
    if (!data.ok) {
      setNote(data.error || "The bell is quiet.")
      return
    }
    setState(data.match)
    setNote(mode === "live" ? "Pebble accepted. The server keeps the turns." : "")
  }
  const act = async (move: string, skillId?: string) => {
    if (!state) return
    const response = await fetch("/api/combat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "act", id: state.id, move, skillId }),
    })
    const data = await response.json()
    if (!data.ok) return
    setState(data.match)
    if (data.match.over && data.match.rewards) applyCombat(data.match.rewards, rival, data.match.mode)
  }
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-4xl">Arena</h1>
        <p className="mt-2 max-w-2xl text-muted">Four buttons. Highest speed starts. Energy is 5 a day and reading the site never spends it. Egg, newborn, and pup cannot be attacked. A loss costs mood, not the ball, not the gear.</p>
        <p className="mt-2 text-sm">Energy {pet.energy}/5 · {pet.stage}</p>
      </header>
      <div className="flex flex-wrap gap-2">
        {rivals.map((item) => (
          <button key={item.id} className="plate px-3 py-2 text-left text-sm" onClick={() => setRival(item.id)}>
            <span className="block">{item.name}</span>
            <span className="text-muted">{item.line}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="plate px-3 py-2" onClick={() => start("dummy")}>Spar the post</button>
        <button className="plate px-3 py-2" onClick={() => start("async")}>Async attack</button>
        <button className="plate px-3 py-2" onClick={() => start("live")}>Ring the bell</button>
      </div>
      {note ? <p className="text-gold">{note}</p> : null}
      {state ? (
        <section className="plate p-4 space-y-3">
          <p>{state.you.name} {state.you.hp}/{state.you.max} · {state.them.name} {state.them.hp}/{state.them.max}</p>
          <div className="flex flex-wrap gap-2">
            <button className="plate px-3 py-2" onClick={() => act("strike")} disabled={state.over}>Strike</button>
            <button className="plate px-3 py-2" onClick={() => act("guard")} disabled={state.over}>Guard</button>
            <button className="plate px-3 py-2" onClick={() => act("item")} disabled={state.over}>Item</button>
            {state.skills.map((skill) => (
              <button key={skill} className="plate px-3 py-2 capitalize" onClick={() => act("skill", skill)} disabled={state.over}>{skill}</button>
            ))}
          </div>
          <ul className="space-y-1 text-sm text-muted">
            {state.log.map((line, index) => <li key={index}>{line}</li>)}
          </ul>
          {state.over ? <p className="text-gold">{state.winner === "you" ? "Win." : "Loss."} The numbers came from the server.</p> : null}
        </section>
      ) : null}
    </div>
  )
}
