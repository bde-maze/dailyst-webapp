'use client'

import { ExternalLink, Coffee } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-sm text-muted-foreground">
          <Link
            href="https://tally.so/r/rjjPzv"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <span>Feature requests & Contact</span>
            <ExternalLink className="size-3.5" />
          </Link>

          <span className="hidden md:inline">•</span>

          <span>Made in France {currentYear}</span>

          <span className="hidden md:inline">•</span>

          <Link
            href="https://buymeacoffee.com/barthelemy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <Coffee className="size-3.5" />
            <span>Buy me a coffee</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
