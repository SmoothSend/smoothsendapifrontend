"use client"

import { Button } from "@/components/ui/button"
import { WalletCards, LogOut, ExternalLink } from "lucide-react"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// ... (existing comments)

export function WalletConnect() {
  const { connect, disconnect, account, connected, wallets } = useWallet()

  /**
   * Truncate Aptos address for display
   * Format: 0x1234...5678
   */
  const truncateAddress = (address: string | undefined) => {
    if (!address || typeof address !== 'string') return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  /**
   * Handle wallet connection
   * Follows Aptos Wallet Standard connect() method
   */
  const handleConnect = async (walletName: string) => {
    try {
      await connect(walletName)
    } catch (error) {
      console.error("[WalletConnect] Connection failed:", error)
      
      // User-friendly error messages
      let errorMessage = 'Unknown error'
      if (error instanceof Error) {
        if (error.message.includes('User rejected')) {
          errorMessage = 'Connection rejected by user'
        } else if (error.message.includes('not installed')) {
          errorMessage = 'Wallet not installed. Please install the wallet extension.'
        } else {
          errorMessage = error.message
        }
      }
      
      alert(`Failed to connect: ${errorMessage}`)
    }
  }

  /**
   * Handle wallet disconnection
   * Follows Aptos Wallet Standard disconnect() method
   */
  const handleDisconnect = async () => {
    try {
      await disconnect()
    } catch (error) {
      console.error("[WalletConnect] Disconnection failed:", error)
    }
  }

  // Connected state - show wallet info
  if (connected && account) {
    return (
      <div className="flex items-center justify-between p-4 rounded-xl bg-[#22232A] border border-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#7595FF]/20 flex items-center justify-center">
            <WalletCards className="w-5 h-5 text-[#7595FF]" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Connected</p>
            <p className="text-xs text-gray-400 font-mono">
              {truncateAddress(account?.address?.toString())}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDisconnect}
          className="text-gray-400 hover:text-white hover:bg-[#2A2B35]"
          title="Disconnect wallet"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  // Disconnected state - show connect button
  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-[#7595FF]/10 flex items-center justify-center border border-[#7595FF]/20 shadow-lg shadow-[#7595FF]/5">
        <WalletCards className="w-8 h-8 text-[#7595FF]" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-white mb-2">Connect Your Wallet</h3>
        <p className="text-sm text-gray-400">
          Connect your Aptos wallet to get started
        </p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="w-full h-12 text-base font-semibold phantom-button rounded-xl"
          >
            <WalletCards className="w-5 h-5 mr-2" />
            Connect Wallet
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          className="w-64"
        >
          {/* List all available wallets (dynamic discovery) */}
          {wallets && wallets.length > 0 ? (
            wallets.map((wallet) => (
              <DropdownMenuItem
                key={wallet.name}
                onClick={() => handleConnect(wallet.name)}
                className="cursor-pointer flex items-center gap-3 p-3 hover:bg-muted"
              >
                {wallet.icon && (
                  <img
                    src={wallet.icon}
                    alt={wallet.name}
                    className="w-6 h-6 rounded"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium">{wallet.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {wallet.readyState === 'Installed' ? 'Installed' : 'Available'}
                  </p>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            // No wallets detected - show installation prompt
            <div className="p-4 text-sm text-muted-foreground text-center space-y-3">
              <p>No wallets detected.</p>
              <p className="text-xs">
                Please install an Aptos wallet extension to continue.
              </p>
              <div className="pt-2 space-y-2">
                <a
                  href="https://petra.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 text-primary hover:underline text-sm"
                >
                  Install Petra Wallet
                  <ExternalLink className="w-3 h-3" />
                </a>
                <p className="text-xs text-muted-foreground">
                  (Recommended for best experience)
                </p>
              </div>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Additional help text */}
      <p className="text-xs text-muted-foreground">
        Supports Petra, Martian, Pontem, and other Aptos wallets
      </p>
    </div>
  )
}
