import { strict as assert } from "node:assert"
import { readFileSync } from "node:fs"
const { PGlite }=await import(process.env.PGLITE_MODULE || "@electric-sql/pglite")
const db=new PGlite()
await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated;
CREATE TABLE public.provinces(province_id integer PRIMARY KEY,nome text);
CREATE TABLE public.agencies(agency_id integer PRIMARY KEY,nome text,email text,province_id integer,review_token text);
CREATE TABLE public.reviews(agency_id integer,reviewer_name text,reviewer_email text,rating integer,comment text,status text);
INSERT INTO provinces VALUES(1,'Test province');
INSERT INTO agencies VALUES(42,'Test','private@example.test',1,'11111111-1111-4111-8111-111111111111');
CREATE FUNCTION public.submit_public_review(integer,text,text,integer,text) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$ BEGIN
IF $4 NOT BETWEEN 1 AND 5 THEN RAISE EXCEPTION 'invalid'; END IF;
INSERT INTO public.reviews VALUES($1,$2,$3,$4,$5,'pending');END $$;`)
const sql=readFileSync(new URL('../scripts/009_agency_link_review_SOLO_TEST.sql',import.meta.url),'utf8')
await db.exec(sql);await db.exec(sql)
await db.exec('SET ROLE anon')
const result=await db.query(`SELECT public.get_public_agency_review_link('11111111-1111-4111-8111-111111111111') AS link`)
assert.deepEqual(result.rows[0].link,{nome:'Test',province:'Test province'})
await db.exec(`SELECT public.submit_agency_link_review('11111111-1111-4111-8111-111111111111','Alias','test@example.test',5,'Experience')`)
await assert.rejects(db.exec('SELECT email,review_token FROM public.agencies'))
await assert.rejects(db.exec(`SELECT public.submit_agency_link_review('22222222-2222-4222-8222-222222222222','Alias','test@example.test',5,'Experience')`))
await db.exec('RESET ROLE')
const reviews=await db.query('SELECT status FROM public.reviews');assert.equal(reviews.rows[0].status,'pending')
console.log('PASS isolated SQL: migration rerun, minimal lookup, pending submission, private columns denied, invalid token rejected; real cooldown/trigger not reproduced by this fixture')
await db.close()
