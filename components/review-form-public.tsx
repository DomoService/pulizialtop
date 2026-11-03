"use client"

import { useState } from "react"
import { submitReviewWithToken } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"

export function ReviewFormPublic({
  token,
  agencyName,
}: {
  token: string
  agencyName: string
}) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    formData.append("review_token", token)
    const result = await submitReviewWithToken(formData)

    if (result.success) {
      setSubmitted(true)
    } else {
      alert(result.error || "Errore durante l'invio")
    }
    setIsSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="py-8 text-center">
        <div className="mb-4 text-6xl">✓</div>
        <h3 className="mb-2 text-2xl font-bold text-green-600">Grazie!</h3>
        <p className="text-muted-foreground">
          La tua recensione per <strong>{agencyName}</strong> è stata ricevuta e sarà pubblicata dopo la moderazione.
        </p>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="reviewer_name">Nome e Cognome</Label>
        <Input id="reviewer_name" name="reviewer_name" required placeholder="Mario Rossi" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reviewer_email">Email</Label>
        <Input id="reviewer_email" name="reviewer_email" type="email" required placeholder="mario@example.com" />
      </div>

      <div className="space-y-2">
        <Label>Valutazione</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`h-10 w-10 ${
                  star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
        <input type="hidden" name="rating" value={rating} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Recensione</Label>
        <Textarea
          id="comment"
          name="comment"
          required
          placeholder="Descrivi la tua esperienza con questa agenzia..."
          rows={6}
        />
      </div>

      <Button type="submit" disabled={isSubmitting || rating === 0} className="w-full" size="lg">
        {isSubmitting ? "Invio in corso..." : "Invia Recensione"}
      </Button>
    </form>
  )
}
