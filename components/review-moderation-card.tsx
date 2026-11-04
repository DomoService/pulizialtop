"use client"

import { useState } from "react"
import { Star, Check, X } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { moderateReview } from "@/app/actions"
import { useRouter } from 'next/navigation'

interface ReviewModerationCardProps {
  review: any
}

export function ReviewModerationCard({ review }: ReviewModerationCardProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  async function handleModerate(status: "approved" | "rejected") {
    setIsProcessing(true)
    console.log("[v0] Starting moderation for review:", review.id, "status:", status)
    const result = await moderateReview(review.id, status)
    console.log("[v0] Moderation result:", result)
    setIsProcessing(false)
    router.refresh()
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold">{review.reviewer_name}</p>
            <p className="text-sm text-muted-foreground">{review.reviewer_email}</p>
            <p className="text-sm font-medium text-primary">{review.agencies?.nome}</p>
            <p className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString("it-IT")}</p>
          </div>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{review.comment}</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          onClick={() => handleModerate("approved")}
          disabled={isProcessing}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          <Check className="mr-2 h-4 w-4" />
          Approva
        </Button>
        <Button
          onClick={() => handleModerate("rejected")}
          disabled={isProcessing}
          variant="destructive"
          className="flex-1"
        >
          <X className="mr-2 h-4 w-4" />
          Rifiuta
        </Button>
      </CardFooter>
    </Card>
  )
}
