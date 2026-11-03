import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getAgencies, generateAllCredentials } from "@/app/actions"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CredentialsEmailTemplate } from "@/components/credentials-email-template"

export default async function CredenzialiPage() {
  const agencies = await getAgencies()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">Credenziali Agenzie</h1>
            <p className="text-muted-foreground">
              Genera e invia le credenziali di accesso alle agenzie per gestire il loro profilo.
            </p>
          </div>

          <div className="mb-6">
            <form action={generateAllCredentials}>
              <Button size="lg" type="submit">
                Genera Credenziali per Tutte le Agenzie
              </Button>
            </form>
          </div>

          <div className="grid gap-4">
            {agencies.map((agency) => (
              <Card key={agency.agency_id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="mb-1 text-lg font-semibold">{agency.nome}</h3>
                    <p className="mb-3 text-sm text-muted-foreground">
                      {agency.province} - {agency.tipo}
                    </p>

                    {agency.email ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Email:</span>
                          <code className="rounded bg-muted px-2 py-1 text-sm">{agency.email}</code>
                        </div>

                        <CredentialsEmailTemplate agency={agency} />
                      </div>
                    ) : (
                      <p className="text-sm text-destructive">Nessuna email disponibile per questa agenzia</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
