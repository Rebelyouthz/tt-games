"use client"

import { entries } from "@/data/catalog"
import { useStudio } from "@/components/studio"
import { useState } from "react"

export default function Page() {
  const { profile, root, postWall, reportPost, deletePost, owner } = useStudio()
  const [body, setBody] = useState("")
  const [target, setTarget] = useState("everyone")
  const [note, setNote] = useState("")
  return (
    <div className="space-y-6">
      <h1 className="text-5xl">Wall</h1>
      <p className="max-w-2xl text-muted">Write to the studio, to a game, or to everyone. The studio can remove a post. Anyone else can report one.</p>
      {profile ? (
        <form
          className="plate space-y-3 p-4"
          onSubmit={(event) => {
            event.preventDefault()
            setNote(postWall(target, body))
            setBody("")
          }}
        >
          <select className="bg-transparent" value={target} onChange={(event) => setTarget(event.target.value)}>
            <option value="everyone">Everyone</option>
            <option value="studio">Studio</option>
            {entries.map((entry) => <option key={entry.id} value={entry.id}>{entry.title}</option>)}
          </select>
          <textarea className="min-h-24 w-full bg-transparent" maxLength={280} value={body} onChange={(event) => setBody(event.target.value)} placeholder="One short line" />
          <button className="plate px-3 py-2" type="submit">Post</button>
          {note ? <p className="text-sm text-gold">{note}</p> : null}
        </form>
      ) : (
        <p className="plate p-4 text-sm">Reading is open. Posting needs an account.</p>
      )}
      <div className="space-y-3">
        {root.wall.length === 0 ? <p className="text-sm text-muted">The wall is empty, and it looks like a wall.</p> : null}
        {root.wall.map((post) => (
          <article key={post.id} className="plate p-4">
            <p className="text-xs tracking-[0.14em] uppercase text-gold">{post.authorName} · {post.rank} · {post.target}</p>
            <p className="mt-2">{post.body}</p>
            <div className="mt-2 flex gap-3 text-xs text-muted">
              {profile && post.authorId !== profile.id ? <button onClick={() => reportPost(post.id)}>Report</button> : null}
              {profile && (post.authorId === profile.id || owner) ? <button onClick={() => deletePost(post.id)}>Remove</button> : null}
              {owner && post.reports.length ? <span>{post.reports.length} reports</span> : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
