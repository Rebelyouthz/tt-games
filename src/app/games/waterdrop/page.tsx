import { editions, lineage, prettyDate } from "@/data/catalog";
import { Plate, Status } from "@/components/ui";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Waterdrop Survivor" };

export default function Page() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs tracking-[0.18em] text-gold uppercase">Series</p>
        <h1 className="text-5xl">Waterdrop Survivor</h1>
        <p className="mt-3 max-w-3xl text-lg">The same idea, built more than once. Each edition keeps the liquid frame and gets its own accent. A repo becomes an edition when it is its own build.</p>
      </header>
      <div className="space-y-3">
        {editions().map((entry) => (
          <Plate key={entry.id} href={`/games/waterdrop/${entry.id}`}>
            <span className="flex flex-wrap items-baseline justify-between gap-3">
              <span className="display text-3xl">{entry.title}</span>
              <Status status={entry.status} label={entry.statusLabel} />
            </span>
            <span className="mt-2 block text-sm text-muted">{entry.language} · {entry.method}</span>
            <span className="mt-1 block text-sm">{prettyDate(entry.updated)}</span>
          </Plate>
        ))}
      </div>
      <section className="plate p-4 text-sm text-muted space-y-2">
        <h2 className="display text-2xl text-paper">Passes, not editions</h2>
        {lineage.map((line) => <p key={line}>{line}</p>)}
      </section>
    </div>
  );
}
