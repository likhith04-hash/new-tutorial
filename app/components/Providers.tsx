'use client'

import { SessionProvider } from 'next-auth/react'
import { NutritionProvider } from './NutritionContext'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NutritionProvider>
        {children}
      </NutritionProvider>
    </SessionProvider>
  )
}
