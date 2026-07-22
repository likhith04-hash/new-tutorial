import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = { title: 'Nourish — Your daily health companion', description: 'AI-powered nutrition tracking' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
