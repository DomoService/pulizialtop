export const metadata = {
  title: "Registra la tua agenzia",
  description: "Richiedi l'inserimento della tua agenzia di pulizie o manutenzione nella directory PuliziAlTop in Sardegna.",
  alternates: { canonical: "https://pulizialtop.it/registrazione-agenzia" },
}

import { Building2, CheckCircle2, Star, Users } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { submitAgencyRegistration } from "@/app/actions"
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
              <h1 className="text-4xl font-bold text-foreground mb-4">Registra la Tua Agenzia di Pulizie</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Unisciti a PuliziAlTop e raggiungi migliaia di clienti in cerca di servizi di pulizia professionali in Sardegna. La registrazione è gratuita.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-6">Perché Registrarsi?</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg h-fit">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Visibilità Immediata</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Appari nei risultati di ricerca di migliaia di utenti alla ricerca di servizi di pulizia.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg h-fit">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Recensioni Verificate</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Raccogli recensioni autentiche dai tuoi clienti e costruisci la tua reputazione online.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg h-fit">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Profilo Professionale</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Crea un profilo completo con servizi, prezzi, area di copertura e portfolio.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg h-fit">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">100% Gratuito</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Nessun costo di registrazione. Inizia subito a ricevere contatti dai clienti.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-6">Richiedi Registrazione</h2>

                <form action={submitAgencyRegistration} className="space-y-6">
                  <div>
                    <label htmlFor="agency_name" className="block text-sm font-medium text-foreground mb-2">
                      Nome Agenzia *
                    </label>
                    <Input id="agency_name" name="agency_name" type="text" required placeholder="Es. Pulizie Express" />
                  </div>

                  <div>
                    <label htmlFor="contact_name" className="block text-sm font-medium text-foreground mb-2">
                      Nome Referente *
                    </label>
                    <Input id="contact_name" name="contact_name" type="text" required placeholder="Mario Rossi" />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email *
                    </label>
                    <Input id="email" name="email" type="email" required placeholder="info@tuaagenzia.it" />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                      Telefono *
                    </label>
                    <Input id="phone" name="phone" type="tel" required placeholder="+39 070 123 4567" />
                  </div>

                  <div>
                    <label htmlFor="province" className="block text-sm font-medium text-foreground mb-2">
                      Provincia Principale *
                    </label>
                    <select
                      id="province"
                      name="province"
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Seleziona provincia</option>
                      <option value="Cagliari">Cagliari</option>
                      <option value="Sassari">Sassari</option>
                      <option value="Nuoro">Nuoro</option>
                      <option value="Oristano">Oristano</option>
                      <option value="Sud Sardegna">Sud Sardegna</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="services" className="block text-sm font-medium text-foreground mb-2">
                      Servizi Offerti
                    </label>
                    <Textarea
                      id="services"
                      name="services"
                      rows={3}
                      placeholder="Es. Pulizie ordinarie, straordinarie, sanificazione..."
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Messaggio (opzionale)
                    </label>
                    <Textarea id="message" name="message" rows={4} placeholder="Raccontaci della tua agenzia..." />
                  </div>

                  <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      I dati inviati saranno trattati da Barbara Massa al solo scopo di rispondere alla richiesta, secondo quanto indicato nella{' '}
                      <Link href="/privacy-policy" className="text-primary underline">
                        Privacy Policy
                      </Link>
                      .
                    </p>
                    <div className="flex items-start gap-2">
                      <Checkbox id="privacy-consent" name="privacy_consent" required />
                      <label htmlFor="privacy-consent" className="text-xs text-foreground leading-relaxed cursor-pointer">
                        Ho letto l'informativa e acconsento al trattamento dei miei dati personali. *
                      </label>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Invia Richiesta di Registrazione
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Riceverai le credenziali di accesso via email entro 48 ore dalla verifica della richiesta.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
