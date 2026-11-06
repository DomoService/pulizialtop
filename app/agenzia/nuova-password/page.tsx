import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { PasswordRecoveryForm } from "@/components/password-recovery-form"

export const dynamic = "force-dynamic"

export default async function NewPasswordPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect("/agenzia/password-dimenticata?invalid=1")
  return <main className="mx-auto w-full max-w-md space-y-6 px-4 py-12">
    <h1 className="text-3xl font-bold">Scegli la nuova password</h1>
    <PasswordRecoveryForm update audience="agenzia" />
  </main>
}
