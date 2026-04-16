'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

const NAV_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/equipment', label: 'Equipment', icon: '🚧' },
  { href: '/admin/bookings', label: 'Bookings', icon: '📋' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
]

/**
 * Admin layout — dark macOS-style shell.
 * Verifies the user is logged in AND has role = 'admin'.
 * Redirects to / if not authorised.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)

  const hasAdminRole = (user: User, profile: { role?: string | null; is_admin?: boolean | null } | null) => {
    const profileAdmin = profile?.role?.toLowerCase() === 'admin' || profile?.is_admin === true
    const metaRole = (user.app_metadata?.role ?? user.user_metadata?.role ?? '') as string
    const metaAdmin = metaRole.toLowerCase() === 'admin' || user.app_metadata?.is_admin === true
    return profileAdmin || metaAdmin
  }

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push('/login'); return }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role, is_admin')
          .eq('id', user.id)
          .maybeSingle()

        const isAdmin = hasAdminRole(user, profile)

        if (!isAdmin) {
          router.push('/')
          return
        }

        setChecking(false)
      } catch {
        router.push('/')
      }
    }
    checkAdmin()
  }, [router])

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 36, height: 36, border: '3px solid rgba(244,162,97,0.3)', borderTopColor: '#f4a261', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>Verifying permissions…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#e8e8e8' }}>

      {/* Top bar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0 24px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* Brand */}
          <Link href="/admin" style={{ fontWeight: 800, fontSize: 15, color: '#fff', textDecoration: 'none', letterSpacing: '-0.03em', flexShrink: 0 }}>
            Construct<span style={{ color: '#f4a261' }}>Rent</span>
            <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 600, color: 'rgba(244,162,97,0.6)', background: 'rgba(244,162,97,0.1)', border: '1px solid rgba(244,162,97,0.2)', borderRadius: 4, padding: '2px 6px', verticalAlign: 'middle' }}>ADMIN</span>
          </Link>

          {/* Nav links */}
          <nav style={{ display: 'flex', gap: 2 }} aria-label="Admin navigation">
            {NAV_LINKS.map(link => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 12px', borderRadius: 8, fontSize: 13, textDecoration: 'none', fontWeight: 500,
                    color: active ? '#fff' : 'rgba(255,255,255,0.4)',
                    background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: 14 }}>{link.icon}</span>
                  <span className="admin-nav-label">{link.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        <Link href="/" style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, transition: 'color 0.2s' }}
          onMouseOver={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
          onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
          ← Back to site
        </Link>
      </header>

      {/* Breadcrumb */}
      <div style={{ padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)' }}>
        <nav aria-label="Breadcrumb">
          <ol style={{ display: 'flex', alignItems: 'center', gap: 8, listStyle: 'none', margin: 0, padding: 0, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
            <li><Link href="/admin" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Admin</Link></li>
            {pathname !== '/admin' && (
              <>
                <li aria-hidden="true">›</li>
                <li style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                  {NAV_LINKS.find(l => pathname.startsWith(l.href) && l.href !== '/admin')?.label ?? 'Page'}
                </li>
              </>
            )}
          </ol>
        </nav>
      </div>

      {/* Content */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 80px' }}>
        {children}
      </main>

      <style>{`
        @media (max-width: 640px) { .admin-nav-label { display: none; } }
      `}</style>
    </div>
  )
}
