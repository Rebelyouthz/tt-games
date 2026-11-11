import { playSheets, type Meter } from "@/data/play"

function Bar({ meter, accent }: { meter: Meter; accent: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span>{meter.label}</span>
        <span className="text-gold">{meter.value}</span>
      </div>
      <div className="mt-1 h-2 bg-black/50">
        <div className="h-full" style={{ width: `${Math.max(4, meter.fill * 100)}%`, background: accent }} />
      </div>
      <p className="mt-1 text-xs text-muted">{meter.reading ? "Reading. " : ""}{meter.source}</p>
    </div>
  )
}

function Gauge({ meter, accent }: { meter: Meter; accent: string }) {
  const r = 36
  const c = 2 * Math.PI * r
  const dash = c * Math.max(0, Math.min(1, meter.fill))
  return (
    <div className="flex items-center gap-3">
      <svg width="92" height="92" viewBox="0 0 92 92" aria-hidden>
        <circle cx="46" cy="46" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="8" />
        <circle
          cx="46"
          cy="46"
          r={r}
          fill="none"
          stroke={accent}
          strokeWidth="8"
          strokeDasharray={`${dash} ${c}`}
          strokeLinecap="butt"
          transform="rotate(-90 46 46)"
        />
      </svg>
      <div>
        <p className="text-sm">{meter.label}</p>
        <p className="text-gold">{meter.value}</p>
        <p className="text-xs text-muted">{meter.reading ? "Reading. " : ""}{meter.source}</p>
      </div>
    </div>
  )
}

export function PlaySheet({ id, accent }: { id: string; accent: string }) {
  const sheet = playSheets.find((item) => item.id === id)
  if (!sheet) {
    return (
      <section className="plate p-4">
        <h2 className="text-2xl">How it plays</h2>
        <p className="mt-3 max-w-3xl leading-relaxed">
          HnT stays without meters. The copies opened on this machine were not the current build, and the bad take is not on this page.
        </p>
      </section>
    )
  }
  return (
    <section className="space-y-4">
      <h2 className="text-2xl">How it plays</h2>
      {sheet.how.map((line) => (
        <p key={line.slice(0, 32)} className="max-w-3xl leading-relaxed">{line}</p>
      ))}
      <div className="grid gap-4 md:grid-cols-[1fr_280px]">
        <div className="plate space-y-4 p-4">
          {sheet.bars.map((meter) => (
            <Bar key={meter.label} meter={meter} accent={accent} />
          ))}
        </div>
        <div className="plate p-4">
          {sheet.gauges.map((meter) => (
            <Gauge key={meter.label} meter={meter} accent={accent} />
          ))}
        </div>
      </div>
      <div className="plate p-4">
        <p className="text-xs tracking-[0.14em] text-gold uppercase">Genre, a reading</p>
        <p className="mt-2 text-sm">{sheet.genre.label}</p>
        <div className="relative mt-3 h-2 bg-black/50">
          <div className="absolute top-1/2 h-4 w-1 -translate-y-1/2 bg-[var(--ember)]" style={{ left: `${sheet.genre.at * 100}%` }} />
        </div>
        <div className="mt-1 flex justify-between text-xs text-muted">
          <span>Melee</span>
          <span>Bullet-hell</span>
        </div>
        <p className="mt-2 text-xs text-muted">{sheet.genre.note}</p>
      </div>
    </section>
  )
}
