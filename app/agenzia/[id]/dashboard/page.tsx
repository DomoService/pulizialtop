import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getAgencyById, getAgencyInvitations } from "@/app/actions"
import { InvitationForm, InvitationsList } from "@/components/invitation-form"

export default async function AgencyDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const agency = await getAgencyById(Number.parseInt(id))
  const invitations = await getAgencyInvitations(Number.parseInt(id))

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
              <h1 className="text-3xl font-bold">Dashboard - {agency.nome}</h1>
              <p className="text-muted-foreground">Gestisci gli inviti alle recensioni per i tuoi clienti</p>
            </div>

            <InvitationForm agencyId={agency.agency_id} />
            <InvitationsList invitations={invitations} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
