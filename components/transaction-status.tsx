"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ExternalLink, Copy, Check } from "lucide-react"
import type { TransactionResult } from "./transfer-card"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

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
    <Card className="p-6 bg-success/10 border-success/20">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-6 h-6 text-success" />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <h4 className="font-semibold text-success mb-1">Transaction Successful!</h4>
            <p className="text-sm text-muted-foreground">Your tokens have been sent successfully</p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">{transaction.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recipient</span>
              <span className="font-mono text-xs">
                {transaction.recipient.slice(0, 10)}...{transaction.recipient.slice(-8)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fee Paid</span>
              <span className="font-medium text-success">{transaction.fee}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Transaction Hash</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs">{truncatedHash}</span>
                <button
                  onClick={copyToClipboard}
                  className="p-1 hover:bg-muted rounded transition-colors"
                  title="Copy transaction hash"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-success" />
                  ) : (
                    <Copy className="w-3 h-3 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
            <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
              View on Explorer
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </Card>
  )
}
