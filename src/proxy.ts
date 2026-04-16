import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// In-memory rate limit map (resets on cold start — good enough for edge)
const rateLimitMap = new Map<string, { count: number; ts: number }>()
const RATE_WINDOW_MS = 60_000 // 1 minute
const MAX_AUTH_REQUESTS = 30  // admin/dashboard: generous limit
const MAX_API_REQUESTS = 10   // protect API endpoints

export function rateLimit(ip: string, maxRequests: number): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)
  if (record && now - record.ts < RATE_WINDOW_MS) {
    if (record.count >= maxRequests) return false
    record.count++
  } else {
    rateLimitMap.set(ip, { count: 1, ts: now })
  }
  return true
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = (request.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0].trim()

  // ── Rate limiting on API routes ──────────────────────────────
  if (pathname.startsWith('/api/')) {
    if (!rateLimit(ip, MAX_API_REQUESTS)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      )
    }
    return NextResponse.next() // APIs handle their own auth
  }

  const response = NextResponse.next({ request: { headers: request.headers } })
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value)
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()

  // ── Not logged in → redirect to login ────────────────────────
  if (!user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // ── Admin routes: enforce server-side is_admin check ─────────
  // This is the CRITICAL fix — admin check in middleware, not client
  if (pathname.startsWith('/admin')) {
    if (!rateLimit(ip, MAX_AUTH_REQUESTS)) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_admin')
      .eq('id', user.id)
      .maybeSingle()

    const isAdmin =
      profile?.is_admin === true ||
      profile?.role?.toLowerCase() === 'admin' ||
      user.app_metadata?.is_admin === true ||
      (user.app_metadata?.role ?? '').toLowerCase() === 'admin'

    if (!isAdmin) {
      // Non-admin user tried to access /admin → hard block, redirect to home
      return NextResponse.redirect(new URL('/?unauthorized=1', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/profile/:path*', '/api/:path*'],
}
