"use client"

import { getEntry, mergeRoadmap, prettyDate, type Entry } from "@/data/catalog"
import { useStudio } from "@/components/studio"
import { Gate, Plate, Status } from "@/components/ui"
import Link from "next/link"
import { useEffect, useState } from "react"

export function GameView({ id }: { id: string }) {
  const entry = getEntry(id)
  const { profile, visit, wishlist, root } = useStudio()
  const [note, setNote] = useState("")
  useEffect(() => {
    visit(id)
  }, [id, visit])
  if (!entry) return null
  const media = root.desk.media[id] || {}
  const rows = mergeRoadmap(root.desk.roadmap).filter((row) => row.gameId === id)
  const wished = profile?.wishlist.includes(id)
  const alpha = profile?.alpha[id]
  return (
    <article className="space-y-8" style={{ ["--accent" as string]: entry.accent }}>
      <header className="space-y-3">
        <p className="text-xs tracking-[0.18em] text-gold uppercase">{entry.kicker}</p>
        <h1 className="text-5xl">
          {entry.logo ? <img src={entry.logo} alt={entry.title} className="max-h-72 w-full max-w-3xl object-contain object-left" /> : entry.title}
        </h1>
        <Status status={entry.status} label={entry.statusLabel} />
      </header>
      <Gate texture={entry.texture} accent={entry.accent} video={media.video || entry.clip} still={media.still || entry.still} label="Trailer" />
      <p className="max-w-3xl text-lg leading-relaxed">{entry.summary}</p>
      {entry.story?.length ? (
        <section className="max-w-3xl space-y-4">
          <h2 className="text-2xl">Story</h2>
          {entry.story.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="leading-relaxed text-paper/90">
              {paragraph}
            </p>
          ))}
        </section>
      ) : null}
      <p className="text-gold">{entry.standout}</p>
      <div className="grid gap-3 md:grid-cols-4">
        {entry.focus.map((item) => (
          <div key={item.label} className="plate p-3">
            <p className="text-xs tracking-[0.14em] uppercase text-muted">{item.label}</p>
            <div className="mt-3 h-1.5 bg-black/40">
              <div className="h-full" style={{ width: `${item.value}%`, background: entry.accent }} />
            </div>
          </div>
        ))}
      </div>
      <table className="w-full text-left text-sm">
        <tbody>
          {entry.facts.map((fact) => (
            <tr key={fact.label} className="border-t border-[var(--line)]">
              <th className="py-2 pr-4 font-normal text-muted">{fact.label}</th>
              <td>{fact.value}</td>
            </tr>
          ))}
          <tr className="border-t border-[var(--line)]">
            <th className="py-2 pr-4 font-normal text-muted">Updated</th>
            <td>{prettyDate(entry.updated)}</td>
          </tr>
        </tbody>
      </table>
      <section className="space-y-3">
        <h2 className="text-2xl">Roadmap</h2>
        {rows.map((row) => (
          <div key={row.id} className="plate p-4">
            <Status status={row.status} label={prettyDate(row.date)} />
            <p className="mt-1">{row.title}</p>
            <p className="text-sm text-muted">{row.detail}</p>
            <p className="text-sm text-gold">Next: {row.next}</p>
          </div>
        ))}
      </section>
      <section className="grid gap-3 md:grid-cols-3">
        {[0, 1, 2].map((slot) => (
          <Gate key={slot} texture={entry.texture} accent={entry.accent} still={entry.stills?.[slot]} label={entry.stills?.[slot] ? "From the take" : `Still ${slot + 1}`} />
        ))}
      </section>
      <div className="flex flex-wrap gap-3">
        {profile ? (
          <Plate onClick={() => setNote(wished ? "Already on your list." : (wishlist(id), "Wished."))} className="px-4">
            {wished ? "On your wishlist" : "Wish for it"}
          </Plate>
        ) : (
          <Plate href={`/login?next=/games/${entry.series ? `waterdrop/${entry.id}` : entry.id}`}>Wish for it</Plate>
        )}
        <div className="plate px-4 py-3 text-sm">
          {!profile ? "Alpha sits behind an account." : alpha && media.build ? <Link href={media.build}>Open the alpha</Link> : alpha ? "The demo is not up yet." : "The demo is not up yet."}
        </div>
        {entry.repo ? (
          <a className="plate px-4 py-3 text-sm" href={entry.repo}>
            Repository
          </a>
        ) : (
          <p className="plate px-4 py-3 text-sm text-muted">Steam wishlist waits on a store page.</p>
        )}
      </div>
      {note ? <p className="text-sm text-gold">{note}</p> : null}
    </article>
  )
}

export function entryPath(entry: Entry) {
  return entry.series ? `/games/waterdrop/${entry.id}` : `/games/${entry.id}`
}
