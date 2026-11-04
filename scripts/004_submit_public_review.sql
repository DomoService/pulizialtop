-- Manual migration for the audited agencies/reviews schema. Review before running.
-- Adds one restricted RPC; does NOT grant access to private table columns.
-- Apply 003_public_reviews.sql separately if approved-review view is missing.
BEGIN;
SET LOCAL lock_timeout = '5s';

-- Preserve the existing trigger's approved-only aggregation, qualifying every
-- relation so it also works when called from the RPC's empty search_path.
-- No stored review/agency rows are modified by CREATE OR REPLACE FUNCTION.
CREATE OR REPLACE FUNCTION public.update_agency_rating()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $trigger$
BEGIN
  UPDATE public.agencies
  SET average_rating = (
    SELECT ROUND(AVG(rating)::numeric, 1)
    FROM public.reviews
    WHERE agency_id = NEW.agency_id AND status = 'approved'
  ),
  google_reviews = (
    SELECT COUNT(*)
    FROM public.reviews
    WHERE agency_id = NEW.agency_id AND status = 'approved'
  )
  WHERE agency_id = NEW.agency_id;
  RETURN NEW;
END;
$trigger$;

CREATE OR REPLACE FUNCTION public.submit_public_review(
 p_agency_id integer, p_reviewer_name text, p_reviewer_email text,
 p_rating integer, p_comment text
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
 v_name text := btrim(p_reviewer_name);
 v_email text := lower(btrim(p_reviewer_email));
 v_comment text := btrim(p_comment);
BEGIN
 IF p_agency_id IS NULL OR p_agency_id <= 0
    OR p_rating IS NULL OR p_rating NOT BETWEEN 1 AND 5
    OR v_name IS NULL OR length(v_name) NOT BETWEEN 1 AND 255
    OR v_email IS NULL OR length(v_email) > 255
    OR v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    OR v_comment IS NULL OR length(v_comment) NOT BETWEEN 1 AND 5000 THEN
   RAISE EXCEPTION 'Invalid review' USING ERRCODE = '22023';
 END IF;
 IF NOT EXISTS (SELECT 1 FROM public.agencies WHERE agency_id = p_agency_id) THEN
   RAISE EXCEPTION 'Invalid agency' USING ERRCODE = '22023';
 END IF;
 -- Serialize repeated submissions for the same agency/email, including concurrent calls.
 PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_agency_id::text || ':' || v_email, 0));
 IF EXISTS (
   SELECT 1 FROM public.reviews
   WHERE agency_id = p_agency_id AND lower(btrim(reviewer_email)) = v_email
     AND created_at > localtimestamp - interval '10 minutes'
 ) THEN
   RAISE EXCEPTION 'Review submitted recently' USING ERRCODE = 'P0001';
 END IF;
 INSERT INTO public.reviews(agency_id, reviewer_name, reviewer_email, rating, comment, status)
 VALUES (p_agency_id, v_name, v_email, p_rating, v_comment, 'pending');
END;
$$;
-- Trusted operator owns this narrowly scoped function. Never accept SQL/table names from callers.
ALTER FUNCTION public.submit_public_review(integer,text,text,integer,text) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.submit_public_review(integer,text,text,integer,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_public_review(integer,text,text,integer,text) TO anon, authenticated;
NOTIFY pgrst, 'reload schema';
COMMIT;
-- No direct INSERT/SELECT/UPDATE/DELETE privileges on reviews or agencies are added.
-- Existing rating trigger still executes; verify its behavior in your test database.
-- The email cooldown is not a CAPTCHA or comprehensive distributed anti-spam protection.
