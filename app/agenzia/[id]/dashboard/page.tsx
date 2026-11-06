import Link from "next/link"
import { redirect, notFound } from "next/navigation"
import { CompanyReviewResponse } from "@/components/company-review-response"
import { getApprovedReviews } from "@/app/actions"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { requireAgencyAccess, AgencyAccessDenied } from "@/lib/access"
import { SessionLogout } from "@/components/session-logout"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getAgencyById, getAgencyInvitations } from "@/app/actions"
import { InvitationForm, InvitationsList } from "@/components/invitation-form"

// Authorization must run on every request, never from a shared rendered cache.
export const dynamic = "force-dynamic"

export default async function AgencyDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) notFound()
  try {
    await requireAgencyAccess(await getSupabaseServerClient(), Number(id))
  } catch (error) {
    if (error instanceof AgencyAccessDenied) redirect("/agenzia/login?accesso=negato")
    throw error
  }
  const agency = await getAgencyById(Number.parseInt(id))
  let invitations: any[] = []
  let invitationsAvailable = true
  try { invitations = await getAgencyInvitations(Number.parseInt(id)) }
  catch { invitationsAvailable = false }
  const reviews = await getApprovedReviews(Number(id))

  if (!agency) {
    return <div>Agenzia non trovata</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-4xl space-y-8">
            <div>
              <SessionLogout />
              <h1 className="text-3xl font-bold">Dashboard - {agency.nome}</h1>
              <p className="text-muted-foreground">
                Gestisci gli inviti alle recensioni per i tuoi clienti
              </p>
            </div>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">
                Rispondi alle recensioni pubblicate
              </h2>
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="space-y-3 rounded border bg-card p-5"
                >
                  <p>
                    {review.reviewer_name}: {review.comment}
                  </p>
                  <CompanyReviewResponse id={review.id} />
                  <Link
                    className="underline"
                    href={`/segnala-un-problema?tipo=contestazione&url=${encodeURIComponent(`https://www.pulizialtop.it/agenzia/${agency.agency_id}#recensione-${review.id}`)}`}
                  >
                    Contesta recensione
                  </Link>
                </article>
              ))}
            </section>
            <InvitationForm agencyId={agency.agency_id} />
            {invitationsAvailable ? <InvitationsList invitations={invitations} /> :
              <p role="alert">Elenco inviti non disponibile. Non significa che non esistano inviti: verifica i permessi del database.</p>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
