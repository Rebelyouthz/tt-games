"use client"

import { useStudio } from "@/components/studio"

export default function Page() {
  const { root } = useStudio()
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-5xl">Studio</h1>
      <p className="text-lg">TT Games is TimmieTooth Games. One person, three doors: HnT, Unremembered, and the Waterdrop Survivor series.</p>
      <p className="text-muted">The mark is two letters, a word, and a plaque. Gold, a red channel, and drops that keep moving. The site is the studio shell. Footage comes later, into gates that are already built.</p>
      <section className="space-y-3">
        <h2 className="text-2xl">Devlog</h2>
        {root.desk.devlog.length === 0 ? <p className="plate p-4 text-sm text-muted">No devlog yet. The desk can add one without a rebuild.</p> : root.desk.devlog.map((entry) => (
          <article key={entry.id} className="plate p-4">
            <h3 className="text-xl">{entry.title}</h3>
            <p className="mt-2 text-sm">{entry.body}</p>
          </article>
        ))}
      </section>
    </div>
  )
}
