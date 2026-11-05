import {Header} from "@/components/header"
import {Footer} from "@/components/footer"
import {getInvitationByToken} from "@/app/actions"
import {InvitedReviewForm} from "@/components/invited-review-form"
export const dynamic="force-dynamic"
export const metadata={title:"Invito recensione",robots:{index:false,follow:false},referrer:"no-referrer" as const}
export default async function Page({params}:{params:Promise<{token:string}>}) {
 const {token}=await params
 let invitation:{agency_name:string,reviewed:boolean}|null=null,unavailable=false
 try{invitation=await getInvitationByToken(token)}catch{unavailable=true}
 return <div className="flex min-h-screen flex-col"><Header/><main className="container mx-auto max-w-2xl flex-1 space-y-4 px-4 py-12"><h1 className="text-2xl font-bold">Invito a lasciare una recensione</h1>
 {unavailable?<p role="alert">Servizio temporaneamente non disponibile. Riprova più tardi.</p>:!invitation?<p>Link non valido.</p>:invitation.reviewed?<p>Il link è già stato utilizzato.</p>:<><p>Sei stato invitato a recensire <strong>{invitation.agency_name}</strong>.</p><InvitedReviewForm token={token}/></>}
 </main><Footer/></div>
}
