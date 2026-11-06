-- SOLO pulizialtop-test. Richiede 004, 005, 007. Nessuna riga esistente riscritta.
BEGIN;
SET LOCAL lock_timeout='5s';
CREATE OR REPLACE FUNCTION public.get_public_invitation(p_token uuid) RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT jsonb_build_object('agency_name',a.nome,'reviewed',i.reviewed)
 FROM public.review_invitations i JOIN public.agencies a USING(agency_id)
 WHERE i.invitation_token=p_token::text;
$$;
ALTER FUNCTION public.get_public_invitation(uuid) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.get_public_invitation(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_invitation(uuid) TO anon,authenticated;
CREATE OR REPLACE FUNCTION public.submit_invited_review(p_token uuid,p_rating integer,p_comment text,p_public_name text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE i public.review_invitations%ROWTYPE;
BEGIN
 IF p_rating IS NULL OR p_rating NOT BETWEEN 1 AND 5 OR p_comment IS NULL OR length(btrim(p_comment)) NOT BETWEEN 1 AND 5000
 OR p_public_name IS NULL OR length(btrim(p_public_name)) NOT BETWEEN 1 AND 255 THEN
 RAISE EXCEPTION 'Invalid review' USING ERRCODE='22023'; END IF;
 SELECT * INTO i FROM public.review_invitations WHERE invitation_token=p_token::text FOR UPDATE;
 IF NOT FOUND OR i.reviewed IS DISTINCT FROM false THEN RAISE EXCEPTION 'Invalid or used invitation' USING ERRCODE='22023'; END IF;
 -- Reuses approved-only pending insertion and cooldown, without exposing customer email.
 PERFORM public.submit_public_review(i.agency_id,btrim(p_public_name),i.customer_email,p_rating,btrim(p_comment));
 UPDATE public.review_invitations SET reviewed=true WHERE invitation_id=i.invitation_id;
END;
$$;
ALTER FUNCTION public.submit_invited_review(uuid,integer,text,text) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.submit_invited_review(uuid,integer,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_invited_review(uuid,integer,text,text) TO anon,authenticated;
NOTIFY pgrst,'reload schema';
COMMIT;
-- UUID link is a bearer capability: keep private, no analytics/referrers, never log full tokens.
-- No expiry invented for existing links. Retention/expiry policy requires owner decision.
