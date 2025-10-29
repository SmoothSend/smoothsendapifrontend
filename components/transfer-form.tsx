"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TokenSelector } from "@/components/token-selector"
import { NetworkBadge } from "@/components/network-badge"
import { Send, Loader2, RefreshCw } from "lucide-react"
import type { TransactionResult, APICall } from "./transfer-card"
import { getCoinBalances, parseCoinType } from "@/lib/aptos-client"
import { useToast } from "@/hooks/use-toast"
import { smoothSendClient, handleAPIError } from "@/lib/smoothsend"
import { useWallet } from "@aptos-labs/wallet-adapter-react"

type TransferFormProps = {
  walletAddress: string
  onSuccess: (result: TransactionResult) => void
  onError: (error: string) => void
  onAPICall: (call: APICall) => void
  onNetworkChange?: () => void
}

export type Token = {
  symbol: string
  name: string
  decimals: number
  assetType: string
  balance?: string
}

// USDC asset metadata addresses for each network
const USDC_ADDRESSES = {
  testnet: "0x69091fbab5f7d635ee7ac5098cf0c1efbe31d68fec0f2cd565e8d168daf52832",
  mainnet: "0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b"
}

const DEFAULT_TOKENS: Token[] = [
  { symbol: "USDC", name: "USD Coin", decimals: 6, assetType: USDC_ADDRESSES.testnet },
]

export function TransferForm({ walletAddress, onSuccess, onError, onAPICall, onNetworkChange }: TransferFormProps) {
  const { account, connected, signTransaction } = useWallet()
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [tokens, setTokens] = useState<Token[]>(DEFAULT_TOKENS)
  const [selectedToken, setSelectedToken] = useState<Token>(DEFAULT_TOKENS[0])
  const [network, setNetwork] = useState<"testnet" | "mainnet">("testnet")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingBalances, setIsFetchingBalances] = useState(false)
  const [feeEstimate, setFeeEstimate] = useState<number | null>(null)
  const [isEstimatingFee, setIsEstimatingFee] = useState(false)
  const [feeEstimateError, setFeeEstimateError] = useState<string | null>(null)
  const { toast } = useToast()

  // Helper function to validate Aptos address
  const validateAddress = (address: string) => {
    return address.startsWith("0x") && address.length === 66
  }

  // Display fee based on estimate or network default
  const fee = feeEstimate !== null && typeof feeEstimate === 'number'
    ? (feeEstimate === 0 ? "FREE" : `$${feeEstimate.toFixed(2)}`)
    : (network === "testnet" ? "FREE" : "$0.01")

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
        const estimateRequest = {
          sender: walletAddress,
          recipient,
          amount,
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
      const balances = await getCoinBalances(walletAddress, network)

      console.log("[v0] Fetched balances:", balances)

      // Use the correct USDC address for the current network
      const currentNetworkTokens = [
        { symbol: "USDC", name: "USD Coin", decimals: 6, assetType: USDC_ADDRESSES[network] }
      ]

      const tokensWithBalances = currentNetworkTokens.map((token) => {
        const balance = balances.find((b) => b.asset_type === token.assetType)
        return {
          ...token,
          balance: balance ? (Number(balance.amount) / Math.pow(10, token.decimals)).toFixed(token.decimals) : "0",
        }
      })

      balances.forEach((balance) => {
        const exists = tokensWithBalances.find((t) => t.assetType === balance.asset_type)
        if (!exists && balance.amount !== "0") {
          const symbol = parseCoinType(balance.asset_type)
          tokensWithBalances.push({
            symbol,
            name: symbol,
            decimals: balance.metadata?.decimals || 8,
            assetType: balance.asset_type,
            balance: (Number(balance.amount) / Math.pow(10, balance.metadata?.decimals || 8)).toFixed(
              balance.metadata?.decimals || 8,
            ),
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

    // Update USDC asset type for the new network
    const updatedTokens = tokens.map(token => {
      if (token.symbol === "USDC") {
        return {
          ...token,
          assetType: USDC_ADDRESSES[newNetwork]
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
      // Call real API to estimate fee
      const estimateRequest = {
        sender: walletAddress,
        recipient,
        amount,
        assetType: selectedToken.assetType,
        network,
        decimals: selectedToken.decimals,
        symbol: selectedToken.symbol,
      }

      const estimateResponse = await smoothSendClient.estimateFee(estimateRequest)

      onAPICall({
        endpoint: "POST /api/v1/relayer/estimate-fee",
        request: estimateRequest,
        response: estimateResponse,
        timestamp: Date.now(),
      })

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

      const amountInBaseUnits = (Number.parseFloat(amount) * Math.pow(10, selectedToken.decimals)).toString()

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

        onAPICall({
          endpoint: "POST /api/v1/relayer/gasless-transaction (Script Composer build)",
          request: txRequest,
          response: buildResponse,
          timestamp: Date.now(),
        })

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

        console.log('[SmoothSend] Authenticator bytes length:', authenticatorBytes.length)
        console.log('[SmoothSend] Transaction bytes length:', buildResponse.transactionBytes.length)

        const submitResponse = await smoothSendClient.submitSignedTransaction(
          buildResponse.transactionBytes,
          Array.from(authenticatorBytes)
        )

        onAPICall({
          endpoint: "POST /api/v1/relayer/gasless-transaction (Script Composer submit)",
          request: { transactionBytes: '...', authenticatorBytes: '...' },
          response: submitResponse,
          timestamp: Date.now(),
        })

        if (!submitResponse.success) {
          const errorMsg = submitResponse.message || submitResponse.error || 'Transaction submission failed'
          console.error('[SmoothSend] Mainnet submit error:', submitResponse)
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

        // Step 1: Initialize Aptos SDK
        const { Aptos, AptosConfig, Network: AptosNetwork } = await import('@aptos-labs/ts-sdk')
        const config = new AptosConfig({ network: AptosNetwork.TESTNET })
        const aptos = new Aptos(config)

        console.log('[SmoothSend] Building transaction with fee payer...')

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

        onAPICall({
          endpoint: "POST /api/v1/relayer/gasless-transaction (Testnet submit)",
          request: { transactionBytes: '...', authenticatorBytes: '...' },
          response: submitResponse,
          timestamp: Date.now(),
        })

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
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Send Tokens</h3>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={fetchTokenBalances}
            disabled={isFetchingBalances}
            className="text-muted-foreground hover:text-foreground"
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
          <Label htmlFor="recipient">Recipient Address</Label>
          <Input
            id="recipient"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="font-mono text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="flex gap-2">
            <Input
              id="amount"
              type="number"
              step="any"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`flex-1 ${hasInsufficientBalance || hasInvalidAmount ? "border-destructive focus-visible:ring-destructive" : ""}`}
              required
            />
            <TokenSelector tokens={tokens} selectedToken={selectedToken} onSelect={setSelectedToken} />
          </div>
          {selectedToken.balance && (
            <p className="text-xs text-muted-foreground">
              Balance: {selectedToken.balance} {selectedToken.symbol}
            </p>
          )}
          {hasInsufficientBalance && (
            <p className="text-xs text-destructive">
              Insufficient balance. You have {selectedToken.balance} {selectedToken.symbol}
            </p>
          )}
          {hasInvalidAmount && (
            <p className="text-xs text-destructive">
              Please enter a valid amount greater than 0
            </p>
          )}
        </div>

        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Network Fee</span>
            <div className="flex items-center gap-2">
              {isEstimatingFee ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground text-xs">Estimating...</span>
                </>
              ) : (
                <span className={`font-semibold ${network === "testnet" || fee === "FREE" ? "text-success" : "text-foreground"}`}>
                  {fee}
                </span>
              )}
            </div>
          </div>
          {feeEstimateError && (
            <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-2">
              ⚠️ Fee estimation failed: {feeEstimateError}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading || !isFormValid}
        className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Send Tokens
          </>
        )}
      </Button>
    </form>
  )
}
