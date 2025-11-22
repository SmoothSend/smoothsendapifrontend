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
          <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
            {/* Left Column: Main Action */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full flex justify-center lg:justify-end"
            >
              <TransferCard />
            </motion.div>

            {/* Right Column: Info & Context */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-8 max-w-md mx-auto lg:mx-0"
            >
              <div className="space-y-4 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                  Send Tokens <br />
                  <span className="text-[#7595FF]">Without Gas Fees</span>
                </h1>
                <p className="text-lg text-gray-400 leading-relaxed">
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
