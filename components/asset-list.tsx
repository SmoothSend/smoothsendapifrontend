"use client"

import { Token } from "./transfer-form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Send, ArrowUpRight } from "lucide-react"

type AssetListProps = {
    tokens: Token[]
    onSelect: (token: Token) => void
    tokenPrices: Record<string, number>
}

export function AssetList({ tokens, onSelect, tokenPrices }: AssetListProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Your Assets</h3>
            </div>

            <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-2">
                    {tokens.map((token) => {
                        const balance = Number(token.balance || "0")
                        const price = tokenPrices[token.symbol] || 0
                        const usdValue = balance * price

                        return (
                            <Button
                                key={token.symbol}
                                variant="ghost"
                                className="w-full flex items-center justify-between p-4 h-auto hover:bg-white/5 rounded-2xl group transition-all duration-300 border border-transparent hover:border-white/5"
                                onClick={() => onSelect(token)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/5 p-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        {token.logo ? (
                                            <img src={token.logo} alt={token.symbol} className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="w-full h-full rounded-full bg-primary/20" />
                                        )}
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold text-base">{token.name}</div>
                                        <div className="text-xs text-muted-foreground">{token.symbol}</div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="font-semibold text-base">
                                        {balance > 0 ? balance.toLocaleString(undefined, { maximumFractionDigits: 4 }) : "0"}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        ${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                </div>
                            </Button>
                        )
                    })}
                </div>
            </ScrollArea>
        </div>
    )
}
