import { AdminHeader } from "@/components/admin-header"
import { AddAgencyForm } from "@/components/add-agency-form"

export default async function AddAgencyPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 text-3xl font-bold text-foreground">Aggiungi Nuova Agenzia</h1>
          <AddAgencyForm />
        </div>
      </main>
    </div>
  )
}
