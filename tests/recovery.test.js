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
