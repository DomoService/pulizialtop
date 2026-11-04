import { AdminHeader } from "@/components/admin-header"
import { getAgencies } from "@/app/actions"
import { AgencyManagementList } from "@/components/agency-management-list"

export default async function GestisciAgenzePage() {
  const agencies = await getAgencies()

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Gestisci Agenzie</h1>
          <p className="text-muted-foreground">Modifica o elimina le agenzie esistenti</p>
        </div>
        <AgencyManagementList agencies={agencies} />
      </div>
    </div>
  )
}
