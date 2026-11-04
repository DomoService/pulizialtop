import { LegalPage, LegalSection } from "@/components/legal-page"
import { CookiePreferencesLink } from "@/components/cookie-preferences"
import { getLegalSettings } from "@/lib/legal/data"
export const metadata = {
  title: "Cookie Policy",
  alternates: { canonical: "https://pulizialtop.it/cookie-policy" },
}
export default async function Page() {
  const { settings } = await getLegalSettings()
  return (
    <LegalPage title="Cookie Policy">
      <LegalSection title="Strumenti effettivamente previsti">
        <p>
          Cookie e memoria del browser possono servire a sessioni, sicurezza e
          preferenze. La classificazione riguarda la funzione, non soltanto il
          nome dello strumento. In questa versione Google Analytics e Cookiebot
          non vengono caricati dall’applicazione.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Supabase Auth: cookie di sessione con prefisso sb- per login e
            rinnovo. Durata dipendente dalle impostazioni effettive del
            progetto, da verificare; non usati per marketing.
          </li>
          <li>
            Preferenze: localStorage pulizialtop-consent-v1: categoria
            statistiche sì/no, versione e scadenza di sei mesi, senza
            identificatore utente o invio al server.
          </li>
          <li>
            Componente sidebar, se utilizzato: cookie sidebar_state per stato
            del menu, durata nel codice 7 giorni; non risulta utilizzato nelle
            pagine pubbliche esaminate.
          </li>
          <li>
            Vercel Web Analytics:{" "}
            {settings.analyticsEnabled
              ? "abilitato come opzione, ma caricato solo dopo consenso"
              : "disabilitato"}
            . Non usa cookie secondo la documentazione del fornitore; resta uno
            strumento statistico qui sottoposto a scelta preventiva. Query e
            frammenti rimossi dagli eventi; percorsi riservati e richieste
            esclusi.
          </li>
        </ul>
      </LegalSection>
      <LegalSection title="Scelte e revoca">
        <p>
          Se sono abilitati strumenti facoltativi, compaiono Accetta tutti,
          Rifiuta tutti e Personalizza con uguale accessibilità. Rifiutare o
          chiudere senza scelta non abilita statistiche. Puoi riaprire{" "}
          <CookiePreferencesLink /> in qualsiasi momento; revocare ricarica la
          pagina per arrestare gli script già caricati. Sono rimossi i cookie GA
          legacy raggiungibili sul dominio, non quelli di altri siti.
        </p>
        <p>
          Se restano solo strumenti tecnici, non viene mostrato un banner
          automatico; il comando nel footer resta disponibile. La preferenza
          vale sei mesi sul dispositivo; non viene chiesta nuovamente a ogni
          visita mentre resta valida. La durata scelta segue il criterio delle
          linee guida cookie del Garante, non i tempi dei dati aziendali. La
          cancellazione dei dati del browser può eliminarla.
        </p>
      </LegalSection>
      <LegalSection title="Limiti dell’inventario">
        <p>
          Hosting, protezioni Vercel e servizi di autenticazione possono usare
          ulteriori strumenti tecnici secondo configurazione. L’elenco deriva
          dall’analisi del codice e non è una scansione esaustiva di ogni
          browser, login, integrazione esterna o configurazione del fornitore.
          Prima del rilascio definitivo occorre un controllo di rete e dei
          cookie in più stati di navigazione.
        </p>
        <p>
          Non aggiungere pixel, iframe o servizi di marketing senza aggiornare
          l’inventario e il blocco preventivo. Nessuna categoria marketing è
          attualmente implementata.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
