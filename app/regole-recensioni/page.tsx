import Link from "next/link"
import { LegalPage, LegalSection } from "@/components/legal-page"
export const metadata = {
  title: "Recensioni e moderazione",
  alternates: { canonical: "https://pulizialtop.it/regole-recensioni" },
}
export default function Page() {
  return (
    <LegalPage title="Recensioni e moderazione">
      <LegalSection title="Moderate non significa verificate">
        <p>
          Le nuove recensioni sono inviate in attesa di approvazione. Il
          controllo editoriale non prova che il recensore abbia acquistato o
          utilizzato il servizio. Non esiste nel codice un sistema generale di
          verifica dell’acquisto; anche un link d’invito non basta a provarlo.
          Le valutazioni non sono certificazioni delle imprese.
        </p>
      </LegalSection>
      <LegalSection title="Regole uguali per giudizi positivi e negativi">
        <p>
          Sono vietati falsi, incentivi non dichiarati, conflitti di interesse
          occultati, minacce, offese, discriminazioni, diffamazione, dati
          personali non necessari e spam. Non vengono create recensioni fittizie
          né riscritti automaticamente i contenuti degli autori. Le email dei
          recensori non sono mostrate nella vista pubblica.
        </p>
      </LegalSection>
      <LegalSection title="Procedura">
        <ol className="list-decimal pl-6 space-y-2">
          <li>Ricezione in stato pending e controllo umano del contenuto.</li>
          <li>
            In presenza di dubbi o segnalazioni, richiesta di chiarimenti alle
            parti; prove limitate a quanto necessario, senza pubblicare
            documenti.
          </li>
          <li>
            Decisione proporzionata (nessuna azione, rifiuto, limitazione o
            rimozione quando dovuta), con motivazione, base applicabile e
            rimedi. Nessuna cancellazione automatica.
          </li>
          <li>
            Comunicazione al segnalante e all’autore nei casi previsti,
            registrata dall’amministratore. L’invio email automatico non è
            ancora attivo: l’operatore deve inviare il riscontro e registrarne
            l’effettivo invio.
          </li>
          <li>
            Riesame umano su reclamo; restano disponibili i rimedi
            extragiudiziali e giudiziari applicabili. Tempi e requisiti
            specifici dipendono dagli obblighi effettivamente applicabili.
          </li>
        </ol>
      </LegalSection>
      <LegalSection title="Segnalare o contestare">
        <p>
          Usa{" "}
          <Link
            href="/segnala-un-problema?tipo=recensione"
            className="underline"
          >
            Segnala una recensione
          </Link>
          , indicando l’URL con identificativo della recensione, la ragione e un
          contatto. Per false recensioni spiega perché non rispecchiano
          un’esperienza reale. Per contestare una decisione indica il numero
          della richiesta precedente. Le aziende possono rispondere tramite la
          propria area riservata con account verificato e autorizzato, oppure
          chiedere assistenza tramite il modulo.
        </p>
      </LegalSection>
      <LegalSection title="Prevenzione abusi e limiti">
        <p>
          L’invio pubblico valida campi e limiti lato server e database e limita
          ripetizioni per agenzia/email nel percorso RPC. Non è una garanzia di
          autenticità né una protezione completa contro bot distribuiti; i
          percorsi legacy su invito richiedono ulteriori verifiche. Non vengono
          rimossi giudizi negativi soltanto perché sgraditi.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
