import { getAgencies } from "./actions"

export default async function sitemap() {
  const agencies = await getAgencies({})

  const agencyUrls = agencies.map((agency) => ({
    url: `https://pulizialtop.it/agenzia/${agency.agency_id}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [
    {
      url: "https://pulizialtop.it",
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: "https://pulizialtop.it/chi-siamo",
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: "https://pulizialtop.it/come-funziona",
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: "https://pulizialtop.it/per-agenzie",
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: "https://pulizialtop.it/contattaci",
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: "https://pulizialtop.it/registrazione-agenzia",
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    ...[
      "diritti-privacy",
      "privacy-policy",
      "cookie-policy",
      "termini-e-condizioni",
      "informazioni-legali",
      "regole-recensioni",
    ].map((path) => ({
      url: `https://pulizialtop.it/${path}`,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    })),
    ...agencyUrls,
  ]
}
