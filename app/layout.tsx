import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { WalletProvider } from "@/lib/wallet-context"
import { WebSocketProvider } from "@/lib/websocket-context"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Showito - Flow NFT Analytics",
  description: "Real-time analytics and insights for the Flow blockchain ecosystem",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        <WalletProvider>
          <WebSocketProvider>
            {children}
          </WebSocketProvider>
        </WalletProvider>
      </body>
    </html>
  )
}
