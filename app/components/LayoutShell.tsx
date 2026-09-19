'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { NutritionProvider } from './NutritionContext'
import Sidebar from './Sidebar'
import SearchModal from './SearchModal'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const isPublic = ['/', '/sign-in', '/onboarding', '/privacy', '/terms'].includes(pathname)
  const isAuth = status === 'authenticated'

  useEffect(() => {
    const handleOpenSearch = () => setSearchOpen(true)
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }

    window.addEventListener('open-search', handleOpenSearch)
    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.removeEventListener('open-search', handleOpenSearch)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Public pages or loading state — show without sidebar
  if (isPublic || status === 'loading') {
    return <NutritionProvider>{children}</NutritionProvider>
  }

  return (
    <NutritionProvider>
      <main className="shell">
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <section className="content">
          {children}
        </section>
        <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      </main>
    </NutritionProvider>
  )
}
