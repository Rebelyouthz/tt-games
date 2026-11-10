import Link from "next/link"

export default function NotFound() {
  return (
    <div className="plate max-w-xl p-8">
      <h1 className="text-4xl">That door is not cut</h1>
      <p className="mt-3 text-muted">The page is missing. The studio is not.</p>
      <Link className="mt-4 inline-block text-gold" href="/">Back to the mark</Link>
    </div>
  )
}
