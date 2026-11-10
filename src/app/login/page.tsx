"use client"

import { browserSupabase, supabaseConfigured } from "@/lib/supabase"
import { useStudio } from "@/components/studio"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"

function Form() {
  const { createLocal, root } = useStudio()
  const params = useSearchParams()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [note, setNote] = useState("")
  const invite = params.get("invite") || ""
  const next = params.get("next") || "/account"
  const configured = supabaseConfigured()
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-5xl">Sit down</h1>
      <p className="text-muted">Google and a magic email link use Supabase when the keys are set. Until then, a seat on this machine still gets an egg.</p>
      <form
        className="plate space-y-3 p-4"
        onSubmit={async (event) => {
          event.preventDefault()
          const client = browserSupabase()
          if (client && email) {
            const { error } = await client.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` } })
            setNote(error ? error.message : "Check the inbox for the link. Supabase sends it.")
            return
          }
          createLocal(name || email || "Player", invite)
          router.push(next)
        }}
      >
        <label className="block text-sm">Name<input className="mt-1 w-full bg-transparent" value={name} onChange={(event) => setName(event.target.value)} /></label>
        <label className="block text-sm">Email<input className="mt-1 w-full bg-transparent" value={email} onChange={(event) => setEmail(event.target.value)} type="email" /></label>
        {invite ? <p className="text-sm text-gold">Invite {invite}</p> : null}
        <button className="plate px-3 py-2" type="submit">{configured ? "Email me a link" : "Use a local seat"}</button>
      </form>
      <button
        className="plate px-4 py-3 disabled:opacity-50"
        disabled={!configured}
        onClick={async () => {
          const client = browserSupabase()
          if (!client) return
          await client.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` } })
        }}
      >
        Google {configured ? "" : "· needs Supabase"}
      </button>
      <button className="plate px-4 py-3 opacity-50" disabled title="Waiting on an Apple Developer account.">Apple · waiting</button>
      {!configured ? <p className="text-sm text-muted">Local seats stay in this browser. They are the day-one account until Supabase is connected.</p> : null}
      <div className="space-y-2 text-sm">
        {Object.values(root.profiles).map((seat) => (
          <p key={seat.id}>{seat.name} is already on this machine.</p>
        ))}
      </div>
      {note ? <p className="text-gold">{note}</p> : null}
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<p>Opening the door.</p>}>
      <Form />
    </Suspense>
  )
}
