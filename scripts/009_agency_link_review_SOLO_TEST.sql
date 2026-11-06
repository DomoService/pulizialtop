-- NON applicato. Solo database test, dopo 004. Verificare schema e trigger reali.
-- Non concede SELECT su review_token, non riscrive link esistenti.
BEGIN;
SET LOCAL lock_timeout='5s';
CREATE OR REPLACE FUNCTION public.get_public_agency_review_link(p_token uuid)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT jsonb_build_object('nome', a.nome, 'province', p.nome)
 FROM public.agencies a LEFT JOIN public.provinces p ON p.province_id=a.province_id
 WHERE a.review_token=p_token::text;
$$;
ALTER FUNCTION public.get_public_agency_review_link(uuid) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.get_public_agency_review_link(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_agency_review_link(uuid) TO anon,authenticated;
CREATE OR REPLACE FUNCTION public.submit_agency_link_review(p_token uuid,p_reviewer_name text,p_reviewer_email text,p_rating integer,p_comment text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE id integer;
BEGIN
 SELECT agency_id INTO id FROM public.agencies WHERE review_token=p_token::text;
 IF id IS NULL THEN RAISE EXCEPTION 'Invalid link' USING ERRCODE='22023'; END IF;
 PERFORM public.submit_public_review(id,p_reviewer_name,p_reviewer_email,p_rating,p_comment);
END;
$$;
ALTER FUNCTION public.submit_agency_link_review(uuid,text,text,integer,text) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.submit_agency_link_review(uuid,text,text,integer,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_agency_link_review(uuid,text,text,integer,text) TO anon,authenticated;
NOTIFY pgrst,'reload schema';
COMMIT;
