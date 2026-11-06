import { beforeEach, expect, mock, test } from "bun:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import {
  legalSettingsSchema,
  missingLegalFields,
  requestSchema,
  registrationSchema,
} from "../lib/legal/schema"
import { consentRecord, readConsent, isPrivatePath } from "../lib/legal/consent"
const rpc = mock(async () => ({
  data: "00000000-0000-0000-0000-000000000003",
  error: null,
}))
const from = mock(() => {
  throw new Error("Unexpected direct table access")
})
mock.module("@/lib/supabase/server", () => ({
  getSupabaseServerClient: async () => ({
    auth: { getUser: async () => ({ data: { user: null }, error: null }) },
    rpc,
    from,
  }),
}))
const actions = await import("../app/legal-actions")
beforeEach(() => {
  rpc.mockClear()
  from.mockClear()
})
const request = {
  kind: "privacy",
  name: "Test",
  email: "test@example.test",
  url: "",
  message: "Please access my personal data",
  acknowledged: true,
  goodFaith: false,
  website: "",
}
test("missing identity/retention stay explicit; optional analytics disabled by default", () => {
  const settings = legalSettingsSchema.parse({})
  expect(settings.analyticsEnabled).toBe(false)
  expect(settings.controller).toBe("Barbara Massa — ditta individuale")
  expect(missingLegalFields(settings)).toContain(
    "Criteri / tempi conservazione recensioni"
  )
  expect(
    legalSettingsSchema.safeParse({ privacyContact: "not-email" }).success
  ).toBe(false)
})
test("unknown/expired consent fails closed, rejection persists, sensitive paths excluded", () => {
  expect(readConsent(null)).toBe(null)
  expect(readConsent("garbage")).toBe(null)
  expect(
    readConsent(JSON.stringify({ version: 1, analytics: true, expires: 1 }))
  ).toBe(null)
  expect(readConsent(consentRecord(false))).toBe(false)
  expect(readConsent(consentRecord(true))).toBe(true)
  for (const path of [
    "/admin/conformita",
    "/auth/recovery",
    "/recensione/token",
    "/invito/token",
    "/segnala-un-problema",
    "/agenzia/42/dashboard",
    "/contattaci",
  ])
    expect(isPrivatePath(path)).toBe(true)
  expect(isPrivatePath("/agenzia/42")).toBe(false)
})
test("reports validate exact location, good faith and exception-specific anonymity", () => {
  expect(requestSchema.safeParse(request).success).toBe(true)
  for (const v of [
    { ...request, website: "spam" },
    { ...request, message: "" },
    { ...request, kind: "recensione", url: "" },
    { ...request, kind: "recensione", url: "javascript:alert(1)" },
    {
      ...request,
      kind: "recensione",
      url: "https://example.test/review",
      goodFaith: false,
    },
    { ...request, name: "", email: "", anonymousException: true },
  ])
    expect(requestSchema.safeParse(v).success).toBe(false)
  expect(
    requestSchema.safeParse({
      ...request,
      kind: "contenuto-illecito",
      name: "",
      email: "",
      url: "https://example.test/review",
      anonymousException: true,
      goodFaith: true,
    }).success
  ).toBe(true)
})
test("public requests use restricted RPC only; invalid inputs never write", async () => {
  expect(
    (await actions.submitLegalRequest({ ...request, acknowledged: false }))
      .success
  ).toBe(false)
  expect(rpc).not.toHaveBeenCalled()
  expect((await actions.submitLegalRequest(request)).success).toBe(true)
  expect(rpc).toHaveBeenCalledTimes(1)
  expect(from).not.toHaveBeenCalled()
})
test("all admin legal actions reject anonymous direct invocation before DB writes", async () => {
  for (const [name, args] of [
    ["saveLegalSettings", [{}]],
    ["resolveLegalRequest", [{}]],
    ["saveAgencyProvenance", [{}]],
    ["getComplianceRequests", [0]],
  ])
    await expect(actions[name](...args)).rejects.toThrow()
  expect(from).not.toHaveBeenCalled()
  expect(rpc).not.toHaveBeenCalled()
})
test("registration requires both declarations, legal address and formal VAT checksum", () => {
  const valid = {
    agency_name: "Fictional test",
    contact_name: "Test",
    email: "test@example.test",
    phone: "+39 070 123456",
    vat: "12345678903",
    legal_address: "Fictional street 1",
    business_website: "",
    province: "Cagliari",
    services: "",
    message: "",
    terms: true,
    privacy: true,
    website: "",
  }
  expect(registrationSchema.safeParse(valid).success).toBe(true)
  for (const v of [
    { ...valid, terms: false },
    { ...valid, privacy: false },
    { ...valid, vat: "12345678901" },
    { ...valid, legal_address: "" },
  ])
    expect(registrationSchema.safeParse(v).success).toBe(false)
})
test("public review list omits private email, offers reporting and labels moderation accurately", async () => {
  const { ReviewList } = await import("../components/review-list")
  const html = renderToStaticMarkup(
    createElement(ReviewList, {
      reviews: [
        {
          id: 1,
          agency_id: 42,
          reviewer_name: "Test",
          reviewer_email: "private@example.test",
          rating: 4,
          comment: "Comment",
          status: "approved",
          created_at: "2026-01-01",
          company_response: "Response",
        },
      ],
    })
  )
  expect(html).not.toContain("private@example.test")
  expect(html).not.toContain("Recensioni verificate")
  expect(html).toContain("Risposta dell’impresa")
  expect(html).toContain("Segnala o contesta")
  expect(html).toContain('id="recensione-1"')
})

test("absence of an appointed DPO is not an incomplete mandatory contact", () => {
 const settings=legalSettingsSchema.parse({})
 expect(settings.dpo).toBe("")
 expect(missingLegalFields(settings).some(label=>label.startsWith("DPO"))).toBe(false)
})

test("consent records date, preserves legacy refusal and excludes login/recovery", () => {
  const now = new Date("2026-11-06T12:00:00Z")
  const v = JSON.parse(consentRecord(false, now))
  expect(v.savedAt).toBe(now.getTime())
  expect(readConsent(JSON.stringify({ version: 1, analytics: false, expires: v.expires }), now.getTime())).toBe(false)
  expect(readConsent(consentRecord(false, now), new Date("2027-05-05").getTime())).toBe(false)
  expect(readConsent(consentRecord(false, now), new Date("2027-05-07").getTime())).toBe(null)
  for (const path of ["/agenzia/login", "/agenzia/password-dimenticata", "/agenzia/nuova-password"]) expect(isPrivatePath(path)).toBe(true)
})

test("loaded analytics SDK cannot send after revocation or on a private navigation", async () => {
  const { redactAnalyticsEvent } = await import("../lib/legal/consent")
  const event = { type: "pageview", url: "https://example.test/agenzia/42?email=private@example.test#token" }
  expect(redactAnalyticsEvent(event, null, "/")).toBeNull()
  expect(redactAnalyticsEvent(event, consentRecord(false), "/")).toBeNull()
  expect(redactAnalyticsEvent(event, consentRecord(true), "/auth/recovery")).toBeNull()
  expect(redactAnalyticsEvent({ ...event, type: "event", data: { email: "private" } }, consentRecord(true), "/")).toBeNull()
  expect(redactAnalyticsEvent(event, consentRecord(true), "/").url).toBe("https://example.test/agenzia/42")
})
