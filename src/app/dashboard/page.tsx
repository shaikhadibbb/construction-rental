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
  equipment: {
    name: string
    category: string
    image_url: string
    daily_rate: number
  }
}

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-gray-100 text-gray-600',
}

export default function DashboardPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [justBooked, setJustBooked] = useState(false)

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
      fetchBookings(user.id)
    })
  }, [router, fetchBookings])

  const cancelBooking = async (bookingId: string) => {
    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId)
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b))
  }

  const calcDays = (start: string, end: string) => {
    const diff = new Date(end).getTime() - new Date(start).getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center text-gray-400">
        <p className="text-5xl mb-4">⏳</p>
        <p>Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your equipment rentals</p>
        </div>
        <Link href="/catalog" className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors">
          + Rent Equipment
        </Link>
      </div>

      {justBooked && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-5 py-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-semibold">Booking confirmed!</p>
            <p className="text-sm">Your equipment rental has been successfully booked.</p>
          </div>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
          <p className="text-5xl mb-4">📋</p>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No bookings yet</h2>
          <p className="text-gray-400 mb-6">Browse our catalog and rent your first piece of equipment</p>
          <Link href="/catalog" className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
            Browse Equipment
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white border border-gray-200 rounded-2xl p-5 flex gap-5 items-start shadow-sm">
              <img src={booking.equipment.image_url} alt={booking.equipment.name} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{booking.equipment.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{booking.equipment.category}</p>
                  </div>
                  <span className={'px-3 py-1 rounded-full text-xs font-semibold capitalize flex-shrink-0 ' + (STATUS_STYLES[booking.status] || 'bg-gray-100 text-gray-600')}>
                    {booking.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                  <span>📅 {booking.start_date} → {booking.end_date}</span>
                  <span>⏱ {calcDays(booking.start_date, booking.end_date)} days</span>
                  <span className="font-semibold text-gray-900">💰 ${booking.total_amount}</span>
                </div>
              </div>
              {booking.status === 'pending' && (
                <button onClick={() => cancelBooking(booking.id)} className="text-sm text-red-500 hover:text-red-700 font-medium flex-shrink-0">
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
