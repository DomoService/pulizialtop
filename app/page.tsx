import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { AgencyList } from "@/components/agency-list"
import { Footer } from "@/components/footer"
import { getAgencies } from "@/app/actions"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: { absolute: "Agenzie di pulizie e manutenzione in Sardegna | PuliziAlTop" },
  description: "Trova agenzie di pulizie e manutenzione in Sardegna. Consulta servizi e contatti delle imprese a Cagliari, Sassari, Nuoro, Oristano e Sud Sardegna.",
  alternates: { canonical: "https://pulizialtop.it" },
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "PuliziAlTop",
    title: "Agenzie di pulizie e manutenzione in Sardegna | PuliziAlTop",
    description: "Consulta servizi e contatti delle agenzie di pulizie e manutenzione in Sardegna.",
    url: "https://pulizialtop.it",
    images: ["/professional-cleaning-service-team.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Agenzie di pulizie e manutenzione in Sardegna | PuliziAlTop",
    description: "Consulta servizi e contatti delle agenzie in Sardegna.",
    images: ["/professional-cleaning-service-team.jpg"],
  },
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; province?: string }>
}) {
  const params = await searchParams
  const filters = {
    type: params.type,
    province: params.province,
  }

  const agencies = await getAgencies(filters)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <AgencyList agencies={agencies} />
      </main>
      <Footer />
    </div>
  )
}
