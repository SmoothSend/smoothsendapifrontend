"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TransferCard } from "@/components/transfer-card"
import { InfoSection } from "@/components/info-section"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <main className="min-h-screen mesh-gradient flex flex-col relative font-sans text-[#EAECF2]">
      <div className="relative flex-1 flex flex-col">
        <Header />

        <div className="container mx-auto px-4 py-12 flex-1 flex flex-col items-center justify-center gap-12 max-w-6xl">
          <div className="flex flex-col items-center gap-24 w-full">
            {/* Hero Section: Transfer Card Only */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full flex justify-center"
            >
              <TransferCard />
            </motion.div>

            {/* Info Section: Below the fold */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-4xl space-y-16 text-center"
            >
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                  Send Tokens <br />
                  <span className="text-primary">Without Gas Fees</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  Experience the smoothest way to send assets on Aptos.
                  No gas required on testnet, just pennies on mainnet.
                </p>
              </div>

              <InfoSection />
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
