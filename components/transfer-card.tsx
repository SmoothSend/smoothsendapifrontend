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
    <div className="w-full max-w-md mx-auto">
      <div className="phantom-card rounded-2xl p-8 space-y-8 relative overflow-hidden">
        {/* Header with Logo */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-white/5 rounded-2xl flex items-center justify-center shadow-lg shadow-black/20 backdrop-blur-sm border border-white/10">
            <img
              src="/Logo Light.png"
              alt="SmoothSend"
              className="w-12 h-12 object-contain opacity-90"
            />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">SmoothSend</h2>
          <p className="text-gray-400 text-sm">
            Send tokens gasless on Aptos.
            <br />
            Connect your wallet to get started.
          </p>
        </div>

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
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-in fade-in slide-in-from-top-2">
            <p className="text-sm text-red-400 font-medium flex items-center gap-2">
              <span className="text-lg">⚠️</span> {error}
            </p>
          </div>
        )}
      </div>

      {apiCalls.length > 0 && <APIDisplay calls={apiCalls} />}
    </div>
  )
}
