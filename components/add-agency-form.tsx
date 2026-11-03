"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addNewAgency } from "@/app/actions"
import { useRouter } from "next/navigation"

export function AddAgencyForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)

  // State per ogni campo del form
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "",
    provincia: "",
    indirizzo: "",
    cap: "",
    telefono: "",
    email: "",
    website: "",
    partita_iva: "",
    descrizione: "",
  })

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setLogoFile(null)
      setLogoPreview(null)
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  function handleSelectChange(name: string, value: string) {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const data = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value)
    })
    if (logoFile) data.append("logo", logoFile)

    const result = await addNewAgency(data)

    if (result.success) {
      setMessage({ type: "success", text: "Agenzia aggiunta con successo!" })
      setTimeout(() => {
        router.push("/admin/link-recensioni")
        router.refresh()
      }, 1500)
    } else {
      setMessage({ type: "error", text: result.error || "Errore durante l'inserimento" })
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-card p-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="nome">Nome Agenzia *</Label>
          <Input
            id="nome"
            name="nome"
            required
            placeholder="Es. Puliti & Ordinati Srl"
            value={formData.nome}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="logo">Logo Agenzia</Label>
          <Input
            id="logo"
            name="logo"
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/svg+xml"
            onChange={handleLogoChange}
          />
          <p className="mt-1 text-sm text-muted-foreground">
            Carica il logo dell'agenzia (formato: PNG, JPG, SVG - max 2MB)
          </p>
          {logoPreview && (
            <div className="mt-2">
              <img
                src={logoPreview || "/placeholder.svg"}
                alt="Preview logo"
                className="h-20 w-20 rounded-lg border object-contain"
              />
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="tipo">Tipo *</Label>
          <Select
            name="tipo"
            required
            value={formData.tipo}
            onValueChange={(value) => handleSelectChange("tipo", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleziona tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pulizie">Pulizie</SelectItem>
              <SelectItem value="manutenzione">Manutenzione</SelectItem>
              <SelectItem value="multiservice">Multiservice</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="provincia">Provincia *</Label>
          <Select
            name="provincia"
            required
            value={formData.provincia}
            onValueChange={(value) => handleSelectChange("provincia", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleziona provincia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cagliari">Cagliari</SelectItem>
              <SelectItem value="Sassari">Sassari</SelectItem>
              <SelectItem value="Nuoro">Nuoro</SelectItem>
              <SelectItem value="Oristano">Oristano</SelectItem>
              <SelectItem value="Sud Sardegna">Sud Sardegna</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="indirizzo">Indirizzo</Label>
          <Input
            id="indirizzo"
            name="indirizzo"
            placeholder="Via Roma, 123"
            value={formData.indirizzo}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="cap">CAP</Label>
          <Input
            id="cap"
            name="cap"
            placeholder="09100"
            maxLength={5}
            value={formData.cap}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="telefono">Telefono</Label>
          <Input
            id="telefono"
            name="telefono"
            type="tel"
            placeholder="070123456"
            value={formData.telefono}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="info@agenzia.it"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="website">Sito Web</Label>
          <Input
            id="website"
            name="website"
            type="url"
            placeholder="https://www.agenzia.it"
            value={formData.website}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="partita_iva">Partita IVA</Label>
          <Input
            id="partita_iva"
            name="partita_iva"
            placeholder="01234567890"
            maxLength={11}
            value={formData.partita_iva}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor="descrizione">Descrizione</Label>
          <Textarea
            id="descrizione"
            name="descrizione"
            placeholder="Descrizione dell'agenzia e dei servizi offerti"
            rows={4}
            value={formData.descrizione}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {message && (
        <div
          className={`rounded-md p-4 ${
            message.type === "success"
              ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Aggiunta in corso..." : "Aggiungi Agenzia"}
      </Button>
    </form>
  )
}
