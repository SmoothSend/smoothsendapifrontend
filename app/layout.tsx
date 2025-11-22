import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from "@/components/ui/toaster"
import { WalletProvider } from "@/providers/wallet-provider"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SmoothSend - Gasless Aptos Transfers",
  description: "Send tokens on Aptos without gas fees. Experience the smoothest way to transfer assets on testnet and mainnet.",
  keywords: ["Aptos", "Gasless", "Crypto", "Blockchain", "SmoothSend", "Wallet", "Transfer", "DeFi"],
  openGraph: {
    title: "SmoothSend - Gasless Aptos Transfers",
    description: "Send tokens on Aptos without gas fees. Experience the smoothest way to transfer assets.",
    type: "website",
    url: "https://demo.smoothsend.xyz",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmoothSend - Gasless Aptos Transfers",
    description: "Send tokens on Aptos without gas fees.",
  },
  icons: {
    icon: "/Logo Light.png",
    shortcut: "/Logo Light.png",
    apple: "/Logo Light.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        <WalletProvider>
          <ThemeProvider // Added ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider> {/* Closed ThemeProvider */}
        </WalletProvider>
        <Analytics />
      </body>
    </html>
  )
}
