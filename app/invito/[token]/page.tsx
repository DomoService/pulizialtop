import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getInvitationByToken, submitReviewFromInvitation } from "@/app/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Star } from 'lucide-react'
import { redirect } from 'next/navigation'
import Link from "next/link"

export default async function InvitationReviewPage({ params }: { params: { token: string } }) {
  const invitation = await getInvitationByToken(params.token)

  if (!invitation || invitation.reviewed) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                {invitation?.reviewed
                  ? "Hai già lasciato una recensione con questo link."
                  : "Link non valido o scaduto."}
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  async function handleSubmit(formData: FormData) {
    "use server"
    const result = await submitReviewFromInvitation(formData)
    if (result.success) {
      redirect("/grazie")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Lascia una Recensione</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Sei stato invitato a recensire <strong>{invitation.agencies.nome}</strong>
                </p>
              </CardHeader>
              <CardContent>
                <form action={handleSubmit} className="space-y-6">
                  <input type="hidden" name="invitation_token" value={params.token} />

                  <div className="space-y-2">
                    <Label htmlFor="rating">Valutazione *</Label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <label key={star} className="cursor-pointer">
                          <input type="radio" name="rating" value={star} required className="peer sr-only" />
                          <Star className="h-8 w-8 text-gray-300 peer-checked:fill-yellow-400 peer-checked:text-yellow-400 hover:text-yellow-400 transition-colors" />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comment">Commento *</Label>
                    <Textarea
                      id="comment"
                      name="comment"
                      required
                      rows={6}
                      placeholder="Descrivi la tua esperienza con questo servizio..."
                    />
                  </div>

                  {/* GDPR informativa with checkbox */}
                  <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      I dati inviati saranno trattati da Barbara Massa al solo scopo di pubblicare la recensione, secondo quanto indicato nella{' '}
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

                  <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
                    La tua recensione sarà verificata prima della pubblicazione.
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Invia Recensione
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
