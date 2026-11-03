import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  alternates: { canonical: "https://pulizialtop.it/cookie-policy" },
  title: "Cookie Policy",
  description: "Informativa sui cookie di PuliziAlTop - Come utilizziamo i cookie sul nostro sito",
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        
        <div className="prose prose-blue max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Cosa sono i Cookie</h2>
            <p>
              I cookie sono piccoli file di testo che i siti web visitati dall'utente inviano al suo 
              terminale (computer, tablet, smartphone) dove vengono memorizzati per essere poi ritrasmessi 
              agli stessi siti alla successiva visita.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Tipologie di Cookie Utilizzati</h2>
            
            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Cookie Tecnici</h3>
            <p>
              Sono cookie necessari al funzionamento del sito e non richiedono il consenso dell'utente. 
              Permettono la navigazione e l'utilizzo delle funzionalità base del sito.
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Cookie Analitici</h3>
            <p>
              Utilizzati per raccogliere informazioni sull'uso del sito (pagine visitate, tempo di permanenza, ecc.) 
              in forma aggregata e anonima. PuliziAlTop utilizza Vercel Analytics per monitorare le prestazioni del sito.
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Cookie di Profilazione</h3>
            <p>
              Sono utilizzati per tracciare la navigazione dell'utente e creare profili sui suoi gusti e preferenze. 
              Richiedono il consenso esplicito dell'utente prima dell'installazione.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Cookie di Terze Parti</h2>
            <p>
              PuliziAlTop può utilizzare servizi di terze parti che installano cookie per le seguenti finalità:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Vercel Analytics:</strong> Analisi del traffico e delle prestazioni del sito</li>
              <li><strong>Cookiebot:</strong> Gestione del consenso per i cookie</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Gestione dei Cookie</h2>
            <p>
              L'utente può gestire le proprie preferenze sui cookie attraverso:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Banner Cookiebot:</strong> Al primo accesso, compare un banner che permette di accettare o rifiutare i cookie</li>
              <li><strong>Impostazioni Browser:</strong> È possibile modificare le impostazioni del browser per bloccare o eliminare i cookie</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Disabilitazione dei Cookie</h2>
            <p>
              Puoi disabilitare i cookie dalle impostazioni del tuo browser:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Chrome:</strong> Impostazioni &gt; Privacy e sicurezza &gt; Cookie e altri dati dei siti</li>
              <li><strong>Firefox:</strong> Opzioni &gt; Privacy e sicurezza &gt; Cookie e dati dei siti web</li>
              <li><strong>Safari:</strong> Preferenze &gt; Privacy &gt; Gestisci dati siti web</li>
              <li><strong>Edge:</strong> Impostazioni &gt; Cookie e autorizzazioni sito &gt; Cookie e dati dei siti</li>
            </ul>
            <p className="mt-4">
              <strong>Nota:</strong> La disabilitazione dei cookie tecnici potrebbe compromettere 
              il corretto funzionamento del sito.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Cookie Installati</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="border border-border px-4 py-2 text-left">Nome</th>
                    <th className="border border-border px-4 py-2 text-left">Tipologia</th>
                    <th className="border border-border px-4 py-2 text-left">Durata</th>
                    <th className="border border-border px-4 py-2 text-left">Finalità</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border px-4 py-2">CookieConsent</td>
                    <td className="border border-border px-4 py-2">Tecnico</td>
                    <td className="border border-border px-4 py-2">12 mesi</td>
                    <td className="border border-border px-4 py-2">Memorizza le preferenze sui cookie</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2">_vercel_analytics</td>
                    <td className="border border-border px-4 py-2">Analitico</td>
                    <td className="border border-border px-4 py-2">Sessione</td>
                    <td className="border border-border px-4 py-2">Analisi traffico sito</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Aggiornamenti</h2>
            <p>
              Questa Cookie Policy può essere aggiornata periodicamente. 
              Eventuali modifiche saranno pubblicate su questa pagina.
            </p>
            <p className="mt-4">
              <strong>Ultimo aggiornamento: 14 Novembre 2025</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Contatti</h2>
            <p>
              Per maggiori informazioni sulla gestione dei cookie, contatta: info@pulizialtop.it
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
