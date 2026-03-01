'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
      const { data: bookings } = await supabase.from('bookings').select('*, equipment(name, image_url)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
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

  const STATUS_STYLES: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-gray-100 text-gray-600',
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading profile...</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center text-white text-2xl font-bold">
              {(fullName || user?.email || '?')[0].toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">{fullName || 'No name set'}</p>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full capitalize">{profile?.role || 'customer'}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Enter your full name" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="text" value={user?.email} disabled className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
              <input type="text" value={new Date(user?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} disabled className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
            </div>
            {saved && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2.5 text-sm font-medium">✅ Profile updated!</div>}
            <button onClick={handleSave} disabled={saving} className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-200 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-bold text-gray-900 text-lg">Recent Bookings</h2>
            <Link href="/dashboard" className="text-sm text-yellow-600 hover:text-yellow-700 font-medium">View all →</Link>
          </div>
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-3xl mb-2">📋</p>
              <p className="font-medium">No bookings yet</p>
              <Link href="/catalog" className="text-yellow-600 text-sm font-medium mt-2 inline-block">Browse equipment →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map(booking => (
                <div key={booking.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <img src={booking.equipment?.image_url} alt={booking.equipment?.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{booking.equipment?.name}</p>
                    <p className="text-xs text-gray-400">{new Date(booking.start_date).toLocaleDateString()} → {new Date(booking.end_date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-900 text-sm">${booking.total_amount}</p>
                    <span className={'text-xs font-medium px-2 py-0.5 rounded-full capitalize ' + (STATUS_STYLES[booking.status] || 'bg-gray-100 text-gray-600')}>{booking.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
