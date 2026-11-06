import type { User, SupabaseClient } from "@supabase/supabase-js"

export class AgencyAccessDenied extends Error {
  constructor() { super("Accesso non autorizzato"); this.name = "AgencyAccessDenied" }
}

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
    throw new AgencyAccessDenied()
  }
  if (isAdmin(user)) return user
  // The existing audited RPC checks fresh auth.users identity AND uniqueness across
  // the table. A SELECT filtered by RLS cannot reliably detect duplicate owners.
  const { data: allowed, error: accessError } = await client.rpc("can_manage_agency_invites", { p_agency: agencyId })
  if (accessError || allowed !== true) throw new AgencyAccessDenied()
  return user
}
