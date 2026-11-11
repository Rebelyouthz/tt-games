"use client"

import { useStudio } from "@/components/studio"
import { Plate } from "@/components/ui"
import { useEffect, useRef, useState } from "react"

type Mode = "nest" | "storm"
type Weapon = "spit" | "ring" | "fan"

type Enemy = { x: number; y: number; r: number; hp: number; speed: number }
type Shot = { x: number; y: number; vx: number; vy: number; r: number; life: number }
type Gem = { x: number; y: number }

const W = 900
const H = 520

export function TuffieRun() {
  const studio = useStudio()
  const pet = studio.pet
  const canvas = useRef<HTMLCanvasElement>(null)
  const [phase, setPhase] = useState<"pick" | "play" | "card" | "end">("pick")
  const [mode, setMode] = useState<Mode>("nest")
  const [card, setCard] = useState<string[]>([])
  const [end, setEnd] = useState("")
  const [runId, setRunId] = useState(0)
  const pick = useRef<(choice: string) => void>(() => {})
  const bank = useRef(studio.bankRun)
  bank.current = studio.bankRun

  useEffect(() => {
    if (!runId) return
    const node = canvas.current
    if (!node) return
    const ctx = node.getContext("2d")
    if (!ctx) return
    const keys = new Set<string>()
    const down = (event: KeyboardEvent) => keys.add(event.key.toLowerCase())
    const up = (event: KeyboardEvent) => keys.delete(event.key.toLowerCase())
    window.addEventListener("keydown", down)
    window.addEventListener("keyup", up)

    const nest = mode === "nest"
    const limit = nest ? 40 : 32
    const color = pet?.genes?.furPrimary || "#e4b15a"
    let x = W / 2
    let y = H / 2
    let hp = 80 + (pet?.gear.collar ? 20 : 0) + (pet?.gear.armor ? 15 : 0)
    const maxHp = hp
    let weapon: Weapon = "spit"
    let wrap = pet?.gear.armor ? 0.8 : 1
    let gems = 0
    let level = 1
    let shot = 0
    let spawn = 0
    let time = 0
    let paused = false
    const enemies: Enemy[] = []
    const shots: Shot[] = []
    const drops: Gem[] = []
    let over = false

    const finish = (won: boolean) => {
      if (over) return
      over = true
      const xp = won ? 12 + level : 4
      const note = pet && pet.stage !== "egg" ? bank.current(xp) : "Practice. The egg, if you have one, stayed in the shell."
      setEnd(won ? `Clear. ${note}` : `Down. ${note}`)
      setPhase("end")
    }

    const offer = () => {
      paused = true
      const options = ["Spit, faster", "Ring of sparks", "Fan of three", "Thicker hide"].sort(() => Math.random() - 0.5).slice(0, 3)
      setCard(options)
      setPhase("card")
      pick.current = (choice) => {
        if (choice.startsWith("Spit")) shot = Math.max(0, shot - 0.05)
        if (choice.startsWith("Ring")) weapon = "ring"
        if (choice.startsWith("Fan")) weapon = "fan"
        if (choice.startsWith("Thicker")) {
          hp += 12
          wrap = Math.min(wrap, 0.75)
        }
        level += 1
        paused = false
        setPhase("play")
      }
    }

    let last = performance.now()
    let frame = 0
    const loop = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000)
      last = now
      if (!paused && !over) {
        time += dt
        if (time >= limit) finish(true)
        let mx = 0
        let my = 0
        if (keys.has("a") || keys.has("arrowleft")) mx -= 1
        if (keys.has("d") || keys.has("arrowright")) mx += 1
        if (keys.has("w") || keys.has("arrowup")) my -= 1
        if (keys.has("s") || keys.has("arrowdown")) my += 1
        const mag = Math.hypot(mx, my) || 1
        const speed = nest ? 150 : 170
        x = Math.max(18, Math.min(W - 18, x + (mx / mag) * speed * dt))
        y = Math.max(18, Math.min(H - 18, y + (my / mag) * speed * dt))

        spawn -= dt
        if (spawn <= 0) {
          spawn = nest ? 0.85 : 0.42
          const edge = Math.floor(Math.random() * 4)
          const ex = edge === 0 ? -10 : edge === 1 ? W + 10 : Math.random() * W
          const ey = edge === 2 ? -10 : edge === 3 ? H + 10 : Math.random() * H
          enemies.push({ x: ex, y: ey, r: 12, hp: 2 + Math.floor(time / 12), speed: nest ? 46 : 72 })
        }

        shot -= dt
        const aim = enemies.reduce<{ x: number; y: number; d: number } | null>((best, enemy) => {
          const d = Math.hypot(enemy.x - x, enemy.y - y)
          if (!best || d < best.d) return { x: enemy.x, y: enemy.y, d }
          return best
        }, null)
        if (weapon !== "ring" && shot <= 0 && aim) {
          shot = weapon === "fan" ? 0.42 : 0.26
          const base = Math.atan2(aim.y - y, aim.x - x)
          const angles = weapon === "fan" ? [base - 0.3, base, base + 0.3] : [base]
          for (const angle of angles) {
            shots.push({ x, y, vx: Math.cos(angle) * 280, vy: Math.sin(angle) * 280, r: 4, life: 1.1 })
          }
        }

        for (const enemy of enemies) {
          const d = Math.hypot(x - enemy.x, y - enemy.y) || 1
          enemy.x += ((x - enemy.x) / d) * enemy.speed * dt
          enemy.y += ((y - enemy.y) / d) * enemy.speed * dt
          if (d < enemy.r + 14) {
            hp -= (nest ? 8 : 12) * wrap * dt
          }
        }
        if (hp <= 0) finish(false)

        for (const bullet of shots) {
          bullet.x += bullet.vx * dt
          bullet.y += bullet.vy * dt
          bullet.life -= dt
          for (const enemy of enemies) {
            if (Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y) < enemy.r + bullet.r) {
              enemy.hp -= 1
              bullet.life = 0
            }
          }
        }
        if (weapon === "ring") {
          for (const enemy of enemies) {
            const spin = Math.hypot(enemy.x - x, enemy.y - y)
            if (spin < 46 && spin > 28) enemy.hp -= 2 * dt
          }
        }
        for (let i = enemies.length - 1; i >= 0; i -= 1) {
          if (enemies[i].hp <= 0) {
            drops.push({ x: enemies[i].x, y: enemies[i].y })
            enemies.splice(i, 1)
          }
        }
        for (let i = shots.length - 1; i >= 0; i -= 1) {
          if (shots[i].life <= 0) shots.splice(i, 1)
        }
        for (let i = drops.length - 1; i >= 0; i -= 1) {
          if (Math.hypot(drops[i].x - x, drops[i].y - y) < 22) {
            gems += 1
            drops.splice(i, 1)
            if (gems >= level * 4) offer()
          }
        }
      }

      ctx.fillStyle = "#090807"
      ctx.fillRect(0, 0, W, H)
      ctx.strokeStyle = "rgba(228,177,90,0.25)"
      ctx.strokeRect(8, 8, W - 16, H - 16)
      for (const gem of drops) {
        ctx.fillStyle = "#e4b15a"
        ctx.fillRect(gem.x - 3, gem.y - 3, 6, 6)
      }
      for (const enemy of enemies) {
        ctx.fillStyle = "#d45c4a"
        ctx.beginPath()
        ctx.arc(enemy.x, enemy.y, enemy.r, 0, Math.PI * 2)
        ctx.fill()
      }
      for (const bullet of shots) {
        ctx.fillStyle = "#f3d7a1"
        ctx.beginPath()
        ctx.arc(bullet.x, bullet.y, bullet.r, 0, Math.PI * 2)
        ctx.fill()
      }
      if (weapon === "ring") {
        ctx.strokeStyle = "#e07a2f"
        ctx.beginPath()
        ctx.arc(x, y, 36, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, 14, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "#f4efe6"
      ctx.font = "14px Segoe UI, sans-serif"
      ctx.fillText(`${Math.ceil(limit - time)}s   HP ${Math.max(0, Math.ceil(hp))}/${maxHp}   Lv ${level}`, 20, 32)
      if (!over) frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("keydown", down)
      window.removeEventListener("keyup", up)
    }
  }, [runId, mode, pet])

  return (
    <div className="space-y-4">
      <header>
        <p className="text-xs tracking-[0.16em] text-gold uppercase">A short run</p>
        <h1 className="text-4xl">{pet && pet.stage !== "egg" ? pet.name : "Practice pebble"}</h1>
        <p className="mt-2 max-w-2xl">WASD or arrows. Shots go to the nearest threat. Live through the clock. The egg, if it is still an egg, does not leave the shell.</p>
      </header>
      {phase === "pick" ? (
        <div className="flex flex-wrap gap-3">
          <Plate onClick={() => { setMode("nest"); setPhase("play"); setRunId((value) => value + 1) }}>Nest · 40 seconds</Plate>
          <Plate onClick={() => { setMode("storm"); setPhase("play"); setRunId((value) => value + 1) }}>Storm · 32 seconds</Plate>
        </div>
      ) : null}
      {phase !== "pick" ? <canvas ref={canvas} width={W} height={H} className="w-full max-w-4xl border border-[var(--line)] bg-ink" /> : null}
      {phase === "card" ? (
        <div className="flex flex-wrap gap-3">
          {card.map((choice) => (
            <Plate key={choice} onClick={() => pick.current(choice)}>{choice}</Plate>
          ))}
        </div>
      ) : null}
      {phase === "end" ? (
        <div className="space-y-3">
          <p className="text-gold">{end}</p>
          <div className="flex gap-3">
            <Plate onClick={() => setPhase("pick")}>Another run</Plate>
            <Plate href="/tuffie">Back to the den</Plate>
          </div>
        </div>
      ) : null}
    </div>
  )
}
