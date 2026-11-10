import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(request: Request) {
  const key = process.env.STRIPE_SECRET_KEY || ""
  if (!key.startsWith("sk_test_")) return NextResponse.json({ ok: false, error: "Stripe test mode is not connected." }, { status: 400 })
  const body = await request.json().catch(() => null)
  const sessionId = String(body?.sessionId || "")
  if (!sessionId) return NextResponse.json({ ok: false, error: "Missing session." }, { status: 400 })
  const stripe = new Stripe(key)
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  if (session.payment_status !== "paid") return NextResponse.json({ ok: false, error: "Not paid." }, { status: 400 })
  return NextResponse.json({ ok: true, sku: session.metadata?.sku || "", sessionId })
}
