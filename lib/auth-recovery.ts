import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
export async function recoveryCallback(request: NextRequest, audience: "admin" | "agenzia") {
  const destination = new URL(`/${audience}/password-dimenticata?invalid=1`, request.url)
  const code = request.nextUrl.searchParams.get("code")
  try {
    if (code && !request.nextUrl.searchParams.has("error")) {
      const supabase = await getSupabaseServerClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) { destination.pathname = `/${audience}/nuova-password`; destination.search = "" }
    }
  } catch { /* invalid, expired, reused, different-browser or unavailable */ }
  const response = NextResponse.redirect(destination)
  response.headers.set("Cache-Control", "no-store")
  response.headers.set("Referrer-Policy", "no-referrer")
  return response
}
