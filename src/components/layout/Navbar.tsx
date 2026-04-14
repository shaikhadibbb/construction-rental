'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { supabase } from '@/lib/supabase'

const navLinks = [
  { href: '/catalog', label: 'Equipment' },
  { href: '/faq', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

/**
 * Site-wide navigation bar.
 * Sticky, glass-morphic on scroll, responsive with hamburger on mobile.
 */
export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useUser()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Scroll detection for glass effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (pathname === '/') return null

  return (
    <>
      <nav aria-label="Main navigation" style={{ position: 'sticky', top: 0, zIndex: 100, background: scrolled ? 'rgba(7,9,13,0.82)' : 'transparent', backdropFilter: scrolled ? 'blur(24px)' : 'none', borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent', transition: 'all 220ms var(--ease-standard)' }}>
        <div className="ui-container" style={{ height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          <Link href="/" className="brand-logo" style={{ fontSize: 17 }}>
            <span className="brand-logo-mark" aria-hidden="true" />
            Construct<span className="brand-logo-accent">Rent</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="cr-hide-mobile">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} style={{
                padding: '8px 14px', borderRadius: 9, fontSize: 13, textDecoration: 'none', fontWeight: 600,
                color: pathname === link.href ? '#fff' : 'var(--text-muted)',
                background: pathname === link.href ? 'var(--surface-2)' : 'transparent',
                transition: 'all 0.2s',
              }}
                onMouseOver={e => { if (pathname !== link.href) e.currentTarget.style.color = '#d8def0' }}
                onMouseOut={e => { if (pathname !== link.href) e.currentTarget.style.color = 'var(--text-muted)' }}>
                {link.label}
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} className="cr-hide-mobile">
            {user ? (
              <>
                <Link href="/dashboard" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', padding: '8px 14px', fontWeight: 600 }}>
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  aria-label="Log out"
                  style={{ fontSize: 13, color: 'var(--text-subtle)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '8px 12px', fontWeight: 600 }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', padding: '8px 14px', fontWeight: 600 }}>
                  Login
                </Link>
                <Link href="/catalog" className="ui-button-primary" style={{ padding: '9px 15px', fontSize: 13 }}>
                  Get Quote
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="cr-show-mobile"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 10, cursor: 'pointer', padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ width: 18, height: 1.5, background: '#fff', display: 'block', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translateY(6px)' : 'none' }} />
            <span style={{ width: 18, height: 1.5, background: '#fff', display: 'block', opacity: menuOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
            <span style={{ width: 18, height: 1.5, background: '#fff', display: 'block', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none' }} />
          </button>
        </div>

        {menuOpen && (
          <div id="mobile-menu" style={{ background: 'rgba(7,9,13,0.98)', backdropFilter: 'blur(24px)', borderTop: '1px solid var(--border-subtle)', padding: '14px 24px 24px' }}>
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{ display: 'block', padding: '12px 0', fontSize: 15, color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid var(--border-subtle)' }}>
                {link.label}
              </Link>
            ))}
            <div style={{ paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)} style={{ display: 'block', color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14, padding: '4px 0', fontWeight: 600 }}>Dashboard</Link>
                  <button onClick={handleLogout} style={{ textAlign: 'left', color: 'var(--text-subtle)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', padding: 0, fontWeight: 600 }}>
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/catalog" onClick={() => setMenuOpen(false)} className="ui-button-primary" style={{ width: 'fit-content', padding: '12px 18px', fontSize: 14 }}>
                  Get Quote →
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 640px) { .cr-hide-mobile { display: none !important; } }
        @media (min-width: 641px) { .cr-show-mobile { display: none !important; } }
      `}</style>
    </>
  )
}