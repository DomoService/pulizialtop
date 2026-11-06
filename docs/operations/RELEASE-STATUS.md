# Release candidate — 6 November 2026

Auth completion: distinct admin/agency recovery callbacks, expired/reused/error
handling, shared password confirmation/session checks, local signout and full
logout navigation. Login forms recover from exceptions. Session middleware covers
agency and auth routes and preserves refreshed cookies when redirecting admins.

Retention: proposed configurable criteria are shown only in the authenticated
admin settings page; offline metadata-only planner emits manual-review candidates.
No DB connection, apply flag, scheduled task or deletion. See RETENTION-PROCEDURE.md.
Unapproved policies, missing dates, legal holds/open cases or unreviewed records
fail closed. These proposals are not adopted policy or statutory retention periods.

Privacy pages no longer render empty-value placeholder tokens. They state actual
code behavior and known limits rather than inventing contracts or configured
retention. This does not resolve the organizational gaps or certify an adequate
final notice. Optional analytics remains disabled unless supplier/transfer/log
criteria and review are documented as well as the explicit enable setting.

Operator-specific environment evidence, required decisions and exact preview
callback allowlist are delivered privately, not published as a public task list.
No migration or production release performed in this update. Prior database
operator results and preview tests are not autonomous production verification.
Authenticated real-email recovery, all production role paths and external provider
settings remain release checks. Do not claim ready until essential checks pass.

Run each tests/*.test.js file separately; tests/privacy-browser.mjs uses a local
fixture with intercepted analytics endpoint and simulated Next routing. It does
not prove actual provider requests/storage. tsc --noEmit is a separate required
check (the pre-existing Next build option ignores type errors).
