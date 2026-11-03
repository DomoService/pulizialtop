import Link from "next/link"
import { Mail, Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold">
                <span className="text-blue-600">Pulizi</span>
                <span className="text-orange-500">Al</span>
                <span className="text-blue-600">Top</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Trova agenzie di pulizie professionali in Sardegna per casa, ufficio o attività commerciale.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Servizi</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pulizie Casa
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pulizie Ufficio
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pulizie Condominio
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pulizie Hotel & B&B
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Azienda</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/chi-siamo" className="text-muted-foreground hover:text-foreground transition-colors">
                  Chi Siamo
                </Link>
              </li>
              <li>
                <Link href="/come-funziona" className="text-muted-foreground hover:text-foreground transition-colors">
                  Come Funziona
                </Link>
              </li>
              <li>
                <Link href="/per-agenzie" className="text-muted-foreground hover:text-foreground transition-colors">
                  Per Agenzie
                </Link>
              </li>
              <li>
                <Link href="/contattaci" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contattaci
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Contatti</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@pulizialtop.it</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+39 393 111 2121</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="text-center text-sm text-muted-foreground space-y-3">
            <p className="leading-relaxed">
              PuliziaAlTop è un progetto informativo gratuito in fase beta e non rappresenta attività commerciale.
            </p>
            <p>
              © 2025 Barbara Massa – Tutti i diritti riservati.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/privacy-policy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <span>|</span>
              <Link href="/cookie-policy" className="hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
              <span>|</span>
              <span>Email: info@pulizialtop.it</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
