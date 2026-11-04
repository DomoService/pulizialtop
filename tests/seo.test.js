import { expect, test } from "bun:test"
import { agencyMetadata } from "../lib/seo"

const agency = { agency_id: 20, nome: "Impresa di prova", tipo: "pulizie", province: "Cagliari", descrizione: "Pulizie di case e uffici." }

test("each agency has its own canonical and social URL, not the homepage", () => {
  for (const id of [20, 21]) {
    const metadata = agencyMetadata({ ...agency, agency_id: id })
    expect(metadata.alternates?.canonical).toBe(`https://pulizialtop.it/agenzia/${id}`)
    expect(metadata.openGraph?.url).toBe(`https://pulizialtop.it/agenzia/${id}`)
    expect(metadata.title).toBe("Impresa di prova - Pulizie a Cagliari")
    expect(metadata.description).toBe(agency.descrizione)
    expect(metadata.twitter?.title).toBe(metadata.title)
  }
})

test("maintenance and missing descriptions use accurate service/location fallbacks", () => {
  const metadata = agencyMetadata({ ...agency, tipo: "manutenzione", province: "N/A", descrizione: null })
  expect(metadata.title).toBe("Impresa di prova - Manutenzione in Sardegna")
  expect(metadata.description).toContain("servizi di manutenzione")
  expect(metadata.description).not.toContain("recensioni verificate")
})

test("descriptions normalize whitespace and remain bounded", () => {
  const metadata = agencyMetadata({ ...agency, descrizione: " Servizi\n\t di pulizia " + "a".repeat(200) })
  expect(metadata.description?.length).toBeLessThanOrEqual(160)
  expect(metadata.description).toStartWith("Servizi di pulizia ")
})
