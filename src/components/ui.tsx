"use client"

import { playClick } from "@/lib/audio"
import { motion } from "motion/react"
import Link from "next/link"

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ")
}

export function Plate({
  href,
  children,
  className,
  onClick,
  type = "button",
}: {
  href?: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
  type?: "button" | "submit"
}) {
  const classNames = cn("plate block px-4 py-3 text-left", className)
  if (href) {
    return (
      <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.985 }}>
        <Link href={href} className={classNames} onClick={() => playClick()}>
          <span className="sheen" />
          <span className="relative">{children}</span>
        </Link>
      </motion.div>
    )
  }
  return (
    <motion.button type={type} whileHover={{ y: -2 }} whileTap={{ scale: 0.985 }} className={classNames} onClick={() => { playClick(); onClick?.() }}>
      <span className="sheen" />
      <span className="relative">{children}</span>
    </motion.button>
  )
}

export function Gate({ texture, accent, video, still, label }: { texture: string; accent: string; video?: string; still?: string; label: string }) {
  return (
    <div className={cn("gate", `texture-${texture}`)} style={{ boxShadow: `inset 0 0 80px ${accent}22` }}>
      <i /><i /><b /><b />
      {video ? <video className="absolute inset-0 h-full w-full object-cover" src={video} poster={still} controls playsInline /> : null}
      {!video && still ? <img className="absolute inset-0 h-full w-full object-cover" src={still} alt="" /> : null}
      {!video && !still ? (
        <div className="absolute inset-0 grid place-items-center p-6 text-center">
          <div>
            <p className="display text-lg text-gold">{label}</p>
            <p className="mt-2 max-w-sm text-sm text-muted">The gate is cut. The picture is not in yet.</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function Status({ status, label }: { status: string; label: string }) {
  return <p className={cn("text-xs tracking-[0.16em] uppercase", `status-${status}`)}>{label}</p>
}
