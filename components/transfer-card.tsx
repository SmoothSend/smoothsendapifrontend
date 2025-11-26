"use client"

import { Card } from "@/components/ui/card"
import { WalletConnect } from "@/components/wallet-connect"
import { TransferForm, Token } from "@/components/transfer-form"
import { TransactionStatus } from "@/components/transaction-status"
import { WalletBalance } from "@/components/wallet-balance"
import { AssetList } from "@/components/asset-list"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Send as SendIcon } from "lucide-react"
import { getCoinBalances } from "@/lib/aptos-client"

export type TransactionResult = {
  hash: string
  amount: string
  recipient: string
  token: string
  fee: string
  network: "testnet" | "mainnet"
}

// Token config (should match TransferForm - ideally shared)
const TOKEN_CONFIG = [
  { symbol: "USDT", decimals: 6, coingeckoId: "tether", assetType: "0x357b0b74bc833e95a115ad22604854d6b0fca151cecd94111770e5d6ffc9dc2b" },
  { symbol: "USDC", decimals: 6, coingeckoId: "usd-coin", assetType: "0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b" },
  { symbol: "WBTC", decimals: 8, coingeckoId: "wrapped-bitcoin", assetType: "0x68844a0d7f2587e726ad0579f3d640865bb4162c08a4589eeda3f9689ec52a3d" },
  { symbol: "USDe", decimals: 6, coingeckoId: "ethena-usde", assetType: "0xf37a8864fe737eb8ec2c2931047047cbaed1beed3fb0e5b7c5526dafd3b9c2e9" },
  { symbol: "USD1", decimals: 6, coingeckoId: "anzen-usd1", assetType: "0x05fabd1b12e39967a3c24e91b7b8f67719a6dacee74f3c8b9fb7d93e855437d2" },
]

export function TransferCard() {
  const { connected, account } = useWallet()
  const [transaction, setTransaction] = useState<TransactionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<"dashboard" | "send">("dashboard")
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)

  // State for dashboard data
  const [tokens, setTokens] = useState<Token[]>([])
  const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({})

  // Fetch data for dashboard
  useEffect(() => {
    if (connected && account?.address) {
      fetchDashboardData()
    }
  }, [connected, account])

  const fetchDashboardData = async () => {
    // 1. Fetch Balances
    const faAddresses = TOKEN_CONFIG.map(t => t.assetType)
    const balances = await getCoinBalances(account!.address.toString(), "mainnet", faAddresses)

    // 2. Map to Token objects
    const mappedTokens: Token[] = TOKEN_CONFIG.map(config => {
      const balance = balances.find(b => b.asset_type === config.assetType)
      // Use dynamic decimals if available, otherwise fallback to config
      const decimals = balance?.metadata?.decimals ?? config.decimals

      return {
        ...config,
        decimals, // Update with real decimals
        name: config.symbol === "WBTC" ? "Wrapped Bitcoin" : config.symbol === "USDC" ? "USD Coin" : config.symbol, // Simplified naming
        assetType: config.assetType,
        balance: balance ? (Number(balance.amount) / Math.pow(10, decimals)).toString() : "0",
        // Logos handled in AssetList or TransferForm
        logo: config.symbol === "USDT" ? "https://cryptologos.cc/logos/tether-usdt-logo.png?v=029" :
          config.symbol === "USDC" ? "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=029" :
            config.symbol === "WBTC" ? "https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png?v=029" :
              config.symbol === "USDe" ? "https://cryptologos.cc/logos/ethena-usde-usde-logo.png?v=040" :
                config.symbol === "USD1" ? "https://assets.panora.exchange/tokens/aptos/USD1.png" :
                  "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=029" // Fallback
      }
    })
    setTokens(mappedTokens)

    // 3. Fetch Prices
    const ids = TOKEN_CONFIG.map(t => t.coingeckoId).join(',')
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`)
      const data = await response.json()
      const prices: Record<string, number> = {}
      TOKEN_CONFIG.forEach(t => {
        prices[t.symbol] = data[t.coingeckoId]?.usd || (['USDT', 'USDC', 'USDe', 'USD1'].includes(t.symbol) ? 1 : 0)
      })
      setTokenPrices(prices)
    } catch (e) {
      console.error("Failed to fetch prices", e)
    }
  }

  const handleTransactionSuccess = (result: TransactionResult) => {
    setTransaction(result)
    setError(null)
    setView("dashboard") // Return to dashboard on success
    fetchDashboardData() // Refresh data
  }

  const handleTransactionError = (errorMessage: string) => {
    setError(errorMessage)
  }

  const handleNetworkChange = () => {
    setTransaction(null)
    setError(null)
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      {/* Wallet Balance Display (Only show on dashboard) */}
      {/* Wallet Balance Display */}
      <WalletBalance />

      <div className="phantom-card rounded-3xl p-8 space-y-6 relative overflow-hidden backdrop-blur-xl min-h-[500px] flex flex-col">
        {/* Header with Wallet Connect */}
        <div className="flex justify-between items-center">
          {view === "send" && (
            <Button variant="ghost" size="icon" onClick={() => setView("dashboard")} className="rounded-full hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="flex-1 flex justify-center">
            <WalletConnect />
          </div>
          {view === "send" && <div className="w-10" />} {/* Spacer */}
        </div>

        {connected ? (
          view === "dashboard" ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <Button
                  className="flex-1 h-12 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary font-semibold"
                  onClick={() => setView("send")}
                >
                  <SendIcon className="w-4 h-4 mr-2" />
                  Send
                </Button>
                {/* Add Receive/Swap placeholders if needed */}
              </div>

              {/* Asset List */}
              <AssetList
                tokens={tokens}
                tokenPrices={tokenPrices}
                onSelect={(token) => {
                  setSelectedToken(token)
                  setView("send")
                }}
              />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <TransferForm
                walletAddress={account?.address?.toString() || ""}
                onSuccess={handleTransactionSuccess}
                onError={handleTransactionError}
                onNetworkChange={handleNetworkChange}
                initialToken={selectedToken}
              />
            </div>
          )
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground">
            <p>Connect your wallet to manage assets</p>
          </div>
        )}
        {/* Transaction Status */}
        {transaction && (
          <TransactionStatus
            transaction={transaction}
            onClose={() => setTransaction(null)}
          />
        )}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-in fade-in slide-in-from-top-2">
            <p className="text-sm text-red-400 font-medium flex items-center gap-2">
              <span className="text-lg">⚠️</span> {error}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
