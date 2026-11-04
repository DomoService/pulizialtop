-- Manual migration: review in the Supabase SQL Editor before running.
-- Public access is limited to approved reviews and excludes email addresses.
-- A dedicated view is used because RLS restricts rows, not columns.
BEGIN;
CREATE OR REPLACE VIEW public.public_agency_reviews
WITH (security_barrier = true) AS
SELECT id, agency_id, reviewer_name, rating, comment, status, created_at,
       reviewed_at, company_response, company_response_date
FROM public.reviews
WHERE status = 'approved';

REVOKE ALL ON public.public_agency_reviews FROM PUBLIC;
GRANT SELECT ON public.public_agency_reviews TO anon, authenticated;
-- Do not grant access to the underlying reviews table to anonymous visitors.
-- Existing grants/policies on that table must be audited separately for admin
-- moderation and owner responses. This migration does not widen them.
COMMIT;
