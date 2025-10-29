"use client"

import { useState, useEffect } from "react"
import { getCoinBalances } from "@/lib/aptos-client"
import type { Token } from "@/components/transfer-form"

export function useAptosBalance(address: string | undefined, network: "testnet" | "mainnet") {
  const [tokens, setTokens] = useState<Token[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBalances = async () => {
    if (!address) return

    setIsLoading(true)
    setError(null)

    try {
      const balances = await getCoinBalances(address, network)

      const DEFAULT_TOKENS: Token[] = [
        { symbol: "APT", name: "Aptos", decimals: 8, assetType: "0x1::aptos_coin::AptosCoin" },
        { symbol: "USDC", name: "USD Coin", decimals: 6, assetType: "0x1::usdc::USDC" },
        { symbol: "USDT", name: "Tether USD", decimals: 6, assetType: "0x1::usdt::USDT" },
      ]

      const tokensWithBalances = DEFAULT_TOKENS.map((token) => {
        const balance = balances.find((b) => b.coin_type === token.assetType)
        return {
          ...token,
          balance: balance ? (Number(balance.amount) / Math.pow(10, token.decimals)).toFixed(token.decimals) : "0",
        }
      })

      setTokens(tokensWithBalances)
    } catch (err) {
      console.error("[v0] Error fetching balances:", err)
      setError("Failed to fetch token balances")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBalances()
  }, [address, network])

  return { tokens, isLoading, error, refetch: fetchBalances }
}
