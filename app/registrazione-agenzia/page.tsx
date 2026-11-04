import { RegistrationForm } from "@/components/registration-form"
export const metadata = {
  title: "Registra la tua agenzia",
  description:
    "Richiedi l'inserimento della tua agenzia di pulizie o manutenzione nella directory PuliziAlTop in Sardegna.",
  alternates: { canonical: "https://pulizialtop.it/registrazione-agenzia" },
}

import { Building2, CheckCircle2, Star, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function RegistrazioneAgenziaPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="bg-gradient-to-b from-primary/5 to-background py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Registra la Tua Agenzia di Pulizie
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Richiedi una scheda su PuliziAlTop per farti trovare da chi è in
                cerca di servizi di pulizia professionali in Sardegna. La
                registrazione è gratuita.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-6">
                  Perché Registrarsi?
                </h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg h-fit">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Visibilità nella directory
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Richiedi una scheda nei risultati di ricerca, dopo la
                        valutazione della richiesta.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg h-fit">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Recensioni Moderate
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Invita i clienti a raccontare esperienze autentiche e
                        costruisci la tua reputazione online.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg h-fit">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Profilo Professionale
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Richiedi una scheda con informazioni aziendali, contatti
                        e servizi.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg h-fit">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        100% Gratuito
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Nessun costo di registrazione. Inizia subito a ricevere
                        contatti dai clienti.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-6">
                  Richiedi Registrazione
                </h2>

                <RegistrationForm />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
