import { shelf } from "@/data/shelf"
import { Reveal } from "@/components/reveal"
import { Gate } from "@/components/ui"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = { title: "Teaser" }

export default function Page() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs tracking-[0.16em] text-gold uppercase">TT Games</p>
        <h1 className="text-5xl">Teaser</h1>
        <p className="mt-3 max-w-2xl">One card per title. Extra folders and repos sit under that title as passes. Empty art stays a finished gate.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {shelf.map((title) => (
          <Reveal key={title.id}>
            <article className="plate p-4">
              <Gate texture={title.id === "remnant" ? "ash" : title.id === "waterdrop" ? "liquid" : "iron"} accent="#e4b15a" label={title.title} />
              <h2 className="mt-3 text-3xl">{title.href ? <Link href={title.href}>{title.title}</Link> : title.title}</h2>
              <p className="mt-2 text-sm leading-relaxed">{title.blurb}</p>
              <ul className="mt-3 space-y-1 text-xs text-muted">
                {title.passes.map((pass) => <li key={pass}>{pass}</li>)}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
      <p className="text-sm text-muted">Yatzy, Skepnad, and ElectroKarma are not on this shelf.</p>
    </div>
  )
}
