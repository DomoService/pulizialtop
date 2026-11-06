import { RetentionProposals } from "@/components/retention-proposals"
import Link from "next/link"
import { AdminHeader } from "@/components/admin-header"
import { Footer } from "@/components/footer"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/access"
import { getLegalSettings } from "@/lib/legal/data"
import { getComplianceRequests } from "@/app/legal-actions"
import {
  ComplianceSettings,
  ComplianceRequest,
  ProvenanceAdmin,
} from "@/components/compliance-admin"
export const metadata = {
  title: "Conformità e sicurezza",
  robots: { index: false, follow: false },
}
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ pagina?: string }>
}) {
  const db = await getSupabaseServerClient()
  await requireAdmin(db)
  const param = (await searchParams).pagina || "0"
  const page = /^\d{1,6}$/.test(param) ? Math.min(Number(param), 100000) : 0
  const [{ settings, configured }, { requests, available }] = await Promise.all(
    [getLegalSettings(), getComplianceRequests(page)]
  )
  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <main className="container mx-auto max-w-5xl flex-1 space-y-8 px-4 py-12">
        <h1 className="text-3xl font-bold">Conformità e sicurezza</h1>
        <p>
          Strumenti operativi, non certificazione legale. Revisionare
          applicabilità DSA/accessibilità, fornitori, conservazione e diritti
          sui contenuti. Cancellazioni ed esportazioni dei dati richiedono
          verifica umana: nessuna eliminazione automatica.
        </p>
        <ComplianceSettings initial={settings} configured={configured} />
        <RetentionProposals />
        <ProvenanceAdmin />
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            Richieste privacy, segnalazioni, reclami e registrazioni
          </h2>
          {!available ? (
            <p role="alert">
              Registro non disponibile: verifica migrazione e permessi. Non
              significa assenza di richieste. Gestisci nel frattempo la casella
              info@pulizialtop.it.
            </p>
          ) : requests.length === 0 ? (
            <p>Nessuna richiesta in questa pagina.</p>
          ) : (
            requests.map((r) => <ComplianceRequest key={r.id} request={r} />)
          )}
          <nav aria-label="Pagine richieste" className="flex gap-6">
            {page > 0 && (
              <Link className="underline" href={`?pagina=${page - 1}`}>
                Precedente
              </Link>
            )}
            {requests.length === 25 && (
              <Link className="underline" href={`?pagina=${page + 1}`}>
                Successiva
              </Link>
            )}
          </nav>
        </section>
      </main>
      <Footer />
    </div>
  )
}
