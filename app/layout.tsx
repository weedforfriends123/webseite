import type { Metadata } from "next"
import { Syne, Space_Grotesk, Space_Mono } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/lib/cart"
import { CartDrawer } from "@/components/CartDrawer"
import { WFFHeader } from "@/components/WFFHeader"
import { WFFFooter } from "@/components/WFFFooter"
import { PageTransition } from "@/components/PageTransition"
import { SmoothScroll } from "@/components/SmoothScroll"
import { LoadingScreen } from "@/components/LoadingScreen"
import { PreLoader } from "@/components/PreLoader"

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600"],
})

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
})

export const metadata: Metadata = {
  title: "Weed For Friends — Sacred Herb. Modern Science.",
  description:
    "Deutschlands #1 für laborgeprüfte Cannabinoide. 5000 Jahre Weisheit. Moderne Reinheit. Diskret. Schnell. Premium.",
  keywords: ["CBD", "Cannabinoide", "laborgeprüft", "HC", "Vape", "Deutschland"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="de"
      className={`${syne.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}
    >
      <head>
        {/* Preload fonts used in loading screen to prevent FOUT on animation */}
        <link rel="preload" as="font" href="/fonts/drinksom/DrukWide-Heavy.woff2" crossOrigin="anonymous" type="font/woff2" />
        <link rel="preload" as="font" href="/fonts/Ekstra-Regular.otf" crossOrigin="anonymous" type="font/otf" />
      </head>
      <body>
        <PreLoader />
        <LoadingScreen />
        <SmoothScroll />
        <CartProvider>
          <PageTransition>
            <WFFHeader />
            {children}
            <WFFFooter />
            <CartDrawer />
          </PageTransition>
        </CartProvider>
      </body>
    </html>
  )
}
