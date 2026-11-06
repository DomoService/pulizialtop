"use client"
import { useState } from "react"
import { logoutAdmin } from "@/app/actions"
import { Button } from "@/components/ui/button"
export function SessionLogout({ audience = "agenzia" }: { audience?: "admin" | "agenzia" }) {
  const [busy,setBusy]=useState(false),[error,setError]=useState("")
  async function logout(){
    setBusy(true);setError("")
    try {
      const result=await logoutAdmin()
      if(!result.success){setError("Uscita non riuscita. Riprova.");return}
      // Full navigation drops private client-side route caches as well.
      window.location.assign(`/${audience}/login`)
    } catch {setError("Uscita non riuscita. Riprova.")} finally {setBusy(false)}
  }
  return <div><Button variant="outline" disabled={busy} onClick={logout}>{busy?"Uscita…":"Esci"}</Button>{error&&<p role="alert">{error}</p>}</div>
}
