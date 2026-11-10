"use client"

import { useStudio } from "@/components/studio"
import Link from "next/link"

export default function Page() {
  const { profile, readInbox } = useStudio()
  if (!profile) return <p className="plate p-6">The inbox opens with an account. <Link href="/login">Sit down</Link></p>
  return (
    <div className="space-y-4">
      <h1 className="text-5xl">Inbox</h1>
      <p className="text-sm text-muted">Welcome notes and studio updates land here. Mail to other people's addresses waits on a domain.</p>
      {profile.inbox.map((item) => (
        <article key={item.id} className="plate p-4" onClick={() => readInbox(item.id)}>
          <h2 className="text-xl">{item.title}</h2>
          <p className="mt-2 text-sm">{item.body}</p>
          {!item.read ? <p className="mt-1 text-xs text-gold">New</p> : null}
        </article>
      ))}
    </div>
  )
}
