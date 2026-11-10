"use client"

import { useStudio } from "@/components/studio"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

function Return() {
  const params = useSearchParams()
  const { grantSku } = useStudio()
  const [note, setNote] = useState("Checking the test payment.")
  useEffect(() => {
    const sessionId = params.get("session_id")
    if (!sessionId) return
    void fetch("/api/shop/confirm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId }) })
      .then((response) => response.json())
      .then((data) => {
        if (!data.ok) setNote(data.error || "The payment did not confirm.")
        else {
          setNote(grantSku(data.sku, data.sessionId) || "It landed.")
        }
      })
  }, [grantSku, params])
  return <p className="plate p-6">{note}</p>
}

export default function Page() {
  return <Suspense fallback={<p>Returning.</p>}><Return /></Suspense>
}
