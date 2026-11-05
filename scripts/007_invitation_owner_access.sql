-- SOLO TEST: esaminare ed eseguire esclusivamente in pulizialtop-test.
-- Prerequisiti: schema inviti e script 005. Nessun dato cliente modificato.
-- Abilita elenco/creazione privati. NON abilita ancora l'uso pubblico del link.
BEGIN;
SET LOCAL lock_timeout='5s';
CREATE OR REPLACE FUNCTION public.can_manage_agency_invites(p_agency integer)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT EXISTS (
   SELECT 1 FROM auth.users u WHERE u.id=auth.uid() AND u.email_confirmed_at IS NOT NULL
   AND (u.raw_app_meta_data->>'role'='admin' OR (
     EXISTS(SELECT 1 FROM public.agencies a WHERE a.agency_id=p_agency AND lower(a.email)=lower(u.email))
     AND (SELECT count(*) FROM public.agencies a WHERE lower(a.email)=lower(u.email))=1
   ))
 );
$$;
ALTER FUNCTION public.can_manage_agency_invites(integer) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.can_manage_agency_invites(integer) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.can_manage_agency_invites(integer) TO authenticated;
ALTER TABLE public.review_invitations ENABLE ROW LEVEL SECURITY;
-- In test this table was intentionally closed. Never copy to production without an audit.
REVOKE ALL ON public.review_invitations FROM PUBLIC,anon,authenticated;
GRANT SELECT(invitation_id,agency_id,customer_name,customer_email,invitation_token,sent_at,reviewed)
 ON public.review_invitations TO authenticated;
GRANT INSERT(agency_id,customer_name,customer_email,invitation_token)
 ON public.review_invitations TO authenticated;
-- serial sequence on the audited production schema; identity fixture may not need this.
DO $$ DECLARE seq text; BEGIN
 seq:=pg_get_serial_sequence('public.review_invitations','invitation_id');
 IF seq IS NOT NULL THEN EXECUTE format('GRANT USAGE ON SEQUENCE %s TO authenticated',seq::regclass); END IF;
END $$;
DROP POLICY IF EXISTS invitations_owner_read ON public.review_invitations;
CREATE POLICY invitations_owner_read ON public.review_invitations FOR SELECT TO authenticated
 USING(public.can_manage_agency_invites(agency_id));
DROP POLICY IF EXISTS invitations_owner_create ON public.review_invitations;
CREATE POLICY invitations_owner_create ON public.review_invitations FOR INSERT TO authenticated
 WITH CHECK(public.can_manage_agency_invites(agency_id)
 AND length(btrim(customer_name)) BETWEEN 1 AND 255
 AND length(customer_email)<=255
 AND customer_email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
 AND reviewed=false);
NOTIFY pgrst,'reload schema';
COMMIT;
