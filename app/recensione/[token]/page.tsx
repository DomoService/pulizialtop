import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getAgencyByToken } from "@/app/actions"
import { ReviewFormPublic } from "@/components/review-form-public"

export const metadata = { robots: { index: false, follow: false }, referrer: "no-referrer" as const }
export const dynamic = "force-dynamic"

export default async function RecensionePublicaPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const agency = await getAgencyByToken(token)

  if (!agency) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold">Lascia una recensione</h1>
              <p className="text-xl text-muted-foreground">{agency.nome}</p>
              <p className="text-sm text-muted-foreground">{agency.province}</p>
            </div>

            <div className="rounded-lg border bg-card p-8 shadow-lg">
              <ReviewFormPublic token={token} agencyName={agency.nome} />
            </div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              La tua recensione sarà moderata prima della pubblicazione
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
