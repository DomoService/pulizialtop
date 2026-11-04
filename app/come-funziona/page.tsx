import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Search, Star, MessageSquare, CheckCircle2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Come Funziona - Trova Agenzie di Pulizie in 4 Semplici Passi",
  description:
    "Scopri come utilizzare PuliziAlTop per trovare le migliori agenzie di pulizie in Sardegna in pochi semplici passaggi. Cerca, confronta recensioni, contatta e valuta.",
  keywords: "come funziona pulizialtop, trovare agenzie pulizie, confrontare recensioni pulizie sardegna",
  alternates: {
    canonical: 'https://pulizialtop.it/come-funziona',
  },
  openGraph: {
    title: "Come Funziona | PuliziAlTop",
    description: "Trova la tua agenzia di pulizie ideale in 4 semplici passaggi",
    url: "https://pulizialtop.it/come-funziona",
  }
}

export default function ComeFunzionaPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-orange-50 to-background py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold text-balance text-foreground md:text-5xl">Come Funziona</h1>
              <p className="mt-6 text-lg text-muted-foreground text-pretty">
                Trovare l'agenzia di pulizie perfetta non è mai stato così semplice. Segui questi 4 passaggi.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-5xl">
              <div className="grid gap-12">
                {/* Step 1 */}
                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <Search className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
                      Passo 1
                    </div>
                    <h3 className="mb-3 text-2xl font-bold text-foreground">Cerca e Filtra</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Utilizza i nostri filtri per trovare agenzie di pulizie o manutenzione nella tua provincia. Filtra
                      per tipo di servizio, valutazione e zona di lavoro per trovare l'agenzia perfetta per le tue
                      esigenze.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-orange-100">
                    <Star className="h-8 w-8 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 inline-block rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-600">
                      Passo 2
                    </div>
                    <h3 className="mb-3 text-2xl font-bold text-foreground">Leggi le Recensioni</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Consulta le recensioni verificate lasciate da altri clienti. Ogni recensione viene moderata per
                      garantire autenticità e trasparenza. Scopri cosa dicono i clienti su qualità del servizio,
                      puntualità e professionalità.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <MessageSquare className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
                      Passo 3
                    </div>
                    <h3 className="mb-3 text-2xl font-bold text-foreground">Contatta l'Agenzia</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Hai trovato l'agenzia giusta? Contattala direttamente tramite email o telefono per richiedere un
                      preventivo personalizzato. Tutte le informazioni di contatto sono disponibili nella scheda
                      dell'agenzia.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-orange-100">
                    <CheckCircle2 className="h-8 w-8 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 inline-block rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-600">
                      Passo 4
                    </div>
                    <h3 className="mb-3 text-2xl font-bold text-foreground">Lascia una Recensione</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Dopo aver utilizzato il servizio, lascia una recensione onesta per aiutare altri utenti a fare la
                      scelta giusta. Le recensioni vengono moderate prima della pubblicazione per garantire qualità e
                      autenticità.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-blue-50 to-orange-50 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-foreground">Per le Agenzie</h2>
              <p className="mt-4 text-lg text-muted-foreground text-pretty leading-relaxed">
                Sei un'agenzia di pulizie o manutenzione? Unisciti a PuliziAlTop per aumentare la tua visibilità,
                raccogliere recensioni dai tuoi clienti e far crescere il tuo business.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" asChild className="bg-orange-500 hover:bg-orange-600">
                  <Link href="/per-agenzie">Scopri di Più</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/agenzia/login">Accedi</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
