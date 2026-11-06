import { beforeEach, expect, mock, test } from "bun:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

const rpc = mock(async () => ({ error: null }))
const from = mock(() => {
  throw new Error("Direct table access is forbidden")
})
mock.module("@/lib/supabase/server", () => ({
  getSupabaseServerClient: async () => ({ rpc, from }),
}))
const { submitReview } = await import("../app/actions")
const { ReviewForm } = await import("../components/review-form")
function form(changes = {}) {
  const f = new FormData()
  for (const [key, value] of Object.entries({
    agency_id: "42",
    experience: "on",
    terms: "on",
    reviewer_name: "Test",
    reviewer_email: "test@example.test",
    rating: "5",
    comment: "Esperienza di prova",
    ...changes,
  }))
    f.set(key, value)
  return f
}
beforeEach(() => {
  rpc.mockClear()
  from.mockClear()
  rpc.mockResolvedValue({ error: null })
})

test("form renders rating controls and submit action", () => {
  const html = renderToStaticMarkup(
    createElement(ReviewForm, { agencyId: 42, agencyName: "Impresa" })
  )
  expect(html).toContain('name="agency_id" value="42"')
  expect(html).toContain("Invia recensione")
  expect(html).toContain('aria-label="5 stelle"')
})
test("invalid inputs never reach the database", async () => {
  for (const invalid of [
    { agency_id: "42x" },
    { agency_id: "0" },
    { rating: "0" },
    { rating: "6" },
    { rating: "2.5" },
    { reviewer_name: " " },
    { reviewer_email: "bad" },
    { comment: " " },
    { comment: "x".repeat(5001) },
  ]) {
    expect((await submitReview(form(invalid))).success).toBe(false)
  }
  expect(rpc).not.toHaveBeenCalled()
})
test("valid input uses only the pending-review RPC and ignores forged status", async () => {
  expect(
    await submitReview(form({ status: "approved", reviewer_name: " Test " }))
  ).toEqual({ success: true })
  expect(rpc).toHaveBeenCalledWith("submit_public_review", {
    p_agency_id: 42,
    p_reviewer_name: "Test",
    p_reviewer_email: "test@example.test",
    p_rating: 5,
    p_comment: "Esperienza di prova",
  })
  expect(from).not.toHaveBeenCalled()
})
test("database errors and missing migration are not reported as success or leaked", async () => {
  rpc.mockResolvedValueOnce({
    error: { code: "PGRST202", message: "private detail" },
  })
  const result = await submitReview(form())
  expect(result.success).toBe(false)
  expect(result.error).not.toContain("private detail")
  rpc.mockResolvedValueOnce({ error: { code: "P0001" } })
  expect((await submitReview(form())).error).toContain("10 minuti")
  rpc.mockRejectedValueOnce(new Error("network"))
  expect((await submitReview(form())).success).toBe(false)
})
