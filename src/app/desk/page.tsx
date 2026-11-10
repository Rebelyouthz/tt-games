"use client"

import { entries } from "@/data/catalog"
import { useStudio } from "@/components/studio"
import { useState } from "react"

export default function Page() {
  const studio = useStudio()
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [gameId, setGameId] = useState("hnt")
  const [media, setMedia] = useState("")
  const [bark, setBark] = useState("")
  const [tag, setTag] = useState("default")
  if (!studio.owner) return <div className="plate max-w-xl p-8"><h1 className="text-4xl">Desk</h1><p className="mt-3 text-muted">This desk is Timmy's. The first seat on this machine holds the key until an owner email is set.</p></div>
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-5xl">Desk</h1>
      <form className="plate space-y-2 p-4" onSubmit={(event) => { event.preventDefault(); studio.deskRoad({ id: crypto.randomUUID().slice(0, 8), gameId, date: new Date().toISOString().slice(0, 10), title, status: "building", detail: body, next: body }); setTitle(""); setBody("") }}>
        <h2 className="text-2xl">Roadmap row</h2>
        <select className="w-full bg-transparent" value={gameId} onChange={(event) => setGameId(event.target.value)}>{entries.map((entry) => <option key={entry.id} value={entry.id}>{entry.title}</option>)}</select>
        <input className="w-full bg-transparent" placeholder="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
        <textarea className="min-h-20 w-full bg-transparent" placeholder="What changed, and the next step" value={body} onChange={(event) => setBody(event.target.value)} />
        <button className="plate px-3 py-2" type="submit">Add row</button>
      </form>
      <form className="plate space-y-2 p-4" onSubmit={(event) => { event.preventDefault(); studio.deskLog(title, body) }}>
        <h2 className="text-2xl">Devlog</h2>
        <button className="plate px-3 py-2" type="submit">Post to the studio page</button>
      </form>
      <form className="plate space-y-2 p-4" onSubmit={(event) => { event.preventDefault(); const [kind, url] = media.split(" ") ; studio.deskMedia(gameId, { [kind || "video"]: url || media }) }}>
        <h2 className="text-2xl">Media URL</h2>
        <input className="w-full bg-transparent" placeholder="video https://… or still https://… or build https://…" value={media} onChange={(event) => setMedia(event.target.value)} />
        <button className="plate px-3 py-2" type="submit">Set on the selected game</button>
      </form>
      <form className="plate space-y-2 p-4" onSubmit={(event) => { event.preventDefault(); studio.deskBark(tag, bark); setBark("") }}>
        <h2 className="text-2xl">Bark</h2>
        <input className="w-full bg-transparent" placeholder="tag" value={tag} onChange={(event) => setTag(event.target.value)} />
        <input className="w-full bg-transparent" placeholder="Short English line" value={bark} onChange={(event) => setBark(event.target.value)} />
        <button className="plate px-3 py-2" type="submit">Add line</button>
      </form>
      <form className="plate space-y-2 p-4" onSubmit={(event) => { event.preventDefault(); studio.deskMail(title || "Update", body) }}>
        <h2 className="text-2xl">Inbox update</h2>
        <button className="plate px-3 py-2" type="submit">Send to every seat on this machine</button>
      </form>
      <section className="plate space-y-2 p-4">
        <h2 className="text-2xl">Inner</h2>
        {Object.values(studio.root.profiles).map((seat) => (
          <label key={seat.id} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={seat.inner} onChange={(event) => studio.deskInner(seat.id, event.target.checked)} />
            {seat.name}
          </label>
        ))}
      </section>
    </div>
  )
}
