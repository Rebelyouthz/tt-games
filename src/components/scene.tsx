"use client"

import { playDrop, playHit } from "@/lib/audio"
import { ornamentSvg } from "@/components/mark"
import { Text } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import gsap from "gsap"
import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"

type Rig = { t1: number; t2: number; g: number; a: number; m: number; e: number; s: number; crest: number; show: number; shake: number }

function useCrestTexture() {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  useEffect(() => {
    let dead = false
    const run = async () => {
      const face = new FontFace("Cinzel Local", "url(/fonts/cinzel-700.woff)")
      await face.load()
      document.fonts.add(face)
      const canvas = document.createElement("canvas")
      canvas.width = 1600
      canvas.height = 1024
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      const image = new Image()
      const url = URL.createObjectURL(new Blob([ornamentSvg()], { type: "image/svg+xml;charset=utf-8" }))
      image.onload = () => {
        ctx.drawImage(image, 0, 80, 1600, 1024)
        ctx.textAlign = "center"
        ctx.font = "700 150px 'Cinzel Local'"
        ctx.lineWidth = 12
        ctx.strokeStyle = "#4a120e"
        ctx.strokeText("GAMES", 800, 760)
        ctx.fillStyle = "#f6e2b8"
        ctx.fillText("GAMES", 800, 760)
        ctx.font = "700 42px 'Cinzel Local'"
        ctx.fillStyle = "#f3e2c0"
        ctx.fillText("TIMMIETOOTH GAMES", 800, 860)
        const next = new THREE.CanvasTexture(canvas)
        next.colorSpace = THREE.SRGBColorSpace
        if (!dead) setTexture(next)
        URL.revokeObjectURL(url)
      }
      image.src = url
    }
    void run()
    return () => {
      dead = true
    }
  }, [])
  return texture
}

function Drops({ active }: { active: boolean }) {
  const group = useRef<THREE.Group>(null)
  const seeds = useMemo(() => Array.from({ length: 18 }, (_, index) => ({ x: Math.sin(index * 1.7) * 2.1, z: (index % 4) * 0.05, gold: index % 2 === 0, speed: 0.35 + (index % 5) * 0.08 })), [])
  useFrame((_, delta) => {
    if (!group.current || !active) return
    group.current.children.forEach((child, index) => {
      const seed = seeds[index]
      child.position.y -= seed.speed * delta * 1.4
      if (child.position.y < -2.6) {
        child.position.y = 1.3
        child.position.x = seed.x + Math.sin(index) * 0.2
      }
    })
  })
  return (
    <group ref={group} visible={active}>
      {seeds.map((seed, index) => (
        <mesh key={index} position={[seed.x, 1.2 - (index % 6) * 0.2, seed.z]}>
          <sphereGeometry args={[seed.gold ? 0.07 : 0.05, 16, 16]} />
          <meshStandardMaterial color={seed.gold ? "#e4b15a" : "#c5231c"} metalness={0.85} roughness={0.18} emissive={seed.gold ? "#5a3a10" : "#3a0808"} />
        </mesh>
      ))}
    </group>
  )
}

function Show({ rig, mode }: { rig: React.RefObject<Rig | null>; mode: "intro" | "rest" }) {
  const letters = useRef<THREE.Group>(null)
  const crest = useRef<THREE.Mesh>(null)
  const texture = useCrestTexture()
  const labels = [
    ["T", -0.7, 1.35],
    ["T", 0.7, 1.35],
    ["G", -1.5, 0.62],
    ["A", -0.75, 0.62],
    ["M", 0, 0.62],
    ["E", 0.75, 0.62],
    ["S", 1.5, 0.62],
  ] as const
  useFrame(() => {
    const state = rig.current
    if (!state) return
    if (letters.current) {
      const values = [state.t1, state.t2, state.g, state.a, state.m, state.e, state.s]
      letters.current.children.forEach((child, index) => {
        child.position.y = values[index] ?? -8
        child.visible = state.show < 0.5
      })
    }
    if (crest.current) {
      crest.current.position.y = mode === "rest" ? 0 : state.crest
      crest.current.visible = mode === "rest" || state.show > 0.2
      const material = crest.current.material
      if (!Array.isArray(material)) material.opacity = mode === "rest" ? 1 : state.show
      crest.current.rotation.z = state.shake * 0.02
    }
  })
  return (
    <>
      {mode === "intro" ? <group ref={letters}>
        {labels.map(([label, x, size]) => (
          <Text key={label + x} font="/fonts/cinzel-700.woff" position={[x, -8, 0]} fontSize={size} color="#f6e2b8" anchorX="center" anchorY="middle">
            {label}
          </Text>
        ))}
      </group> : null}
      {mode === "intro" && texture ? (
        <mesh ref={crest} position={[0, -6, 0]}>
          <planeGeometry args={[4.4, 2.8]} />
          <meshBasicMaterial map={texture} transparent toneMapped={false} />
        </mesh>
      ) : null}
      <Drops active={mode === "rest"} />
    </>
  )
}

export function CrestScene({ mode, onDone }: { mode: "intro" | "rest"; onDone?: () => void }) {
  const rig = useRef<Rig>({ t1: -8, t2: -8, g: -8, a: -8, m: -8, e: -8, s: -8, crest: -6, show: 0, shake: 0 })
  const dropsOn = useRef(false)
  const done = useRef(onDone)
  done.current = onDone
  const [, bump] = useState(0)
  useEffect(() => {
    if (mode === "rest") {
      rig.current.show = 1
      rig.current.crest = 0
      return
    }
    const state = rig.current
    const timeline = gsap.timeline({ onComplete: () => done.current?.() })
    const slam = (key: "t1" | "t2" | "g" | "a" | "m" | "e" | "s", at: number) => {
      timeline.to(state, { [key]: 0, duration: 0.22, ease: "power4.in" }, at)
      timeline.call(() => playHit(), [], at + 0.2)
    }
    slam("t1", 0.15)
    slam("t2", 0.62)
    slam("g", 1.15)
    slam("a", 1.42)
    slam("m", 1.64)
    slam("e", 1.8)
    slam("s", 1.92)
    timeline.to(state, { t1: 8, t2: 8, g: 8, a: 8, m: 8, e: 8, s: 8, duration: 0.28, ease: "power2.in" }, 2.35)
    timeline.to(state, { crest: 0, show: 1, duration: 0.45, ease: "power4.in" }, 2.5)
    timeline.call(() => {
      state.shake = 1
      dropsOn.current = true
      bump((value) => value + 1)
      playDrop()
    }, [], 2.95)
    return () => {
      timeline.kill()
    }
  }, [mode])
  return (
    <Canvas camera={{ position: [0, 0, 6.2], fov: 38 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={0.7} />
      <spotLight position={[2, 4, 6]} intensity={40} color="#ffe1a8" />
      <pointLight position={[-3, -1, 4]} intensity={12} color="#e07a2f" />
      <Show rig={rig} mode={mode} />
      {mode === "intro" ? <IntroDrops on={dropsOn.current} /> : null}
    </Canvas>
  )
}

function IntroDrops({ on }: { on: boolean }) {
  return <Drops active={on} />
}
