import Link from "next/link"
import { LegalPage, LegalSection } from "@/components/legal-page"
import { getLegalSettings } from "@/lib/legal/data"
export const metadata = { title: "Diritti Privacy", alternates: { canonical: "https://pulizialtop.it/diritti-privacy" } }
export default async function Page() {
  const { settings } = await getLegalSettings()
  return <LegalPage title="Diritti Privacy">
    <LegalSection title="Come presentare una richiesta">
      <p>Scrivi a <a className="underline" href={`mailto:${settings.privacyContact || "info@pulizialtop.it"}?subject=Richiesta%20privacy`}>{settings.privacyContact || "info@pulizialtop.it"}</a>, oppure usa il <Link className="underline" href="/segnala-un-problema?tipo=privacy">modulo richieste privacy</Link>. Indica il diritto che desideri esercitare, un contatto per il riscontro e, se utile, l’URL della scheda o recensione interessata.</p>
      <p>Non inviare password, chiavi, dati sanitari o copie di documenti in questa prima fase. L’eventuale verifica dell’identità sarà proporzionata alla richiesta e al rischio, senza richiesta indiscriminata di documenti.</p>
    </LegalSection>
    <LegalSection title="Diritti esercitabili">
      <ul className="list-disc pl-6 space-y-2"><li>Accesso ai dati personali e informazioni sul trattamento.</li><li>Rettifica di dati inesatti o incompleti.</li><li>Cancellazione e limitazione, nei casi previsti dalla legge.</li><li>Portabilità, quando il trattamento automatizzato si basa su consenso o contratto.</li><li>Opposizione ai trattamenti basati sul legittimo interesse, nei casi previsti.</li><li>Revoca del consenso, senza pregiudicare la liceità dei trattamenti precedenti. Per gli strumenti facoltativi usa Gestisci preferenze cookie nel footer.</li></ul>
    </LegalSection>
    <LegalSection title="Gestione e tempi di risposta">
      <p>Il titolare valuta la richiesta senza ingiustificato ritardo e di norma entro un mese. Nei casi previsti dall’art. 12 GDPR può prorogare di due mesi, informandoti entro il primo mese delle ragioni. Di regola il riscontro è gratuito, ferme le eccezioni previste dal GDPR per richieste manifestamente infondate o eccessive.</p>
      <p>Una richiesta non cancella automaticamente dati o recensioni: occorre verificare identità, presupposti, diritti di terzi, obblighi di legge ed eventuali esigenze di difesa. Il riferimento restituito dal modulo prova la registrazione, non l’accoglimento. Se il modulo non è disponibile usa l’email indicata.</p>
    </LegalSection>
    <LegalSection title="Reclami e ulteriori informazioni"><p>Puoi proporre reclamo al <a className="underline" href="https://www.garanteprivacy.it">Garante per la protezione dei dati personali</a> e utilizzare gli ulteriori rimedi previsti dalla legge. Consulta la <Link className="underline" href="/privacy-policy">Privacy Policy</Link> per finalità, basi giuridiche, fornitori e conservazione.</p></LegalSection>
  </LegalPage>
}
