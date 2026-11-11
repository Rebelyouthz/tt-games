import { apps } from "@/data/shelf"
import { AppMark } from "@/components/app-mark"
import { Gate } from "@/components/ui"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

export function generateStaticParams() {
  return apps.map((app) => ({ slug: app.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const app = apps.find((item) => item.slug === slug)
  return { title: app?.title || "Application" }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const app = apps.find((item) => item.slug === slug)
  if (!app) notFound()
  return (
    <article className="max-w-3xl space-y-6">
      <header className="flex items-center gap-3">
        <AppMark className="w-12" />
        <div>
          <p className="text-xs tracking-[0.16em] text-gold uppercase">TT Applications</p>
          <h1 className="text-5xl">{app.title}</h1>
        </div>
      </header>
      <Gate texture="iron" accent="#e07a2f" label={app.title} />
      <p className="text-sm text-gold">{app.status}</p>
      <p className="text-sm text-muted">{app.where}</p>
      {app.body.map((line) => (
        <p key={line.slice(0, 24)} className="leading-relaxed">{line}</p>
      ))}
      <p className="text-sm"><Link href="/apps">All applications</Link></p>
    </article>
  )
}
