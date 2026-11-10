import { inherit } from "@/lib/model"
import type { Genes, Stats } from "@/lib/types"
import { NextResponse } from "next/server"

function rngFrom(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const a = body?.a as { genes?: Genes; stats?: Stats } | undefined
  const b = body?.b as { genes?: Genes; stats?: Stats } | undefined
  if (!a?.genes || !b?.genes || !a.stats || !b.stats) return NextResponse.json({ ok: false, error: "Both parents need genes." }, { status: 400 })
  const child = inherit(a.genes, b.genes, a.stats, b.stats, rngFrom(Date.now() % 2147483647))
  return NextResponse.json({ ok: true, genes: child.genes, statsA: child.statsA, statsB: child.statsB })
}
