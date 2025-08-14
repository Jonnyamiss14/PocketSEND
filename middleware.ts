import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Update user session
  const response = await updateSession(request)
  
  const { pathname } = request.nextUrl
  
  // Allow access to auth routes and API routes
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/candidate-login') ||
    pathname.startsWith('/api/auth') ||
    pathname === '/'
  ) {
    return response
  }

  // Check if user is authenticated for protected routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/portal')) {
    const supabaseResponse = await fetch(
      new URL('/api/auth/user', request.url),
      {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      }
    ).catch(() => null)

    if (!supabaseResponse?.ok) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes that don't require auth
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
