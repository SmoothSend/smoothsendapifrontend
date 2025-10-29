import { Card } from "@/components/ui/card"
import { CheckCircle2, Zap, DollarSign, Code2 } from "lucide-react"

export function InfoSection() {
  return (
    <div className="space-y-6">
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">How It Works</h3>
        <ol className="space-y-3">
          {[
            "Connect your Petra or Martian wallet",
            "Enter recipient address and amount",
            "Select your token and network",
            "Click send - we handle the gas fees",
            "Transaction confirmed instantly",
          ].map((step, index) => (
            <li key={index} className="flex gap-3 text-sm">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-semibold">
                {index + 1}
              </span>
              <span className="text-muted-foreground leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </Card>

      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Benefits</h3>
        <div className="space-y-3">
          {[
            { icon: CheckCircle2, text: "No gas fees on testnet", color: "text-success" },
            { icon: DollarSign, text: "Fixed $0.01 fee on mainnet", color: "text-primary" },
            { icon: Zap, text: "No APT required in wallet", color: "text-secondary" },
            { icon: Code2, text: "Developer-friendly API", color: "text-primary" },
          ].map((benefit, index) => (
            <div key={index} className="flex items-center gap-3">
              <benefit.icon className={`w-5 h-5 ${benefit.color}`} />
              <span className="text-sm text-muted-foreground">{benefit.text}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="glass-card p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
        <h3 className="text-lg font-semibold mb-2">Ready to Integrate?</h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          Get your API key and start building gasless experiences for your users.
        </p>
        <a
          href="#"
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Get API Key →
        </a>
      </Card>
    </div>
  )
}
