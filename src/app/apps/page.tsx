import { apps } from "@/data/shelf"
import { AppMark } from "@/components/app-mark"
import { Reveal } from "@/components/reveal"
import { Gate } from "@/components/ui"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = { title: "Applications" }

export default function Page() {
  return (
    <div className="space-y-8">
      <header className="flex items-end gap-4">
        <AppMark />
        <div>
          <p className="text-xs tracking-[0.16em] text-gold uppercase">TT Applications</p>
          <h1 className="text-5xl">Applications</h1>
        </div>
      </header>
      <p className="max-w-2xl">Tools found on this machine or under Rebelyouthz. A page says only what the folder or the repository description actually says.</p>
      <div className="grid gap-4 md:grid-cols-2">
        {apps.map((app) => (
          <Reveal key={app.slug}>
            <Link href={`/apps/${app.slug}`} className="plate block p-4">
              <Gate texture="iron" accent="#e07a2f" label={app.title} />
              <span className="mt-3 block text-2xl">{app.title}</span>
              <span className="mt-1 block text-sm text-muted">{app.status}</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
