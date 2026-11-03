import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getAgencies } from "@/app/actions"
import { ReviewLinkCard } from "@/components/review-link-card"

export default async function LinkRecensioniPage() {
  const agencies = await getAgencies()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-6 text-3xl font-bold">Link Recensioni Agenzie</h1>
          <p className="mb-8 text-muted-foreground">
            Condividi questi link con le agenzie. I loro clienti potranno lasciare recensioni tramite questi link unici.
          </p>

          <div className="grid gap-4">
            {agencies.map((agency) => (
              <ReviewLinkCard key={agency.agency_id} agency={agency} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
