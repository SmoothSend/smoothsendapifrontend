import { Github, Twitter, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/50 backdrop-blur-sm bg-background/50 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">SmoothSend</h3>
            <p className="text-sm text-muted-foreground">
              Gasless transactions made simple. No APT needed, just send.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://docs.smoothsend.xyz" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a 
                  href="https://dashboard.smoothsend.xyz" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/SmoothSend/smoothsendapifrontend" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a 
                  href="https://smoothsend.xyz" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Website
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Connect</h4>
            <div className="flex gap-4">
              <a 
                href="https://github.com/SmoothSend/smoothsendapifrontend" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://x.com/smoothsend" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://discord.smoothsend.xyz" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Discord"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              <a 
                href="mailto:contact@smoothsend.xyz"
                className="hover:text-foreground transition-colors"
              >
                contact@smoothsend.xyz
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SmoothSend. Built with ❤️ for the Aptos ecosystem.</p>
        </div>
      </div>
    </footer>
  )
}
