"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { submitReview } from "@/app/actions"

interface ReviewFormProps {
  agencyId: number
  agencyName: string
}

export function ReviewForm({ agencyId, agencyName }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    const result = await submitReview(formData)
    setIsSubmitting(false)

    if (result.success) {
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setRating(0)
      }, 3000)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lascia una recensione</CardTitle>
        <CardDescription>La tua recensione sarà pubblicata dopo la nostra verifica</CardDescription>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="rounded-lg bg-green-50 p-4 text-center text-green-800">
            Grazie! La tua recensione è in attesa di approvazione.
          </div>
        ) : (
          <form action={handleSubmit} className="space-y-4">
            <input type="hidden" name="agency_id" value={agencyId} />

            <div className="space-y-2">
              <Label htmlFor="reviewer_name">Nome</Label>
              <Input id="reviewer_name" name="reviewer_name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reviewer_email">Email</Label>
              <Input id="reviewer_email" name="reviewer_email" type="email" required />
            </div>

            <div className="space-y-2">
              <Label>Valutazione</Label>
              <input type="hidden" name="rating" value={rating} required />
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
                      className={`h-8 w-8 ${
                        star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating === 0 && (
                <p className="text-sm text-muted-foreground">Seleziona una valutazione da 1 a 5 stelle</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Commento</Label>
              <Textarea id="comment" name="comment" rows={4} placeholder="Racconta la tua esperienza..." required />
            </div>

            <Button type="submit" disabled={isSubmitting || rating === 0} className="w-full">
              {isSubmitting ? "Invio in corso..." : "Invia recensione"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
