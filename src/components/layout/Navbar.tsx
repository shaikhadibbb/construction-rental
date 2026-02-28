'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user)
        setUserEmail(user.email || '')
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        setUserEmail(session.user.email || '')
      } else {
        setUser(null)
        setUserEmail('')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const initials = userEmail ? userEmail[0].toUpperCase() : ''

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏗️</span>
            <span className="text-xl font-bold text-gray-900">
              Construct<span className="text-yellow-500">Rent</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/catalog" className="text-gray-600 hover:text-yellow-500 font-medium transition-colors">
              Equipment
            </Link>

            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-yellow-500 font-medium transition-colors">
                  Dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center text-sm font-bold">
                    {initials}
                  </div>
                  <span className="text-sm text-gray-600 max-w-32 truncate">{userEmail}</span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-500 hover:text-red-500 font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-yellow-500 font-medium transition-colors">
                  Login
                </Link>
                <Link href="/register" className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>

        </div>

        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 flex flex-col gap-4">
            <Link href="/catalog" className="text-gray-600 font-medium" onClick={() => setMenuOpen(false)}>
              Equipment
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-600 font-medium" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="text-left text-red-500 font-medium">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 font-medium" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="bg-yellow-500 text-white font-semibold px-4 py-2 rounded-lg text-center" onClick={() => setMenuOpen(false)}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
