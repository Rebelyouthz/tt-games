"use client"

import { entries, mergeRoadmap, prettyDate } from "@/data/catalog"
import { CrestScene } from "@/components/scene"
import { LogoMark } from "@/components/mark"
import { usePhase } from "@/components/shell"
import { useStudio } from "@/components/studio"
import { Gate, Plate } from "@/components/ui"
import { Component } from "react"

class Boundary extends Component<{ children: React.ReactNode; fallback: React.ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

export function HomeClient() {
  const phase = usePhase()
  const { root } = useStudio()
  const latest = mergeRoadmap(root.desk.roadmap).find((row) => row.date)
  const gates = [
    entries.find((entry) => entry.id === "hnt"),
    entries.find((entry) => entry.id === "unremembered"),
  ]
  return (
    <div className="space-y-10">
      <section className="relative min-h-[70vh]">
        {phase === "live" ? (
          <Boundary fallback={null}>
            <div className="pointer-events-none absolute inset-0">
              <CrestScene mode="rest" />
            </div>
          </Boundary>
        ) : null}
        <div className="relative z-10 mx-auto w-[min(920px,94%)] pt-6">
          <LogoMark live />
        </div>
        <p className="relative z-10 mt-2 text-center text-sm tracking-[0.22em] text-muted uppercase">TimmieTooth Games</p>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {gates.map((entry) =>
          entry ? (
            <Plate key={entry.id} href={`/games/${entry.id}`} className="p-0">
              <Gate texture={entry.texture} accent={entry.accent} label={entry.title} />
              <span className="block p-4">
                <span className="display text-2xl">{entry.title}</span>
                <span className="mt-2 block text-sm text-muted">{entry.kicker}</span>
              </span>
            </Plate>
          ) : null,
        )}
        <Plate href="/games/waterdrop" className="p-0">
          <Gate texture="liquid" accent="#e4b15a" label="Waterdrop Survivor" />
          <span className="block p-4">
            <span className="display text-2xl">Waterdrop Survivor</span>
            <span className="mt-2 block text-sm text-muted">A series. Core, Space, Remnant, and the builds that are their own.</span>
          </span>
        </Plate>
      </section>
      {latest ? (
        <Plate href="/roadmap">
          <p className="text-xs tracking-[0.16em] text-gold uppercase">Latest roadmap</p>
          <p className="display mt-2 text-2xl">{latest.title}</p>
          <p className="mt-2 text-sm text-muted">{prettyDate(latest.date)} — {latest.next}</p>
        </Plate>
      ) : null}
    </div>
  )
}
