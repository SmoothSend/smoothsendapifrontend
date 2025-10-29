import { Zap } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border/50 backdrop-blur-sm bg-background/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">SmoothSend</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a 
              href="https://docs.smoothsend.xyz" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Documentation
            </a>
            <a 
              href="https://dashboard.smoothsend.xyz" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </a>
            <a 
              href="https://github.com/SmoothSend/smoothsendapifrontend" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
