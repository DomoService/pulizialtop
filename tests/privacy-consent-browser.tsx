// Isolated browser fixture, never mounted by the Next app. No real analytics events.
import React from "react"
import { createRoot } from "react-dom/client"
import { CookiePreferences, CookiePreferencesLink } from "../components/cookie-preferences"
createRoot(document.getElementById("root")!).render(<>
  <h1>Collaudo preferenze</h1>
  <CookiePreferencesLink enabled={!location.search.includes("technical")} />
  <CookiePreferences enabled={!location.search.includes("technical")} />
</>)
