import { LegalPage } from "@/components/legal-page"
import { LegalRequestForm } from "@/components/legal-request-form"
export const metadata = {
  title: "Segnala un problema",
  robots: { index: false, follow: true },
}
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string; url?: string }>
}) {
  const p = await searchParams
  return (
    <LegalPage title="Segnala un problema">
      <p>
        Richieste privacy, contestazioni, contenuti potenzialmente illeciti,
        correzione o rimozione delle schede e assistenza. Nessuna richiesta
        modifica automaticamente i dati del sito. Per urgenze relative alla
        sicurezza delle persone rivolgiti alle autorità competenti.
      </p>
      <LegalRequestForm
        initialKind={p.tipo}
        initialUrl={p.url?.slice(0, 2000) || ""}
      />
    </LegalPage>
  )
}
