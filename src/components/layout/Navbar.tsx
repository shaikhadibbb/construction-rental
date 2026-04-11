'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => setUser(session?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/') }

  const navLinks = [
    { href: '/catalog', label: 'Equipment' },
    { href: '/faq', label: 'Pricing' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'rgba(8,8,8,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link href="/" style={{ fontWeight: 800, fontSize: 16, color: '#fff', textDecoration: 'none', letterSpacing: '-0.03em' }}>
            Construct<span style={{ color: '#f4a261' }}>Rent</span>
          </Link>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="cr-hide-mobile">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 14, textDecoration: 'none', fontWeight: 500,
                color: pathname === link.href ? '#fff' : 'rgba(255,255,255,0.45)',
                background: pathname === link.href ? 'rgba(255,255,255,0.07)' : 'transparent',
                transition: 'all 0.2s',
              }}
                onMouseOver={e => { if (pathname !== link.href) e.currentTarget.style.color = 'rgba(255,255,255,0.75)' }}
                onMouseOut={e => { if (pathname !== link.href) e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} className="cr-hide-mobile">
            {user ? (
              <>
                <Link href="/dashboard" style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', padding: '6px 14px' }}>Dashboard</Link>
                <button onClick={handleLogout} style={{ fontSize: 14, color: 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '6px 14px' }}>Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', padding: '6px 14px' }}>Login</Link>
                <Link href="/catalog" style={{
                  fontSize: 14, fontWeight: 700, color: '#0a0a0a', background: '#f4a261',
                  textDecoration: 'none', padding: '8px 18px', borderRadius: 8,
                  transition: 'background 0.2s',
                }}
                  onMouseOver={e => (e.currentTarget.style.background = '#e8955a')}
                  onMouseOut={e => (e.currentTarget.style.background = '#f4a261')}>
                  Get Quote
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="cr-show-mobile"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ width: 20, height: 1.5, background: '#fff', display: 'block', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translateY(6px)' : 'none' }} />
            <span style={{ width: 20, height: 1.5, background: '#fff', display: 'block', opacity: menuOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
            <span style={{ width: 20, height: 1.5, background: '#fff', display: 'block', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none' }} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: 'rgba(8,8,8,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '16px 24px 24px' }}>
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} style={{ display: 'block', padding: '12px 0', fontSize: 16, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontWeight: 500, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {link.label}
              </Link>
            ))}
            <div style={{ paddingTop: 16 }}>
              <Link href="/catalog" style={{ display: 'inline-block', background: '#f4a261', color: '#0a0a0a', fontWeight: 700, padding: '12px 24px', borderRadius: 10, textDecoration: 'none', fontSize: 15 }}>
                Get Quote →
              </Link>
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