"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { TokenSelector } from "@/components/token-selector"
import { NetworkBadge } from "@/components/network-badge"
import { Send, Loader2, RefreshCw } from "lucide-react"
import type { TransactionResult } from "./transfer-card"
import { getCoinBalances, parseCoinType } from "@/lib/aptos-client"
import { useToast } from "@/hooks/use-toast"
import { smoothSendClient, handleAPIError } from "@/lib/smoothsend"
import { useWallet } from "@aptos-labs/wallet-adapter-react"

type TransferFormProps = {
  walletAddress: string
  onSuccess: (result: TransactionResult) => void
  onError: (error: string) => void
  onNetworkChange?: () => void
  initialToken?: Token | null // Added prop
}

export type Token = {
  symbol: string
  name: string
  decimals: number
  assetType: string
  balance?: string
  logo?: string
  coingeckoId?: string
}

// Token asset metadata addresses for each network
const TOKEN_ADDRESSES = {
  testnet: {
    USDT: "0x69091fbab5f7d635ee7ac5098cf0c1efbe31d68fec0f2cd565e8d168daf52832", // Using USDC as placeholder
    USDC: "0x69091fbab5f7d635ee7ac5098cf0c1efbe31d68fec0f2cd565e8d168daf52832",
    WBTC: "0x69091fbab5f7d635ee7ac5098cf0c1efbe31d68fec0f2cd565e8d168daf52832", // Using USDC as placeholder
    USDe: "0x69091fbab5f7d635ee7ac5098cf0c1efbe31d68fec0f2cd565e8d168daf52832", // Using USDC as placeholder
    USD1: "0x69091fbab5f7d635ee7ac5098cf0c1efbe31d68fec0f2cd565e8d168daf52832", // Using USDC as placeholder
  },
  mainnet: {
    USDT: "0x357b0b74bc833e95a115ad22604854d6b0fca151cecd94111770e5d6ffc9dc2b",
    USDC: "0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b",
    WBTC: "0x68844a0d7f2587e726ad0579f3d640865bb4162c08a4589eeda3f9689ec52a3d",
    USDe: "0xf37a8864fe737eb8ec2c2931047047cbaed1beed3fb0e5b7c5526dafd3b9c2e9",
    USD1: "0x05fabd1b12e39967a3c24e91b7b8f67719a6dacee74f3c8b9fb7d93e855437d2",
  }
}

const DEFAULT_TOKENS: Token[] = [
  {
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    assetType: TOKEN_ADDRESSES.mainnet.USDT,
    logo: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=029",
    coingeckoId: "tether"
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    assetType: TOKEN_ADDRESSES.mainnet.USDC,
    logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=029",
    coingeckoId: "usd-coin"
  },
  {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    decimals: 8,
    assetType: TOKEN_ADDRESSES.mainnet.WBTC,
    logo: "https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png?v=029",
    coingeckoId: "wrapped-bitcoin"
  },
  {
    symbol: "USDe",
    name: "Ethena USDe",
    decimals: 6,
    assetType: TOKEN_ADDRESSES.mainnet.USDe,
    logo: "https://cryptologos.cc/logos/ethena-usde-usde-logo.png?v=040",
    coingeckoId: "ethena-usde"
  },
  {
    symbol: "USD1",
    name: "World Liberty Financial USD",
    decimals: 6,
    assetType: TOKEN_ADDRESSES.mainnet.USD1,
    logo: "https://assets.panora.exchange/tokens/aptos/USD1.png",
    coingeckoId: "anzen-usd1"
  },
]

export function TransferForm({ walletAddress, onSuccess, onError, onNetworkChange, initialToken }: TransferFormProps) {
  const { account, connected, signTransaction } = useWallet()
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [tokens, setTokens] = useState<Token[]>(DEFAULT_TOKENS)
  // Use initialToken if provided, otherwise default
  const [selectedToken, setSelectedToken] = useState<Token>(initialToken || DEFAULT_TOKENS[0])
  const [network, setNetwork] = useState<"testnet" | "mainnet">("mainnet")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingBalances, setIsFetchingBalances] = useState(false)
  const [feeEstimate, setFeeEstimate] = useState<number | null>(null)
  const [isEstimatingFee, setIsEstimatingFee] = useState(false)
  const [feeEstimateError, setFeeEstimateError] = useState<string | null>(null)
  const [tokenPrice, setTokenPrice] = useState<number | null>(null)
  const { toast } = useToast()

  // Helper function to validate Aptos address
  const validateAddress = (address: string) => {
    return address.startsWith("0x") && address.length === 66
  }

  // Fetch token price from CoinGecko
  const fetchTokenPrice = async (token: Token) => {
    if (!token.coingeckoId) {
      // Fallback for stablecoins if no ID
      if (['USDC', 'USDT', 'USD1', 'USDe'].includes(token.symbol)) {
        setTokenPrice(1)
        return
      }
      setTokenPrice(null)
      return
    }

    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${token.coingeckoId}&vs_currencies=usd`)
      const data = await response.json()
      if (data[token.coingeckoId]?.usd) {
        setTokenPrice(data[token.coingeckoId].usd)
      } else {
        // Fallback for stablecoins
        if (['USDC', 'USDT', 'USD1', 'USDe'].includes(token.symbol)) {
          setTokenPrice(1)
        } else {
          setTokenPrice(null)
        }
      }
    } catch (error) {
      console.warn("Failed to fetch token price:", error)
      // Fallback for stablecoins
      if (['USDC', 'USDT', 'USD1', 'USDe'].includes(token.symbol)) {
        setTokenPrice(1)
      } else {
        setTokenPrice(null)
      }
    }
  }

  // Fetch price when token changes
  useEffect(() => {
    fetchTokenPrice(selectedToken)
  }, [selectedToken])

  // Display fee based on estimate or network default
  const fee = network === "testnet"
    ? "FREE"
    : feeEstimate !== null && typeof feeEstimate === 'number'
      ? (() => {
        // If we have a token price, show fee in token units
        if (tokenPrice && tokenPrice > 0) {
          const feeInToken = feeEstimate / tokenPrice
          // Format with appropriate decimals based on value
          const formattedFee = feeInToken < 0.0001
            ? feeInToken.toExponential(4)
            : feeInToken.toFixed(6)

          return (
            <div className="flex flex-col items-end">
              <span className="font-semibold text-foreground">{formattedFee} {selectedToken.symbol}</span>
              <span className="text-xs text-muted-foreground">(${feeEstimate.toFixed(4)})</span>
            </div>
          )
        }
        return `$${feeEstimate.toFixed(4)}`
      })()
      : isEstimatingFee
        ? "Estimating..."
        : "~$0.01" // Show approximate when not estimated

  // Handle Max Button Click
  const handleMaxClick = () => {
    if (!selectedToken.balance) return

    let maxAmount = Number.parseFloat(selectedToken.balance)

    // For mainnet, we need to reserve some amount for gas
    if (network === "mainnet") {
      // If we have a fee estimate, use it directly (converted to token units approx)
      // Note: feeEstimate is in USD, so this is an approximation if token != USDC
      // For simplicity/safety, we'll stick to a buffer but make it tighter if we have an estimate

      // Better approach: Reserve a fixed "safe" amount of the token itself
      // If it's USDC, $0.02 is 0.02 USDC. If it's APT, it's different.
      // We'll use a conservative 0.02 buffer for now as a "fee" placeholder
      const feeBuffer = 0.02

      maxAmount = Math.max(0, maxAmount - feeBuffer)
    }

    // Format to appropriate decimal places
    // Use floor to avoid rounding up which could exceed balance
    const factor = Math.pow(10, selectedToken.decimals)
    const flooredAmount = Math.floor(maxAmount * factor) / factor

    setAmount(flooredAmount.toFixed(selectedToken.decimals))
  }

  // Validation states
  const amountNum = Number.parseFloat(amount)
  const balanceNum = selectedToken.balance ? Number.parseFloat(selectedToken.balance) : 0
  const hasInsufficientBalance = amount && amountNum > 0 && amountNum > balanceNum
  const hasInvalidAmount = amount && (isNaN(amountNum) || amountNum <= 0)
  const isFormValid = recipient && amount && !hasInvalidAmount && !hasInsufficientBalance && validateAddress(recipient)

  useEffect(() => {
    fetchTokenBalances()
  }, [walletAddress, network])

  // Fee estimation with debouncing
  useEffect(() => {
    // Reset fee estimate when inputs change
    setFeeEstimate(null)
    setFeeEstimateError(null)

    // Only estimate if we have valid inputs
    if (!recipient || !amount || !validateAddress(recipient) || Number.parseFloat(amount) <= 0) {
      return
    }

    // Debounce fee estimation by 500ms
    const timeoutId = setTimeout(async () => {
      setIsEstimatingFee(true)
      setFeeEstimateError(null)

      try {
        // Convert amount to base units (integer string)
        const amountInBaseUnits = Math.round(Number.parseFloat(amount) * Math.pow(10, selectedToken.decimals)).toString()

        const estimateRequest = {
          sender: walletAddress,
          recipient,
          amount: amountInBaseUnits, // Send base units
          assetType: selectedToken.assetType,
          network,
          decimals: selectedToken.decimals,
          symbol: selectedToken.symbol,
        }

        const estimateResponse = await smoothSendClient.estimateFee(estimateRequest)
        setFeeEstimate(estimateResponse.feeInUsd)
      } catch (err) {
        // Handle fee estimation errors gracefully without blocking transaction
        const errorMessage = handleAPIError(err)
        setFeeEstimateError(errorMessage)
        console.warn("[Fee Estimation] Failed:", errorMessage)
      } finally {
        setIsEstimatingFee(false)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [recipient, amount, network, selectedToken, walletAddress])

  const fetchTokenBalances = async () => {
    setIsFetchingBalances(true)
    try {
      // Collect all FA addresses to check
      const currentTokens = DEFAULT_TOKENS.map(token => ({
        ...token,
        assetType: TOKEN_ADDRESSES[network][token.symbol as keyof typeof TOKEN_ADDRESSES.testnet] || token.assetType
      }))
      const faAddresses = currentTokens.map(t => t.assetType)

      const balances = await getCoinBalances(walletAddress, network, faAddresses)

      console.log("[v0] Fetched balances:", balances)

      // Use the correct addresses for the current network
      const currentNetworkTokens = currentTokens

      const tokensWithBalances: Token[] = currentNetworkTokens.map((token) => {
        const balance = balances.find((b) => b.asset_type === token.assetType)
        // Use dynamic decimals if available, otherwise fallback to token config
        const decimals = balance?.metadata?.decimals ?? token.decimals

        return {
          ...token,
          decimals, // Update with real decimals
          balance: balance ? (Number(balance.amount) / Math.pow(10, decimals)).toFixed(decimals) : "0",
        }
      })

      balances.forEach((balance) => {
        const exists = tokensWithBalances.find((t) => t.assetType === balance.asset_type)
        if (!exists && balance.amount !== "0") {
          const symbol = parseCoinType(balance.asset_type)
          const decimals = balance.metadata?.decimals || 8
          tokensWithBalances.push({
            symbol,
            name: symbol,
            decimals,
            assetType: balance.asset_type,
            balance: (Number(balance.amount) / Math.pow(10, decimals)).toFixed(decimals),
          })
        }
      })

      setTokens(tokensWithBalances)

      const updatedSelectedToken = tokensWithBalances.find((t) => t.symbol === selectedToken.symbol)
      if (updatedSelectedToken) {
        setSelectedToken(updatedSelectedToken)
      }

      toast({
        title: "Balances Updated",
        description: `Fetched balances for ${tokensWithBalances.length} tokens`,
      })
    } catch (err) {
      console.error("[v0] Error fetching balances:", err)
      toast({
        title: "Failed to fetch balances",
        description: "Using default token list",
        variant: "destructive",
      })
    } finally {
      setIsFetchingBalances(false)
    }
  }

  const handleNetworkSwitch = () => {
    // Toggle network
    const newNetwork = network === "testnet" ? "mainnet" : "testnet"
    setNetwork(newNetwork)

    // Update asset types for the new network
    const updatedTokens = tokens.map(token => {
      const newAddress = TOKEN_ADDRESSES[newNetwork][token.symbol as keyof typeof TOKEN_ADDRESSES.testnet]
      if (newAddress) {
        return {
          ...token,
          assetType: newAddress
        }
      }
      return token
    })
    setTokens(updatedTokens)
    setSelectedToken(updatedTokens[0])

    // Clear transaction state in parent component
    onNetworkChange?.()

    // Reset fee estimate
    setFeeEstimate(null)
    setFeeEstimateError(null)

    // Show toast notification
    toast({
      title: "Network Switched",
      description: `Switched to ${newNetwork}. Refreshing balances...`,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateAddress(recipient)) {
      onError("Invalid Aptos address. Must start with 0x and be 64 characters.")
      return
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      onError("Please enter a valid amount.")
      return
    }

    if (selectedToken.balance && Number.parseFloat(amount) > Number.parseFloat(selectedToken.balance)) {
      onError(`Insufficient balance. You have ${selectedToken.balance} ${selectedToken.symbol}`)
      return
    }

    setIsLoading(true)

    try {
      // Convert amount to base units (integer string)
      // Use Math.round to handle floating point precision issues (e.g. 1.1 * 1e6 = 1100000.0000000002)
      const amountInBaseUnits = Math.round(Number.parseFloat(amount) * Math.pow(10, selectedToken.decimals)).toString()

      // Call real API to estimate fee
      const estimateRequest = {
        sender: walletAddress,
        recipient,
        amount: amountInBaseUnits, // Send base units (e.g. "1500000" for 1.5 USDC)
        assetType: selectedToken.assetType,
        network,
        decimals: selectedToken.decimals,
        symbol: selectedToken.symbol,
      }

      const estimateResponse = await smoothSendClient.estimateFee(estimateRequest)



      // Validate wallet connection before proceeding
      if (!connected || !account) {
        throw new Error('Wallet is not connected. Please connect your wallet first.')
      }

      if (!signTransaction) {
        throw new Error('Wallet does not support transaction signing')
      }

      // GASLESS TRANSACTION FLOW
      // Mainnet: Use Script Composer (backend builds transaction with fee)
      // Testnet: Use simple transfer (no fee)

      if (network === 'mainnet') {
        // MAINNET: Use Script Composer mode
        console.log('[SmoothSend] Mainnet: Using Script Composer mode...')

        // Step 1: Build transaction on backend (includes fee calculation)
        const txRequest = {
          sender: walletAddress,
          recipient,
          amount: amountInBaseUnits,
          assetType: selectedToken.assetType,
          network,
          decimals: selectedToken.decimals,
          symbol: selectedToken.symbol,
        }

        const buildResponse = await smoothSendClient.sendGaslessTransaction(txRequest)



        if (!buildResponse.success || !buildResponse.transactionBytes) {
          throw new Error(buildResponse.message || 'Failed to build transaction')
        }

        console.log('[SmoothSend] Transaction built with fee:', {
          fee: buildResponse.fee,
          totalAmount: buildResponse.totalAmount,
          feeBreakdown: buildResponse.feeBreakdown
        })

        // Step 2: Deserialize and sign
        const { Deserializer, SimpleTransaction } = await import('@aptos-labs/ts-sdk')
        const txBytes = new Uint8Array(buildResponse.transactionBytes)
        const deserializer = new Deserializer(txBytes)
        const transaction = SimpleTransaction.deserialize(deserializer)

        console.log('[SmoothSend] Signing transaction...')

        const signResponse = await signTransaction({ transactionOrPayload: transaction })

        console.log('[SmoothSend] Sign response:', signResponse)

        if (!signResponse || !signResponse.authenticator) {
          throw new Error('Failed to sign transaction')
        }

        // Step 3: Submit signed transaction
        const authenticatorBytes = signResponse.authenticator.bcsToBytes()

        console.log('[SmoothSend] Submitting signed transaction...')

        const submitResponse = await smoothSendClient.submitSignedTransaction(
          buildResponse.transactionBytes,
          Array.from(authenticatorBytes),
          network  // ✅ Pass network parameter for submission!
        )

        console.log('[SmoothSend] Submit response:', submitResponse)



        if (!submitResponse.success) {
          const errorMsg = submitResponse.message || (submitResponse as any).error || 'Transaction submission failed'
          console.error('[SmoothSend] Submit error:', {
            response: submitResponse,
            message: errorMsg
          })

          // Check if it's a sequence number error
          if ((submitResponse as any).details && (submitResponse as any).details.includes('SEQUENCE_NUMBER_TOO_OLD')) {
            throw new Error('Transaction expired. Please try again - your wallet sequence number changed.')
          }

          throw new Error(`Mainnet transaction failed: ${errorMsg}`)
        }

        console.log('[SmoothSend] ✅ Mainnet transaction successful!', submitResponse)

        // Extract transaction hash and fee
        const txHash = submitResponse.txnHash || submitResponse.hash || 'pending'

        // Calculate fee display from the backend response
        // The fee is in micro-USDC (6 decimals), so divide by 1,000,000
        let feeDisplay = "$0.01" // Default fallback
        if (buildResponse.fee) {
          const feeInUSDC = Number(buildResponse.fee) / 1_000_000
          feeDisplay = `$${feeInUSDC.toFixed(4)}` // Show 4 decimal places for accuracy
        } else if (buildResponse.feeBreakdown?.totalFeeFormatted) {
          feeDisplay = buildResponse.feeBreakdown.totalFeeFormatted
        }

        console.log('[SmoothSend] Fee calculated:', {
          feeRaw: buildResponse.fee,
          feeDisplay,
          feeBreakdown: buildResponse.feeBreakdown
        })

        onSuccess({
          hash: txHash,
          amount: `${amount} ${selectedToken.symbol}`,
          recipient,
          token: selectedToken.symbol,
          fee: feeDisplay,
          network,
        })

      } else {
        // TESTNET: Use simple transfer (no fee, relayer sponsors gas)
        console.log('[SmoothSend] Testnet: Using simple transfer...')

        // Step 1: Initialize Aptos SDK with correct network
        const { Aptos, AptosConfig, Network: AptosNetwork } = await import('@aptos-labs/ts-sdk')

        // Use the correct network based on user selection
        const aptosNetwork = AptosNetwork.TESTNET
        const config = new AptosConfig({ network: aptosNetwork })
        const aptos = new Aptos(config)

        console.log('[SmoothSend] Building transaction with fee payer for', network, '...')

        // Step 2: Build transaction on frontend with withFeePayer flag
        const rawTransaction = await aptos.transaction.build.simple({
          sender: account.address,
          withFeePayer: true, // Critical: This enables gasless transactions
          data: {
            function: selectedToken.symbol === "APT"
              ? "0x1::aptos_account::transfer"
              : "0x1::primary_fungible_store::transfer",
            typeArguments: selectedToken.symbol === "APT"
              ? []
              : ["0x1::fungible_asset::Metadata"],
            functionArguments: selectedToken.symbol === "APT"
              ? [recipient, amountInBaseUnits]
              : [selectedToken.assetType, recipient, amountInBaseUnits]
          }
        })

        console.log('[SmoothSend] Signing transaction...')

        // Step 3: Sign the transaction
        const signResponse = await signTransaction({ transactionOrPayload: rawTransaction })

        if (!signResponse || !signResponse.authenticator) {
          throw new Error('Failed to sign transaction')
        }

        console.log('[SmoothSend] Serializing and submitting...')

        // Step 4: Serialize and submit
        const transactionBytes = rawTransaction.bcsToBytes()
        const authenticatorBytes = signResponse.authenticator.bcsToBytes()

        const submitResponse = await smoothSendClient.submitSignedTransaction(
          Array.from(transactionBytes),
          Array.from(authenticatorBytes)
        )



        if (!submitResponse.success) {
          throw new Error(submitResponse.message || 'Transaction submission failed')
        }

        console.log('[SmoothSend] ✅ Testnet transaction successful!', submitResponse)

        // Extract transaction hash
        const txHash = submitResponse.txnHash || submitResponse.hash || 'pending'

        onSuccess({
          hash: txHash,
          amount: `${amount} ${selectedToken.symbol}`,
          recipient,
          token: selectedToken.symbol,
          fee: "FREE",
          network,
        })
      }



      // Reset form
      setRecipient("")
      setAmount("")

      // Refresh balances after successful transaction
      setTimeout(() => fetchTokenBalances(), 2000)
    } catch (err) {
      // Use handleAPIError utility for user-friendly error messages
      const errorMessage = handleAPIError(err)
      onError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Send Tokens</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={fetchTokenBalances}
            disabled={isFetchingBalances}
            className="text-muted-foreground hover:text-foreground hover:bg-accent transition-colors h-8 w-8 p-0 rounded-full"
          >
            <RefreshCw className={`w-4 h-4 ${isFetchingBalances ? "animate-spin" : ""}`} />
          </Button>
          <NetworkBadge
            network={network}
            onToggle={handleNetworkSwitch}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recipient" className="sr-only">Recipient Address</Label>
          <Textarea
            id="recipient"
            placeholder="Recipient Address (0x...)"
            value={recipient}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRecipient(e.target.value)}
            className="phantom-input min-h-[80px] rounded-xl px-4 py-3 font-mono text-sm bg-input/50 focus:bg-input transition-colors resize-none"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount" className="sr-only">Amount</Label>
          <div className="flex gap-3">
            <div className="relative flex-1 group">
              <Input
                id="amount"
                type="text"
                inputMode="decimal"
                pattern="[0-9]*\.?[0-9]*"
                placeholder="0.00"
                value={amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  // Allow decimals and handle input validation
                  const value = e.target.value
                  // Only allow numbers and one decimal point
                  if (value === '' || /^\d*\.?\d*$/.test(value)) {
                    setAmount(value)
                  }
                }}
                className={`phantom-input h-14 rounded-xl px-4 text-lg font-medium bg-input/50 focus:bg-input transition-colors ${hasInsufficientBalance || hasInvalidAmount ? "border-destructive/50 focus:border-destructive" : ""}`}
                required
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleMaxClick}
                  className="text-xs font-bold text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 px-2 py-1 rounded transition-colors"
                >
                  MAX
                </button>
                <span className="text-sm text-muted-foreground pointer-events-none">
                  {selectedToken.symbol}
                </span>
              </div>
            </div>
            <TokenSelector tokens={tokens} selectedToken={selectedToken} onSelect={setSelectedToken} />
          </div>

          <div className="flex justify-between px-2 text-xs">
            {selectedToken.balance && (
              <p className="text-muted-foreground">
                Balance: <span className="text-foreground font-medium">{selectedToken.balance} {selectedToken.symbol}</span>
              </p>
            )}
            {hasInsufficientBalance && (
              <p className="text-destructive font-medium">
                Insufficient balance
              </p>
            )}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-accent/50 border border-transparent">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Network Fee</span>
            <div className="flex items-center gap-2">
              {isEstimatingFee ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground text-xs">Estimating...</span>
                </>
              ) : (
                <span className={`font-semibold ${network === "testnet" || fee === "FREE" ? "text-green-500 dark:text-green-400" : "text-foreground"}`}>
                  {fee}
                </span>
              )}
            </div>
          </div>
          {feeEstimateError && (
            <p className="text-xs text-yellow-500 mt-2 flex items-center gap-1">
              <span>⚠️</span> {feeEstimateError}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading || !isFormValid}
        className="w-full h-14 text-base font-semibold phantom-button rounded-xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Send {amount ? `${amount} ${selectedToken.symbol}` : "Tokens"}
          </>
        )}
      </Button>
    </form>
  )
}
