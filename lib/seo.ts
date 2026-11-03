import type { Metadata } from "next"

export interface AgencySeo {
  agency_id: number
  nome: string
  tipo: string
  province?: string
  descrizione: string | null
}

export function agencyMetadata(agency: AgencySeo): Metadata {
  const location = agency.province && agency.province !== "N/A" ? agency.province : "Sardegna"
  const place = location === "Sardegna" ? "in Sardegna" : `a ${location}`
  const service = agency.tipo === "manutenzione" ? "Manutenzione" : "Pulizie"
  const title = `${agency.nome} - ${service} ${place}`
  const description = agency.descrizione?.trim()
    ? agency.descrizione.replace(/\s+/g, " ").trim().slice(0, 160)
    : `${agency.nome}: servizi di ${service.toLowerCase()} ${place}. Consulta la scheda dell'agenzia, i servizi e i contatti su PuliziAlTop.`
  const url = `https://pulizialtop.it/agenzia/${agency.agency_id}`
  const images = ["/professional-cleaning-service-team.jpg"]
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", locale: "it_IT", siteName: "PuliziAlTop", images },
    twitter: { card: "summary_large_image", title, description, images },
  }
}
