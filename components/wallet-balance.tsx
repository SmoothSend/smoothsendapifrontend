"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { getCoinBalances, parseCoinType } from "@/lib/aptos-client"
import { Loader2, Wallet } from "lucide-react"

// Token configuration (matching TransferForm)
const TOKENS = [
    { symbol: "USDT", decimals: 6, coingeckoId: "tether", assetType: "0x357b0b74bc833e95a115ad22604854d6b0fca151cecd94111770e5d6ffc9dc2b" },
    { symbol: "USDC", decimals: 6, coingeckoId: "usd-coin", assetType: "0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b" },
    { symbol: "WBTC", decimals: 8, coingeckoId: "wrapped-bitcoin", assetType: "0x68844a0d7f2587e726ad0579f3d640865bb4162c08a4589eeda3f9689ec52a3d" },
    { symbol: "USDe", decimals: 6, coingeckoId: "ethena-usde", assetType: "0xf37a8864fe737eb8ec2c2931047047cbaed1beed3fb0e5b7c5526dafd3b9c2e9" },
    { symbol: "USD1", decimals: 6, coingeckoId: "anzen-usd1", assetType: "0x05fabd1b12e39967a3c24e91b7b8f67719a6dacee74f3c8b9fb7d93e855437d2" },
]

export function WalletBalance() {
    const { account, connected, network } = useWallet() // Get network from wallet
    const [totalBalance, setTotalBalance] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (connected && account?.address) {
            fetchTotalBalance()
        }
    }, [connected, account, network]) // Re-fetch on network change

    const fetchTotalBalance = async () => {
        setIsLoading(true)
        try {
            // 1. Fetch balances for all tokens
            const faAddresses = TOKENS.map(t => t.assetType)
            // Use current network name if available, otherwise default to mainnet
            const currentNetwork = network?.name?.toLowerCase().includes("testnet") ? "testnet" : "mainnet"
            const balances = await getCoinBalances(account!.address.toString(), currentNetwork, faAddresses)

            console.log("[WalletBalance] Fetched balances:", balances)

            // 2. Fetch prices
            const ids = TOKENS.map(t => t.coingeckoId).join(',')
            const priceResponse = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`)
            const prices = await priceResponse.json()

            // 3. Calculate total
            let total = 0

            for (const token of TOKENS) {
                // Find balance for this token
                const tokenBalance = balances.find(b => b.asset_type === token.assetType)

                if (tokenBalance) {
                    // Use dynamic decimals if available, otherwise fallback to token config
                    const decimals = tokenBalance.metadata?.decimals ?? token.decimals
                    const amount = Number(tokenBalance.amount) / Math.pow(10, decimals)
                    const price = prices[token.coingeckoId]?.usd || (['USDT', 'USDC', 'USDe', 'USD1'].includes(token.symbol) ? 1 : 0)
                    total += amount * price
                }
            }

            setTotalBalance(total)
        } catch (error) {
            console.error("Failed to fetch wallet balance:", error)
        } finally {
            setIsLoading(false)
        }
    }

    if (!connected) return null

    return (
        <div className="flex flex-col items-center justify-center py-6 space-y-2 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium uppercase tracking-wider">
                <Wallet className="w-4 h-4" />
                <span>Total Balance</span>
            </div>
            <div className="text-5xl md:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
                {isLoading ? (
                    <Loader2 className="w-12 h-12 animate-spin text-white/20" />
                ) : (
                    `$${(totalBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                )}
            </div>
        </div>
    )
}
