"use client"

import { useId } from "react"

export function ornamentSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 640">
  <defs>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff4d2"/>
      <stop offset="0.45" stop-color="#e4b15a"/>
      <stop offset="1" stop-color="#8a5a1e"/>
    </linearGradient>
    <linearGradient id="blood" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ff6a55"/>
      <stop offset="1" stop-color="#6e1410"/>
    </linearGradient>
    <linearGradient id="iron" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3c342c"/>
      <stop offset="1" stop-color="#120e0c"/>
    </linearGradient>
  </defs>
  <path fill="url(#iron)" d="M70 470 H930 L900 560 H100 Z"/>
  <path fill="url(#iron)" d="M40 560 H960 L920 610 H80 Z"/>
  <path fill="url(#gold)" stroke="#2a140c" stroke-width="8" d="M70 78 H500 L514 140 H300 L330 330 H214 L176 140 H58 Z"/>
  <path fill="url(#gold)" stroke="#2a140c" stroke-width="8" d="M500 78 H930 L942 140 H824 L792 330 H676 L710 140 H486 Z"/>
  <path fill="none" stroke="url(#blood)" stroke-width="16" stroke-linecap="round" d="M150 132 H430 M268 150 V300"/>
  <path fill="none" stroke="url(#blood)" stroke-width="16" stroke-linecap="round" d="M560 132 H860 M742 150 V300"/>
  <path fill="url(#gold)" d="M500 28 L524 78 L500 96 L476 78 Z"/>
  <path fill="url(#blood)" d="M500 150 L518 196 L500 214 L482 196 Z"/>
  <path fill="url(#gold)" d="M120 300 C118 360 100 400 112 450 C128 392 126 350 124 300 Z"/>
  <path fill="url(#blood)" d="M250 330 C248 390 236 430 248 490 C266 420 262 370 258 330 Z"/>
  <path fill="url(#gold)" d="M860 300 C866 370 890 420 868 480 C848 410 850 350 852 300 Z"/>
  <path fill="url(#blood)" d="M760 330 C764 400 786 450 768 510 C746 440 748 380 750 330 Z"/>
  <path fill="url(#gold)" d="M180 600 C176 640 160 680 176 720 C196 660 194 630 188 600 Z"/>
  <path fill="url(#blood)" d="M800 600 C806 650 830 690 808 730 C786 670 788 630 792 600 Z"/>
</svg>`
}

export function LogoMark({ className, live = true }: { className?: string; live?: boolean }) {
  const uid = useId().replace(/:/g, "")
  return (
    <svg className={className} viewBox="0 0 1000 640" role="img" aria-label="TT Games">
      <defs>
        <linearGradient id={`${uid}-gold`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff4d2" />
          <stop offset="0.45" stopColor="#e4b15a" />
          <stop offset="1" stopColor="#8a5a1e" />
        </linearGradient>
        <linearGradient id={`${uid}-blood`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff6a55" />
          <stop offset="1" stopColor="#6e1410" />
        </linearGradient>
        <linearGradient id={`${uid}-iron`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3c342c" />
          <stop offset="1" stopColor="#120e0c" />
        </linearGradient>
      </defs>
      <path fill={`url(#${uid}-iron)`} d="M70 470 H930 L900 545 H100 Z" />
      <path fill={`url(#${uid}-iron)`} d="M40 548 H960 L910 610 H90 Z" />
      <path fill={`url(#${uid}-gold)`} stroke="#2a140c" strokeWidth="8" d="M70 78 H500 L514 140 H300 L330 318 H214 L176 140 H58 Z" />
      <path fill={`url(#${uid}-gold)`} stroke="#2a140c" strokeWidth="8" d="M500 78 H930 L942 140 H824 L792 318 H676 L710 140 H486 Z" />
      <path fill="none" stroke={`url(#${uid}-blood)`} strokeWidth="16" strokeLinecap="round" d="M150 132 H430 M268 150 V292" />
      <path fill="none" stroke={`url(#${uid}-blood)`} strokeWidth="16" strokeLinecap="round" d="M560 132 H860 M742 150 V292" />
      <path fill={`url(#${uid}-gold)`} d="M500 28 L524 78 L500 96 L476 78 Z" />
      <path fill={`url(#${uid}-blood)`} d="M500 150 L518 196 L500 214 L482 196 Z" />
      <text x="500" y="455" textAnchor="middle" fill={`url(#${uid}-gold)`} stroke="#4a120e" strokeWidth="8" fontFamily="Cinzel Local, Palatino, serif" fontSize="92" letterSpacing="14">
        GAMES
      </text>
      <text x="500" y="532" textAnchor="middle" fill="#f3e2c0" fontFamily="Cinzel Local, Palatino, serif" fontSize="22" letterSpacing="6">
        TIMMIETOOTH GAMES
      </text>
      <path className={live ? "drip" : undefined} fill={`url(#${uid}-gold)`} d="M120 300 C118 350 102 390 114 440 C130 384 128 340 124 300 Z" />
      <path className={live ? "drip drip-slow" : undefined} fill={`url(#${uid}-blood)`} d="M250 318 C248 372 234 414 246 470 C264 408 260 360 256 318 Z" />
      <path className={live ? "drip" : undefined} fill={`url(#${uid}-gold)`} d="M860 300 C866 360 888 410 868 468 C848 402 850 346 852 300 Z" />
      <path className={live ? "drip drip-slow" : undefined} fill={`url(#${uid}-blood)`} d="M760 318 C764 380 786 430 768 488 C746 420 748 368 750 318 Z" />
      <path className={live ? "drip" : undefined} fill={`url(#${uid}-gold)`} d="M190 600 C186 640 168 670 184 700 C204 652 200 626 196 600 Z" />
      <path className={live ? "drip drip-slow" : undefined} fill={`url(#${uid}-blood)`} d="M800 600 C806 646 828 678 808 710 C786 656 788 628 792 600 Z" />
    </svg>
  )
}
