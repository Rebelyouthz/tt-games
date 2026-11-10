"use client"

import { armors, creditPacks, dyes, eyeExtras, hairs, hats, passProducts, weapons } from "@/data/catalog"
import { useStudio } from "@/components/studio"
import { useState } from "react"

export default function Page() {
  const { profile, buyKibble, buyCredit, feed } = useStudio()
  const [note, setNote] = useState("")
  const checkout = async (sku: string) => {
    const response = await fetch("/api/shop/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sku }) })
    const data = await response.json()
    if (data.url) window.location.href = data.url
    else setNote(data.error || "Stripe test mode is not connected. The shelf is still here.")
  }
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-5xl">Shop</h1>
        <p className="mt-3 max-w-2xl text-muted">Kibble comes from the site. Credits are money, in test mode until a Stripe test key is present. A live key is refused. No random boxes. You point at the hair you mean.</p>
        <p className="text-sm">Kibble {profile?.kibble ?? 0} · Credits {profile?.credits ?? 0}</p>
      </header>
      <section className="space-y-3">
        <h2 className="text-2xl">Kibble</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <button className="plate p-4 text-left" onClick={() => setNote(feed(false))}>Kibble bite · 8 · hunger</button>
          <button className="plate p-4 text-left" onClick={() => setNote(buyKibble("hearty"))}>Hearty tin · 20 · hunger and a little mood</button>
          {Object.entries(weapons).map(([id, item]) => (
            <button key={id} className="plate p-4 text-left" onClick={() => setNote(buyKibble("weapon", id))}>{item.name} · {item.kibble} · {item.blurb}</button>
          ))}
          {Object.entries(armors).map(([id, item]) => (
            <button key={id} className="plate p-4 text-left" onClick={() => setNote(buyKibble("armor", id))}>{item.name} · {item.kibble} · {item.blurb}</button>
          ))}
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">Credits</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {hairs.map((hair) => <button key={hair.id} className="plate p-4 text-left" onClick={() => setNote(buyCredit("hair", hair.id))}>{hair.name} · 45 Credits</button>)}
          {hats.map((hat) => <button key={hat.id} className="plate p-4 text-left" onClick={() => setNote(buyCredit("hat", hat.id))}>{hat.name} · {hat.credits} Credits</button>)}
          {eyeExtras.map((extra) => <button key={extra.id} className="plate p-4 text-left" onClick={() => setNote(buyCredit("eyes", extra.id))}>{extra.name} · {extra.credits} Credits</button>)}
          {dyes.map((dye) => <button key={dye.id} className="plate p-4 text-left" onClick={() => setNote(buyCredit("dye", dye.id))}><span className="mr-2 inline-block h-3 w-3" style={{ background: dye.hex }} />{dye.name} · 30 Credits</button>)}
          <button className="plate p-4 text-left" onClick={() => setNote(buyCredit("vip", "vip"))}>VIP pass · 200 Credits. Supporter and level 15 also get there.</button>
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">Credit packs</h2>
        <p className="text-sm text-muted">Prices in kronor. Test checkout only.</p>
        <div className="grid gap-3 md:grid-cols-3">
          {creditPacks.map((pack) => (
            <button key={pack.sku} className="plate p-4 text-left" onClick={() => checkout(pack.sku)}>
              <span className="display text-2xl">{pack.name}</span>
              <span className="mt-1 block text-sm">{pack.credits} Credits · {pack.sek} SEK</span>
            </button>
          ))}
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">Early Access</h2>
        <p className="text-sm text-muted">A pass is a product. It opens the alpha for that game when a build URL exists, sets Supporter, gives the badge, 500 Credits, the studio collar, and one stat charm. The charm is +1 on a stat you choose, capped at +3, and Luck cannot take one. Buying digital access here is the moment the withdrawal right for that content is agreed.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {passProducts().map((pass) => (
            <button key={pass.sku} className="plate p-4 text-left" onClick={() => checkout(pass.sku)}>
              <span className="display text-2xl">{pass.name}</span>
              <span className="mt-1 block text-sm">{pass.sek} SEK</span>
            </button>
          ))}
        </div>
      </section>
      {note ? <p className="text-gold">{note}</p> : null}
    </div>
  )
}
