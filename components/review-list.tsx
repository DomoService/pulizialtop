import { Star } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Review } from "@/app/actions"

interface ReviewListProps {
  reviews: Review[]
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        Nessuna recensione ancora. Sii il primo a lasciarne una!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Recensioni verificate</h3>
      <div className="space-y-3">
        {reviews.map((review) => (
          <Card key={review.review_id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{review.reviewer_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString("it-IT")}
                  </p>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
