"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Copy } from "lucide-react"
import { createReviewInvitation } from "@/app/actions"
import { useRef } from "react"

export function InvitationForm({ agencyId }: { agencyId: number }) {
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    const result = await createReviewInvitation(formData)
    if (result.success) {
      alert(`Link generato! Copialo e invialo al cliente:\n${window.location.origin}/invito/${result.token}`)
      formRef.current?.reset()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Crea Nuovo Invito Recensione
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <input type="hidden" name="agency_id" value={agencyId} />
          <div className="space-y-2">
            <Label htmlFor="customer_name">Nome Cliente</Label>
            <Input id="customer_name" name="customer_name" required placeholder="Mario Rossi" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer_email">Email Cliente</Label>
            <Input
              id="customer_email"
              name="customer_email"
              type="email"
              required
              placeholder="mario.rossi@email.com"
            />
          </div>
          <Button type="submit" className="w-full">
            Genera Link Recensione
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export function InvitationsList({ invitations }: { invitations: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inviti Inviati ({invitations.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {invitations.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Nessun invito creato ancora</p>
        ) : (
          <div className="space-y-3">
            {invitations.map((invitation: any) => (
              <div key={invitation.invitation_id} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">{invitation.customer_name}</p>
                  <p className="text-sm text-muted-foreground">{invitation.customer_email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(invitation.sent_at).toLocaleDateString("it-IT")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {invitation.reviewed ? (
                    <span className="text-sm text-green-600 font-medium">✓ Recensito</span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const url = `${window.location.origin}/invito/${invitation.invitation_token}`
                        navigator.clipboard.writeText(url)
                        alert("Link copiato!")
                      }}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copia Link
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
