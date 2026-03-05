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
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const navLinks = [
    { href: '/catalog', label: 'Equipment' },
    { href: '/about', label: 'About' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a1628] shadow-2xl shadow-black/30' : 'bg-[#0a1628]'}`}>
      <div className="h-0.5 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-[#0a1628]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
              </svg>
            </div>
            <span className="font-black text-lg tracking-tight text-white">Construct<span className="text-yellow-500">Rent</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === link.href ? 'text-yellow-400 bg-white/5' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a href={'tel:' + CALL_NUMBER} className="flex items-center gap-2 text-gray-300 hover:text-white text-sm font-medium transition-colors">
              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              <span className="hidden lg:block">+91 98765 43210</span>
            </a>
            {user ? (
              <>
                <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">Dashboard</Link>
                <Link href="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-[#0a1628] text-xs font-black">{user.email?.[0].toUpperCase()}</div>
                  <span className="text-sm text-gray-300 hidden lg:block max-w-[120px] truncate">{user.email}</span>
                </Link>
                <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-300 font-medium transition-colors">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">Login</Link>
                <Link href="/catalog" className="bg-yellow-500 hover:bg-yellow-400 text-[#0a1628] font-black px-5 py-2 rounded-lg text-sm transition-all hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/25 flex items-center gap-1.5">
                  Get Free Quote
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <a href={'tel:' + CALL_NUMBER} className="w-9 h-9 rounded-lg bg-yellow-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#0a1628]" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
            </a>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              {menuOpen
                ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              }
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0d1e35] px-4 py-4 space-y-1">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="block px-4 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 font-medium text-sm transition-colors">
              {link.label}
            </Link>
          ))}
          <div className="border-t border-white/10 pt-3 mt-3 space-y-2">
            <Link href="/catalog" className="flex items-center justify-center gap-2 bg-yellow-500 text-[#0a1628] font-black py-3 rounded-xl text-sm">
              🚀 Get Free Quote
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="block px-4 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 font-medium text-sm">Dashboard</Link>
                <Link href="/profile" className="block px-4 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 font-medium text-sm">My Profile</Link>
                <p className="px-4 py-1 text-xs text-gray-500">{user.email}</p>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 font-medium text-sm">Logout</button>
              </>
            ) : (
              <Link href="/login" className="block px-4 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 font-medium text-sm text-center">Sign In</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}