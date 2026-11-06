const { PGlite } = await import(
  process.env.PGLITE_MODULE || "@electric-sql/pglite"
)
import fs from "node:fs"
import assert from "node:assert/strict"
const db = new PGlite()
let n = 0
await db.exec(`CREATE ROLE anon;CREATE ROLE authenticated;CREATE SCHEMA auth;
CREATE TABLE auth.users(id uuid PRIMARY KEY,email text,email_confirmed_at timestamptz,raw_app_meta_data jsonb);
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT NULLIF(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
GRANT USAGE ON SCHEMA auth TO anon,authenticated;GRANT EXECUTE ON FUNCTION auth.uid() TO anon,authenticated;
INSERT INTO auth.users VALUES('00000000-0000-0000-0000-000000000001','owner@example.test',now(),'{"role":"admin"}'),('00000000-0000-0000-0000-000000000002','agency@example.test',now(),'{}');
CREATE TABLE public.agencies(agency_id integer PRIMARY KEY,nome text,email text,google_rating numeric,google_reviews integer);
CREATE TABLE public.reviews(id integer PRIMARY KEY,agency_id integer REFERENCES agencies,reviewer_name text,reviewer_email text,rating integer,comment text,status text,created_at timestamp DEFAULT now(),reviewed_at timestamp,company_response text,company_response_date timestamp);
INSERT INTO agencies(agency_id,nome,email) VALUES(42,'Test','agency@example.test');INSERT INTO reviews(id,agency_id,reviewer_name,rating,comment,status) VALUES(1,42,'Author',5,'Test','pending');
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;`)
const sql = fs.readFileSync(
  new URL("../scripts/005_legal_compliance.sql", import.meta.url),
  "utf8"
)
await db.exec(sql)
await db.exec(sql)
async function role(r, id = "") {
  await db.exec(
    `RESET ROLE;SELECT set_config('request.jwt.claim.sub','${id}',false);SET ROLE ${r}`
  )
}
async function deny(sql) {
  try {
    await db.exec(sql)
    throw Error("Unexpected access: " + sql)
  } catch (e) {
    if (e.message.startsWith("Unexpected access:")) throw e
    n++
  }
}
const user = "00000000-0000-0000-0000-000000000002",
  admin = "00000000-0000-0000-0000-000000000001"
await role("anon")
await deny("SELECT * FROM public.legal_requests")
await deny(
  "SELECT public.decide_legal_request(gen_random_uuid(),'resolved','A decision reason',true)"
)
let r = await db.query("SELECT public.submit_legal_request($1::jsonb) AS id", [
  JSON.stringify({
    kind: "privacy",
    name: "Test",
    email: "test@example.test",
    url: "",
    message: "Please access my data",
    acknowledged: true,
  }),
])
const id = r.rows[0].id
n++
await deny(
  `SELECT public.submit_legal_request('{"kind":"privacy","name":"","email":"","message":"long enough message","acknowledged":true}')`
)
await deny(
  `SELECT public.submit_legal_request('{"kind":"privacy","name":"Test","email":"test@example.test","message":"long enough message","acknowledged":true}')`
)
await deny(
  `SELECT public.submit_legal_request('{"kind":"contenuto-illecito","name":"Test","email":"test2@example.test","message":"long enough message","acknowledged":true}')`
)
await role("authenticated", user)
assert.equal(
  (await db.query("SELECT public.legal_is_admin() AS ok")).rows[0].ok,
  false
)
n++
assert.equal(
  (await db.query("SELECT * FROM public.legal_requests")).rows.length,
  0
)
n++
await deny("INSERT INTO legal_settings VALUES(1,'{}','v',now())")
await deny(
  `SELECT public.decide_legal_request('${id}','resolved','A decision reason',true)`
)
await deny(
  "SELECT public.moderate_legal_review(1,'approved','A decision reason')"
)
await deny("SELECT public.respond_legal_review(1,'Hello')")
await role("authenticated", admin)
await db.exec(
  `INSERT INTO legal_settings(id,settings,version) VALUES(1,'{"controller":"Operator","analyticsEnabled":false,"secret":"never expose"}','v')`
)
await db.exec(
  `SELECT public.decide_legal_request('${id}','in_review','Human review needed',false)`
)
await db.exec(
  "SELECT public.moderate_legal_review(1,'approved','Complies with rules')"
)
n += 2
assert.equal(
  (await db.query("SELECT * FROM legal_request_events")).rows.length,
  1
)
n++
await role("authenticated", user)
await db.exec("SELECT public.respond_legal_review(1,'Company response')")
n++
await role("anon")
r = await db.query("SELECT public.get_public_legal_settings() AS settings")
assert.equal(r.rows[0].settings.controller, "Operator")
assert.equal(r.rows[0].settings.secret, undefined)
n += 2
await deny("SELECT * FROM reviews")
await deny("INSERT INTO agency_provenance VALUES(42,'claimed')")
await role("postgres")
assert.equal((await db.query("SELECT * FROM agencies")).rows.length, 1)
assert.equal(
  (await db.query("SELECT * FROM reviews")).rows[0].company_response,
  "Company response"
)
n += 2
console.log(
  n +
    " isolated SQL assertions passed. New intake, RLS/admin/owner checks, audit decisions, public settings whitelist, no existing data deletion."
)
await db.close()
