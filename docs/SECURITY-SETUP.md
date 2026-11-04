# Required before release

These changes are in the preview only. Do not promote before database setup and
an authorized end-to-end test. The preview currently shares the configured database;
do not create test records there without approval.

## Administrators

Only confirmed Supabase Auth users whose **app_metadata.role** is `admin` are
administrators. `user_metadata`, email entered in a form and localStorage are not
authorization. Assign the role to the owner's existing verified Auth identity using
the Supabase SQL Editor or trusted Auth Admin API. Never expose a service-role key.
Sign out and sign in again after role assignment to refresh the JWT used by RLS.
Public administrator registration is disabled. Existing ordinary users are not promoted.

## Agencies

Legacy temporary-password login and plaintext-password generation are disabled.
An agency needs a confirmed Supabase Auth account whose verified email matches the
agency email. More than one agency with that email requires explicit resolution.
Changing a password updates the signed-in Auth account, not a public table column.
No existing users, passwords or records are migrated automatically.

The server verifies ownership for dashboard, invitation listing/creation and company
responses. Audit DB RLS as well: clients may call the Supabase API without going through
Next.js. Do not grant blanket privileges to `authenticated` without restrictive RLS.

## Reviews

Run `scripts/003_public_reviews.sql` manually after reviewing the real schema.
The view intentionally executes with its trusted owner's privileges and exposes only
approved reviews and explicitly listed public columns, never reviewer_email. Keep
ownership with a trusted database administrator. Both anonymous and authenticated
visitors may select this view; they receive no write permission through it.
This avoids granting public access to private fields of the base table.

This is not a complete RLS migration: audit all existing grants/policies on agencies,
reviews, review_invitations and agency_services before release. Moderation and owner
writes may still be denied until their least-privilege DB policies are configured.
The app keeps the cookie-authenticated client and does not bypass RLS using service_role.

## HTTP migrations

/api/migrate is permanently inert (410). Use SQL Editor or operator-controlled
migration tooling. Never re-enable database-changing HTTP GET requests.

## Release checks

Run the tests in separate processes because existing recovery tests mock shared modules:

    bun test tests/access.test.js
    bun test tests/security-actions.test.js
    bun test tests/recovery.test.js
    bun test tests/seo.test.js

Verify unauthenticated rejection, non-admin rejection, admin access, matching/mismatched
agency ownership and approved-review visibility in a test database/account. Do not
interpret a missing table/view or permission-denied empty list as a successful data test.

## Public review form repair

The agency detail page now includes the review form. Submission validates all fields
on the server and calls only `submit_public_review`, never a privileged client.
Errors remain visible and success remains in the moderation-pending state.

An operator must review and apply `scripts/004_submit_public_review.sql` in Supabase.
It creates a tightly scoped SECURITY DEFINER function owned by postgres with an empty
search_path. It validates inputs again, checks the agency, forces pending status,
serializes and rejects repeated submissions for the same agency/email within ten
minutes, and grants only EXECUTE to anon/authenticated. It does not reopen the base
tables or change existing reviews. The cooldown is not full spam protection: add a
verified CAPTCHA/rate-limiting service before accepting high-volume public traffic.
The existing review trigger still runs with this write; verify its pending-review
behavior in a test database before rollout. Do not bypass moderation or grant users
UPDATE on agencies to make the trigger work.

Database operator checks before promotion:
- Apply 004 in a test database with the real trigger and confirm a valid submission
  inserts one pending review without exposing reviewer_email or changing approved ratings.
- Confirm invalid fields/unknown agencies and rapid repeated submissions are rejected.
- Confirm anon/authenticated still cannot read private reviews or directly mutate tables.
- Ensure 003's approved-only view exists for public display; 004 does not create it.
- On the deployed preview, verify validation, five rating controls, visible errors,
  and pending confirmation. A preview can share the production DB: do not create
  synthetic reviews there. Use a separate test database for successful write tests.

Local checks: run each `bun test tests/*.test.js` file in a separate process.
The public-review tests mock the database; they do not prove the live SQL migration
has been applied. The SQL was also exercised on an isolated PGlite schema fixture. After the operator
supplied the rating trigger definition, the empty-search_path failure was reproduced
and fixed by schema-qualifying its relations. With that trigger on the fixture,
anonymous/authenticated pending submissions preserved the approved-only mean/count,
and operator approval updated them. Migration reruns preserved existing rows.
Actual successful writes on the deployed database remain operator verification steps. Do not report the live issue fixed before these pass.
