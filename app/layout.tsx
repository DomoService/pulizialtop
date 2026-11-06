import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { CookiePreferences } from "@/components/cookie-preferences"
import { getLegalSettings } from "@/lib/legal/data"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://pulizialtop.it"),
  title: {
    default: "PuliziAlTop - Trova le Migliori Agenzie di Pulizie in Sardegna",
    template: "%s | PuliziAlTop",
  },
  description:
    "Confronta e scegli tra le migliori agenzie di pulizie professionali in Sardegna. Recensioni moderate, valutazioni reali e preventivi gratuiti per casa, ufficio, hotel, B&B e attività commerciali. Servizio in tutta la Sardegna: Cagliari, Sassari, Nuoro, Oristano, Sud Sardegna.",
  keywords: [
    "agenzie pulizie Sardegna",
    "imprese pulizie Cagliari",
    "servizi pulizie Sassari",
    "pulizie professionali Nuoro",
    "pulizie uffici Sardegna",
    "pulizie casa Cagliari",
    "pulizie hotel Sardegna",
    "pulizie B&B",
    "pulizie condomini",
    "manutenzione Sardegna",
    "recensioni agenzie pulizie",
    "preventivo pulizie",
  ],
  authors: [{ name: "PuliziAlTop" }],
  creator: "PuliziAlTop",
  publisher: "PuliziAlTop",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://pulizialtop.it",
    siteName: "PuliziAlTop",
    title: "PuliziAlTop - Trova le Migliori Agenzie di Pulizie in Sardegna",
    description:
      "Confronta agenzie di pulizie professionali in Sardegna. Recensioni moderate e preventivi gratuiti.",
    images: [
      {
        url: "/professional-cleaning-service-team.jpg",
        alt: "PuliziAlTop - Agenzie di Pulizie in Sardegna",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PuliziAlTop - Agenzie di Pulizie in Sardegna",
    description:
      "Trova e confronta le migliori agenzie di pulizie professionali in Sardegna",
    images: ["/professional-cleaning-service-team.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "7OiokNVs39Shew4ERBugHiuVp5Jk8vOCxbKn6Ow2lYs", // Added Google Search Console verification code
  },
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { settings } = await getLegalSettings()
  return (
    <html lang="it">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "PuliziAlTop",
              description:
                "Directory di agenzie di pulizie e manutenzione in Sardegna",
              url: "https://pulizialtop.it",
            }),
          }}
        />
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
        <a
          href="#contenuto-principale"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded focus:bg-background focus:p-3"
        >
          Salta al contenuto
        </a>
        <div id="contenuto-principale" tabIndex={-1}>
          {children}
        </div>
        <CookiePreferences enabled={settings.analyticsEnabled} />
      </body>
    </html>
  )
}
