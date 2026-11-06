-- Correzione mirata sull'export 6 novembre 2026. NON eseguito dall'agente.
-- Eseguire integralmente, con backup disponibile, prima sul DB test e poi
-- sul DB pubblico soltanto dopo il collaudo test. Tutto o niente: errori => ROLLBACK.
-- Non migra utenti, non invia email, non cancella righe o file esistenti.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='60s';
DO $$ BEGIN
 IF to_regprocedure('public.legal_is_admin()') IS NULL
 OR to_regprocedure('public.submit_public_review(integer,text,text,integer,text)') IS NULL
 OR to_regprocedure('public.can_manage_agency_invites(integer)') IS NULL
 THEN RAISE EXCEPTION 'Prerequisiti 004/005/007 assenti: nessuna modifica applicata'; END IF;
 IF NOT EXISTS(SELECT 1 FROM storage.buckets WHERE id='agency-logos')
 THEN RAISE EXCEPTION 'Bucket agency-logos assente: nessuna modifica applicata'; END IF;
END $$;

-- La vista pubblica non deve essere scrivibile, neppure attraverso grant di colonna.
CREATE OR REPLACE VIEW public.public_agency_reviews WITH (security_barrier=true) AS
 SELECT id,agency_id,reviewer_name,rating,comment,status,created_at,reviewed_at,
 company_response,company_response_date FROM public.reviews WHERE status='approved';
ALTER VIEW public.public_agency_reviews OWNER TO postgres;
REVOKE ALL ON public.public_agency_reviews FROM PUBLIC,anon,authenticated;
DO $$ DECLARE c record; BEGIN
 FOR c IN SELECT attname FROM pg_attribute WHERE attrelid='public.public_agency_reviews'::regclass AND attnum>0 AND NOT attisdropped LOOP
 EXECUTE format('REVOKE ALL (%I) ON public.public_agency_reviews FROM PUBLIC,anon,authenticated',c.attname);
 END LOOP;
END $$;
GRANT SELECT ON public.public_agency_reviews TO anon,authenticated;

-- Protezione di accesso fresca: il booleano non rivela dati, non è pubblico.
CREATE OR REPLACE FUNCTION public.legal_is_admin() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT EXISTS(SELECT 1 FROM auth.users u WHERE u.id=auth.uid()
 AND u.email_confirmed_at IS NOT NULL AND u.raw_app_meta_data->>'role'='admin');
$$;
ALTER FUNCTION public.legal_is_admin() OWNER TO postgres;
REVOKE ALL ON FUNCTION public.legal_is_admin() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.legal_is_admin() TO authenticated;

-- Non concedere SELECT pubblico dei token, neanche agli utenti ordinari autenticati.
CREATE OR REPLACE FUNCTION public.get_admin_agency_review_links() RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF NOT public.legal_is_admin() THEN RAISE EXCEPTION 'Forbidden' USING ERRCODE='42501'; END IF;
 RETURN (SELECT coalesce(jsonb_agg(jsonb_build_object('agency_id',agency_id,'review_token',review_token)),'[]'::jsonb) FROM public.agencies);
END;
$$;
ALTER FUNCTION public.get_admin_agency_review_links() OWNER TO postgres;
REVOKE ALL ON FUNCTION public.get_admin_agency_review_links() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.get_admin_agency_review_links() TO authenticated;

-- Ripristina solo le modifiche di profilo previste dall'app, mai la password legacy.
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
GRANT UPDATE(nome,tipo,province_id,telefono,email,website,descrizione,logo_url)
 ON public.agencies TO authenticated;
DROP POLICY IF EXISTS release_admin_update_agencies ON public.agencies;
CREATE POLICY release_admin_update_agencies ON public.agencies FOR UPDATE TO authenticated
 USING(public.legal_is_admin()) WITH CHECK(public.legal_is_admin());
-- Restrittiva: eventuali altre policy permissive non possono dare UPDATE ai non admin.
DROP POLICY IF EXISTS release_update_agencies_guard ON public.agencies;
CREATE POLICY release_update_agencies_guard ON public.agencies AS RESTRICTIVE FOR UPDATE TO authenticated
 USING(public.legal_is_admin()) WITH CHECK(public.legal_is_admin());

-- Cancellazione SOLO su azione admin futura, transazionale; nessuna esecuzione ora.
-- Se audit/provenienza hanno FK RESTRICT, l'intera operazione fallisce senza rimozioni parziali.
CREATE OR REPLACE FUNCTION public.delete_agency_as_admin(p_agency integer) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF NOT public.legal_is_admin() THEN RAISE EXCEPTION 'Forbidden' USING ERRCODE='42501'; END IF;
 IF p_agency IS NULL OR p_agency<1 THEN RAISE EXCEPTION 'Invalid agency' USING ERRCODE='22023'; END IF;
 PERFORM 1 FROM public.agencies WHERE agency_id=p_agency FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Unknown agency' USING ERRCODE='22023'; END IF;
 DELETE FROM public.reviews WHERE agency_id=p_agency;
 DELETE FROM public.agency_services WHERE agency_id=p_agency;
 DELETE FROM public.review_invitations WHERE agency_id=p_agency;
 DELETE FROM public.agencies WHERE agency_id=p_agency;
END;
$$;
ALTER FUNCTION public.delete_agency_as_admin(integer) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.delete_agency_as_admin(integer) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.delete_agency_as_admin(integer) TO authenticated;

-- Storage: non tocca file, non rende privati i loghi pubblici esistenti.
-- Revoca l'upload pubblico rilevato; i guard restrittivi proteggono il bucket anche
-- se una policy permissiva aggiuntiva esiste. Altri bucket non sono riaperti.
DROP POLICY IF EXISTS "Allow public uploads t09f1c_0" ON storage.objects;
DROP POLICY IF EXISTS release_admin_logo_insert ON storage.objects;
CREATE POLICY release_admin_logo_insert ON storage.objects FOR INSERT TO authenticated
 WITH CHECK(bucket_id='agency-logos' AND public.legal_is_admin());
DROP POLICY IF EXISTS release_logo_insert_guard ON storage.objects;
CREATE POLICY release_logo_insert_guard ON storage.objects AS RESTRICTIVE FOR INSERT TO PUBLIC
 WITH CHECK(bucket_id<>'agency-logos' OR (auth.uid() IS NOT NULL AND public.legal_is_admin()));
DROP POLICY IF EXISTS release_logo_update_guard ON storage.objects;
CREATE POLICY release_logo_update_guard ON storage.objects AS RESTRICTIVE FOR UPDATE TO PUBLIC
 USING(bucket_id<>'agency-logos' OR (auth.uid() IS NOT NULL AND public.legal_is_admin()))
 WITH CHECK(bucket_id<>'agency-logos' OR (auth.uid() IS NOT NULL AND public.legal_is_admin()));
DROP POLICY IF EXISTS release_logo_delete_guard ON storage.objects;
CREATE POLICY release_logo_delete_guard ON storage.objects AS RESTRICTIVE FOR DELETE TO PUBLIC
 USING(bucket_id<>'agency-logos' OR (auth.uid() IS NOT NULL AND public.legal_is_admin()));
-- Non amplia un limite gia' piu' restrittivo. I vecchi oggetti restano invariati.
UPDATE storage.buckets SET file_size_limit=least(coalesce(file_size_limit,5242880),5242880),
 allowed_mime_types=ARRAY(SELECT x FROM unnest(ARRAY['image/jpeg','image/png','image/webp']) x
 WHERE allowed_mime_types IS NULL OR x=ANY(allowed_mime_types)) WHERE id='agency-logos';

-- Funzioni 009 mancanti: lookup minimo e invio tramite il percorso pending/cooldown.
CREATE OR REPLACE FUNCTION public.get_public_agency_review_link(p_token uuid)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT jsonb_build_object('nome',a.nome,'province',p.nome)
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
-- Un solo risultato da condividere. Non include dati clienti/token/credenziali.
SELECT jsonb_build_object(
 'esito','CORREZIONE_APPLICATA',
 'review_link_lookup',to_regprocedure('public.get_public_agency_review_link(uuid)') IS NOT NULL,
 'review_link_submit',to_regprocedure('public.submit_agency_link_review(uuid,text,text,integer,text)') IS NOT NULL,
 'vista_pubblica_scrivibile',has_table_privilege('anon','public.public_agency_reviews','INSERT,UPDATE,DELETE'),
 'admin_links_rpc',to_regprocedure('public.get_admin_agency_review_links()') IS NOT NULL,
 'delete_rpc',to_regprocedure('public.delete_agency_as_admin(integer)') IS NOT NULL,
 'logo_limit_bytes',(SELECT file_size_limit FROM storage.buckets WHERE id='agency-logos'),
 'logo_mime',(SELECT allowed_mime_types FROM storage.buckets WHERE id='agency-logos')
) AS controllo_finale;
