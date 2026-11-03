"use server"

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

  let query = supabase.from("agencies").select("*").order("google_rating", { ascending: false, nullsLast: true })

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

  const provincesMap = new Map(provincesData?.map((p: any) => [p.province_id, p.nome]) || [])

  const agencyIds = agenciesData.map((a: any) => a.agency_id)
  const { data: agencyServicesData } = await supabase
    .from("agency_services")
    .select("agency_id, service_id")
    .in("agency_id", agencyIds)

  const serviceIds = [...new Set(agencyServicesData?.map((as: any) => as.service_id) || [])]
  const { data: servicesData } = await supabase.from("services").select("service_id, nome").in("service_id", serviceIds)

  const servicesMap = new Map(servicesData?.map((s: any) => [s.service_id, s.nome]) || [])

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
    .from("reviews")
    .select("*")
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
  const supabase = await getSupabaseServerClient()

  const reviewData = {
    agency_id: Number.parseInt(formData.get("agency_id") as string),
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

export async function getPendingReviews() {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      agencies (nome)
    `)
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching pending reviews:", error)
    return []
  }

  return data
}

export async function moderateReview(reviewId: number, status: "approved" | "rejected") {
  const supabase = await getSupabaseServerClient()

  console.log("[v0] Moderating review:", reviewId, "to status:", status)

  const { data: reviewData } = await supabase
    .from("reviews")
    .select("agency_id")
    .eq("id", reviewId)
    .single()

  const { error, data } = await supabase
    .from("reviews")
    .update({ status, reviewed_at: new Date().toISOString() })
    .eq("id", reviewId)
    .select()

  if (error) {
    console.error("[v0] Error moderating review:", error)
    return { success: false, error: error.message }
  }

  console.log("[v0] Review moderated successfully:", data)

  if (status === "approved" && reviewData) {
    await updateAgencyRating(reviewData.agency_id)
  }

  return { success: true }
}

async function updateAgencyRating(agencyId: number) {
  const supabase = await getSupabaseServerClient()

  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating")
    .eq("agency_id", agencyId)
    .eq("status", "approved")

  if (!reviews || reviews.length === 0) {
    return
  }

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  const roundedRating = Math.round(averageRating * 10) / 10

  await supabase
    .from("agencies")
    .update({
      google_rating: roundedRating,
      google_reviews: reviews.length
    })
    .eq("agency_id", agencyId)

  console.log("[v0] Updated agency rating:", { agencyId, rating: roundedRating, count: reviews.length })
}

export async function getAgencyByToken(token: string) {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase.from("agencies").select("*").eq("review_token", token).single()

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
  const { data: agency } = await supabase.from("agencies").select("agency_id").eq("review_token", token).single()

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

  const invitationData = {
    agency_id: Number.parseInt(formData.get("agency_id") as string),
    customer_email: formData.get("customer_email") as string,
    customer_name: formData.get("customer_name") as string,
    invitation_token: crypto.randomUUID(),
  }

  const { error } = await supabase.from("review_invitations").insert(invitationData)

  if (error) {
    console.error("[v0] Error creating invitation:", error)
    return { success: false, error: error.message }
  }

  return { success: true, token: invitationData.invitation_token }
}

export async function getAgencyInvitations(agencyId: number) {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from("review_invitations")
    .select("*")
    .eq("agency_id", agencyId)
    .order("sent_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching invitations:", error)
    return []
  }

  return data
}

export async function getInvitationByToken(token: string) {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from("review_invitations")
    .select(`
      *,
      agencies (*)
    `)
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

  const { data: review, error: reviewError } = await supabase.from("reviews").insert(reviewData).select().single()

  if (reviewError) {
    console.error("[v0] Error submitting review:", reviewError)
    return { success: false, error: reviewError.message }
  }

  await supabase.from("review_invitations").update({ reviewed: true }).eq("invitation_id", invitation.invitation_id)

  return { success: true }
}

export async function addCompanyResponse(reviewId: number, response: string) {
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase
    .from("reviews")
    .update({
      company_response: response,
      company_response_date: new Date().toISOString(),
    })
    .eq("id", reviewId)

  if (error) {
    console.error("[v0] Error adding company response:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function getAgencyById(agencyId: number) {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase.from("agencies").select("*").eq("agency_id", agencyId).single()

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

export async function generateAgencyCredentials(agencyId: number) {
  const supabase = await getSupabaseServerClient()

  const tempPassword = Math.random().toString(36).slice(-8).toUpperCase()

  const { error } = await supabase
    .from("agencies")
    .update({
      temp_password: tempPassword,
      is_claimed: false,
    })
    .eq("agency_id", agencyId)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, password: tempPassword }
}

export async function generateAllCredentials() {
  const supabase = await getSupabaseServerClient()

  const { data: agencies } = await supabase.from("agencies").select("agency_id, email").not("email", "is", null)

  if (!agencies) return { success: false }

  const credentials = []

  for (const agency of agencies) {
    const result = await generateAgencyCredentials(agency.agency_id)
    if (result.success) {
      credentials.push({
        agency_id: agency.agency_id,
        email: agency.email,
        password: result.password,
      })
    }
  }

  return { success: true, credentials }
}

export async function loginAgency(email: string, password: string) {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from("agencies")
    .select("*")
    .eq("email", email)
    .eq("temp_password", password)
    .single()

  if (error || !data) {
    return { success: false, error: "Credenziali non valide" }
  }

  await supabase
    .from("agencies")
    .update({
      last_login: new Date().toISOString(),
      is_claimed: true,
    })
    .eq("agency_id", data.agency_id)

  return { success: true, agency: data }
}

export async function changeAgencyPassword(agencyId: number, newPassword: string) {
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase.from("agencies").update({ temp_password: newPassword }).eq("agency_id", agencyId)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function registerAdmin(formData: FormData) {
  const supabase = await getSupabaseServerClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${process.env.NEXT_PUBLIC_SUPABASE_URL}/admin/recensioni`,
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data }
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
  const supabase = await getSupabaseServerClient()

  const contactData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    subject: formData.get("subject") as string,
    message: formData.get("message") as string,
    created_at: new Date().toISOString(),
  }

  // Crea tabella contact_messages se non esiste (da eseguire una volta su Supabase)
  const { error } = await supabase.from("contact_messages").insert(contactData)

  if (error) {
    console.error("[v0] Error sending contact message:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function submitAgencyRegistration(formData: FormData) {
  const supabase = await getSupabaseServerClient()

  const registrationData = {
    agency_name: formData.get("agency_name") as string,
    contact_name: formData.get("contact_name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    province: formData.get("province") as string,
    services: formData.get("services") as string,
    message: formData.get("message") as string,
    status: "pending",
    created_at: new Date().toISOString(),
  }

  // Crea tabella agency_registrations se non esiste (da eseguire una volta su Supabase)
  const { error } = await supabase.from("agency_registrations").insert(registrationData)

  if (error) {
    console.error("[v0] Error submitting registration:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function addNewAgency(formData: FormData) {
  const supabase = await getSupabaseServerClient()

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
      return { success: false, error: `Errore durante il caricamento del logo: ${uploadError.message}` }
    }

    console.log("[v0] Upload successful, getting public URL")
    const { data: urlData } = supabase.storage.from("agency-logos").getPublicUrl(fileName)
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

    const { data: urlData } = supabase.storage.from("agency-logos").getPublicUrl(fileName)
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

  const { error } = await supabase.from("agencies").update(updateData).eq("agency_id", agencyId)

  if (error) {
    console.error("[v0] Error updating agency:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteAgency(agencyId: number) {
  const supabase = await getSupabaseServerClient()

  await supabase.from("reviews").delete().eq("agency_id", agencyId)

  await supabase.from("agency_services").delete().eq("agency_id", agencyId)

  await supabase.from("review_invitations").delete().eq("agency_id", agencyId)

  const { error } = await supabase.from("agencies").delete().eq("agency_id", agencyId)

  if (error) {
    console.error("[v0] Error deleting agency:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
