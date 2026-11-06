import { beforeEach, expect, mock, test } from "bun:test"

const exchange = mock(async () => ({ error: null }))
mock.module("@/lib/supabase/server", () => ({
  getSupabaseServerClient: async () => ({ auth: { exchangeCodeForSession: exchange } }),
}))
const { GET } = await import("../app/auth/recovery/route")
const { NextRequest } = await import("next/server")
beforeEach(() => exchange.mockClear())

test("missing code rejects even with a forged redirect", async () => {
  const response = await GET(new NextRequest("https://example.test/auth/recovery?next=https://evil.test"))
  expect(response.headers.get("location")).toBe("https://example.test/admin/password-dimenticata?invalid=1")
  expect(exchange).not.toHaveBeenCalled()
})
test("valid PKCE code goes only to the password page and removes code", async () => {
  exchange.mockResolvedValueOnce({ error: null })
  const response = await GET(new NextRequest("https://example.test/auth/recovery?code=test-code&next=https://evil.test"))
  expect(exchange).toHaveBeenCalledWith("test-code")
  expect(response.headers.get("location")).toBe("https://example.test/admin/nuova-password")
  expect(response.headers.get("cache-control")).toBe("no-store")
  expect(response.headers.get("referrer-policy")).toBe("no-referrer")
})
test("expired or reused code rejects", async () => {
  exchange.mockResolvedValueOnce({ error: new Error("expired") })
  const response = await GET(new NextRequest("https://example.test/auth/recovery?code=expired"))
  expect(response.headers.get("location")).toBe("https://example.test/admin/password-dimenticata?invalid=1")
})

test("agency callback uses agency routes and never accepts external redirects", async () => {
 const {GET:agencyGET}=await import('../app/auth/agenzia/recovery/route')
 exchange.mockResolvedValueOnce({error:null})
 const r=await agencyGET(new NextRequest('https://example.test/auth/agenzia/recovery?code=valid&next=https://evil.test'))
 expect(r.headers.get('location')).toBe('https://example.test/agenzia/nuova-password')
})
test("provider errors and exchange exceptions are safe and strip tokens",async()=>{
 const {GET:agencyGET}=await import('../app/auth/agenzia/recovery/route')
 exchange.mockClear()
 const rejected=await agencyGET(new NextRequest('https://example.test/auth/agenzia/recovery?error=access_denied&code=private'))
 expect(rejected.headers.get('location')).toBe('https://example.test/agenzia/password-dimenticata?invalid=1')
 expect(exchange).not.toHaveBeenCalled()
 exchange.mockRejectedValueOnce(new Error('network details'))
 const unavailable=await GET(new NextRequest('https://example.test/auth/recovery?code=private'))
 expect(unavailable.headers.get('location')).toBe('https://example.test/admin/password-dimenticata?invalid=1')
})
