"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { registerAdmin } from "@/app/actions"

export function AdminRegisterForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const password = formData.get("password")
    const confirmPassword = formData.get("confirmPassword")

    if (password !== confirmPassword) {
      setError("Le password non coincidono")
      setLoading(false)
      return
    }

    const result = await registerAdmin(formData)

    if (result.error) {
      if (result.error.includes("already registered") || result.error.includes("already exists")) {
        setError("Questa email è già registrata. Prova ad accedere o usa un'altra email.")
      } else if (result.error.includes("invalid")) {
        setError("Email non valida. Assicurati di usare un formato email corretto (es: tuo@email.com)")
      } else {
        setError(`Errore: ${result.error}`)
      }
      setLoading(false)
    } else {
      setSuccessMessage("Registrazione completata! Controlla la tua email per confermare l'account, poi accedi.")
      setLoading(false)
      setTimeout(() => {
        router.push("/admin/login")
      }, 3000)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrazione</CardTitle>
        <CardDescription>Crea un nuovo account amministratore</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="admin@pulizialtop.it" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" minLength={6} required />
            <p className="text-xs text-muted-foreground">Minimo 6 caratteri</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Conferma Password</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" minLength={6} required />
          </div>
          {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}
          {successMessage && <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">{successMessage}</div>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registrazione in corso..." : "Registrati"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
