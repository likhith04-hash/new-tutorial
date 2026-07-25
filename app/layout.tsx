import type { Metadata, Viewport } from 'next'
import './globals.css'
import LayoutShell from './components/LayoutShell'

export const metadata: Metadata = {
  title: {
    default: 'Nourish AI — Your daily health & nutrition companion',
    template: '%s | Nourish AI',
  },
  description: 'AI-powered nutrition tracking, proactive coaching, and daily macro analytics to reach your wellness goals.',
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'Nourish AI',
    statusBarStyle: 'default',
  },
}

export const viewport: Viewport = {
  themeColor: '#314f49',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  )
}
