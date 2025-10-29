"use client"

import { Card } from "@/components/ui/card"
import { WalletConnect } from "@/components/wallet-connect"
import { TransferForm } from "@/components/transfer-form"
import { TransactionStatus } from "@/components/transaction-status"
import { APIDisplay } from "@/components/api-display"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { useState } from "react"

export type TransactionResult = {
  hash: string
  amount: string
  recipient: string
  token: string
  fee: string
  network: "testnet" | "mainnet"
}

export type APICall = {
  endpoint: string
  request: any
  response: any
  timestamp: number
}

export function TransferCard() {
  const { connected, account, signTransaction } = useWallet()
  const [transaction, setTransaction] = useState<TransactionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [apiCalls, setApiCalls] = useState<APICall[]>([])

  const handleTransactionSuccess = (result: TransactionResult) => {
    setTransaction(result)
    setError(null)
  }

  const handleTransactionError = (errorMessage: string) => {
    setError(errorMessage)
    setTransaction(null)
  }

  const handleAPICall = (call: APICall) => {
    setApiCalls((prev) => [...prev, call])
  }

  const handleNetworkChange = () => {
    // Clear transaction and error state when network changes
    setTransaction(null)
    setError(null)
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card p-6 space-y-6">
        <WalletConnect />

        {connected && account && (
          <TransferForm
            walletAddress={account.address.toString()}
            onSuccess={handleTransactionSuccess}
            onError={handleTransactionError}
            onAPICall={handleAPICall}
            onNetworkChange={handleNetworkChange}
          />
        )}

        {transaction && <TransactionStatus transaction={transaction} />}
        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive font-medium">{error}</p>
          </div>
        )}
      </Card>

      {apiCalls.length > 0 && <APIDisplay calls={apiCalls} />}
    </div>
  )
}
