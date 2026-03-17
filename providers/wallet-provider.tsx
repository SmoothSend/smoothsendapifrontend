"use client"

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react"
import { Network } from "@aptos-labs/ts-sdk"
import type { ReactNode } from "react"
import { useMemo } from "react"
import { SmoothSendTransactionSubmitter } from "@smoothsend/sdk"

// Get API key from environment
const SMOOTHSEND_API_KEY = process.env.NEXT_PUBLIC_SMOOTHSEND_API_KEY || ''
const NETWORK = (process.env.NEXT_PUBLIC_NETWORK as 'testnet' | 'mainnet') || 'testnet'

/**
 * Wallet Provider - Implements Aptos Wallet Standard (AIP-62) with SmoothSend
 * 
 * GASLESS STRATEGY:
 * - **Testnet**: SDK transactionSubmitter (free gasless via relayer)
 * - **Mainnet**: Script Composer (free, client-side, no credits needed)
 * 
 * Script Composer (mainnet): Deducts fee from the token being transferred
 * SDK Relayer (testnet): Free gasless transactions for testing
 * 
 * Currently Supported Wallets:
 * - Petra Wallet (recommended)
 * 
 * Learn more: https://aptos.dev/standards/wallets
 */
export function WalletProvider({ children }: { children: ReactNode }) {
  // Create transaction submitter for gasless transactions
  // IMPORTANT:
  // - Testnet: enable transactionSubmitter (free)
  // - Mainnet: disable transactionSubmitter to avoid accidental credit deduction
  //           (mainnet demo uses Script Composer fee-in-token flow)
  const transactionSubmitter = useMemo(() => {
    if (NETWORK === 'mainnet') {
      console.log('[WalletProvider] Mainnet: transactionSubmitter disabled (use Script Composer fee-in-token)')
      return undefined
    }

    if (!SMOOTHSEND_API_KEY) {
      console.warn('[WalletProvider] No API key - transactions will require gas')
      return undefined
    }

    console.log(`[WalletProvider] Using SDK transactionSubmitter for ${NETWORK} (gasless)`)
    return new SmoothSendTransactionSubmitter({
      apiKey: SMOOTHSEND_API_KEY,
      network: NETWORK,
      debug: true,
    })
  }, [])

  return (
    <AptosWalletAdapterProvider
      autoConnect={false}
      dappConfig={{
        network: NETWORK === 'mainnet' ? Network.MAINNET : Network.TESTNET,
        transactionSubmitter, // SDK handles gasless conversion automatically
      }}
      onError={(error: any) => {
        console.error("[Wallet Adapter] Error:", error)
        
        // User-friendly error messages
        if (error?.message?.includes('User rejected')) {
          console.log("[Wallet Adapter] User rejected the connection request")
        } else if (error?.message?.includes('not installed')) {
          console.log("[Wallet Adapter] Wallet extension not installed")
        } else {
          console.error("[Wallet Adapter] Unexpected error:", error)
        }
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  )
}
