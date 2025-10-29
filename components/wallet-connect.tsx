"use client"

import { Button } from "@/components/ui/button"
import { Wallet, LogOut } from "lucide-react"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function WalletConnect() {
  const { connect, disconnect, account, connected, wallets } = useWallet()

  const truncateAddress = (address: string | undefined) => {
    if (!address || typeof address !== 'string') return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const handleConnect = async (walletName: string) => {
    try {
      await connect(walletName)
    } catch (error) {
      console.error("[v0] Failed to connect wallet:", error)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
    } catch (error) {
      console.error("[v0] Failed to disconnect wallet:", error)
    }
  }

  if (connected && account) {
    return (
      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">Connected</p>
            <p className="text-xs text-muted-foreground font-mono">{truncateAddress(account?.address?.toString())}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDisconnect}
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
        <Wallet className="w-8 h-8 text-primary-foreground" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
        <p className="text-sm text-muted-foreground">Connect Petra or Martian wallet to get started</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-64">
          {wallets?.map((wallet) => (
            <DropdownMenuItem
              key={wallet.name}
              onClick={() => handleConnect(wallet.name)}
              className="cursor-pointer flex items-center gap-3 p-3"
            >
              {wallet.icon && <img src={wallet.icon || "/placeholder.svg"} alt={wallet.name} className="w-6 h-6" />}
              <span className="font-medium">{wallet.name}</span>
            </DropdownMenuItem>
          ))}
          {(!wallets || wallets.length === 0) && (
            <div className="p-3 text-sm text-muted-foreground text-center">
              No wallets detected. Please install Petra or Martian wallet.
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
