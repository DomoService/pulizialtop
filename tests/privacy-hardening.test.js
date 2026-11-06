import { beforeEach, expect, mock, test } from "bun:test"
import { publicImageUrl } from "../lib/public-image"
const rpc = mock(async () => ({ data: { nome: "Test", province: "Test" }, error: null }))
const from = mock(() => { throw new Error("Private token table must not be read") })
mock.module("@/lib/supabase/server", () => ({ getSupabaseServerClient: async () => ({ rpc, from }) }))
const actions = await import("../app/actions")
beforeEach(() => { rpc.mockClear(); from.mockClear() })
const token = "11111111-1111-4111-8111-111111111111"
test("legacy link lookup is minimal RPC, invalid token does not access DB", async () => {
  expect(await actions.getAgencyByToken("invalid")).toBeNull()
  expect(rpc).not.toHaveBeenCalled()
  expect(await actions.getAgencyByToken(token)).toEqual({ nome: "Test", province: "Test" })
  expect(rpc).toHaveBeenCalledWith("get_public_agency_review_link", { p_token: token })
  expect(from).not.toHaveBeenCalled()
})
test("legacy submission validates all fields and declarations, never inserts directly", async () => {
  const f = new FormData()
  f.set("review_token", token)
  expect((await actions.submitReviewWithToken(f)).success).toBe(false)
  expect(rpc).not.toHaveBeenCalled()
  for (const [k, v] of Object.entries({ reviewer_name: "Alias", reviewer_email: "test@example.test", rating: "5", comment: "Esperienza", terms: "on", experience: "on", status: "approved" })) f.set(k,v)
  expect((await actions.submitReviewWithToken(f)).success).toBe(true)
  expect(rpc.mock.calls[0][0]).toBe("submit_agency_link_review")
  expect(rpc.mock.calls[0][1]).not.toHaveProperty("status")
  expect(from).not.toHaveBeenCalled()
})
test("unreviewed image origins cannot load in the visitor browser", () => {
  const base = "https://project.supabase.co"
  expect(publicImageUrl("/local.jpg", base)).toBe("/local.jpg")
  expect(publicImageUrl(`${base}/storage/v1/object/public/agency-logos/a.png`, base)).toContain("agency-logos")
  for (const url of ["//tracker.test/pixel", "/\\tracker.test/pixel", "https://tracker.test/pixel", "javascript:alert(1)", `${base}/auth/v1/verify?token=x`]) expect(publicImageUrl(url, base)).toBeNull()
})

test("logo upload rejects active content, MIME mismatch and oversize", async () => {
  const {validatedLogoExtension}=await import('../lib/logo-validation')
  expect(await validatedLogoExtension(new File([new Uint8Array([137,80,78,71,13,10,26,10])],'x.png',{type:'image/png'}))).toBe('png')
  expect(await validatedLogoExtension(new File(['<svg onload="alert(1)">'],'x.svg',{type:'image/svg+xml'}))).toBeNull()
  expect(await validatedLogoExtension(new File(['<html>'],'x.png',{type:'image/png'}))).toBeNull()
  expect(await validatedLogoExtension(new File([new Uint8Array(5242881)],'x.png',{type:'image/png'}))).toBeNull()
})
