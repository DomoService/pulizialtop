import { isAdmin } from "@/lib/access"
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: { sameSite: "lax", secure: process.env.NODE_ENV === "production" },
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect admin routes
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    !request.nextUrl.pathname.startsWith("/admin/login") &&
    !request.nextUrl.pathname.startsWith("/admin/registrazione") &&
    request.nextUrl.pathname !== "/admin/password-dimenticata" &&
    request.nextUrl.pathname !== "/admin/nuova-password"
  ) {
    if (!isAdmin(user)) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = "/admin/login"
      redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
      const response = NextResponse.redirect(redirectUrl)
      supabaseResponse.cookies.getAll().forEach(cookie => response.cookies.set(cookie))
      return response
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/admin/:path*", "/agenzia/:path*", "/auth/:path*"],
}
