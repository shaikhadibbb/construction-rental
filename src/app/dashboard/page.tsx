'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Booking = {
  id: string
  start_date: string
  end_date: string
  total_amount: number
  status: string
  created_at: string
  customer_name?: string
  equipment_name?: string
  notes?: string
  equipment: {
    name: string
    category: string
    image_url: string
    daily_rate: number
  }
}

const STATUS_CONFIG: Record<string, { label: string, classes: string, dot: string }> = {
  pending:   { label: 'Pending Review', classes: 'bg-yellow-50 text-yellow-700 border border-yellow-200', dot: 'bg-yellow-500 animate-pulse' },
  confirmed: { label: 'Confirmed', classes: 'bg-green-50 text-green-700 border border-green-200', dot: 'bg-green-500' },
  cancelled: { label: 'Cancelled', classes: 'bg-red-50 text-red-600 border border-red-200', dot: 'bg-red-500' },
  completed: { label: 'Completed', classes: 'bg-gray-100 text-gray-600 border border-gray-200', dot: 'bg-gray-400' },
}

export default function DashboardPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [justBooked, setJustBooked] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [filter, setFilter] = useState('all')

  const fetchBookings = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('bookings')
      .select('*, equipment(name, category, image_url, daily_rate)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    setBookings(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('booked') === 'true') setJustBooked(true)
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      setUser(user)
      fetchBookings(user.id)
    })
  }, [router, fetchBookings])

  const cancelBooking = async (bookingId: string) => {
    if (!confirm('Cancel this booking?')) return
    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId)
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b))
  }

  const calcDays = (start: string, end: string) => {
    if (!start || !end) return 0
    const diff = new Date(end).getTime() - new Date(start).getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  const stats = {
    total: bookings.length,
    active: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    spent: bookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + Number(b.total_amount || 0), 0),
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-[#0a1628]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-500 text-xs font-bold tracking-widest uppercase mb-1">My Account</p>
              <h1 className="text-3xl font-black text-white">Dashboard</h1>
              {user && <p className="text-gray-400 text-sm mt-1">{user.email}</p>}
            </div>
            <Link href="/catalog"
              className="bg-yellow-500 hover:bg-yellow-400 text-[#0a1628] font-black px-5 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2">
              + Rent Equipment
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Total Bookings', value: stats.total, icon: '📋' },
              { label: 'Active Rentals', value: stats.active, icon: '✅' },
              { label: 'Pending Review', value: stats.pending, icon: '⏳' },
              { label: 'Total Spent', value: '$' + stats.spent.toLocaleString(), icon: '💰' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-lg mb-1">{stat.icon}</p>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-gray-400 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Success banner */}
        {justBooked && (
          <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 mb-6 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-green-800">Quote request submitted!</p>
              <p className="text-green-600 text-sm">We'll get back to you within 2 hours with pricing details.</p>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        {bookings.length > 0 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map(tab => (
              <button key={tab} onClick={() => setFilter(tab)}
                className={'px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ' +
                  (filter === tab ? 'bg-[#0a1628] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300')}>
                {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className="ml-1.5 text-xs opacity-60">
                  ({tab === 'all' ? bookings.length : bookings.filter(b => b.status === tab).length})
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Bookings list */}
        {filtered.length === 0 && bookings.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-xl font-black text-gray-800 mb-2">No bookings yet</h2>
            <p className="text-gray-400 mb-6">Browse our catalog and request a quote for your first rental</p>
            <Link href="/catalog" className="bg-yellow-500 hover:bg-yellow-600 text-[#0a1628] font-black px-6 py-3 rounded-xl transition-colors">
              Browse Equipment →
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-400">No {filter} bookings found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((booking) => {
              const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending
              const equipName = booking.equipment_name || booking.equipment?.name || 'Equipment'
              const equipImg = booking.equipment?.image_url
              const days = booking.start_date && booking.end_date ? calcDays(booking.start_date, booking.end_date) : null

              return (
                <div key={booking.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
                  <div className="flex gap-4 items-start">
                    {/* Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      {equipImg ? (
                        <img src={equipImg} alt={equipName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">🚧</div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h3 className="font-black text-[#0a1628] text-base leading-tight">{equipName}</h3>
                          {booking.equipment?.category && (
                            <p className="text-xs text-gray-400 capitalize mt-0.5">{booking.equipment.category}</p>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 flex-shrink-0 ${status.classes}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                        {booking.start_date && booking.end_date && (
                          <span className="flex items-center gap-1">
                            📅 {booking.start_date} → {booking.end_date}
                            {days && <span className="text-xs text-gray-400">({days} days)</span>}
                          </span>
                        )}
                        {booking.total_amount > 0 && (
                          <span className="font-bold text-[#0a1628]">💰 ${booking.total_amount}</span>
                        )}
                        <span className="text-xs text-gray-400">
                          Submitted {new Date(booking.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      {booking.notes && (
                        <p className="text-xs text-gray-400 mt-2 bg-gray-50 rounded-lg px-3 py-2 italic">"{booking.notes}"</p>
                      )}
                    </div>

                    {/* Cancel button */}
                    {booking.status === 'pending' && (
                      <button onClick={() => cancelBooking(booking.id)}
                        className="text-xs text-red-400 hover:text-red-600 font-semibold flex-shrink-0 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-8 bg-[#0a1628] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-black text-white">Need more equipment?</p>
            <p className="text-gray-400 text-sm mt-0.5">Browse our full catalog of 50+ machines</p>
          </div>
          <Link href="/catalog"
            className="bg-yellow-500 hover:bg-yellow-400 text-[#0a1628] font-black px-6 py-3 rounded-xl text-sm transition-colors whitespace-nowrap">
            Browse Catalog →
          </Link>
        </div>
      </div>
    </div>
  )
}