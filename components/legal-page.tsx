import type { ReactNode } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
export function LegalPage({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto max-w-4xl flex-1 space-y-6 px-4 py-12">
        <h1 className="text-4xl font-bold">{title}</h1>
        {children}
      </main>
      <Footer />
    </div>
  )
}
export function LegalSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="space-y-3 text-muted-foreground">
      <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  )
}
export function Missing({ value, label }: { value: string; label: string }) {
  return value ? <span>{value}</span> : null
}
