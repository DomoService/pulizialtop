import type { User, SupabaseClient } from "@supabase/supabase-js"

export function isAdmin(user: User | null): boolean {
  return !!user?.email_confirmed_at && user.app_metadata?.role === "admin"
}

export async function requireAdmin(client: SupabaseClient) {
  const { data: { user }, error } = await client.auth.getUser()
  if (error || !isAdmin(user)) throw new Error("Accesso riservato agli amministratori")
  return user!
}

export async function requireAgencyAccess(client: SupabaseClient, agencyId: number) {
  const { data: { user }, error } = await client.auth.getUser()
  if (error || !user?.email_confirmed_at || !Number.isSafeInteger(agencyId) || agencyId <= 0) {
    throw new Error("Accesso non autorizzato")
  }
  if (isAdmin(user)) return user
  const { data: agency, error: agencyError } = await client.from("agencies")
    .select("email").eq("agency_id", agencyId).single()
  if (agencyError || !agency?.email || !user.email || agency.email.toLowerCase() !== user.email.toLowerCase()) {
    throw new Error("Accesso non autorizzato")
  }
  return user
}
