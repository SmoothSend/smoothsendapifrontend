"use client"

import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

type NetworkBadgeProps = {
  network: "testnet" | "mainnet"
  onToggle: () => void
}

export function NetworkBadge({ network, onToggle }: NetworkBadgeProps) {
  return (
    <Button variant="outline" size="sm" onClick={onToggle} className="gap-2 bg-transparent">
      <Globe className="w-4 h-4" />
      <span className="capitalize">{network}</span>
    </Button>
  )
}
