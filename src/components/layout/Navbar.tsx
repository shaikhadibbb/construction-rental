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

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span>🏗️</span>
            <span className="text-gray-900">Construct<span className="text-yellow-500">Rent</span></span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/catalog" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">
              Equipment
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">
                  Dashboard
                </Link>
                <Link href="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors">
                  <span className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs font-bold">
                    {user.email?.[0].toUpperCase()}
                  </span>
                  <span className="hidden lg:block">{user.email}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">
                  Login
                </Link>
                <Link href="/register" className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
          <Link href="/catalog" className="block px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm">
            Equipment
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="block px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm">
                Dashboard
              </Link>
              <Link href="/profile" className="block px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm">
                My Profile
              </Link>
              <div className="pt-2 border-t border-gray-100 mt-2">
                <p className="px-3 py-1 text-xs text-gray-400">{user.email}</p>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 font-medium text-sm transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="block px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm">
                Login
              </Link>
              <Link href="/register" className="block px-3 py-2.5 rounded-lg bg-yellow-500 text-white font-semibold text-sm text-center">
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
