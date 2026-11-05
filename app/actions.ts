"use server"

import { z } from "zod"
import { publicReviewSchema } from "@/lib/public-review"
import { requireAdmin, requireAgencyAccess, isAdmin } from "@/lib/access"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export interface Agency {
  agency_id: number
  nome: string
  tipo: "pulizie" | "manutenzione"
  province_id: number
  province?: string
  indirizzo: string | null
  cap: string | null
  telefono: string | null
  email: string | null
  website: string | null
  partita_iva: string | null
  average_rating?: number | null
  google_rating: number | null
  google_reviews: number
  descrizione: string | null
  servizi?: string[]
  image_url: string | null
  logo_url: string | null // Aggiunto campo logo_url all'interfaccia
}

export interface Review {
  id: number // Changed from review_id to id to match database schema
  agency_id: number
  reviewer_name: string
  reviewer_email: string
  rating: number
  comment: string
  status: "pending" | "approved" | "rejected"
  created_at: string
  reviewed_at: string | null
  company_response?: string
  company_response_date?: string
}

export async function getAgencies(filters?: {
  type?: string
  province?: string
}) {
  console.log("[v0] Fetching agencies with filters:", filters)
  const supabase = await getSupabaseServerClient()

  let query = supabase
    .from("agencies")
    .select(
      "agency_id,nome,tipo,province_id,indirizzo,cap,telefono,email,website,partita_iva,google_rating,google_reviews,descrizione,image_url,logo_url"
    )
    .order("google_rating", { ascending: false, nullsFirst: false })

  if (filters?.type && filters.type !== "tutti") {
    query = query.eq("tipo", filters.type)
  }

  if (filters?.province && filters.province !== "tutte") {
    const { data: provinceData } = await supabase
      .from("provinces")
      .select("province_id")
      .eq("nome", filters.province)
      .single()

    if (provinceData) {
      query = query.eq("province_id", provinceData.province_id)
    }
  }

  const { data: agenciesData, error } = await query

  if (error) {
    console.error("[v0] Error fetching agencies:", error.message)
    return []
  }

  if (!agenciesData || agenciesData.length === 0) {
    console.log("[v0] No agencies found")
    return []
  }

  const provinceIds = [...new Set(agenciesData.map((a: any) => a.province_id))]
  const { data: provincesData } = await supabase
    .from("provinces")
    .select("province_id, nome")
    .in("province_id", provinceIds)

  const provincesMap = new Map(
    provincesData?.map((p: any) => [p.province_id, p.nome]) || []
  )

  const agencyIds = agenciesData.map((a: any) => a.agency_id)
  const { data: agencyServicesData } = await supabase
    .from("agency_services")
    .select("agency_id, service_id")
    .in("agency_id", agencyIds)

  const serviceIds = [
    ...new Set(agencyServicesData?.map((as: any) => as.service_id) || []),
  ]
  const { data: servicesData } = await supabase
    .from("services")
    .select("service_id, nome")
    .in("service_id", serviceIds)

  const servicesMap = new Map(
    servicesData?.map((s: any) => [s.service_id, s.nome]) || []
  )

  const agencyServicesMap = new Map()
  agencyServicesData?.forEach((as: any) => {
    if (!agencyServicesMap.has(as.agency_id)) {
      agencyServicesMap.set(as.agency_id, [])
    }
    const serviceName = servicesMap.get(as.service_id)
    if (serviceName) {
      agencyServicesMap.get(as.agency_id).push(serviceName)
    }
  })

  const agencies = agenciesData.map((agency: any) => ({
    ...agency,
    province: provincesMap.get(agency.province_id) || "N/A",
    servizi: agencyServicesMap.get(agency.agency_id) || [],
  }))

  console.log("[v0] Found agencies:", agencies.length)
  return agencies as Agency[]
}

export async function getAgencyReviews(agencyId: string) {
  const supabase = await getSupabaseServerClient()
  await requireAgencyAccess(supabase, Number(agencyId))

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("agency_id", agencyId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching reviews:", error)
    return []
  }

  return data as Review[]
}

export async function getApprovedReviews(agencyId: number) {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from("public_agency_reviews")
    .select(
      "id,agency_id,reviewer_name,rating,comment,status,created_at,reviewed_at,company_response,company_response_date"
    )
    .eq("agency_id", agencyId)
    .eq("status", "approved")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching reviews:", error)
    return []
  }

  return data as Review[]
}

export async function submitReview(formData: FormData) {
  const parsed = publicReviewSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return {
      success: false,
      error:
        "Controlla nome, email, valutazione (1–5) e commento (massimo 5000 caratteri).",
    }
  }

  try {
    const supabase = await getSupabaseServerClient()
    // No direct table grants or service-role key: the DB function can only insert pending reviews.
    const { error } = await supabase.rpc("submit_public_review", {
      p_agency_id: parsed.data.agency_id,
      p_reviewer_name: parsed.data.reviewer_name,
      p_reviewer_email: parsed.data.reviewer_email,
      p_rating: parsed.data.rating,
      p_comment: parsed.data.comment,
    })
    if (error) {
      console.error("Public review submission failed", { code: error.code })
      return {
        success: false,
        error:
          error.code === "P0001"
            ? "Hai già inviato una recensione per questa agenzia di recente. Attendi 10 minuti prima di riprovare."
            : "Non è stato possibile inviare la recensione. Riprova più tardi.",
      }
    }
    return { success: true }
  } catch {
    return {
      success: false,
      error: "Servizio temporaneamente non disponibile. Riprova più tardi.",
    }
  }
}

export async function getPendingReviews() {
  const supabase = await getSupabaseServerClient()
  await requireAdmin(supabase)

  const { data, error } = await supabase.rpc("get_pending_legal_reviews")
  if (error)
    throw new Error(
      "Registro moderazione non disponibile: verifica configurazione database"
    )
  return data || []
}

export async function moderateReview(
  reviewId: number,
  status: "approved" | "rejected",
  reason: string = ""
) {
  const supabase = await getSupabaseServerClient()
  await requireAdmin(supabase)
  if (
    !Number.isSafeInteger(reviewId) ||
    reviewId < 1 ||
    !["approved", "rejected"].includes(status) ||
    reason.trim().length < 10 ||
    reason.length > 5000
  )
    return {
      success: false,
      error: "Indica una motivazione valida (10–5000 caratteri).",
    }
  const { error } = await supabase.rpc("moderate_legal_review", {
    p_id: reviewId,
    p_status: status,
    p_reason: reason.trim(),
  })
  return error
    ? {
        success: false,
        error: "Moderazione non riuscita: verifica i permessi e la migrazione.",
      }
    : { success: true }
}

export async function getAgencyByToken(token: string) {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from("agencies")
    .select(
      "agency_id,nome,tipo,province_id,indirizzo,cap,telefono,email,website,partita_iva,google_rating,google_reviews,descrizione,image_url,logo_url"
    )
    .eq("review_token", token)
    .single()

  if (error || !data) {
    return null
  }

  const { data: provinceData } = await supabase
    .from("provinces")
    .select("nome")
    .eq("province_id", data.province_id)
    .single()

  return {
    ...data,
    province: provinceData?.nome || "N/A",
  } as Agency
}

export async function submitReviewWithToken(formData: FormData) {
  const supabase = await getSupabaseServerClient()

  const token = formData.get("review_token") as string
  const { data: agency } = await supabase
    .from("agencies")
    .select("agency_id")
    .eq("review_token", token)
    .single()

  if (!agency) {
    return { success: false, error: "Link non valido" }
  }

  const reviewData = {
    agency_id: agency.agency_id,
    reviewer_name: formData.get("reviewer_name") as string,
    reviewer_email: formData.get("reviewer_email") as string,
    rating: Number.parseInt(formData.get("rating") as string),
    comment: formData.get("comment") as string,
    status: "pending" as const,
  }

  const { error } = await supabase.from("reviews").insert(reviewData)

  if (error) {
    console.error("[v0] Error submitting review:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function createReviewInvitation(formData: FormData) {
  const supabase = await getSupabaseServerClient()
  await requireAgencyAccess(supabase, Number(formData.get("agency_id")))

  const parsed = z.object({
    customer_name: z.string().trim().min(1).max(255),
    customer_email: z.string().trim().email().max(255),
  }).safeParse(Object.fromEntries(formData))
  if (!parsed.success) return {success:false,error:"Controlla nome ed email del cliente."}
  const invitationData = {
    agency_id: Number(formData.get("agency_id")),
    ...parsed.data,
    invitation_token: crypto.randomUUID(),
  }

  const { error } = await supabase
    .from("review_invitations")
    .insert(invitationData)

  if (error) {
    console.error("[v0] Error creating invitation:", error)
    return { success: false, error: "Invito non creato. Verifica autorizzazione e configurazione del database." }
  }

  return { success: true, token: invitationData.invitation_token }
}

export async function getAgencyInvitations(agencyId: number) {
  const supabase = await getSupabaseServerClient()
  await requireAgencyAccess(supabase, Number(agencyId))

  const { data, error } = await supabase
    .from("review_invitations")
    .select("invitation_id,agency_id,customer_name,customer_email,invitation_token,sent_at,reviewed")
    .eq("agency_id", agencyId)
    .order("sent_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching invitations:", error)
    throw new Error("Elenco inviti non disponibile")
  }

  return data
}

export async function getInvitationByToken(token: string) {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from("review_invitations")
    .select(
      `
      *,
      agencies (*)
    `
    )
    .eq("invitation_token", token)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export async function submitReviewFromInvitation(formData: FormData) {
  const supabase = await getSupabaseServerClient()

  const token = formData.get("invitation_token") as string
  const invitation = await getInvitationByToken(token)

  if (!invitation || invitation.reviewed) {
    return { success: false, error: "Invito non valido o già utilizzato" }
  }

  const reviewData = {
    agency_id: invitation.agency_id,
    reviewer_name: invitation.customer_name,
    reviewer_email: invitation.customer_email,
    rating: Number.parseInt(formData.get("rating") as string),
    comment: formData.get("comment") as string,
    status: "pending" as const,
  }

  const { data: review, error: reviewError } = await supabase
    .from("reviews")
    .insert(reviewData)
    .select()
    .single()

  if (reviewError) {
    console.error("[v0] Error submitting review:", reviewError)
    return { success: false, error: reviewError.message }
  }

  await supabase
    .from("review_invitations")
    .update({ reviewed: true })
    .eq("invitation_id", invitation.invitation_id)

  return { success: true }
}

export async function addCompanyResponse(reviewId: number, response: string) {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user?.email_confirmed_at)
    throw new Error("Accesso non autorizzato")
  if (
    !Number.isSafeInteger(reviewId) ||
    reviewId < 1 ||
    !response.trim() ||
    response.length > 2000
  )
    return { success: false, error: "Risposta non valida" }
  const { error: writeError } = await supabase.rpc("respond_legal_review", {
    p_id: reviewId,
    p_response: response.trim(),
  })
  return writeError
    ? {
        success: false,
        error:
          "Risposta non salvata: verifica proprietà dell’agenzia e configurazione.",
      }
    : { success: true }
}

export async function getAgencyById(agencyId: number) {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from("agencies")
    .select(
      "agency_id,nome,tipo,province_id,indirizzo,cap,telefono,email,website,partita_iva,google_rating,google_reviews,descrizione,image_url,logo_url"
    )
    .eq("agency_id", agencyId)
    .single()

  if (error || !data) {
    return null
  }

  const { data: provinceData } = await supabase
    .from("provinces")
    .select("nome")
    .eq("province_id", data.province_id)
    .single()

  return {
    ...data,
    province: provinceData?.nome || "N/A",
  } as Agency
}

export async function generateAgencyCredentials(_agencyId: number) {
  const supabase = await getSupabaseServerClient()
  await requireAdmin(supabase)
  return {
    success: false,
    password: undefined,
    error:
      "Credenziali temporanee disabilitate: configura un account Supabase Auth confermato per l'email dell'agenzia.",
  }
}

export async function generateAllCredentials() {
  const supabase = await getSupabaseServerClient()
  await requireAdmin(supabase)
  return {
    success: false,
    credentials: [],
    error: "Credenziali temporanee disabilitate: usa Supabase Auth.",
  }
}

export async function loginAgency(email: string, password: string) {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error || !data.user?.email_confirmed_at || !data.user.email) {
    await supabase.auth.signOut()
    return {
      success: false,
      error:
        "Usa un account Supabase Auth confermato associato all'email dell'agenzia.",
    }
  }
  const { data: agencies, error: agencyError } = await supabase
    .from("agencies")
    .select("agency_id")
    .ilike("email", data.user.email.replace(/[\\%_]/g, "\\$&"))
  if (agencyError || agencies?.length !== 1) {
    await supabase.auth.signOut()
    return {
      success: false,
      error:
        "Account non associato a una sola agenzia. Contatta l'amministratore.",
    }
  }
  return { success: true, agency: agencies[0] }
}

export async function changeAgencyPassword(
  agencyId: number,
  newPassword: string
) {
  const supabase = await getSupabaseServerClient()
  await requireAgencyAccess(supabase, agencyId)
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  return error ? { success: false, error: error.message } : { success: true }
}

export async function registerAdmin(_formData: FormData) {
  return {
    success: false,
    error:
      "La registrazione amministratori è disabilitata. Contatta il titolare del sito.",
  }
}

export async function loginAdmin(formData: FormData) {
  const supabase = await getSupabaseServerClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, error: "Credenziali non valide" }
  }

  if (!isAdmin(data.user)) {
    await supabase.auth.signOut()
    return { success: false, error: "Accesso riservato agli amministratori" }
  }

  return { success: true, data }
}

export async function logoutAdmin() {
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function sendContactMessage(formData: FormData) {
  const { submitLegalRequest } = await import("@/app/legal-actions")
  return submitLegalRequest({
    kind: "contatto",
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    url: "",
    message: `${formData.get("subject") || ""}\n${formData.get("message") || ""}`,
    acknowledged: formData.has("privacy_consent"),
    goodFaith: false,
    website: String(formData.get("website") || ""),
  })
}
export async function submitAgencyRegistration(formData: FormData) {
  const { submitRegistration } = await import("@/app/legal-actions")
  return submitRegistration({
    ...Object.fromEntries(formData),
    terms: formData.get("terms") === "on",
    privacy: formData.get("privacy") === "on",
  })
}

export async function addNewAgency(formData: FormData) {
  const supabase = await getSupabaseServerClient()
  await requireAdmin(supabase)

  console.log("[v0] Starting addNewAgency")

  const provinceName = formData.get("provincia") as string
  const { data: provinceData, error: provinceError } = await supabase
    .from("provinces")
    .select("province_id")
    .eq("nome", provinceName)
    .single()

  if (provinceError || !provinceData) {
    console.log("[v0] Province error:", provinceError)
    return { success: false, error: "Provincia non valida" }
  }

  let logoUrl: string | null = null
  const logoFile = formData.get("logo") as File

  console.log("[v0] Logo file:", {
    name: logoFile?.name,
    size: logoFile?.size,
    type: logoFile?.type,
  })

  if (logoFile && logoFile.size > 0) {
    const fileExt = logoFile.name.split(".").pop()
    const fileName = `${crypto.randomUUID()}.${fileExt}`

    console.log("[v0] Uploading file:", fileName)

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("agency-logos")
      .upload(fileName, logoFile, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      console.error("[v0] Error uploading logo:", uploadError)
      return {
        success: false,
        error: `Errore durante il caricamento del logo: ${uploadError.message}`,
      }
    }

    console.log("[v0] Upload successful, getting public URL")
    const { data: urlData } = supabase.storage
      .from("agency-logos")
      .getPublicUrl(fileName)
    logoUrl = urlData.publicUrl
    console.log("[v0] Public URL:", logoUrl)
  }

  const reviewToken = crypto.randomUUID()

  const agencyData = {
    nome: formData.get("nome") as string,
    tipo: formData.get("tipo") as string,
    province_id: provinceData.province_id,
    indirizzo: (formData.get("indirizzo") as string) || null,
    cap: (formData.get("cap") as string) || null,
    telefono: (formData.get("telefono") as string) || null,
    email: formData.get("email") as string,
    website: (formData.get("website") as string) || null,
    partita_iva: (formData.get("partita_iva") as string) || null,
    descrizione: (formData.get("descrizione") as string) || null,
    logo_url: logoUrl,
    google_rating: 0,
    google_reviews: 0,
    review_token: reviewToken,
  }

  console.log("[v0] Inserting agency data")
  const { error } = await supabase.from("agencies").insert(agencyData)

  if (error) {
    console.error("[v0] Error adding agency:", error)
    return { success: false, error: error.message }
  }

  console.log("[v0] Agency added successfully")
  return { success: true }
}

export async function updateAgency(formData: FormData) {
  const supabase = await getSupabaseServerClient()
  await requireAdmin(supabase)

  const agencyId = Number.parseInt(formData.get("agency_id") as string)
  const provinceName = formData.get("provincia") as string

  const { data: provinceData, error: provinceError } = await supabase
    .from("provinces")
    .select("province_id")
    .eq("nome", provinceName)
    .single()

  if (provinceError || !provinceData) {
    return { success: false, error: "Provincia non valida" }
  }

  let logoUrl: string | undefined = undefined
  const logoFile = formData.get("logo") as File

  if (logoFile && logoFile.size > 0) {
    const fileExt = logoFile.name.split(".").pop()
    const fileName = `${crypto.randomUUID()}.${fileExt}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("agency-logos")
      .upload(fileName, logoFile, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      console.error("[v0] Error uploading logo:", uploadError)
      return { success: false, error: "Errore durante il caricamento del logo" }
    }

    const { data: urlData } = supabase.storage
      .from("agency-logos")
      .getPublicUrl(fileName)
    logoUrl = urlData.publicUrl
  }

  const updateData: any = {
    nome: formData.get("nome") as string,
    tipo: formData.get("tipo") as string,
    province_id: provinceData.province_id,
    telefono: (formData.get("telefono") as string) || null,
    email: formData.get("email") as string,
    website: (formData.get("website") as string) || null,
    descrizione: (formData.get("descrizione") as string) || null,
  }

  if (logoUrl) {
    updateData.logo_url = logoUrl
  }

  const { error } = await supabase
    .from("agencies")
    .update(updateData)
    .eq("agency_id", agencyId)

  if (error) {
    console.error("[v0] Error updating agency:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteAgency(agencyId: number) {
  const supabase = await getSupabaseServerClient()
  await requireAdmin(supabase)

  await supabase.from("reviews").delete().eq("agency_id", agencyId)

  await supabase.from("agency_services").delete().eq("agency_id", agencyId)

  await supabase.from("review_invitations").delete().eq("agency_id", agencyId)

  const { error } = await supabase
    .from("agencies")
    .delete()
    .eq("agency_id", agencyId)

  if (error) {
    console.error("[v0] Error deleting agency:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function getAdminAgencyLinks() {
  const supabase = await getSupabaseServerClient()
  await requireAdmin(supabase)
  const agencies = await getAgencies()
  const { data, error } = await supabase
    .from("agencies")
    .select("agency_id,review_token")
  if (error) throw new Error("Impossibile leggere i link recensione")
  const tokens = new Map(data.map((row) => [row.agency_id, row.review_token]))
  return agencies.map((agency) => ({
    ...agency,
    province: agency.province || "N/A",
    review_token: tokens.get(agency.agency_id) || null,
  }))
}
