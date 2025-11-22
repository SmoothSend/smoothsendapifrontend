"use client"

import { CheckCircle2, Zap, DollarSign, Code2 } from "lucide-react"
import { motion } from "framer-motion"

export function InfoSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0 }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item} className="phantom-card rounded-2xl p-6 relative overflow-hidden group hover:border-[#7595FF]/30 transition-colors">
        <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
          <span className="w-1 h-6 bg-[#7595FF] rounded-full" />
          How It Works
        </h3>
        <ol className="space-y-4">
          {[
            "Connect your Petra or Martian wallet",
            "Enter recipient address and amount",
            "Select your token and network",
            "Click send - we handle the gas fees",
            "Transaction confirmed instantly",
          ].map((step, index) => (
            <li key={index} className="flex gap-4 text-sm group/item">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2A2B35] text-[#7595FF] flex items-center justify-center text-xs font-bold group-hover/item:bg-[#7595FF] group-hover/item:text-white transition-colors">
                {index + 1}
              </span>
              <span className="text-gray-400 group-hover/item:text-gray-200 transition-colors leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </motion.div>

      <motion.div variants={item} className="phantom-card rounded-2xl p-6 relative overflow-hidden group hover:border-[#7595FF]/30 transition-colors">
        <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
          <span className="w-1 h-6 bg-[#163188] rounded-full" />
          Benefits
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {[
            { icon: CheckCircle2, text: "No gas fees on testnet", color: "text-green-400" },
            { icon: DollarSign, text: "Fixed $0.01 fee on mainnet", color: "text-[#7595FF]" },
            { icon: Zap, text: "No APT required in wallet", color: "text-yellow-400" },
            { icon: Code2, text: "Developer-friendly API", color: "text-purple-400" },
          ].map((benefit, index) => (
            <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2A2B35] transition-colors">
              <benefit.icon className={`w-5 h-5 ${benefit.color}`} />
              <span className="text-sm text-gray-300 font-medium">{benefit.text}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item} className="phantom-card rounded-2xl p-6 bg-gradient-to-br from-[#163188]/20 to-[#7595FF]/10 border-[#7595FF]/20 relative overflow-hidden">
        <h3 className="text-lg font-bold mb-2 text-white">Ready to Integrate?</h3>
        <p className="text-sm text-gray-300 mb-4 leading-relaxed">
          Get your API key and start building gasless experiences for your users.
        </p>
        <a
          href="https://dashboard.smoothsend.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-bold text-[#7595FF] hover:text-white transition-colors"
        >
          Get API Key →
        </a>
      </motion.div>
    </motion.div>
  )
}
