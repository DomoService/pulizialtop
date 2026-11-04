import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code")
  const destination = new URL("/admin/password-dimenticata?invalid=1", request.url)
  if (code) {
    const supabase = await getSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) destination.pathname = "/admin/nuova-password"
  }
  destination.search = destination.pathname === "/admin/nuova-password" ? "" : "?invalid=1"
  const response = NextResponse.redirect(destination)
  response.headers.set("Cache-Control", "no-store")
  response.headers.set("Referrer-Policy", "no-referrer")
  return response
}
