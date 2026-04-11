'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const CALL_NUMBER = '+919876543210'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav style={{
      borderBottom: '1px solid #ece9e4',
      background: '#faf9f7',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '0 24px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link href="/" style={{ fontWeight: 800, fontSize: 16, color: '#1a1a1a', textDecoration: 'none', letterSpacing: '-0.02em' }}>
          ConstructRent
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="hide-mobile">
          {[
            { href: '/catalog', label: 'Equipment' },
            { href: '/faq', label: 'Pricing' },
            { href: '/about', label: 'About' },
          ].map(link => (
            <Link key={link.href} href={link.href}
              style={{ fontSize: 14, color: pathname === link.href ? '#1a1a1a' : '#777', textDecoration: 'none', fontWeight: pathname === link.href ? 600 : 400 }}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="hide-mobile">
          {user ? (
            <>
              <Link href="/dashboard" style={{ fontSize: 14, color: '#777', textDecoration: 'none' }}>Dashboard</Link>
              <button onClick={handleLogout} style={{ fontSize: 14, color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ fontSize: 14, color: '#777', textDecoration: 'none' }}>Login</Link>
              <Link href="/catalog"
                style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', textDecoration: 'none', border: '1.5px solid #1a1a1a', padding: '7px 16px', borderRadius: 7 }}>
                Get Quote
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="show-mobile"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <div style={{ width: 20, height: 1.5, background: '#1a1a1a', marginBottom: 5 }} />
          <div style={{ width: 20, height: 1.5, background: '#1a1a1a', marginBottom: 5 }} />
          <div style={{ width: 20, height: 1.5, background: '#1a1a1a' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ borderTop: '1px solid #ece9e4', background: '#faf9f7', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { href: '/catalog', label: 'Equipment' },
            { href: '/faq', label: 'Pricing' },
            { href: '/about', label: 'About' },
            { href: '/contact', label: 'Contact' },
          ].map(link => (
            <Link key={link.href} href={link.href} style={{ fontSize: 15, color: '#1a1a1a', textDecoration: 'none', fontWeight: 500 }}>
              {link.label}
            </Link>
          ))}
          <div style={{ borderTop: '1px solid #ece9e4', paddingTop: 16 }}>
            {user ? (
              <>
                <Link href="/dashboard" style={{ display: 'block', fontSize: 15, color: '#555', textDecoration: 'none', marginBottom: 12 }}>Dashboard</Link>
                <button onClick={handleLogout} style={{ fontSize: 15, color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>Logout</button>
              </>
            ) : (
              <Link href="/catalog"
                style={{ display: 'inline-block', fontSize: 15, fontWeight: 600, color: '#fff', background: '#f4a261', textDecoration: 'none', padding: '10px 20px', borderRadius: 8 }}>
                Get Quote →
              </Link>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) { .hide-mobile { display: none !important; } }
        @media (min-width: 641px) { .show-mobile { display: none !important; } }
      `}</style>
    </nav>
  )
}