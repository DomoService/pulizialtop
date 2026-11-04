import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TrendingUp, Users, Star, BarChart3, Shield, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Per Agenzie di Pulizie - Aumenta la Tua Visibilità in Sardegna",
  description:
    "Unisciti a PuliziAlTop e aumenta la visibilità della tua agenzia di pulizie in Sardegna. Sistema di recensioni verificate, lead generation qualificati e dashboard completa. 100% gratuito.",
  keywords: "agenzie pulizie sardegna, aumentare clienti pulizie, recensioni verificate agenzie, lead generation pulizie",
  alternates: {
    canonical: 'https://pulizialtop.it/per-agenzie',
  },
  openGraph: {
    title: "Per Agenzie | PuliziAlTop",
    description: "Fai crescere la tua agenzia di pulizie con PuliziAlTop",
    url: "https://pulizialtop.it/per-agenzie",
  }
}

export default function PerAgenzePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-blue-50 to-background py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold text-balance text-foreground md:text-5xl">
                Fai Crescere la Tua Agenzia
              </h1>
              <p className="mt-6 text-lg text-muted-foreground text-pretty">
                Unisciti a PuliziAlTop e connettiti con clienti che cercano servizi di pulizia professionali in
                Sardegna.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" asChild className="bg-orange-500 hover:bg-orange-600">
                  <Link href="/agenzia/login">Accedi Ora</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contattaci">Contattaci</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-5xl">
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold text-foreground">Perché Scegliere PuliziAlTop?</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Tutto quello che serve per far crescere il tuo business
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg border border-border bg-card p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">Più Visibilità</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Raggiungi migliaia di potenziali clienti che cercano servizi di pulizia in Sardegna ogni mese.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                    <Users className="h-6 w-6 text-orange-500" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">Lead Qualificati</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Ricevi richieste di contatto da clienti realmente interessati ai tuoi servizi.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Star className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">Recensioni Verificate</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Sistema di recensioni verificate che aumenta la fiducia e la credibilità della tua agenzia.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                    <BarChart3 className="h-6 w-6 text-orange-500" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">Dashboard Completa</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Gestisci il tuo profilo, monitora le recensioni e invia inviti ai tuoi clienti da un'unica
                    dashboard.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">Moderazione</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Tutte le recensioni vengono moderate per garantire qualità e proteggere la tua reputazione.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                    <Clock className="h-6 w-6 text-orange-500" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">100% Gratuito</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Registrati e inizia a ricevere clienti senza costi. Nessun abbonamento o commissione.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-8 text-center text-3xl font-bold text-foreground">Come Funziona per le Agenzie</h2>

              <div className="space-y-6">
                <div className="rounded-lg border border-border bg-background p-6">
                  <div className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
                    Step 1
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">Registra la Tua Agenzia</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Contattaci per aggiungere la tua agenzia alla piattaforma. Ti forniremo le credenziali di accesso
                    alla dashboard.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-background p-6">
                  <div className="mb-2 inline-block rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-600">
                    Step 2
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">Completa il Tuo Profilo</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Accedi alla dashboard, completa il profilo con i tuoi servizi, zone di lavoro e informazioni di
                    contatto.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-background p-6">
                  <div className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
                    Step 3
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">Invita i Tuoi Clienti</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Genera link personalizzati da inviare ai tuoi clienti per lasciare recensioni verificate sulla tua
                    agenzia.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-background p-6">
                  <div className="mb-2 inline-block rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-600">
                    Step 4
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">Ricevi Nuovi Clienti</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Più recensioni positive raccogli, più visibilità ottieni. I clienti ti contatteranno direttamente
                    per richiedere i tuoi servizi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-blue-600 to-orange-500 p-8 text-center text-white md:p-12">
              <h2 className="mb-4 text-3xl font-bold">Pronto a Iniziare?</h2>
              <p className="mb-8 text-lg text-white/90">
                Unisciti alle agenzie che già usano PuliziAlTop per far crescere il loro business.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/contattaci">Contattaci</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-white text-white hover:bg-white/10 bg-transparent"
                >
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
