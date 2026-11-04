import { AdminHeader } from "@/components/admin-header"
import { requireAdmin } from "@/lib/access"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export default async function CredentialsPage() {
  await requireAdmin(await getSupabaseServerClient())
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-4 text-3xl font-bold">Accesso sicuro delle agenzie</h1>
        <p>La generazione di password temporanee è disabilitata.</p>
        <p>Ogni agenzia deve usare un account Supabase Auth confermato associato alla propria email. Gli account esistenti non vengono migrati automaticamente.</p>
      </main>
    </div>
  )
}
