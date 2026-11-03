import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  alternates: { canonical: "https://pulizialtop.it/privacy-policy" },
  title: "Privacy Policy",
  description: "Informativa sulla privacy di PuliziAlTop - Come trattiamo i tuoi dati personali",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-blue max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Titolare del Trattamento</h2>
            <p>
              Il Titolare del trattamento dei dati è Barbara Massa, contattabile all'indirizzo email: info@pulizialtop.it
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Tipologie di Dati Raccolti</h2>
            <p>
              PuliziAlTop raccoglie i seguenti dati personali:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Dati di navigazione (indirizzo IP, tipo di browser, pagine visitate)</li>
              <li>Dati forniti volontariamente dall'utente (nome, email, telefono) tramite form di contatto o registrazione</li>
              <li>Cookie tecnici e di profilazione (vedi Cookie Policy)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Finalità del Trattamento</h2>
            <p>I dati personali sono trattati per le seguenti finalità:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fornire i servizi richiesti dall'utente</li>
              <li>Gestire richieste di contatto e supporto</li>
              <li>Migliorare l'esperienza utente e le funzionalità del sito</li>
              <li>Analisi statistiche anonime sul traffico del sito</li>
              <li>Invio di comunicazioni informative (previo consenso)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Base Giuridica del Trattamento</h2>
            <p>
              Il trattamento dei dati è basato sul consenso dell'utente (art. 6, par. 1, lett. a GDPR) 
              e sull'esecuzione di un contratto o misure precontrattuali (art. 6, par. 1, lett. b GDPR).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Conservazione dei Dati</h2>
            <p>
              I dati personali sono conservati per il tempo necessario a fornire i servizi richiesti 
              e per adempiere agli obblighi di legge. Successivamente, i dati vengono cancellati o anonimizzati.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Diritti dell'Interessato</h2>
            <p>L'utente ha diritto di:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Accedere ai propri dati personali</li>
              <li>Rettificare dati inesatti o incompleti</li>
              <li>Cancellare i propri dati (diritto all'oblio)</li>
              <li>Limitare il trattamento dei dati</li>
              <li>Opporsi al trattamento</li>
              <li>Richiedere la portabilità dei dati</li>
              <li>Revocare il consenso in qualsiasi momento</li>
              <li>Proporre reclamo all'Autorità Garante per la protezione dei dati personali</li>
            </ul>
            <p className="mt-4">
              Per esercitare i tuoi diritti, contatta: info@pulizialtop.it
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Sicurezza dei Dati</h2>
            <p>
              PuliziAlTop adotta misure di sicurezza tecniche e organizzative per proteggere 
              i dati personali da accessi non autorizzati, perdita, distruzione o divulgazione.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Condivisione dei Dati</h2>
            <p>
              I dati personali non vengono venduti o ceduti a terze parti senza il consenso dell'utente, 
              salvo obbligo di legge. Possono essere condivisi con fornitori di servizi tecnici 
              (hosting, analytics) che operano in qualità di Responsabili del trattamento.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Modifiche alla Privacy Policy</h2>
            <p>
              Questa Privacy Policy può essere aggiornata periodicamente. 
              La versione aggiornata sarà pubblicata su questa pagina con indicazione della data di modifica.
            </p>
            <p className="mt-4">
              <strong>Ultimo aggiornamento: 14 Novembre 2025</strong>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
