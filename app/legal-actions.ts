"use server"
import { z } from "zod"
import { requireAdmin } from "@/lib/access"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import {
  legalSettingsSchema,
  canEnableOptionalAnalytics,
  LEGAL_VERSION,
  registrationSchema,
  requestSchema,
} from "@/lib/legal/schema"
import { revalidatePath } from "next/cache"
const unavailable = {
  success: false,
  error:
    "Invio non disponibile. Scrivi a info@pulizialtop.it indicando il tipo di richiesta; non inviare password o documenti non necessari.",
}
export async function submitLegalRequest(input: unknown) {
  const parsed = requestSchema.safeParse(input)
  if (!parsed.success)
    return {
      success: false,
      error: "Controlla campi, URL, informativa e dichiarazione di buona fede.",
    }
  try {
    const db = await getSupabaseServerClient()
    const { data, error } = await db.rpc("submit_legal_request", {
      p_data: { ...parsed.data, version: LEGAL_VERSION },
    })
    if (error || !data) return unavailable
    return { success: true, id: String(data) }
  } catch {
    return unavailable
  }
}
export async function submitRegistration(input: unknown) {
  const parsed = registrationSchema.safeParse(input)
  if (!parsed.success)
    return {
      success: false,
      error:
        "Controlla i campi, la partita IVA e le due dichiarazioni obbligatorie.",
    }
  try {
    const db = await getSupabaseServerClient()
    const { data, error } = await db.rpc("submit_legal_request", {
      p_data: {
        kind: "registrazione",
        name: parsed.data.contact_name,
        email: parsed.data.email,
        url: "",
        message: JSON.stringify(parsed.data),
        acknowledged: true,
        goodFaith: true,
        version: LEGAL_VERSION,
        website: "",
      },
    })
    if (error || !data) return unavailable
    return { success: true, id: String(data) }
  } catch {
    return unavailable
  }
}
export async function saveLegalSettings(input: unknown) {
  const db = await getSupabaseServerClient()
  await requireAdmin(db)
  const parsed = legalSettingsSchema.safeParse(input)
  if (!parsed.success)
    return { success: false, error: "Configurazione non valida" }
  if (parsed.data.analyticsEnabled && !canEnableOptionalAnalytics(parsed.data)) return { success: false, error: "Prima di abilitare statistiche: conferma fornitori, trasferimenti, conservazione log e revisione delle informazioni." }
  const { error } = await db.from("legal_settings").upsert({
    id: 1,
    settings: parsed.data,
    version: LEGAL_VERSION,
    updated_at: new Date().toISOString(),
  })
  if (error)
    return {
      success: false,
      error: "Salvataggio non riuscito: verifica la migrazione e i permessi.",
    }
  revalidatePath("/", "layout")
  return { success: true }
}
export async function getComplianceRequests(page = 0) {
  const db = await getSupabaseServerClient()
  await requireAdmin(db)
  if (!Number.isInteger(page) || page < 0 || page > 100000)
    throw new Error("Pagina non valida")
  const { data, error } = await db
    .from("legal_requests")
    .select(
      "id,kind,name,email,url,message,status,decision,created_at,communicated_at"
    )
    .order("created_at", { ascending: false })
    .range(page * 25, page * 25 + 24)
  return { requests: data || [], available: !error }
}
export async function resolveLegalRequest(input: unknown) {
  const db = await getSupabaseServerClient()
  await requireAdmin(db)
  const schema = z.object({
    id: z.string().uuid(),
    status: z.enum(["open", "in_review", "resolved"]),
    decision: z.string().trim().min(10).max(5000),
    communicated: z.boolean(),
  })
  const parsed = schema.safeParse(input)
  if (!parsed.success)
    return {
      success: false,
      error: "Motivazione richiesta (minimo 10 caratteri)",
    }
  const { error } = await db.rpc("decide_legal_request", {
    p_id: parsed.data.id,
    p_status: parsed.data.status,
    p_decision: parsed.data.decision,
    p_communicated: parsed.data.communicated,
  })
  return error
    ? { success: false, error: "Operazione non riuscita" }
    : { success: true }
}
export async function saveAgencyProvenance(input: unknown) {
  const db = await getSupabaseServerClient()
  await requireAdmin(db)
  const parsed = z
    .object({
      agency_id: z.number().int().positive(),
      source: z.enum(["unknown", "platform", "registered", "claimed"]),
    })
    .safeParse(input)
  if (!parsed.success) return { success: false, error: "Dati non validi" }
  const { error } = await db.from("agency_provenance").upsert(parsed.data)
  return error
    ? { success: false, error: "Operazione non riuscita" }
    : { success: true }
}

export async function getProvenanceReview(page = 0) {
  const db=await getSupabaseServerClient()
  await requireAdmin(db)
  if(!Number.isInteger(page)||page<0||page>100000) throw new Error("Pagina non valida")
  const {data:agencies,error}=await db.from("agencies").select("agency_id,nome,website").order("agency_id").range(page*50,page*50+49)
  if(error) return {available:false,rows:[],hasMore:false}
  const ids=(agencies||[]).map(a=>a.agency_id)
  if(!ids.length) return {available:true,rows:[],hasMore:false}
  const {data:provenance,error:provenanceError}=await db.from("agency_provenance").select("agency_id,source").in("agency_id",ids)
  if(provenanceError) return {available:false,rows:[],hasMore:false}
  const map=new Map((provenance||[]).map(p=>[p.agency_id,p.source]))
  return {available:true,hasMore:ids.length===50,rows:(agencies||[]).map(a=>({...a,status:map.get(a.agency_id)||"unknown"}))}
}
