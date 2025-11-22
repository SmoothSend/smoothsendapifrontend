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
        <Button
          variant="outline"
          className="h-14 w-[120px] phantom-button-secondary border-0 rounded-xl justify-between px-3"
        >
          <span className="flex items-center gap-2">
            {selectedToken.logo ? (
              <img
                src={selectedToken.logo}
                alt={selectedToken.symbol}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-[#7595FF] flex items-center justify-center text-[10px] text-white font-bold">
                {selectedToken.symbol[0]}
              </div>
            )}
            <span className="font-medium">{selectedToken.symbol}</span>
          </span>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-[#18191E] border-[#2A2B35] text-white p-2 rounded-xl shadow-xl">
        {tokens.map((token) => (
          <DropdownMenuItem
            key={token.symbol}
            onClick={() => onSelect(token)}
            className="cursor-pointer focus:bg-[#2A2B35] focus:text-white rounded-lg p-3 mb-1 last:mb-0"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                {token.logo ? (
                  <img
                    src={token.logo}
                    alt={token.symbol}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#2A2B35] flex items-center justify-center text-xs text-white font-bold border border-[#3A3B45]">
                    {token.symbol[0]}
                  </div>
                )}
                <div>
                  <div className="font-medium">{token.symbol}</div>
                  <div className="text-xs text-gray-400">{token.name}</div>
                </div>
              </div>
              {token.balance && (
                <div className="text-right">
                  <div className="text-sm font-mono text-white">{token.balance}</div>
                  <div className="text-[10px] text-gray-500">Balance</div>
                </div>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
