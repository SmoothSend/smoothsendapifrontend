"use client"

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react"
import React from "react"
import { PetraWallet } from "petra-plugin-wallet-adapter"
import type { ReactNode } from "react"
import { useMemo } from "react"

/**
 * Wallet Provider - Implements Aptos Wallet Standard (AIP-62)
 * 
 * This provider sets up wallet integration following the Aptos Wallet Standard.
 * It supports multiple wallets through a plugin architecture, ensuring interoperability
 * and allowing users to choose their preferred wallet.
 * 
 * Currently Supported Wallets:
 * - Petra Wallet (recommended)
 * 
 * To add more wallets (Martian, Pontem, Rise), install their adapter packages:
 * npm install @martianwallet/aptos-wallet-adapter
 * npm install @pontem/wallet-adapter-plugin
 * npm install @rise-wallet/wallet-adapter
 * 
 * Then add them to the wallets array below.
 * 
 * Learn more: https://aptos.dev/standards/wallets
 */
export function WalletProvider({ children }: { children: ReactNode }) {
  // Initialize wallet plugins
  // Following the Aptos Wallet Standard (AIP-62) for interoperability
  const wallets = useMemo(() => [
    new PetraWallet(), // Primary wallet for this demo
    // Add more wallets here as needed:
    // new MartianWallet(),
    // new PontemWallet(),
    // new RiseWallet(),
  ], [])

  // Cast the provider to `any` to avoid stricter prop typing in the demo build
  const AptosProviderAny: any = AptosWalletAdapterProvider as any

  return (
    <AptosProviderAny
      plugins={wallets}
      autoConnect={true}
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
    </AptosProviderAny>
  )
}
