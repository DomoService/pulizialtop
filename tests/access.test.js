import { expect, test, mock } from "bun:test"
import { isAdmin, requireAdmin, requireAgencyAccess, AgencyAccessDenied } from "../lib/access"

const owner = { id: "owner", email: "owner@example.test", email_confirmed_at: "2026-01-01", app_metadata: {} }
const admin = { ...owner, app_metadata: { role: "admin" } }
function client(user, email = "owner@example.test", error = null) {
  const single = mock(async () => ({ data: { email }, error: null }))
  const from = mock(() => ({ select: () => ({ eq: () => ({ single }) }) }))
  return { auth: { getUser: async () => ({ data: { user }, error }) }, from, rpc: mock(async () => ({data: user?.email?.toLowerCase() === email.toLowerCase(), error: null})) }
}

test("admin requires confirmed identity and server-controlled app metadata", () => {
  expect(isAdmin(null)).toBe(false)
  expect(isAdmin({ ...owner, user_metadata: { role: "admin" } })).toBe(false)
  expect(isAdmin({ ...admin, email_confirmed_at: null })).toBe(false)
  expect(isAdmin(admin)).toBe(true)
})
test("anonymous and ordinary users cannot perform admin operations", async () => {
  for (const user of [null, owner]) await expect(requireAdmin(client(user))).rejects.toThrow()
  await expect(requireAdmin(client(admin))).resolves.toBe(admin)
  await expect(requireAdmin(client(admin, undefined, new Error("invalid session")))).rejects.toThrow()
})
test("agency access validates identity, ownership, and IDs", async () => {
  for (const user of [null, { ...owner, email_confirmed_at: null }]) {
    const db = client(user)
    await expect(requireAgencyAccess(db, 1)).rejects.toThrow()
    expect(db.from).not.toHaveBeenCalled()
  }
  await expect(requireAgencyAccess(client(owner, "other@example.test"), 1)).rejects.toThrow()
  await expect(requireAgencyAccess(client(owner), NaN)).rejects.toThrow()
  await expect(requireAgencyAccess(client(owner), 1)).resolves.toBe(owner)
  await expect(requireAgencyAccess(client(admin, "other@example.test"), 1)).resolves.toBe(admin)
})

test("expected agency rejection has a distinct error type for page navigation", async () => {
  await expect(requireAgencyAccess(client(null), 1)).rejects.toBeInstanceOf(AgencyAccessDenied)
  await expect(requireAgencyAccess(client(owner, "other@example.test"), 1)).rejects.toBeInstanceOf(AgencyAccessDenied)
})

test("authorization is re-evaluated when the session changes", async () => {
  let current = owner
  const db = client(owner)
  db.auth.getUser = async () => ({ data: { user: current }, error: null })
  db.rpc = mock(async () => ({ data: current?.email === "owner@example.test", error: null }))
  await expect(requireAgencyAccess(db, 3)).resolves.toBe(owner)
  current = { ...owner, email: "ordinary@example.test" }
  await expect(requireAgencyAccess(db, 3)).rejects.toBeInstanceOf(AgencyAccessDenied)
  current = null
  await expect(requireAgencyAccess(db, 3)).rejects.toBeInstanceOf(AgencyAccessDenied)
})


test("ambiguous ownership or missing authorization RPC fails closed", async () => {
  for (const result of [{data:false,error:null},{data:null,error:{code:"PGRST202"}}]) {
    const db=client(owner);db.rpc=mock(async()=>result)
    await expect(requireAgencyAccess(db,1)).rejects.toBeInstanceOf(AgencyAccessDenied)
  }
})
