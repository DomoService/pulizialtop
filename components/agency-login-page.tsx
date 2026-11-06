"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginAgency } from "@/app/actions"

export function AgencyLoginPage({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await loginAgency(email, password)

      if (result.success && result.agency) {
        router.push(`/agenzia/${result.agency.agency_id}/dashboard`)
      } else {
        setError(result.error || "Credenziali non valide")
        setLoading(false)
      }
    } catch {
      setError("Connessione non disponibile. Riprova.")
    } finally { setLoading(false) }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto flex min-h-[600px] items-center justify-center px-4 py-16">
          <Card className="w-full max-w-md p-8">
            <div className="mb-6 text-center">
              <h1 className="mb-2 text-2xl font-bold">Accesso Agenzie</h1>
              <p className="text-sm text-muted-foreground">Accedi per gestire il profilo della tua agenzia</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" autoComplete="username" type="email" placeholder="info@tuaagenzia.it" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" autoComplete="current-password" placeholder="Password del tuo account" required />
              </div>

              {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Accesso in corso..." : "Accedi"}
              </Button>
            </form>
            <Link href="/agenzia/password-dimenticata" className="mt-4 block underline">Password dimenticata?</Link>
            <Link href="/privacy-policy" className="mt-2 block text-sm underline">Privacy Policy</Link>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Usa un account confermato associato all’email della tua agenzia.</p>
              <p>Se hai problemi, contattaci a info@pulizialtop.it</p>
            </div>
          </Card>
        </div>
      </main>
      {children}
    </div>
  )
}
