export function AppMark({ className = "w-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-label="TT Applications">
      <rect x="6" y="10" width="52" height="44" fill="#120e0c" stroke="#e4b15a" strokeWidth="2" />
      <path d="M16 42 V22 H28 L32 30 L36 22 H48 V42" fill="none" stroke="#e07a2f" strokeWidth="3" />
      <path className="drip" d="M30 44 C30 50 28 54 32 58 C36 54 34 50 34 44 Z" fill="#e4b15a" />
    </svg>
  )
}
