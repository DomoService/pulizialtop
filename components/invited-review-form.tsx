"use client"
import {useState} from "react"
import Link from "next/link"
import {submitReviewFromInvitation} from "@/app/actions"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Button} from "@/components/ui/button"
export function InvitedReviewForm({token}:{token:string}) {
 const [busy,setBusy]=useState(false),[error,setError]=useState(""),[done,setDone]=useState(false)
 async function submit(f:FormData){setBusy(true);setError("");try{const r=await submitReviewFromInvitation(f);if(r.success)setDone(true);else setError(r.error||"Invio non riuscito")}catch{setError("Invio non riuscito")}finally{setBusy(false)}}
 if(done)return <p role="status">Recensione ricevuta e in attesa di moderazione. Il link è ora utilizzato. Nessuna pubblicazione automatica.</p>
 return <form action={submit} className="space-y-4"><input type="hidden" name="invitation_token" value={token}/>
 <label className="block">Nome da mostrare pubblicamente<Input name="public_name" required maxLength={255}/></label>
 <fieldset><legend>Valutazione</legend><div className="flex flex-wrap gap-4">{[1,2,3,4,5].map(n=><label key={n} className="flex gap-1"><input name="rating" type="radio" value={n} required/>{n} {n===1?"stella":"stelle"}</label>)}</div></fieldset>
 <label className="block">Commento<Textarea name="comment" rows={6} required maxLength={5000}/></label>
 <p className="text-sm">Nome scelto e commento saranno pubblici dopo moderazione. L’email associata all’invito resta riservata. Non inserire dati di terzi. L’invito non certifica l’acquisto.</p>
 <label className="flex gap-2"><input name="experience" type="checkbox" required/>Dichiaro una mia esperienza autentica.</label>
 <label className="flex gap-2"><input name="terms" type="checkbox" required/>Accetto i <Link href="/termini-e-condizioni" className="underline">termini</Link> e ho letto la <Link href="/privacy-policy" className="underline">privacy</Link>.</label>
 {error&&<p role="alert">{error}</p>}<Button disabled={busy} type="submit">{busy?"Invio…":"Invia recensione"}</Button></form>
}
