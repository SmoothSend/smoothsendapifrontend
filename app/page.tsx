import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TransferCard } from "@/components/transfer-card"
import { InfoSection } from "@/components/info-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative flex-1">
        <Header />

        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              <span className="gradient-text">Send Tokens</span>
              <br />
              <span className="text-foreground">Without Gas Fees</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Experience gasless token transfers on Aptos. Free on testnet, $0.01 on mainnet.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <TransferCard />
            <InfoSection />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
