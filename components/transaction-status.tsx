"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, ExternalLink, Copy, Check } from "lucide-react"
import type { TransactionResult } from "./transfer-card"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

type TransactionStatusProps = {
  transaction: TransactionResult
}

export function TransactionStatus({ transaction }: TransactionStatusProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  // Generate explorer URL based on network
  const explorerUrl =
    transaction.network === "testnet"
      ? `https://explorer.aptoslabs.com/txn/${transaction.hash}?network=testnet`
      : `https://explorer.aptoslabs.com/txn/${transaction.hash}?network=mainnet`

  // Truncate transaction hash for display
  const truncatedHash = transaction.hash
    ? `${transaction.hash.slice(0, 10)}...${transaction.hash.slice(-8)}`
    : 'Processing...'

  // Copy transaction hash to clipboard
  const copyToClipboard = async () => {
    if (!transaction.hash) return

    try {
      await navigator.clipboard.writeText(transaction.hash)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Transaction hash copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="phantom-card rounded-2xl p-6 relative overflow-hidden border-[#10B981]/20"
    >
      {/* Success Animation Background */}
      <div className="absolute inset-0 bg-[url('/confetti.png')] opacity-10 pointer-events-none mix-blend-overlay" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

      <div className="flex items-start gap-4 relative z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-12 h-12 rounded-full bg-[#10B981]/20 flex items-center justify-center flex-shrink-0 border border-[#10B981]/30"
        >
          <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
        </motion.div>

        <div className="flex-1 space-y-4">
          <div>
            <motion.h4
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="font-bold text-[#10B981] mb-1 text-lg"
            >
              Transaction Successful!
            </motion.h4>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-gray-400"
            >
              Your tokens have been sent successfully
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3 text-sm bg-[#22232A] rounded-xl p-4 border border-transparent"
          >
            <div className="flex justify-between">
              <span className="text-gray-400">Amount</span>
              <span className="font-medium text-white">{transaction.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Recipient</span>
              <span className="font-mono text-xs text-gray-300">
                {transaction.recipient.slice(0, 10)}...{transaction.recipient.slice(-8)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Fee Paid</span>
              <span className="font-medium text-[#10B981]">{transaction.fee}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Transaction Hash</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-gray-300">{truncatedHash}</span>
                <button
                  onClick={copyToClipboard}
                  className="p-1 hover:bg-[#2A2B35] rounded transition-colors text-gray-400 hover:text-white"
                  title="Copy transaction hash"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-[#10B981]" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button variant="outline" size="sm" className="w-full bg-[#2A2B35] hover:bg-[#32333E] border-0 text-white rounded-xl h-10" asChild>
              <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
                View on Explorer
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
