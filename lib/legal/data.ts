import { cache } from "react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { defaultLegalSettings, legalSettingsSchema, canEnableOptionalAnalytics } from "./schema"
// Never cache across users or silently treat missing setup as completed compliance.
export const getLegalSettings = cache(async () => {
  try {
    const db = await getSupabaseServerClient()
    const { data, error } = await db.rpc("get_public_legal_settings")
    const parsed = legalSettingsSchema.safeParse(data)
    if (!error && parsed.success)
      return { settings: { ...parsed.data, analyticsEnabled: parsed.data.analyticsEnabled && canEnableOptionalAnalytics(parsed.data) }, configured: true }
  } catch {
    /* The public pages remain readable if database setup is pending. */
  }
  return { settings: defaultLegalSettings, configured: false }
})
export async function getAgencyProvenance(id: number) {
  try {
    const db = await getSupabaseServerClient()
    const { data, error } = await db
      .from("public_agency_provenance")
      .select("source")
      .eq("agency_id", id)
      .maybeSingle()
    return !error ? data?.source || "unknown" : "unknown"
  } catch {
    return "unknown"
  }
}
