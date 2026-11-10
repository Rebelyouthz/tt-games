"use client"

import { entries, mergeRoadmap, prettyDate } from "@/data/catalog"
import { useStudio } from "@/components/studio"
import { Status } from "@/components/ui"
import { useEffect } from "react"

export default function Page() {
  const { root, readRoadmap } = useStudio()
  useEffect(() => {
    readRoadmap()
  }, [readRoadmap])
  const rows = mergeRoadmap(root.desk.roadmap)
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-5xl">Roadmap</h1>
        <p className="mt-3 max-w-2xl text-muted">What is done, the date on it, and the next step. HnT, Unremembered, and every Waterdrop edition.</p>
      </header>
      {rows.map((row) => {
        const game = entries.find((entry) => entry.id === row.gameId)
        return (
          <article key={row.id} className="plate p-4">
            <Status status={row.status} label={prettyDate(row.date)} />
            <p className="mt-2 text-xs tracking-[0.14em] uppercase text-muted">{game?.title || row.gameId}</p>
            <h2 className="text-2xl">{row.title}</h2>
            <p className="mt-2 text-sm">{row.detail}</p>
            <p className="mt-1 text-sm text-gold">Next: {row.next}</p>
          </article>
        )
      })}
    </div>
  )
}
