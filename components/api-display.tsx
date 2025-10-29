"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Copy, Check } from "lucide-react"
import type { APICall } from "./transfer-card"

type APIDisplayProps = {
  calls: APICall[]
}

export function APIDisplay({ calls }: APIDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <Card className="glass-card p-6">
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-center justify-between text-left">
        <h3 className="text-lg font-semibold">API Calls</h3>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-6 space-y-4">
          {calls.map((call, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-primary">{call.endpoint}</span>
                <span className="text-xs text-muted-foreground">{new Date(call.timestamp).toLocaleTimeString()}</span>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-muted-foreground">Request</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(JSON.stringify(call.request, null, 2), index * 2)}
                      className="h-6 px-2"
                    >
                      {copiedIndex === index * 2 ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                  <pre className="p-3 rounded-lg bg-muted/50 border border-border text-xs overflow-x-auto">
                    <code>{JSON.stringify(call.request, null, 2)}</code>
                  </pre>
                </div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-muted-foreground">Response</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(JSON.stringify(call.response, null, 2), index * 2 + 1)}
                      className="h-6 px-2"
                    >
                      {copiedIndex === index * 2 + 1 ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                  <pre className="p-3 rounded-lg bg-muted/50 border border-border text-xs overflow-x-auto">
                    <code>{JSON.stringify(call.response, null, 2)}</code>
                  </pre>
                </div>
              </div>

              {index < calls.length - 1 && <div className="border-t border-border" />}
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
