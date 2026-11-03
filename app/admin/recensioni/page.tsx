import { AdminHeader } from "@/components/admin-header"
import { Footer } from "@/components/footer"
import { getPendingReviews, addCompanyResponse } from "@/app/actions"
import { ReviewModerationCard } from "@/components/review-moderation-card"

export default async function AdminReviewsPage() {
  const pendingReviews = await getPendingReviews()

  async function handleAddResponse(formData: FormData) {
    "use server"
    const reviewId = Number.parseInt(formData.get("review_id") as string)
    const response = formData.get("response") as string
    await addCompanyResponse(reviewId, response)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-4xl space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Moderazione Recensioni</h1>
              <p className="text-muted-foreground">Approva o rifiuta le recensioni in attesa di verifica</p>
            </div>

            {pendingReviews.length === 0 ? (
              <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
                Nessuna recensione in attesa di moderazione
              </div>
            ) : (
              <div className="space-y-4">
                {pendingReviews.map((review: any) => (
                  <ReviewModerationCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
