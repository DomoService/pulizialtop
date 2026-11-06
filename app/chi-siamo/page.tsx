import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Users, Target, Heart, Award } from "lucide-react"

export const metadata = {
  title: "Chi Siamo - La Prima Piattaforma di Agenzie Pulizie in Sardegna",
  description:
    "Scopri PuliziAlTop, la piattaforma che connette agenzie di pulizie professionali con chi cerca servizi di qualità in Sardegna. Recensioni moderate e informazioni sulle imprese.",
  keywords:
    "chi siamo pulizialtop, piattaforma pulizie sardegna, agenzie pulizie in elenco",
  alternates: {
    canonical: "https://pulizialtop.it/chi-siamo",
  },
  openGraph: {
    title: "Chi Siamo | PuliziAlTop",
    description:
      "La piattaforma che connette agenzie di pulizie professionali in Sardegna",
    url: "https://pulizialtop.it/chi-siamo",
  },
}

export default function ChiSiamoPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-blue-50 to-background py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold text-balance text-foreground md:text-5xl">
                Chi Siamo
              </h1>
              <p className="mt-6 text-lg text-muted-foreground text-pretty">
                PuliziAlTop è la prima piattaforma in Sardegna dedicata a
                connettere chi cerca servizi di pulizia professionali con le
                migliori agenzie del territorio.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  Perché nasce PuliziAlTop
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Gestendo case vacanza e immobili come property manager, mi
                  sono resa conto di quanto sia difficile trovare agenzie di
                  pulizie veramente affidabili: puntuali, professionali e
                  costanti nel tempo.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Da questa necessità concreta è nata l'idea di creare
                  PuliziaAlTop: un portale dedicato a chiunque – privati,
                  property manager, aziende e strutture ricettive – abbia
                  bisogno di individuare rapidamente operatori di pulizia
                  competenti nella propria zona.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  PuliziaAlTop offre un luogo unico dove cercare, valutare e
                  recensire le agenzie di pulizie.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  L'obiettivo è semplice: rendere la scelta più trasparente,
                  immediata e sicura, grazie a informazioni chiare, recensioni
                  reali ed esperienze condivise da chi lavora ogni giorno sul
                  campo.
                </p>
              </div>

              <div className="mt-16 grid gap-8 md:grid-cols-2">
                <div className="rounded-lg border border-border bg-card p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">
                    La Nostra Missione
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Rendere semplice e trasparente la ricerca di agenzie di
                    pulizie professionali, garantendo qualità e affidabilità
                    attraverso recensioni moderate.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                    <Heart className="h-6 w-6 text-orange-500" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">
                    I Nostri Valori
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Trasparenza, qualità e rispetto. Crediamo in un marketplace
                    dove le agenzie serie emergono grazie al merito e alla
                    soddisfazione dei clienti.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">
                    Community
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Una rete di agenzie professionali e clienti soddisfatti che
                    crescono insieme, costruendo rapporti di fiducia duraturi.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                    <Award className="h-6 w-6 text-orange-500" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">
                    Informazioni e trasparenza
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Schede aziendali e recensioni moderate per aiutarti a
                    prendere la decisione giusta con maggiore consapevolezza.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-foreground">
                Perché PuliziAlTop?
              </h2>
              <p className="mt-6 text-lg text-muted-foreground text-pretty leading-relaxed">
                Perché crediamo che trovare un'agenzia di pulizie affidabile non
                debba essere complicato. Con PuliziAlTop hai accesso a
                recensioni moderate, agenzie presenti in elenco e un sistema di
                valutazione trasparente che ti aiuta a scegliere il partner
                giusto per le tue esigenze.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
