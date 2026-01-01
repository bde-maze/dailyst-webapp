'use client'

import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useHistory } from '@/hooks/useHistory'
import { cn } from '@/lib/utils'

// Lazy load HistoryModal as it's not critical for initial render
const HistoryModal = lazy(() =>
  import('@/components/HistoryModal').then((mod) => ({
    default: mod.HistoryModal,
  }))
)

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { pastHistory } = useHistory()
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Day' },
    { href: '/week', label: 'Week' },
    { href: '/month', label: 'Month' },
    { href: '/year', label: 'Year' },
  ]

  const handleNavigation = useCallback(
    (targetPath: string) => {
      if (pathname === targetPath) return
      router.push(targetPath)
    },
    [pathname, router]
  )

  useEffect(() => {
    const keyToPath: Record<string, string> = {
      d: '/',
      w: '/week',
      m: '/month',
      y: '/year',
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isTyping =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)

      if (event.metaKey || event.ctrlKey || event.altKey || isTyping) {
        return
      }

      const key = event.key.toLowerCase()

      if (key in keyToPath) {
        handleNavigation(keyToPath[key])
        return
      }

      if (key === 'h') {
        setIsHistoryOpen((prev) => !prev)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [handleNavigation])

  return (
    <header className="sticky top-0 z-10 bg-background">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/images/logo-dailyst.png"
            alt="Dailyst"
            width={150}
            height={150}
            className="h-10 w-10 rounded-full"
            priority
          />
          <h1 className="text-xl font-semibold">Dailyst</h1>
        </Link>

        <div className="flex items-center gap-1">
          <div className="flex items-center space-x-3 mr-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm hover:text-primary transition-colors',
                    isActive && 'text-primary'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
          <Suspense fallback={null}>
            <HistoryModal
              history={pastHistory}
              open={isHistoryOpen}
              onOpenChange={setIsHistoryOpen}
            />
          </Suspense>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
