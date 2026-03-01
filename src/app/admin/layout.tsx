'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      if (!profile || profile.role !== 'admin') { router.push('/'); return }
      setChecking(false)
    }
    checkAdmin()
  }, [router])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        <p>Checking permissions...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-xl font-bold text-yellow-500">⚙️ Admin Panel</span>
          <nav className="flex gap-6 text-sm">
            <Link href="/admin" className="text-gray-300 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/admin/equipment" className="text-gray-300 hover:text-white transition-colors">
              Equipment
            </Link>
            <Link href="/admin/bookings" className="text-gray-300 hover:text-white transition-colors">
              Bookings
            </Link>
            <Link href="/admin/analytics" className="text-gray-300 hover:text-white transition-colors">
              Analytics
            </Link>
          </nav>
        </div>
        <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
          ← Back to site
        </Link>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  )
}
