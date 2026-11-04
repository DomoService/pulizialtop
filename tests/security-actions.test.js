import { expect, test, mock } from "bun:test"
const from = mock(() => { throw new Error("Unexpected database access") })
const supabase = { auth: { getUser: async () => ({ data: { user: null }, error: null }) }, from }
mock.module("@/lib/supabase/server", () => ({ getSupabaseServerClient: async () => supabase }))
const actions = await import("../app/actions")

test("anonymous direct calls cannot bypass page protection", async () => {
  const form = new FormData()
  for (const [name, args] of [
    ["addNewAgency", [form]], ["updateAgency", [form]], ["deleteAgency", [1]],
    ["moderateReview", [1, "approved"]], ["getPendingReviews", []],
    ["generateAgencyCredentials", [1]], ["generateAllCredentials", []],
    ["getAdminAgencyLinks", []], ["addCompanyResponse", [1, "unused"]], ["getAgencyInvitations", [1]], ["createReviewInvitation", [form]],
    ["changeAgencyPassword", [1, "unused"]], ["getAgencyReviews", ["1"]],
  ]) await expect(actions[name](...args)).rejects.toThrow()
  expect(from).not.toHaveBeenCalled()
})
test("public registration cannot create administrators", async () => {
  expect((await actions.registerAdmin(new FormData())).success).toBe(false)
})
test("migration endpoint is inert, without SQL execution", async () => {
  const { GET } = await import("../app/api/migrate/route")
  const result = await GET()
  expect(result.status).toBe(410)
  expect(from).not.toHaveBeenCalled()
})
