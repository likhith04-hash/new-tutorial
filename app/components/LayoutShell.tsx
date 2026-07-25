'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { NutritionProvider } from './NutritionContext'
import Sidebar from './Sidebar'
import SearchModal from './SearchModal'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  // Redirect to home (landing page) on browser refresh on subpages
  useEffect(() => {
    if (pathname !== '/') {
      const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
      const isReload = navEntries.length > 0 && navEntries[0].type === 'reload'
      const isLegacyReload = typeof window !== 'undefined' && window.performance && (window.performance as any).navigation?.type === 1
      const isDirectOrRefresh = !sessionStorage.getItem('nourish_spa_nav')

      if (isReload || isLegacyReload || isDirectOrRefresh) {
        sessionStorage.setItem('nourish_spa_nav', 'true')
        router.replace('/')
      }
    } else {
      sessionStorage.setItem('nourish_spa_nav', 'true')
    }
  }, [pathname, router])

  // Clear SPA flag on browser unload so refresh triggers redirect
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('nourish_spa_nav')
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

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

  const isLandingPage = pathname === '/'

  return (
    <NutritionProvider>
      {isLandingPage ? (
        children
      ) : (
        <main className="shell">
          <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
          <section className="content">
            {children}
          </section>
          <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
        </main>
      )}
    </NutritionProvider>
  )
}
