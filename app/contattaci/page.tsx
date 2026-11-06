import { ContactForm } from "@/components/contact-form"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

export const metadata = {
  title: "Contattaci - Supporto e Informazioni | PuliziAlTop",
  description:
    "Hai domande su servizi di pulizia in Sardegna? Contattaci per informazioni su agenzie pulizie professionali, registrazione agenzie o assistenza. Invia una richiesta al gestore.",
  keywords:
    "contatti pulizialtop, supporto agenzie pulizie, servizi pulizia Sardegna, agenzie pulizia Cagliari",
  alternates: {
    canonical: "https://pulizialtop.it/contattaci",
  },
  openGraph: {
    title: "Contattaci | PuliziAlTop",
    description: "Hai domande? Siamo qui per aiutarti",
    url: "https://pulizialtop.it/contattaci",
  },
}

export default function ContattaciPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Contattaci
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Hai domande sui servizi di pulizia in Sardegna? Siamo qui per
                aiutarti. Compila il form o contattaci direttamente.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-6">
                  Invia un Messaggio
                </h2>

                <ContactForm />
              </div>

              <div className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-6">
                    Informazioni di Contatto
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground mb-1">
                          Email
                        </h3>
                        <a
                          href="mailto:info@pulizialtop.it"
                          className="text-muted-foreground hover:text-primary"
                        >
                          info@pulizialtop.it
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground mb-1">
                          Telefono
                        </h3>
                        <a
                          href="tel:+393931112121"
                          className="text-muted-foreground hover:text-primary"
                        >
                          +39 393 111 2121
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground mb-1">
                          Sede
                        </h3>
                        <p className="text-muted-foreground">
                          Cagliari, Sardegna
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-8">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Orari di Assistenza
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <span className="font-medium text-foreground">
                        Lunedì - Venerdì:
                      </span>{" "}
                      9:00 - 18:00
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        Sabato:
                      </span>{" "}
                      9:00 - 13:00
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        Domenica:
                      </span>{" "}
                      Chiuso
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
