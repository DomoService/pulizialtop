import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-1">
          <span className="text-2xl font-bold">
            <span className="text-blue-600">Pulizi</span>
            <span className="text-orange-500">Al</span>
            <span className="text-blue-600">Top</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link
            href="/#agenzie"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Trova Agenzie
          </Link>
          <Link
            href="/come-funziona"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Come Funziona
          </Link>
          <Link
            href="/per-agenzie"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Sei un'Agenzia?
          </Link>
          <Link
            href="/contattaci"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Contattaci
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="hidden lg:flex">
            <Link href="/registrazione-agenzia">Registra Agenzia</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/agenzia/login">Accedi</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
