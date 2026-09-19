import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const publicRoutes = ['/', '/sign-in', '/api/auth', '/api/coach', '/api/meal-analysis', '/privacy', '/terms']

  const isPublic = publicRoutes.some(route =>
    route === '/api/auth'
      ? pathname.startsWith('/api/auth')
      : pathname === route
  )

  if (isPublic) return NextResponse.next()

  const sessionToken = request.cookies.get('next-auth.session-token')?.value
    || request.cookies.get('__Secure-next-auth.session-token')?.value

  if (!sessionToken) {
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json|icons/).*)'],
}
