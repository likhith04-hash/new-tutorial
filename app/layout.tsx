import type { Metadata } from 'next'
import './globals.css'
import LayoutShell from './components/LayoutShell'

export const metadata: Metadata = {
  title: 'Nourish — Your daily health companion',
  description: 'AI-powered nutrition tracking and coaching to help you eat better, stay hydrated, and reach your wellness goals.',
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
