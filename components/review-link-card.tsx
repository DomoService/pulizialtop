"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

interface ReviewLinkCardProps {
  agency: {
    agency_id: number
    nome: string
    province: string
    review_token: string | null
  }
}

export function ReviewLinkCard({ agency }: ReviewLinkCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (typeof window !== "undefined" && agency.review_token) {
      const link = `${window.location.origin}/recensione/${agency.review_token}`
      navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold">{agency.nome}</h3>
          <p className="text-sm text-muted-foreground">{agency.province}</p>
        </div>
        <div className="flex items-center gap-4">
          <code className="rounded bg-muted px-3 py-1 text-sm">/recensione/{agency.review_token || "no-token"}</code>
          <Button size="sm" variant="outline" onClick={handleCopy} disabled={!agency.review_token}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </Card>
  )
}
