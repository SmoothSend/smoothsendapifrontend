import Image from "next/image"

export function Header() {
  return (
    <header className="border-b border-border/50 backdrop-blur-sm bg-background/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <picture>
              <source media="(prefers-color-scheme: dark)" srcSet="/Logo Dark.png" />
              <Image 
                src="/Logo Light.png" 
                alt="SmoothSend Logo" 
                width={140} 
                height={32}
                className="h-8 w-auto"
                priority
              />
            </picture>
          </a>

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
