'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const STATUS_CONFIG: Record<string, { classes: string, dot: string, label: string }> = {
  pending:   { classes: 'bg-yellow-50 text-yellow-700 border border-yellow-200', dot: 'bg-yellow-500 animate-pulse', label: 'Pending' },
  confirmed: { classes: 'bg-green-50 text-green-700 border border-green-200', dot: 'bg-green-500', label: 'Confirmed' },
  completed: { classes: 'bg-blue-50 text-blue-700 border border-blue-200', dot: 'bg-blue-500', label: 'Completed' },
  cancelled: { classes: 'bg-red-50 text-red-600 border border-red-200', dot: 'bg-red-500', label: 'Cancelled' },
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  const fetchBookings = async () => {
    const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false })
    setBookings(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchBookings() }, [])

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(id)
    await supabase.from('bookings').update({ status: newStatus }).eq('id', id)
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b))
    setUpdating(null)
  }

  const counts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }

  const filtered = bookings
    .filter(b => filter === 'all' || b.status === filter)
    .filter(b => {
      if (!search) return true
      const s = search.toLowerCase()
      return (
        (b.customer_name || '').toLowerCase().includes(s) ||
        (b.customer_email || '').toLowerCase().includes(s) ||
        (b.customer_phone || '').toLowerCase().includes(s) ||
        (b.equipment_name || '').toLowerCase().includes(s)
      )
    })

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Loading bookings...</p>
      </div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-yellow-600 text-xs font-bold tracking-widest uppercase mb-1">Requests</p>
          <h1 className="text-3xl font-black text-gray-900">All Bookings</h1>
          {counts.pending > 0 && (
            <p className="text-sm text-yellow-600 font-semibold mt-0.5">⚡ {counts.pending} pending review</p>
          )}
        </div>
        <button onClick={fetchBookings}
          className="text-sm text-gray-500 hover:text-gray-700 bg-white border border-gray-200 px-4 py-2 rounded-xl hover:shadow-sm transition-all flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Refresh
        </button>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map(tab => (
          <button key={tab} onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              filter === tab ? 'bg-[#0a1628] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
            }`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className="ml-1.5 text-xs opacity-60">({counts[tab]})</span>
          </button>
        ))}
      </div>

      <div className="relative mb-6">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, phone or equipment..."
          className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 shadow-sm" />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 text-center py-16 text-gray-400">
          <p className="text-3xl mb-3">📋</p>
          <p className="font-medium">{filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(booking => {
            const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending
            const isExpanded = expanded === booking.id
            const date = new Date(booking.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
            const time = new Date(booking.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

            return (
              <div key={booking.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#0a1628] text-yellow-500 flex items-center justify-center font-black text-lg flex-shrink-0">
                      {(booking.customer_name || booking.customer_email || '?')[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <p className="font-black text-[#0a1628]">{booking.customer_name || 'Unknown'}</p>
                          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                            {booking.customer_email && (
                              <a href={`mailto:${booking.customer_email}`} className="text-xs text-blue-500 hover:underline">{booking.customer_email}</a>
                            )}
                            {booking.customer_phone && (
                              <a href={`tel:${booking.customer_phone}`} className="text-xs text-green-600 font-semibold hover:underline">
                                📞 {booking.customer_phone}
                              </a>
                            )}
                          </div>
                        </div>
                        <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 ${status.classes}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 flex-wrap">
                        <span className="text-sm font-bold text-gray-900">🚧 {booking.equipment_name || '—'}</span>
                        {booking.start_date && (
                          <span className="text-xs text-gray-400">📅 {booking.start_date}{booking.end_date ? ` → ${booking.end_date}` : ''}</span>
                        )}
                        <span className="text-xs text-gray-400">{date} at {time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 flex-wrap gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-500 font-medium">Status:</span>
                      {['pending', 'confirmed', 'completed', 'cancelled'].map(s => (
                        <button key={s} onClick={() => updateStatus(booking.id, s)}
                          disabled={booking.status === s || updating === booking.id}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                            booking.status === s
                              ? STATUS_CONFIG[s].classes + ' cursor-default'
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                          } disabled:opacity-50`}>
                          {updating === booking.id && booking.status !== s ? '...' : s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setExpanded(isExpanded ? null : booking.id)}
                      className="text-xs font-semibold text-gray-400 hover:text-gray-600 flex items-center gap-1">
                      {isExpanded ? 'Less' : 'Details'}
                      <svg className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 rounded-b-2xl space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Notes</p>
                        <p className="text-gray-700">{booking.notes || 'No notes provided'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Booking ID</p>
                        <p className="text-gray-400 font-mono text-xs break-all">{booking.id}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      {booking.customer_email && (
                        <a href={`mailto:${booking.customer_email}?subject=Re: Your Equipment Rental Quote`}
                          className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs px-4 py-2 rounded-lg transition-colors">
                          ✉️ Email Customer
                        </a>
                      )}
                      {booking.customer_phone && (
                        <a href={`tel:${booking.customer_phone}`}
                          className="flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-600 font-bold text-xs px-4 py-2 rounded-lg transition-colors">
                          📞 Call Customer
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}