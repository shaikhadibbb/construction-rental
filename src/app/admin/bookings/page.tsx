'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-gray-100 text-gray-600',
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const fetchBookings = async () => {
    const { data } = await supabase
      .from('bookings')
      .select("*")
      .order('created_at', { ascending: false })
    setBookings(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchBookings() }, [])

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from('bookings').update({ status: newStatus }).eq('id', id)
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b))
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  const counts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Bookings</h1>
        <span className="text-sm text-gray-500">{counts.pending} pending review</span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={
              'px-4 py-1.5 rounded-full text-sm font-medium transition-colors ' +
              (filter === tab
                ? tab === 'pending' ? 'bg-yellow-500 text-white'
                  : tab === 'confirmed' ? 'bg-green-500 text-white'
                  : tab === 'cancelled' ? 'bg-red-500 text-white'
                  : 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
            }
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({counts[tab]})
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Customer</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Equipment</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Dates</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Notes</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900 text-sm">
                    {booking.customer_name || booking.profiles?.email || 'Unknown'}
                  </p>
                  {booking.customer_email && (
                    <p className="text-xs text-gray-400">{booking.customer_email}</p>
                  )}
                  {booking.customer_phone && (
                    <a href={'tel:' + booking.customer_phone} className="text-xs text-blue-500 hover:underline">
                      {booking.customer_phone}
                    </a>
                  )}
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900 text-sm">
                    {booking.equipment_name || booking.equipment?.name || '—'}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">
                    {booking.equipment?.category || 'Quote request'}
                  </p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {booking.start_date && booking.end_date
                    ? <>{booking.start_date} → {booking.end_date}</>
                    : booking.start_date
                    ? <>From {booking.start_date}</>
                    : <span className="text-gray-400 text-xs">Not specified</span>
                  }
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                  <p className="truncate">{booking.notes || '—'}</p>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={booking.status}
                    onChange={e => updateStatus(booking.id, e.target.value)}
                    className={'text-xs font-semibold rounded-full px-3 py-1 border-0 cursor-pointer ' + (STATUS_STYLES[booking.status] || 'bg-gray-100')}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p>{filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}</p>
          </div>
        )}
      </div>
    </div>
  )
}