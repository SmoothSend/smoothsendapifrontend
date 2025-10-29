"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import type { Token } from "./transfer-form"

type TokenSelectorProps = {
  tokens: Token[]
  selectedToken: Token
  onSelect: (token: Token) => void
}

export function TokenSelector({ tokens, selectedToken, onSelect }: TokenSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-32 bg-transparent">
          {selectedToken.symbol}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {tokens.map((token) => (
          <DropdownMenuItem key={token.symbol} onClick={() => onSelect(token)} className="cursor-pointer">
            <div className="flex items-center justify-between w-full">
              <div>
                <div className="font-medium">{token.symbol}</div>
                <div className="text-xs text-muted-foreground">{token.name}</div>
              </div>
              {token.balance && <div className="text-xs text-muted-foreground font-mono">{token.balance}</div>}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
