import { productBySku } from "@/data/catalog"
import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(request: Request) {
  const key = process.env.STRIPE_SECRET_KEY || ""
  const body = await request.json().catch(() => null)
  const product = productBySku(String(body?.sku || ""))
  if (!product) return NextResponse.json({ ok: false, error: "Unknown product." }, { status: 400 })
  if (!key.startsWith("sk_test_")) {
    return NextResponse.json({ ok: false, ready: false, error: "Stripe test mode is not connected on this machine." })
  }
  const stripe = new Stripe(key)
  const origin = new URL(request.url).origin
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    currency: "sek",
    line_items: [{ quantity: 1, price_data: { currency: "sek", unit_amount: product.sek * 100, product_data: { name: product.name } } }],
    success_url: `${origin}/shop/return?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/shop`,
    metadata: { sku: product.sku },
  })
  return NextResponse.json({ ok: true, url: session.url })
}
