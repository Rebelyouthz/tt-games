"use client"

import type { Pet } from "@/lib/types"

export function TuffieSprite({ pet, sleeping = false, className = "" }: { pet: Pet; sleeping?: boolean; className?: string }) {
  const genes = pet.genes
  const primary = pet.gear.dye || genes?.furPrimary || "#e4b15a"
  const secondary = genes?.furSecondary || "#1a120c"
  const eye = genes?.eyeColor || "#1a120c"
  const stage = pet.stage
  const scale = stage === "newborn" ? 0.72 : stage === "pup" ? 0.84 : stage === "prime" ? 1.08 : 1
  const eyesClosed = sleeping || stage === "egg"
  const shake = stage === "egg"
  const motion = shake ? "egg-shake" : stage === "prime" ? "bob prime-bob" : "bob"
  return (
    <svg viewBox="0 0 200 180" className={`${motion} ${className}`} aria-hidden>
      {stage === "prime" ? <ellipse cx="100" cy="96" rx="78" ry="70" fill="#e4b15a" opacity="0.18" /> : null}
      {stage === "egg" ? (
        <g>
          <ellipse cx="100" cy="100" rx="58" ry="70" fill="#f3e2c4" stroke="#8a5a1e" strokeWidth="4" />
          <path d="M78 70 C90 90 70 110 86 130" fill="none" stroke="#c47a2a" strokeWidth="3" />
          <path d="M120 64 C132 96 118 120 134 142" fill="none" stroke="#8e2f2a" strokeWidth="3" />
        </g>
      ) : (
        <g transform={`translate(100 100) scale(${scale}) translate(-100 -100)`}>
          {genes?.earTuft !== "none" ? <ellipse cx={genes?.earTuft === "one" ? 100 : 62} cy="48" rx="14" ry="22" fill={primary} /> : null}
          {genes?.earTuft === "two" ? <ellipse cx="138" cy="48" rx="14" ry="22" fill={primary} /> : null}
          <ellipse cx="100" cy="104" rx={genes?.body === "long" ? 48 : genes?.body === "small" ? 40 : 56} ry={genes?.body === "heavy" ? 58 : 50} fill={primary} />
          {genes?.pattern === "belly" ? <ellipse cx="100" cy="118" rx="28" ry="24" fill={secondary} opacity="0.85" /> : null}
          {genes?.pattern === "stripes" ? <path d="M70 90 H130 M66 110 H134 M72 128 H128" stroke={secondary} strokeWidth="6" /> : null}
          {genes?.pattern === "spots" ? (
            <g fill={secondary}>
              <circle cx="78" cy="96" r="7" />
              <circle cx="124" cy="108" r="6" />
              <circle cx="96" cy="124" r="5" />
            </g>
          ) : null}
          {genes?.pattern === "mask" ? <ellipse cx="100" cy="92" rx="34" ry="16" fill={secondary} opacity="0.8" /> : null}
          {pet.hair && pet.hair !== "bald" ? <path d="M60 70 C80 30 120 30 140 70" fill={secondary} /> : null}
          {pet.hair === "mohawk" || pet.hair === "spikes" ? <path d="M92 68 L100 28 L108 68" fill={secondary} /> : null}
          {eyesClosed ? (
            <path d="M72 96 H92 M108 96 H128" stroke={eye} strokeWidth="4" />
          ) : genes?.eyeShape === "star" ? (
            <path d="M82 96 L86 88 L90 96 L98 100 L90 104 L86 112 L82 104 L74 100 Z" fill={eye} />
          ) : (
            <g fill={eye}>
              <ellipse cx="82" cy="98" rx={genes?.eyeShape === "uneven" ? 12 : 9} ry={genes?.eyeShape === "sleepy" ? 4 : genes?.eyeShape === "angry" ? 7 : 11} />
              <ellipse cx="118" cy="98" rx="9" ry={genes?.eyeShape === "sleepy" ? 4 : 11} />
            </g>
          )}
          {genes?.mouth === "line" ? <path d="M88 122 H112" stroke={secondary} strokeWidth="3" /> : null}
          {genes?.mouth === "gap" ? <path d="M90 120 Q100 132 110 120" fill="none" stroke={secondary} strokeWidth="3" /> : null}
          {genes?.mouth === "tooth" ? <path d="M96 120 H104 V128 H96 Z" fill="#f4efe6" /> : null}
          {pet.gear.hat ? <path d="M58 78 H142 L132 64 H70 Z" fill="#1a120c" /> : null}
          {pet.gear.collar ? <ellipse cx="100" cy="136" rx="18" ry="6" fill="none" stroke="#e4b15a" strokeWidth="3" /> : null}
          {pet.scar ? <path d="M118 78 L130 92" stroke="#8e2f2a" strokeWidth="2" /> : null}
          {pet.dirtyUntil ? <ellipse cx="112" cy="124" rx="16" ry="8" fill="#3a2a1c" opacity="0.45" /> : null}
        </g>
      )}
    </svg>
  )
}
