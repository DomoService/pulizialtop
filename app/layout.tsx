import type React from "react"
import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL('https://pulizialtop.it'),
  title: {
    default: "PuliziAlTop - Trova le Migliori Agenzie di Pulizie in Sardegna",
    template: "%s | PuliziAlTop"
  },
  description:
    "Confronta e scegli tra le migliori agenzie di pulizie professionali in Sardegna. Recensioni verificate, valutazioni reali e preventivi gratuiti per casa, ufficio, hotel, B&B e attività commerciali. Servizio in tutta la Sardegna: Cagliari, Sassari, Nuoro, Oristano, Sud Sardegna.",
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
    type: 'website',
    locale: 'it_IT',
    url: 'https://pulizialtop.it',
    siteName: 'PuliziAlTop',
    title: 'PuliziAlTop - Trova le Migliori Agenzie di Pulizie in Sardegna',
    description: 'Confronta agenzie di pulizie professionali in Sardegna. Recensioni verificate e preventivi gratuiti.',
    images: [
      {
        url: '/professional-cleaning-service-team.jpg',
        alt: 'PuliziAlTop - Agenzie di Pulizie in Sardegna',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PuliziAlTop - Agenzie di Pulizie in Sardegna',
    description: 'Trova e confronta le migliori agenzie di pulizie professionali in Sardegna',
    images: ['/professional-cleaning-service-team.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '7OiokNVs39Shew4ERBugHiuVp5Jk8vOCxbKn6Ow2lYs', // Added Google Search Console verification code
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FXSFE7DZCP"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FXSFE7DZCP');
          `}
        </Script>
        
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="f85c5890-ea8c-4676-9de8-dd12e4fea388"
          data-blockingmode="auto"
          data-framework="Next.js"
          data-georegions='{"region":"EU","cbid":"f85c5890-ea8c-4676-9de8-dd12e4fea388"}'
          strategy="beforeInteractive"
        />
        
        <style dangerouslySetInnerHTML={{
          __html: `
            #CybotCookiebotDialog {
              z-index: 9999 !important;
              position: fixed !important;
              bottom: 20px !important;
              left: 20px !important;
              right: 20px !important;
              max-width: 600px !important;
              margin: 0 auto !important;
              box-shadow: 0 10px 40px rgba(0,0,0,0.3) !important;
              animation: slideUp 0.5s ease-out !important;
            }
            @keyframes slideUp {
              from {
                transform: translateY(100px);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }
            #CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll,
            #CybotCookiebotDialogBodyLevelButtonLevelOptinDeclineAll {
              padding: 12px 24px !important;
              font-size: 16px !important;
              min-height: 48px !important;
            }
          `
        }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "PuliziAlTop",
              description: "Directory di agenzie di pulizie e manutenzione in Sardegna",
              url: "https://pulizialtop.it",
            })
          }}
        />
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
