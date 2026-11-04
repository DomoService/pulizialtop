-- DRAFT MIGRATION: manual operator review/test required. Not applied by the agent.
-- No existing agency, review, user or media row is deleted or rewritten.
-- Snapshot schema/grants and verify backup/restore before applying.
BEGIN;
SET LOCAL lock_timeout = '5s';

-- Fresh database identity, not user-editable user_metadata or a supplied email.
CREATE OR REPLACE FUNCTION public.legal_is_admin() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
 SELECT EXISTS(SELECT 1 FROM auth.users u WHERE u.id=auth.uid()
   AND u.email_confirmed_at IS NOT NULL AND u.raw_app_meta_data->>'role'='admin');
$$;
ALTER FUNCTION public.legal_is_admin() OWNER TO postgres;
REVOKE ALL ON FUNCTION public.legal_is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.legal_is_admin() TO authenticated;

CREATE TABLE IF NOT EXISTS public.legal_settings (
 id integer PRIMARY KEY CHECK(id=1), settings jsonb NOT NULL DEFAULT '{}'::jsonb,
 version text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(jsonb_typeof(settings)='object' AND octet_length(settings::text)<=65000)
);
CREATE TABLE IF NOT EXISTS public.legal_requests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 kind text NOT NULL CHECK(kind IN ('privacy','contenuto-illecito','recensione','contestazione','correzione-scheda','rimozione-scheda','rivendicazione','reclamo','accessibilita','contatto','registrazione')),
 name text NOT NULL, email text NOT NULL, url text NOT NULL, message text NOT NULL,
 status text NOT NULL DEFAULT 'open' CHECK(status IN ('open','in_review','resolved')),
 decision text NOT NULL DEFAULT '', version text NOT NULL, anonymous_exception boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(), communicated_at timestamptz,
 CHECK(length(name)<=255 AND length(email)<=255 AND length(url)<=2000 AND length(message)<=15000)
);
CREATE TABLE IF NOT EXISTS public.legal_request_events (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 request_id uuid NOT NULL REFERENCES public.legal_requests(id) ON DELETE RESTRICT,
 actor uuid NOT NULL, status text NOT NULL, decision text NOT NULL,
 communicated boolean NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.agency_provenance (
 agency_id integer PRIMARY KEY REFERENCES public.agencies(agency_id) ON DELETE RESTRICT,
 source text NOT NULL CHECK(source IN ('unknown','platform','registered','claimed'))
);
CREATE TABLE IF NOT EXISTS public.review_moderation_events (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 review_id integer NOT NULL REFERENCES public.reviews(id) ON DELETE RESTRICT,
 actor uuid NOT NULL, status text NOT NULL, reason text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.legal_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_request_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_provenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_moderation_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.legal_settings,public.legal_requests,public.legal_request_events,public.agency_provenance,public.review_moderation_events FROM PUBLIC,anon,authenticated;
GRANT SELECT,INSERT,UPDATE ON public.legal_settings,public.agency_provenance TO authenticated;
GRANT SELECT ON public.legal_requests,public.legal_request_events,public.review_moderation_events TO authenticated;
DROP POLICY IF EXISTS legal_settings_admin ON public.legal_settings;
CREATE POLICY legal_settings_admin ON public.legal_settings TO authenticated USING(public.legal_is_admin()) WITH CHECK(public.legal_is_admin());
DROP POLICY IF EXISTS provenance_admin ON public.agency_provenance;
CREATE POLICY provenance_admin ON public.agency_provenance TO authenticated USING(public.legal_is_admin()) WITH CHECK(public.legal_is_admin());
DROP POLICY IF EXISTS requests_admin ON public.legal_requests;
CREATE POLICY requests_admin ON public.legal_requests FOR SELECT TO authenticated USING(public.legal_is_admin());
DROP POLICY IF EXISTS request_events_admin ON public.legal_request_events;
CREATE POLICY request_events_admin ON public.legal_request_events FOR SELECT TO authenticated USING(public.legal_is_admin());
DROP POLICY IF EXISTS moderation_events_admin ON public.review_moderation_events;
CREATE POLICY moderation_events_admin ON public.review_moderation_events FOR SELECT TO authenticated USING(public.legal_is_admin());
CREATE INDEX IF NOT EXISTS legal_requests_email_time ON public.legal_requests(lower(email),created_at DESC);

CREATE OR REPLACE FUNCTION public.get_public_legal_settings() RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
 SELECT (SELECT COALESCE(jsonb_object_agg(k,v),'{}'::jsonb) FROM public.legal_settings s,
 jsonb_each(s.settings) j(k,v) WHERE s.id=1 AND k=ANY(ARRAY[
 'controller','address','vat','fiscalCode','register','contact','privacyContact','dpo',
 'retentionAccounts','retentionReviews','retentionRequests','retentionLogs','suppliers',
 'transfers','publicSources','applicability','analyticsEnabled','reviewed']));
$$;
ALTER FUNCTION public.get_public_legal_settings() OWNER TO postgres;
REVOKE ALL ON FUNCTION public.get_public_legal_settings() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_legal_settings() TO anon,authenticated;
CREATE OR REPLACE VIEW public.public_agency_provenance WITH(security_barrier=true) AS
 SELECT agency_id,source FROM public.agency_provenance;
ALTER VIEW public.public_agency_provenance OWNER TO postgres;
REVOKE ALL ON public.public_agency_provenance FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.public_agency_provenance TO anon,authenticated;

CREATE OR REPLACE FUNCTION public.submit_legal_request(p_data jsonb) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
 v_kind text:=p_data->>'kind'; v_name text:=btrim(COALESCE(p_data->>'name',''));
 v_email text:=lower(btrim(COALESCE(p_data->>'email','')));v_url text:=btrim(COALESCE(p_data->>'url',''));
 v_message text:=btrim(COALESCE(p_data->>'message',''));v_exception boolean;
 v_id uuid;
BEGIN
 v_exception:=v_kind='contenuto-illecito' AND COALESCE(p_data->>'anonymousException','false')='true';
 IF p_data IS NULL OR jsonb_typeof(p_data)<>'object' OR octet_length(p_data::text)>22000
 OR v_kind IS NULL OR v_kind NOT IN ('privacy','contenuto-illecito','recensione','contestazione','correzione-scheda','rimozione-scheda','rivendicazione','reclamo','accessibilita','contatto','registrazione')
 OR COALESCE(p_data->>'website','')<>'' OR COALESCE(p_data->>'acknowledged','false')<>'true'
 OR length(v_name)>255 OR length(v_email)>255 OR length(v_url)>2000
 OR (NOT v_exception AND (v_name='' OR v_email=''))
 OR (v_email<>'' AND v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')
 OR length(v_message)<10 OR length(v_message)>(CASE WHEN v_kind='registrazione' THEN 15000 ELSE 5000 END)
 OR (v_url<>'' AND (v_url !~ '^https?://' OR v_url ~ '[[:space:]]' OR v_url ~ '^https?://[^/]*@'))
 OR (v_kind IN ('contenuto-illecito','recensione','contestazione','correzione-scheda','rimozione-scheda','rivendicazione') AND v_url='')
 OR (v_kind IN ('contenuto-illecito','recensione','contestazione','reclamo') AND COALESCE(p_data->>'goodFaith','false')<>'true') THEN
  RAISE EXCEPTION 'Invalid request' USING ERRCODE='22023';
 END IF;
 IF v_kind='registrazione' THEN
  -- Private intake only, never an automatic public listing.
  IF COALESCE((v_message::jsonb)->>'terms','false')<>'true' OR COALESCE((v_message::jsonb)->>'privacy','false')<>'true'
     OR COALESCE((v_message::jsonb)->>'agency_name','')=''
     OR COALESCE((v_message::jsonb)->>'vat','') !~ '^[0-9]{11}$'
     OR COALESCE((v_message::jsonb)->>'legal_address','')='' THEN
    RAISE EXCEPTION 'Invalid registration' USING ERRCODE='22023';
  END IF;
 END IF;
 -- Minimal cooldown; does not store IPs or create a fingerprint. Not full anti-bot protection.
 PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('legal:'||COALESCE(NULLIF(v_email,''),v_url),0));
 IF EXISTS(SELECT 1 FROM public.legal_requests WHERE
   ((v_email<>'' AND email=v_email) OR (v_email='' AND email='' AND url=v_url))
   AND created_at>now()-interval '1 minute') THEN
  RAISE EXCEPTION 'Please wait before another request' USING ERRCODE='P0001';
 END IF;
 INSERT INTO public.legal_requests(kind,name,email,url,message,version,anonymous_exception)
 VALUES(v_kind,v_name,v_email,v_url,v_message,'2026-11-04-draft-1',v_exception) RETURNING id INTO v_id;
 RETURN v_id;
END;
$$;
ALTER FUNCTION public.submit_legal_request(jsonb) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.submit_legal_request(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_legal_request(jsonb) TO anon,authenticated;

CREATE OR REPLACE FUNCTION public.decide_legal_request(p_id uuid,p_status text,p_decision text,p_communicated boolean) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
 IF NOT public.legal_is_admin() THEN RAISE EXCEPTION 'Forbidden' USING ERRCODE='42501'; END IF;
 IF p_status IS NULL OR p_status NOT IN ('open','in_review','resolved') OR p_decision IS NULL OR length(btrim(p_decision)) NOT BETWEEN 10 AND 5000 OR p_communicated IS NULL THEN RAISE EXCEPTION 'Invalid decision' USING ERRCODE='22023'; END IF;
 UPDATE public.legal_requests SET status=p_status,decision=btrim(p_decision),
 communicated_at=CASE WHEN p_communicated THEN COALESCE(communicated_at,now()) ELSE NULL END WHERE id=p_id;
 IF NOT FOUND THEN RAISE EXCEPTION 'Unknown request'; END IF;
 INSERT INTO public.legal_request_events(request_id,actor,status,decision,communicated) VALUES(p_id,auth.uid(),p_status,btrim(p_decision),p_communicated);
END;
$$;
ALTER FUNCTION public.decide_legal_request(uuid,text,text,boolean) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.decide_legal_request(uuid,text,text,boolean) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.decide_legal_request(uuid,text,text,boolean) TO authenticated;

CREATE OR REPLACE FUNCTION public.moderate_legal_review(p_id integer,p_status text,p_reason text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_agency integer;
BEGIN
 IF NOT public.legal_is_admin() THEN RAISE EXCEPTION 'Forbidden' USING ERRCODE='42501'; END IF;
 IF p_id IS NULL OR p_id<1 OR p_status IS NULL OR p_status NOT IN ('approved','rejected') OR p_reason IS NULL OR length(btrim(p_reason)) NOT BETWEEN 10 AND 5000 THEN RAISE EXCEPTION 'Invalid moderation' USING ERRCODE='22023'; END IF;
 UPDATE public.reviews SET status=p_status,reviewed_at=now() WHERE id=p_id RETURNING agency_id INTO v_agency;
 IF NOT FOUND THEN RAISE EXCEPTION 'Unknown review'; END IF;
 -- Preserve the previous application's displayed aggregate in this same transaction.
 -- Only an explicit admin moderation updates this agency; no migration-time backfill.
 UPDATE public.agencies SET google_rating=(
   SELECT ROUND(AVG(rating)::numeric,1) FROM public.reviews WHERE agency_id=v_agency AND status='approved'
 ),google_reviews=(SELECT count(*) FROM public.reviews WHERE agency_id=v_agency AND status='approved')
 WHERE agency_id=v_agency;
 INSERT INTO public.review_moderation_events(review_id,actor,status,reason) VALUES(p_id,auth.uid(),p_status,btrim(p_reason));
END;
$$;
ALTER FUNCTION public.moderate_legal_review(integer,text,text) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.moderate_legal_review(integer,text,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.moderate_legal_review(integer,text,text) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_pending_legal_reviews() RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
 IF NOT public.legal_is_admin() THEN RAISE EXCEPTION 'Forbidden' USING ERRCODE='42501'; END IF;
 RETURN (SELECT COALESCE(jsonb_agg(to_jsonb(r)),'[]'::jsonb) FROM (
 SELECT r.id,r.agency_id,r.reviewer_name,r.reviewer_email,r.rating,r.comment,r.status,r.created_at,
 jsonb_build_object('nome',a.nome) AS agencies
 FROM public.reviews r JOIN public.agencies a ON a.agency_id=r.agency_id
 WHERE r.status='pending' ORDER BY r.created_at LIMIT 100
 ) r);
END;
$$;
ALTER FUNCTION public.get_pending_legal_reviews() OWNER TO postgres;
REVOKE ALL ON FUNCTION public.get_pending_legal_reviews() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.get_pending_legal_reviews() TO authenticated;
CREATE OR REPLACE FUNCTION public.respond_legal_review(p_id integer,p_response text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE v_email text; v_agency integer;
BEGIN
 SELECT lower(email) INTO v_email FROM auth.users WHERE id=auth.uid() AND email_confirmed_at IS NOT NULL;
 IF v_email IS NULL THEN RAISE EXCEPTION 'Forbidden' USING ERRCODE='42501'; END IF;
 IF p_id IS NULL OR p_id<1 OR p_response IS NULL OR length(btrim(p_response)) NOT BETWEEN 1 AND 2000 THEN RAISE EXCEPTION 'Invalid response' USING ERRCODE='22023'; END IF;
 SELECT agency_id INTO v_agency FROM public.reviews WHERE id=p_id AND status='approved';
 IF v_agency IS NULL THEN RAISE EXCEPTION 'Unknown review'; END IF;
 IF NOT public.legal_is_admin() AND NOT (
   EXISTS(SELECT 1 FROM public.agencies WHERE agency_id=v_agency AND lower(email)=v_email)
   AND (SELECT count(*) FROM public.agencies WHERE lower(email)=v_email)=1
 ) THEN RAISE EXCEPTION 'Forbidden' USING ERRCODE='42501'; END IF;
 UPDATE public.reviews SET company_response=btrim(p_response),company_response_date=now() WHERE id=p_id AND status='approved';
END;
$$;
ALTER FUNCTION public.respond_legal_review(integer,text) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.respond_legal_review(integer,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.respond_legal_review(integer,text) TO authenticated;

-- Existing approved-only rating trigger must be present and schema-qualified (script 004).
-- User communications remain manual until mail service activation. No mail is sent here.
NOTIFY pgrst,'reload schema';
COMMIT;
