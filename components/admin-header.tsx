"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { logoutAdmin } from "@/app/actions"
import { useRouter } from "next/navigation"

export function AdminHeader() {
  const router = useRouter()

  async function handleLogout() {
    await logoutAdmin()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/admin/recensioni" className="text-lg font-semibold">
            Admin Panel
          </Link>
          <nav className="flex gap-4">
            <Link href="/admin/recensioni" className="text-sm text-muted-foreground hover:text-foreground">
              Recensioni
            </Link>
            <Link href="/admin/link-recensioni" className="text-sm text-muted-foreground hover:text-foreground">
              Link
            </Link>
            <Link href="/admin/credenziali" className="text-sm text-muted-foreground hover:text-foreground">
              Credenziali
            </Link>
            <Link href="/admin/aggiungi-agenzia" className="text-sm text-muted-foreground hover:text-foreground">
              Aggiungi Agenzia
            </Link>
            <Link href="/admin/gestisci-agenzie" className="text-sm text-muted-foreground hover:text-foreground">
              Gestisci Agenzie
            </Link>
          </nav>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  )
}
