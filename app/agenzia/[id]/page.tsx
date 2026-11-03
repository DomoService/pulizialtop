import type { Metadata } from "next"
import { cache } from "react"
import { agencyMetadata } from "@/lib/seo"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ReviewList } from "@/components/review-list"
import { getAgencies, getApprovedReviews } from "@/app/actions"
import { Star, MapPin, Phone, Mail, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const getAgency = cache(async (id: string) => {
  if (!/^\d+$/.test(id)) return undefined
  const agencies = await getAgencies()
  return agencies.find((agency) => agency.agency_id === Number(id))
})

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const agency = await getAgency((await params).id)
  if (!agency) notFound()
  return agencyMetadata(agency)
}

export default async function AgencyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const agency = await getAgency(id)

  if (!agency) {
    notFound()
  }

  const reviews = await getApprovedReviews(agency.agency_id)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="space-y-4">
              <Badge className="capitalize">{agency.tipo}</Badge>
              <h1 className="text-4xl font-bold">{agency.nome}</h1>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold">{agency.google_rating?.toFixed(1) || "N/A"}</span>
                  <span className="text-muted-foreground">({agency.google_reviews} recensioni)</span>
                </div>
              </div>

              <div className="space-y-2 text-muted-foreground">
                {agency.indirizzo && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>
                      {agency.indirizzo}, {agency.province} {agency.cap}
                    </span>
                  </div>
                )}
                {agency.telefono && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    <a href={`tel:${agency.telefono}`} className="hover:underline">
                      {agency.telefono}
                    </a>
                  </div>
                )}
                {agency.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    <a href={`mailto:${agency.email}`} className="hover:underline">
                      {agency.email}
                    </a>
                  </div>
                )}
                {agency.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    <a href={agency.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {agency.website}
                    </a>
                  </div>
                )}
              </div>

              {agency.descrizione && <p className="text-lg leading-relaxed">{agency.descrizione}</p>}

              {agency.servizi && agency.servizi.length > 0 && (
                <div>
                  <h3 className="mb-3 text-xl font-semibold">Servizi offerti</h3>
                  <div className="flex flex-wrap gap-2">
                    {agency.servizi.map((service, idx) => (
                      <Badge key={idx} variant="secondary">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold">Recensioni</h2>
              <ReviewList reviews={reviews} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
