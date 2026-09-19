import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const publicRoutes = ['/', '/sign-in', '/api/auth/*', '/api/coach', '/api/meal-analysis', '/privacy', '/terms']

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Allow public routes
  if (publicRoutes.some(route => {
    if (route.endsWith('/*')) {
      return pathname.startsWith(route.slice(0, -2))
    }
    return pathname === route
  })) {
    return NextResponse.next()
  }

  // Redirect unauthenticated users to sign-in
  if (!isLoggedIn) {
    const signInUrl = new URL('/sign-in', req.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json|icons/).*)'],
}
