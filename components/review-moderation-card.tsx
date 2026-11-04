"use client"

import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Star, Check, X } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { moderateReview } from "@/app/actions"
import { useRouter } from "next/navigation"

interface ReviewModerationCardProps {
  review: any
}

export function ReviewModerationCard({ review }: ReviewModerationCardProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const [reason, setReason] = useState("")
  const [error, setError] = useState("")

  async function handleModerate(status: "approved" | "rejected") {
    setIsProcessing(true)
    setError("")
    try {
      const result = await moderateReview(review.id, status, reason)
      if (!result.success) setError(result.error || "Operazione non riuscita")
      else router.refresh()
    } catch {
      setError("Moderazione non riuscita: verifica accesso e database")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold">{review.reviewer_name}</p>
            <p className="text-sm text-muted-foreground">
              {review.reviewer_email}
            </p>
            <p className="text-sm font-medium text-primary">
              {review.agencies?.nome}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(review.created_at).toLocaleDateString("it-IT")}
            </p>
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
      <div className="space-y-2 px-6 pb-4">
        <label className="block space-y-1">
          <span>Motivazione e rimedi della decisione</span>
          <Textarea
            value={reason}
            minLength={10}
            maxLength={5000}
            onChange={(e) => setReason(e.target.value)}
          />
        </label>
        <p className="text-xs">
          Registra la motivazione; comunica la decisione all’autore nei casi
          previsti. Le email automatiche non sono ancora attive.
        </p>
        {error && <p role="alert">{error}</p>}
      </div>
      <CardFooter className="flex gap-2">
        <Button
          onClick={() => handleModerate("approved")}
          disabled={isProcessing || reason.trim().length < 10}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          <Check className="mr-2 h-4 w-4" />
          Approva
        </Button>
        <Button
          onClick={() => handleModerate("rejected")}
          disabled={isProcessing || reason.trim().length < 10}
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
