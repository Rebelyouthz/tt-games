"use client"

import { LogoMark } from "@/components/mark"
import { CrestScene } from "@/components/scene"
import { TuffieSprite } from "@/components/sprite"
import { StudioProvider, useStudio } from "@/components/studio"
import { isMuted, playClick, setMuted } from "@/lib/audio"
import { barks } from "@/data/catalog"
import { questFlags } from "@/lib/model"
import { motion } from "motion/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Component, createContext, useContext, useEffect, useMemo, useRef, useState } from "react"

const PhaseContext = createContext<"boot" | "intro" | "live">("boot")
export function usePhase() {
  return useContext(PhaseContext)
}

class Boundary extends Component<{ children: React.ReactNode; fallback: React.ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

const links = [
  { href: "/games", label: "Games" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/studio", label: "Studio" },
  { href: "/wall", label: "Wall" },
  { href: "/account", label: "Account" },
]

function Corner() {
  const { profile, pet, jump, look } = useStudio()
  const path = usePathname()
  const [line, setLine] = useState("")
  const [idle, setIdle] = useState(false)
  const [hop, setHop] = useState(false)
  const last = useRef("")
  const tag = useMemo(() => {
    if (!pet) return "default"
    if (pet.stage === "egg") {
      const flags = profile ? questFlags(profile) : null
      const soon = flags ? Object.values(flags).filter(Boolean).length >= 3 || Date.now() > pet.hatchAt - 60 * 60 * 1000 : false
      return soon ? "hatch_soon" : "egg"
    }
    if (pet.hunger < 20) return "hunger_low"
    if (pet.mood < 20) return "mood_low"
    if (pet.energy <= 0 && pet.stage !== "newborn") return "energy_empty"
    if (path.startsWith("/games/waterdrop")) return "game_waterdrop"
    if (path.includes("/hnt")) return "game_hnt"
    if (path.includes("/unremembered")) return "game_unremembered"
    if (path.startsWith("/shop")) return "shop"
    if (path.startsWith("/roadmap")) return "roadmap"
    if (path.startsWith("/wall")) return "wall"
    if (path.startsWith("/tuffie/breed")) return "breed_ready"
    if (idle) return "idle"
    return "default"
  }, [idle, path, pet, profile])

  useEffect(() => {
    const pool = barks.filter((bark) => bark.tag === tag)
    const choices = pool.filter((bark) => bark.id !== last.current)
    const pick = (choices.length ? choices : pool)[Math.floor(Math.random() * Math.max(1, (choices.length ? choices : pool).length))]
    if (!pick) return
    last.current = pick.id
    setLine(pick.text)
  }, [tag, jump])

  useEffect(() => {
    if (!jump) return
    setHop(true)
    const timer = setTimeout(() => setHop(false), 500)
    return () => clearTimeout(timer)
  }, [jump])

  useEffect(() => {
    let timer = window.setTimeout(() => setIdle(true), 60000)
    const wake = () => {
      setIdle(false)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setIdle(true), 60000)
    }
    window.addEventListener("pointermove", wake)
    return () => {
      window.removeEventListener("pointermove", wake)
      window.clearTimeout(timer)
    }
  }, [])

  if (!profile || !pet) return null
  return (
    <Link href="/tuffie" className={`fixed bottom-4 right-4 z-30 w-28 ${hop ? "jump" : ""}`} style={{ transform: `rotate(${look * 16}deg)` }} onClick={() => playClick()}>
      {line ? <span className="plate mb-2 block px-2 py-1 text-center text-xs">{line}</span> : null}
      <TuffieSprite pet={pet} sleeping={idle} />
    </Link>
  )
}

function Frame({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const { profile, owner, setLook } = useStudio()
  const [phase, setPhase] = useState<"boot" | "intro" | "live">("boot")
  const [reduce, setReduce] = useState(false)
  const [muted, setMuteState] = useState(false)
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduce(media.matches)
    setMuteState(isMuted())
    setPhase(sessionStorage.getItem("tt-intro") === "1" ? "live" : "intro")
  }, [])

  useEffect(() => {
    let frame = 0
    let lenis: { raf: (time: number) => void; destroy: () => void } | null = null
    const start = async () => {
      try {
        const { default: Lenis } = await import("lenis")
        await import("lenis/dist/lenis.css")
        lenis = new Lenis({ lerp: 0.085 })
      } catch {
        return
      }
      const loop = (time: number) => {
        lenis?.raf(time)
        frame = requestAnimationFrame(loop)
      }
      frame = requestAnimationFrame(loop)
    }
    if (!reduce) void start()
    return () => {
      cancelAnimationFrame(frame)
      lenis?.destroy()
    }
  }, [reduce])

  const finish = () => {
    sessionStorage.setItem("tt-intro", "1")
    setPhase("live")
  }

  const nav = [...links, ...(profile ? [{ href: "/tuffie", label: "Den" }, { href: "/shop", label: "Shop" }, { href: "/inbox", label: "Inbox" }] : []), ...(owner ? [{ href: "/desk", label: "Desk" }] : [])]

  return (
    <PhaseContext.Provider value={phase}>
      <div className="min-h-screen">
        <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[#090807]/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
            <Link href="/" className="w-24 shrink-0" onClick={() => playClick()} aria-label="Home">
              <LogoMark live={!reduce} />
            </Link>
            <nav className="flex flex-1 flex-wrap gap-2">
              {nav.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => setLook(index / Math.max(1, nav.length - 1) * 2 - 1)}
                  onMouseLeave={() => setLook(0)}
                  onClick={() => playClick()}
                  className="plate px-3 py-2 text-sm"
                >
                  <span className="sheen" />
                  <span className="relative">{item.label}</span>
                </Link>
              ))}
            </nav>
            <button
              className="plate px-3 py-2 text-xs tracking-[0.14em] uppercase"
              onClick={() => {
                const next = !muted
                setMuted(next)
                setMuteState(next)
                if (!next) playClick()
              }}
            >
              {muted ? "Sound off" : "Sound on"}
            </button>
          </div>
        </header>
        <motion.div key={path} initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        </motion.div>
        <footer className="mx-auto flex max-w-6xl flex-wrap gap-4 px-4 py-10 text-sm text-muted">
          <span>TT Games / TimmieTooth Games</span>
          <span>Facebook — account not opened</span>
          <span>X — account not opened</span>
          <span>YouTube — account not opened</span>
        </footer>
        <Corner />
        {phase !== "live" ? (
          <div className="fixed inset-0 z-50 grid place-items-center bg-[#070605] text-paper">
            {phase === "intro" && !reduce ? (
              <Boundary fallback={<button className="plate px-4 py-3" onClick={finish}>Enter</button>}>
                <div className="absolute inset-0">
                  <CrestScene mode="intro" onDone={finish} />
                </div>
              </Boundary>
            ) : (
              <div className="w-[min(860px,90vw)]">
                <LogoMark live={false} />
              </div>
            )}
            {phase === "intro" ? (
              <button className="plate absolute top-6 right-6 z-10 px-4 py-2 text-sm" onClick={finish}>
                Skip
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </PhaseContext.Provider>
  )
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <StudioProvider>
      <Frame>{children}</Frame>
    </StudioProvider>
  )
}
