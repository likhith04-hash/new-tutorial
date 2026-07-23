'use client'

import { useState } from 'react'
import { NutritionProvider } from './NutritionContext'
import Sidebar from './Sidebar'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <NutritionProvider>
      <main className="shell">
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <section className="content">
          {children}
        </section>
      </main>
    </NutritionProvider>
  )
}
