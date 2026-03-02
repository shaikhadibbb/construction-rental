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
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a1628] shadow-2xl shadow-black/30' : 'bg-[#0a1628]'}`}>
      {/* Top accent line */}
      <div className="h-0.5 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-[#0a1628]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
              </svg>
            </div>
            <span className="font-black text-lg tracking-tight text-white">
              Construct<span className="text-yellow-500">Rent</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-yellow-400 bg-white/5'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link href="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-[#0a1628] text-xs font-black">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-300 hidden lg:block max-w-[120px] truncate">{user.email}</span>
                </Link>
                <button onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-gray-300 font-medium transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link href="/register"
                  className="bg-yellow-500 hover:bg-yellow-400 text-[#0a1628] font-bold px-5 py-2 rounded-lg text-sm transition-colors">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0d1e35] px-4 py-4 space-y-1">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href}
              className="block px-4 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 font-medium text-sm transition-colors">
              {link.label}
            </Link>
          ))}
          <div className="border-t border-white/10 pt-3 mt-3 space-y-1">
            {user ? (
              <>
                <Link href="/dashboard" className="block px-4 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 font-medium text-sm">Dashboard</Link>
                <Link href="/profile" className="block px-4 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 font-medium text-sm">My Profile</Link>
                <p className="px-4 py-1 text-xs text-gray-500">{user.email}</p>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 font-medium text-sm">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-4 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 font-medium text-sm">Login</Link>
                <Link href="/register" className="block px-4 py-2.5 rounded-lg bg-yellow-500 text-[#0a1628] font-bold text-sm text-center">Get Started Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}