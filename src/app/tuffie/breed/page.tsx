"use client"

import { useStudio } from "@/components/studio"
import { canBreed } from "@/lib/model"
import { useState } from "react"

export default function Page() {
  const { profile, pet, root, offerBreed, acceptBreed, breedPebble } = useStudio()
  const [note, setNote] = useState("")
  const [target, setTarget] = useState("")
  if (!profile || !pet) return <p className="plate p-6">Breeding needs an account.</p>
  const offers = root.breedOffers.filter((offer) => offer.toId === profile.id && offer.expires > Date.now())
  return (
    <div className="max-w-2xl space-y-5">
      <h1 className="text-5xl">Breed</h1>
      <p className="text-muted">Both are adult, mood over 40, and both say yes within ten minutes. Not with yourself. Three days of cooldown. The den holds three. A full den keeps the young one as a card. Nobody disappears. Cosmetics and weapons are not inherited.</p>
      <p className="text-sm">This one: {pet.name}, {pet.stage}, mood {pet.mood}. {canBreed(pet.stage, pet.mood) ? "Ready." : "Not ready."}</p>
      <button className="plate px-3 py-2" onClick={async () => setNote(await breedPebble())}>Ask Pebble</button>
      <p className="text-sm text-muted">Pebble is the studio Tuffie, so the den can be tried before two hosted accounts exist. Pebble's matching egg stays at the studio.</p>
      <form className="plate space-y-2 p-4" onSubmit={(event) => { event.preventDefault(); setNote(offerBreed(target)) }}>
        <label className="block text-sm">Another seat
          <select className="mt-1 w-full bg-transparent" value={target} onChange={(event) => setTarget(event.target.value)}>
            <option value="">Choose</option>
            {Object.values(root.profiles).filter((seat) => seat.id !== profile.id).map((seat) => <option key={seat.id} value={seat.id}>{seat.name}</option>)}
          </select>
        </label>
        <button className="plate px-3 py-2" type="submit">Ask</button>
      </form>
      {offers.map((offer) => (
        <button key={offer.id} className="plate block px-3 py-2 text-left" onClick={async () => setNote(await acceptBreed(offer.id))}>
          {offer.fromName}'s {offer.petName} is asking. Say yes.
        </button>
      ))}
      {note ? <p className="text-gold">{note}</p> : null}
    </div>
  )
}
