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
