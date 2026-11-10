import { entries } from "@/data/catalog";
import { Plate, Status } from "@/components/ui";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Games" };

export default function Page() {
  const singles = entries.filter((entry) => !entry.series);
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-5xl">Games</h1>
        <p className="mt-3 max-w-2xl text-muted">Two games, and one series. Trailers land in gates that are already cut.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {singles.map((entry) => (
          <Plate key={entry.id} href={entry.series ? `/games/waterdrop/${entry.id}` : `/games/${entry.id}`}>
            <Status status={entry.status} label={entry.statusLabel} />
            <span className="display mt-2 block text-3xl">{entry.title}</span>
            <span className="mt-2 block text-sm text-muted">{entry.genre}</span>
          </Plate>
        ))}
        <Plate href="/games/waterdrop">
          <Status status="playable" label="Series" />
          <span className="display mt-2 block text-3xl">Waterdrop Survivor</span>
          <span className="mt-2 block text-sm text-muted">Core, Space, Remnant, and the other builds that are their own.</span>
        </Plate>
      </div>
      <p className="text-sm text-muted">
        <Link href="/roadmap">Roadmap</Link>
      </p>
    </div>
  );
}
