import { act, createMatch, publicState, type FighterCard, type Match } from "@/lib/combat"
import { NextResponse } from "next/server"

const matches = new Map<string, Match>()

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ ok: false, error: "Empty request." }, { status: 400 })
  if (body.action === "start") {
    const id = crypto.randomUUID()
    const made = createMatch({ id, mode: body.mode, you: body.you as FighterCard, rivalId: body.rivalId, free: Boolean(body.free) })
    if ("error" in made && made.error) return NextResponse.json({ ok: false, error: made.error }, { status: 400 })
    if (!("match" in made) || !made.match) return NextResponse.json({ ok: false, error: "No match." }, { status: 400 })
    const stage = String(body.you?.stage || "")
    const mode = body.mode as Match["mode"]
    const allowed = mode === "dummy" ? ["pup", "teen", "tuffie", "prime"] : mode === "async" ? ["tuffie", "prime"] : ["teen", "tuffie", "prime"]
    if (!allowed.includes(stage)) return NextResponse.json({ ok: false, error: "That age does not fight this way." }, { status: 400 })
    matches.set(id, made.match)
    return NextResponse.json({ ok: true, match: publicState(made.match) })
  }
  const match = matches.get(String(body.id || ""))
  if (!match) return NextResponse.json({ ok: false, error: "That match cooled off." }, { status: 404 })
  const next = act(match, String(body.move || "strike"), body.skillId)
  matches.set(match.id, next)
  return NextResponse.json({ ok: true, match: publicState(next) })
}
