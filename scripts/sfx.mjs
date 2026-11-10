import fs from "fs"
import path from "path"

function wav(samples, rate = 22050) {
  const data = Buffer.alloc(samples.length * 2)
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]))
    data.writeInt16LE(Math.round(s * 32767), i * 2)
  }
  const header = Buffer.alloc(44)
  header.write("RIFF", 0)
  header.writeUInt32LE(36 + data.length, 4)
  header.write("WAVE", 8)
  header.write("fmt ", 12)
  header.writeUInt32LE(16, 16)
  header.writeUInt16LE(1, 20)
  header.writeUInt16LE(1, 22)
  header.writeUInt32LE(rate, 24)
  header.writeUInt32LE(rate * 2, 28)
  header.writeUInt16LE(2, 32)
  header.writeUInt16LE(16, 34)
  header.write("data", 36)
  header.writeUInt32LE(data.length, 40)
  return Buffer.concat([header, data])
}

function tone(freq, seconds, kind) {
  const rate = 22050
  const n = Math.floor(rate * seconds)
  const samples = []
  for (let i = 0; i < n; i++) {
    const t = i / rate
    const env = Math.min(1, i / (rate * 0.012)) * Math.exp(-3.2 * (i / n))
    let v = Math.sin(2 * Math.PI * freq * t)
    if (kind === "click") v = (Math.random() * 2 - 1) * 0.35 + Math.sin(2 * Math.PI * 1200 * t) * 0.65
    if (kind === "hit") v = Math.sin(2 * Math.PI * freq * t) * 0.55 + Math.sin(2 * Math.PI * 70 * t) * 0.45
    if (kind === "drop") v = Math.sin(2 * Math.PI * (freq - t * 220) * t)
    samples.push(v * env * 0.85)
  }
  return samples
}

const dir = path.join(process.cwd(), "public", "sfx")
fs.mkdirSync(dir, { recursive: true })
fs.writeFileSync(path.join(dir, "click.wav"), wav(tone(880, 0.07, "click")))
fs.writeFileSync(path.join(dir, "hit.wav"), wav(tone(130, 0.2, "hit")))
fs.writeFileSync(path.join(dir, "drop.wav"), wav(tone(340, 0.32, "drop")))
