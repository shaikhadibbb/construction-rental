'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const STATUS_CONFIG: Record<string, { classes: string, dot: string }> = {
  pending:   { classes: 'bg-yellow-50 text-yellow-700 border border-yellow-200', dot: 'bg-yellow-500 animate-pulse' },
  confirmed: { classes: 'bg-green-50 text-green-700 border border-green-200', dot: 'bg-green-500' },
  cancelled: { classes: 'bg-red-50 text-red-600 border border-red-200', dot: 'bg-red-500' },
  completed: { classes: 'bg-gray-100 text-gray-600 border border-gray-200', dot: 'bg-gray-400' },
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [fullName, setFullName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(profile)
      setFullName(profile?.full_name || '')
      const { data: bookings } = await supabase
        .from('bookings').select('*, equipment(name, image_url, category)')
        .eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
      setBookings(bookings || [])
      setLoading(false)
    }
    fetchAll()
  }, [router])

  const handleSave = async () => {
    setSaving(true)
    await supabase.from('profiles').update({ full_name: fullName }).eq('id', user.id)
    setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Loading profile...</p>
      </div>
    </div>
  )

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent focus:bg-white transition-colors"
  const memberSince = new Date(user?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const initials = (fullName || user?.email || '?')[0].toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-[#0a1628]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-yellow-500 flex items-center justify-center text-[#0a1628] text-2xl font-black flex-shrink-0">
              {initials}
            </div>
            <div>
              <p className="text-yellow-500 text-xs font-bold tracking-widest uppercase mb-1">My Account</p>
              <h1 className="text-2xl font-black text-white">{fullName || 'No name set'}</h1>
              <p className="text-gray-400 text-sm mt-0.5">{user?.email}</p>
            </div>
            <div className="ml-auto hidden sm:block">
              <span className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold px-3 py-1.5 rounded-full capitalize">
                {profile?.role || 'Customer'}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { label: 'Total Bookings', value: bookings.length },
              { label: 'Active Rentals', value: bookings.filter(b => b.status === 'confirmed').length },
              { label: 'Member Since', value: new Date(user?.created_at).getFullYear() },
            ].map(stat => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <p className="text-xl font-black text-white">{stat.value}</p>
                <p className="text-gray-400 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Profile form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="font-black text-[#0a1628]">Profile Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Full Name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                placeholder="Enter your full name" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Email Address</label>
              <input type="text" value={user?.email} disabled
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-400 cursor-not-allowed" />
              <p className="text-xs text-gray-400 mt-1.5">Email address cannot be changed</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Member Since</label>
              <input type="text" value={memberSince} disabled
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-400 cursor-not-allowed" />
            </div>

            {saved && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-semibold flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Profile updated successfully!
              </div>
            )}

            <button onClick={handleSave} disabled={saving}
              className="bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-200 disabled:text-gray-400 text-[#0a1628] font-black px-6 py-3 rounded-xl transition-all hover:scale-[1.01] text-sm">
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#0a1628] border-t-transparent rounded-full animate-spin" />
                  Saving...
                </span>
              ) : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Recent bookings */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="font-black text-[#0a1628]">Recent Bookings</h2>
            </div>
            <Link href="/dashboard" className="text-xs font-bold text-yellow-600 hover:text-yellow-700 flex items-center gap-1">
              View all
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-3xl mb-2">📋</p>
              <p className="font-medium text-gray-600 text-sm">No bookings yet</p>
              <Link href="/catalog" className="text-yellow-600 text-sm font-bold mt-2 inline-block hover:text-yellow-700">
                Browse equipment →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {bookings.map(booking => {
                const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending
                const equipName = booking.equipment_name || booking.equipment?.name || 'Equipment'
                return (
                  <div key={booking.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      {booking.equipment?.image_url ? (
                        <img src={booking.equipment.image_url} alt={equipName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">🚧</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate">{equipName}</p>
                      <p className="text-xs text-gray-400 capitalize">{booking.equipment?.category || 'Equipment'}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${status.classes}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {booking.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/dashboard"
            className="bg-[#0a1628] hover:bg-[#0d1e35] rounded-2xl p-5 flex items-center gap-3 transition-colors">
            <span className="text-2xl">📋</span>
            <div>
              <p className="font-black text-white text-sm">My Dashboard</p>
              <p className="text-gray-400 text-xs">All bookings</p>
            </div>
          </Link>
          <Link href="/catalog"
            className="bg-yellow-500 hover:bg-yellow-400 rounded-2xl p-5 flex items-center gap-3 transition-colors">
            <span className="text-2xl">🚧</span>
            <div>
              <p className="font-black text-[#0a1628] text-sm">Browse Equipment</p>
              <p className="text-[#0a1628]/60 text-xs">50+ machines</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}