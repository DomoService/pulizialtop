import Link from "next/link"
import { AdminHeader } from "@/components/admin-header"
import { getProvenanceReview } from "@/app/legal-actions"
import { assessProvenance } from "@/lib/legal/provenance"
export const dynamic="force-dynamic"
export const metadata={title:"Verifica riservata provenienze",robots:{index:false,follow:false}}
export default async function Page({searchParams}:{searchParams:Promise<{pagina?:string}>}) {
 const value=(await searchParams).pagina||"0",page=/^\d{1,6}$/.test(value)?Number(value):0
 const result=await getProvenanceReview(page)
 return <><AdminHeader/><main className="container mx-auto space-y-6 px-4 py-10">
 <h1 className="text-3xl font-bold">Schede: verifica riservata della provenienza</h1>
 <p>Nessun sito web viene interpretato come fonte. Nessuna data creazione viene presentata come data di acquisizione. Uno stato “registrata” deve essere correlato alla richiesta effettiva; una rivendicazione non prova l’origine iniziale. Nessuna provenienza viene assegnata automaticamente.</p>
 {!result.available?<p role="alert">Registro non disponibile: verifica permessi e tabelle, non equivale ad assenza di schede.</p>:<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th>ID</th><th>Impresa</th><th>Stato</th><th>Evidenza mancante</th></tr></thead><tbody>{result.rows.map(r=><tr key={r.agency_id} className="border-b"><td className="p-2">{r.agency_id}</td><td className="p-2">{r.nome}</td><td className="p-2">{r.status}</td><td className="p-2">{assessProvenance(r.status).evidence}. Verificare URL fonte, data acquisizione, soggetto inserente e informativa art.14.</td></tr>)}</tbody></table></div>}
 <nav aria-label="Pagine provenienze" className="flex gap-6">{page>0&&<Link href={`?pagina=${page-1}`}>Precedente</Link>}{result.hasMore&&<Link href={`?pagina=${page+1}`}>Successiva</Link>}</nav>
 <p>Rettifica, rivendicazione o rimozione: <Link href="/segnala-un-problema" className="underline">modulo dedicato</Link>. Prima dell’esito verificare identità e diritti senza richiedere documenti indiscriminati; per raccolte indirette valutare informativa individuale entro i termini dell’art.14 o eccezione documentata. L’essere pubblico non rende automaticamente lecito il riuso.</p>
 </main></>
}
